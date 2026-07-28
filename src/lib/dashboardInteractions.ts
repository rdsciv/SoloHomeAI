import * as echarts from "echarts";

type ChartMap = Record<string, echarts.ECharts | undefined>;

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hours24() {
  const labels: string[] = [];
  for (let i = 0; i < 24; i++) labels.push(String(i).padStart(2, "0") + ":00");
  return labels;
}

function loadSeries() {
  const out: number[] = [];
  for (let i = 0; i < 24; i++) {
    const night = i < 6 || i > 22 ? 0.9 : 0;
    const morning = i >= 6 && i <= 9 ? 1.4 : 0;
    const evening = i >= 17 && i <= 21 ? 2.1 : 0;
    const base = 1.1 + 0.35 * Math.sin((i / 24) * Math.PI * 2);
    out.push(+(base + night * 0.2 + morning + evening * (0.6 + 0.1 * Math.sin(i))).toFixed(2));
  }
  return out;
}

function solarSeries() {
  return hours24().map((_, i) => {
    if (i < 7 || i > 19) return 0;
    const peak = Math.sin(((i - 7) / 12) * Math.PI);
    return +(peak * 3.2 + (i > 10 && i < 15 ? 0.4 : 0)).toFixed(2);
  });
}

function inferenceSeries() {
  // kW — idle ~0.085, spikes when generating
  return hours24().map((_, i) => {
    const idle = 0.085;
    const chat =
      (i >= 8 && i <= 10) || (i >= 14 && i <= 16) || (i >= 19 && i <= 21)
        ? 0.12 + 0.08 * Math.abs(Math.sin(i * 1.7))
        : 0;
    const batch = i === 2 || i === 3 ? 0.22 : 0; // night index
    return +(idle + chat + batch).toFixed(3);
  });
}

function homelabSeries() {
  return hours24().map((_, i) => +(0.12 + (i >= 22 || i < 5 ? 0.04 : 0.02) + 0.01 * Math.sin(i)).toFixed(3));
}

function gridSeries(load: number[], solar: number[], lab: number[]) {
  return load.map((l, i) => {
    const residual = l - solar[i] + lab[i] * 0.1;
    // simplify: grid = max(0, home - solar) roughly
    return +Math.max(-2, Math.min(4, residual - solar[i] * 0.5)).toFixed(2);
  });
}

function stackedUsage() {
  // hourly kWh-ish bar components
  const hvac: number[] = [];
  const house: number[] = [];
  const lab: number[] = [];
  const infer: number[] = [];
  for (let i = 0; i < 24; i++) {
    hvac.push(+(0.2 + (i >= 6 && i <= 9 ? 0.5 : 0) + (i >= 17 && i <= 21 ? 0.6 : 0)).toFixed(2));
    house.push(+(0.15 + 0.1 * Math.sin(i / 3)).toFixed(2));
    lab.push(+(0.12 + (i < 5 ? 0.05 : 0)).toFixed(2));
    infer.push(
      +(
        0.04 +
        ((i >= 8 && i <= 10) || (i >= 14 && i <= 16) || (i >= 19 && i <= 21) ? 0.08 : 0) +
        (i === 2 || i === 3 ? 0.1 : 0)
      ).toFixed(2),
    );
  }
  return { hvac, house, lab, infer };
}

function agentReply(text: string) {
  const t = text.toLowerCase();
  if (/secure|security|alarm|doors?|locks?/.test(t)) {
    return {
      body: "Security check complete. Perimeter sensors closed, alarm armed_stay, exterior locks never auto-unlocked by policy.",
      trace:
        'ha_list_entities(domain="binary_sensor")\n  → front_door closed · garage_door closed\nha_get_state(entity_id="alarm_control_panel.home")\n  → armed_stay\nha_list_entities(domain="lock")\n  → all engaged · cap.locks.exterior = never',
    };
  }
  if (/light|lights|dim|bright/.test(t)) {
    return {
      body: "Great room lights are on at 42%. I can stage scene.evening_host or adjust brightness — interior lighting is Always allowed.",
      trace:
        'ha_list_entities(domain="light", area="great room")\n  → light.great_room = on (brightness 108)\nha_list_services(domain="light")\n  → turn_on · turn_off · toggle',
    };
  }
  if (/temp|warm|cool|climate|thermostat|setback/.test(t)) {
    return {
      body: "West wing is 70.1°F vs 68°F target, unoccupied 3h+. Autonomous setback still needs your Ask grant.",
      trace:
        'ha_get_state(entity_id="climate.west_wing")\n  → heat · current 70.1 · target 68\n// ha_call_service blocked until cap.climate.west_wing = always | grant',
    };
  }
  if (/energy|power|kwh|draw|usage|inference|llm|token/.test(t)) {
    return {
      body: "House draw 2.4 kW (AI 180 W active). Inference today 1.4 kWh — 9% of home, 72% solar-backed. Wh/kTok 0.66.",
      trace:
        'ha_get_state(entity_id="sensor.shelly_pro_3em_power") → 2400 W\nha_get_state(entity_id="sensor.inference_node_power") → 180 W\nha_get_state(entity_id="sensor.inference_energy_today") → 1.4 kWh',
    };
  }
  if (/dinner|fridge|cook|taco|food/.test(t)) {
    return {
      body: "Fridge has chicken, spinach, eggs, rice, cheddar, tortillas. Best match: chicken spinach tacos (~25 min). Want a shopping list for soy sauce?",
      trace: 'inventory.local_scan()\n  → chicken · spinach · eggs · rice · cheddar · tortillas · yogurt\nrecipe.match(prefs="family") → tacos · fried rice · omelette',
    };
  }
  if (/soccer|movie|chore|calendar|family/.test(t)) {
    return {
      body: "Today: soccer 5:30 (Emma), movie night 7:30, recycling chore for Alex. I can arm stay after garage leave and pause indexing during the movie.",
      trace: "calendar.family · next 48h\nautomation.suggest · garage_game_day · media.movie_night_quiet",
    };
  }
  if (/morning|routine/.test(t)) {
    return {
      body: "I can stage a morning routine: bedroom lights soft, climate to 72°F, kitchen speaker on. Confirm to execute.",
      trace:
        "planned:\nha_call_service(light.turn_on, light.primary_suite, {brightness:128})\nha_call_service(climate.set_temperature, climate.primary_suite, {temperature:72})\nha_call_service(media_player.turn_on, media_player.kitchen_speaker)",
    };
  }
  return {
    body: "Noted. Evaluating against local policy and live HA state — no data leaves the property for this request.",
    trace: "ha_list_entities() · scoped by active guardrails\negress · denied",
  };
}

function tooltipBase(surface: string, fg: string, border: string) {
  return {
    backgroundColor: surface,
    borderColor: border,
    textStyle: { color: fg, fontSize: 12 },
  };
}

export type DashboardController = {
  setPanel: (id: string) => void;
  refreshCharts: () => void;
  dispose: () => void;
};

/** Wire dashboard panels, drawer, filters, composers, and operations charts. */
export function mountDashboardInteractions(
  root: HTMLElement,
  options: { onThemeToggle: () => void },
): DashboardController {
  const titleEl = root.querySelector<HTMLElement>("#view-title");
  const themeBtn = root.querySelector<HTMLElement>("#theme-toggle");
  const openDrawer = root.querySelector<HTMLElement>("#open-drawer");
  const drawer = root.querySelector<HTMLElement>("#drawer");
  const backdrop = root.querySelector<HTMLElement>("#drawer-backdrop");
  const charts: ChartMap = {};
  let chartsReady = false;
  const cleanups: Array<() => void> = [];

  function themeColors() {
    return {
      primary: cssVar("--color-primary"),
      accent: cssVar("--color-accent-secondary"),
      success: cssVar("--color-success"),
      warn: cssVar("--color-warning"),
      danger: cssVar("--color-danger"),
      fg: cssVar("--color-fg"),
      muted: cssVar("--color-fg-muted"),
      grid: cssVar("--chart-grid"),
      surface: cssVar("--color-surface"),
      border: cssVar("--color-border"),
      solar: "#e8a838",
      gridC: "#5b8def",
      lab: "#6bc4a6",
      infer: "#c084fc",
      house: "#94a3b8",
      batt: "#67e8f9",
    };
  }

  function refreshCharts() {
    if (!chartsReady) return;
    const c = themeColors();
    const textStyle = { color: c.muted, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11 };
    const hours = hours24();
    const load = loadSeries();
    const solar = solarSeries();
    const infer = inferenceSeries();
    const lab = homelabSeries();
    const gridLine = gridSeries(load, solar, lab);
    const tip = tooltipBase(c.surface, c.fg, c.border);

    if (charts.powerSources) {
      charts.powerSources.setOption(
        {
          color: [c.solar, c.gridC, c.lab, c.infer, c.primary],
          textStyle,
          grid: { left: 48, right: 16, top: 36, bottom: 36 },
          tooltip: { trigger: "axis", ...tip },
          legend: {
            data: ["Solar", "Grid", "Homelab", "Inference", "Consumption"],
            textStyle: { color: c.muted, fontSize: 11 },
            top: 0,
          },
          xAxis: {
            type: "category",
            data: hours,
            axisLine: { lineStyle: { color: c.grid } },
            axisLabel: { color: c.muted, interval: 3, fontSize: 10 },
            axisTick: { show: false },
          },
          yAxis: {
            type: "value",
            name: "kW",
            nameTextStyle: { color: c.muted, fontSize: 10 },
            splitLine: { lineStyle: { color: c.grid, type: "dashed" } },
            axisLabel: { color: c.muted, fontSize: 10 },
          },
          series: [
            {
              name: "Solar",
              type: "line",
              smooth: 0.35,
              symbol: "none",
              areaStyle: { opacity: 0.35 },
              lineStyle: { width: 1.5 },
              data: solar,
              stack: "src",
            },
            {
              name: "Grid",
              type: "line",
              smooth: 0.25,
              symbol: "none",
              areaStyle: { opacity: 0.2 },
              lineStyle: { width: 1.5 },
              data: gridLine.map((v) => Math.max(0, v)),
            },
            {
              name: "Homelab",
              type: "line",
              smooth: 0.3,
              symbol: "none",
              areaStyle: { opacity: 0.25 },
              lineStyle: { width: 1.5 },
              data: lab,
            },
            {
              name: "Inference",
              type: "line",
              smooth: 0.3,
              symbol: "none",
              areaStyle: { opacity: 0.4 },
              lineStyle: { width: 2 },
              data: infer,
            },
            {
              name: "Consumption",
              type: "line",
              smooth: 0.3,
              symbol: "none",
              lineStyle: { width: 1.5, type: "dashed", color: c.fg },
              data: load,
            },
          ],
        },
        true,
      );
    }

    if (charts.sankey) {
      charts.sankey.setOption(
        {
          textStyle,
          tooltip: { trigger: "item", ...tip },
          series: [
            {
              type: "sankey",
              emphasis: { focus: "adjacency" },
              nodeAlign: "justify",
              lineStyle: { color: "gradient", curveness: 0.5, opacity: 0.35 },
              label: { color: c.fg, fontSize: 11 },
              data: [
                { name: "Solar", itemStyle: { color: c.solar } },
                { name: "Grid", itemStyle: { color: c.gridC } },
                { name: "Battery", itemStyle: { color: c.batt } },
                { name: "Home bus", itemStyle: { color: c.primary } },
                { name: "Inference", itemStyle: { color: c.infer } },
                { name: "Homelab", itemStyle: { color: c.lab } },
                { name: "HVAC", itemStyle: { color: "#f472b6" } },
                { name: "House loads", itemStyle: { color: c.house } },
                { name: "Export", itemStyle: { color: c.muted } },
              ],
              links: [
                { source: "Solar", target: "Home bus", value: 7.4 },
                { source: "Solar", target: "Export", value: 2.9 },
                { source: "Grid", target: "Home bus", value: 1.3 },
                { source: "Battery", target: "Home bus", value: 0.2 },
                { source: "Home bus", target: "Inference", value: 1.4 },
                { source: "Home bus", target: "Homelab", value: 3.2 },
                { source: "Home bus", target: "HVAC", value: 5.8 },
                { source: "Home bus", target: "House loads", value: 5.0 },
              ],
            },
          ],
        },
        true,
      );
    }

    const gaugeOpt = (value: number, max: number, color: string, unit: string) => ({
      series: [
        {
          type: "gauge",
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max,
          radius: "95%",
          progress: { show: true, width: 10, itemStyle: { color } },
          axisLine: { lineStyle: { width: 10, color: [[1, c.grid]] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: true,
            fontSize: 18,
            fontWeight: 600,
            color: c.fg,
            offsetCenter: [0, "10%"],
            formatter: (v: number) => (unit === "%" ? `${Math.round(v)}%` : `${v.toFixed(1)}`),
          },
          data: [{ value }],
        },
      ],
    });

    charts.gaugeSelf?.setOption(gaugeOpt(56, 100, c.success, "%"), true);
    charts.gaugeSolarAi?.setOption(gaugeOpt(72, 100, c.solar, "%"), true);
    charts.gaugeNet?.setOption(
      {
        series: [
          {
            type: "gauge",
            startAngle: 210,
            endAngle: -30,
            min: 0,
            max: 5,
            radius: "95%",
            progress: { show: true, width: 10, itemStyle: { color: c.gridC } },
            axisLine: { lineStyle: { width: 10, color: [[1, c.grid]] } },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            pointer: { show: false },
            title: { show: false },
            detail: {
              valueAnimation: true,
              fontSize: 16,
              fontWeight: 600,
              color: c.fg,
              offsetCenter: [0, "10%"],
              formatter: (v: number) => `${v.toFixed(1)} kWh`,
            },
            data: [{ value: 1.3 }],
          },
        ],
      },
      true,
    );

    if (charts.electricity) {
      const stack = stackedUsage();
      charts.electricity.setOption(
        {
          color: ["#f472b6", c.house, c.lab, c.infer],
          textStyle,
          grid: { left: 44, right: 16, top: 36, bottom: 36 },
          tooltip: { trigger: "axis", ...tip },
          legend: {
            data: ["HVAC", "House", "Homelab", "Inference"],
            textStyle: { color: c.muted, fontSize: 11 },
            top: 0,
          },
          xAxis: {
            type: "category",
            data: hours,
            axisLabel: { color: c.muted, interval: 3, fontSize: 10 },
            axisLine: { lineStyle: { color: c.grid } },
            axisTick: { show: false },
          },
          yAxis: {
            type: "value",
            name: "kWh",
            nameTextStyle: { color: c.muted, fontSize: 10 },
            splitLine: { lineStyle: { color: c.grid, type: "dashed" } },
            axisLabel: { color: c.muted, fontSize: 10 },
          },
          series: [
            { name: "HVAC", type: "bar", stack: "u", data: stack.hvac, barMaxWidth: 14 },
            { name: "House", type: "bar", stack: "u", data: stack.house, barMaxWidth: 14 },
            { name: "Homelab", type: "bar", stack: "u", data: stack.lab, barMaxWidth: 14 },
            { name: "Inference", type: "bar", stack: "u", data: stack.infer, barMaxWidth: 14 },
          ],
        },
        true,
      );
    }

    if (charts.devices) {
      charts.devices.setOption(
        {
          color: [c.primary],
          textStyle,
          grid: { left: 140, right: 40, top: 12, bottom: 24 },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, ...tip },
          xAxis: {
            type: "value",
            name: "kWh today",
            nameTextStyle: { color: c.muted, fontSize: 10 },
            splitLine: { lineStyle: { color: c.grid, type: "dashed" } },
            axisLabel: { color: c.muted, fontSize: 10 },
          },
          yAxis: {
            type: "category",
            data: [
              "sensor.inference_node",
              "sensor.homelab_pdu",
              "climate.main",
              "switch.ev_charger",
              "sensor.shelly_kitchen",
              "switch.robot_dock",
            ],
            axisLabel: { color: c.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace" },
            axisTick: { show: false },
            axisLine: { show: false },
          },
          series: [
            {
              type: "bar",
              data: [
                { value: 1.4, itemStyle: { color: c.infer } },
                { value: 3.2, itemStyle: { color: c.lab } },
                { value: 5.8, itemStyle: { color: "#f472b6" } },
                { value: 4.1, itemStyle: { color: c.primary } },
                { value: 0.9, itemStyle: { color: c.house } },
                { value: 0.1, itemStyle: { color: c.muted } },
              ],
              barWidth: 12,
              itemStyle: { borderRadius: [0, 4, 4, 0] },
              label: { show: true, position: "right", color: c.muted, fontSize: 10 },
            },
          ],
        },
        true,
      );
    }

    if (charts.inference) {
      charts.inference.setOption(
        {
          color: [c.infer],
          textStyle,
          grid: { left: 48, right: 16, top: 20, bottom: 32 },
          tooltip: { trigger: "axis", ...tip },
          xAxis: {
            type: "category",
            data: hours,
            axisLabel: { color: c.muted, interval: 3, fontSize: 10 },
            axisLine: { lineStyle: { color: c.grid } },
            axisTick: { show: false },
          },
          yAxis: {
            type: "value",
            name: "W",
            nameTextStyle: { color: c.muted, fontSize: 10 },
            splitLine: { lineStyle: { color: c.grid, type: "dashed" } },
            axisLabel: { color: c.muted, fontSize: 10 },
          },
          series: [
            {
              name: "Inference W",
              type: "line",
              smooth: 0.25,
              symbol: "none",
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(192,132,252,0.4)" },
                  { offset: 1, color: "rgba(192,132,252,0.02)" },
                ]),
              },
              lineStyle: { width: 2 },
              data: infer.map((k) => Math.round(k * 1000)),
              markLine: {
                silent: true,
                symbol: "none",
                lineStyle: { type: "dashed", color: c.muted },
                data: [{ yAxis: 85, name: "idle", label: { formatter: "idle 85W", color: c.muted, fontSize: 10 } }],
              },
            },
          ],
        },
        true,
      );
    }

    if (charts.workload) {
      charts.workload.setOption(
        {
          color: [c.infer, c.primary, c.lab, c.accent, c.warn],
          textStyle,
          tooltip: { trigger: "item", ...tip },
          series: [
            {
              type: "pie",
              radius: ["40%", "68%"],
              center: ["50%", "52%"],
              itemStyle: { borderRadius: 4, borderColor: c.surface, borderWidth: 2 },
              label: { color: c.muted, fontSize: 11 },
              data: [
                { name: "Chat", value: 42 },
                { name: "Tools / HA", value: 28 },
                { name: "RAG index", value: 15 },
                { name: "Vision", value: 10 },
                { name: "Batch", value: 5 },
              ],
            },
          ],
        },
        true,
      );
    }

    if (charts.energy) {
      charts.energy.setOption(
        {
          color: [c.primary, c.accent],
          textStyle,
          grid: { left: 44, right: 16, top: 28, bottom: 36 },
          tooltip: { trigger: "axis", ...tip },
          legend: {
            data: ["Load kW", "Setback target"],
            textStyle: { color: c.muted, fontSize: 11 },
            top: 0,
          },
          xAxis: {
            type: "category",
            data: hours,
            axisLine: { lineStyle: { color: c.grid } },
            axisLabel: { color: c.muted, interval: 3, fontSize: 10 },
            axisTick: { show: false },
          },
          yAxis: {
            type: "value",
            name: "kW",
            nameTextStyle: { color: c.muted, fontSize: 10 },
            splitLine: { lineStyle: { color: c.grid, type: "dashed" } },
            axisLabel: { color: c.muted, fontSize: 10 },
          },
          series: [
            {
              name: "Load kW",
              type: "line",
              smooth: 0.35,
              symbol: "none",
              lineStyle: { width: 2, color: c.primary },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(74,158,154,0.28)" },
                  { offset: 1, color: "rgba(74,158,154,0.02)" },
                ]),
              },
              data: load,
            },
            {
              name: "Setback target",
              type: "line",
              smooth: false,
              symbol: "none",
              lineStyle: { width: 1.25, type: "dashed", color: c.accent },
              data: load.map((_, i) => (i >= 9 && i <= 16 ? 1.35 : 2.4)),
            },
          ],
        },
        true,
      );
    }

    if (charts.perms) {
      charts.perms.setOption(
        {
          color: [c.success, c.warn, c.muted, c.danger],
          textStyle,
          tooltip: { trigger: "item", ...tip },
          series: [
            {
              type: "pie",
              radius: ["42%", "68%"],
              center: ["50%", "52%"],
              avoidLabelOverlap: true,
              itemStyle: { borderRadius: 4, borderColor: c.surface, borderWidth: 2 },
              label: { color: c.muted, fontSize: 11 },
              data: [
                { name: "Always", value: 42 },
                { name: "Ask approved", value: 18 },
                { name: "Never", value: 9 },
                { name: "Hard-block", value: 4 },
              ],
            },
          ],
        },
        true,
      );
    }

    if (charts.domains) {
      charts.domains.setOption(
        {
          color: [c.primary],
          textStyle,
          grid: { left: 100, right: 24, top: 12, bottom: 24 },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, ...tip },
          xAxis: {
            type: "value",
            splitLine: { lineStyle: { color: c.grid, type: "dashed" } },
            axisLabel: { color: c.muted, fontSize: 10 },
          },
          yAxis: {
            type: "category",
            data: ["light", "climate", "binary_sensor", "alarm", "sensor*"],
            axisLabel: { color: c.muted, fontSize: 11, fontFamily: "JetBrains Mono, monospace" },
            axisTick: { show: false },
            axisLine: { show: false },
          },
          series: [
            {
              type: "bar",
              data: [186, 94, 61, 12, 8],
              barWidth: 14,
              itemStyle: {
                borderRadius: [0, 4, 4, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "rgba(74,158,154,0.35)" },
                  { offset: 1, color: c.primary },
                ]),
              },
              label: { show: true, position: "right", color: c.muted, fontSize: 10 },
            },
          ],
        },
        true,
      );
    }
  }

  function initChart(id: string, key: string) {
    const el = root.querySelector<HTMLElement>("#" + id);
    if (!el || charts[key]) return;
    charts[key] = echarts.init(el);
  }

  function ensureCharts() {
    if (chartsReady) {
      refreshCharts();
      return;
    }
    // Need at least summary charts present
    const elPower = root.querySelector("#chart-power-sources");
    if (!elPower) return;
    chartsReady = true;

    initChart("chart-power-sources", "powerSources");
    initChart("chart-sankey", "sankey");
    initChart("chart-gauge-self", "gaugeSelf");
    initChart("chart-gauge-solar-ai", "gaugeSolarAi");
    initChart("chart-gauge-net", "gaugeNet");
    initChart("chart-electricity", "electricity");
    initChart("chart-devices", "devices");
    initChart("chart-inference", "inference");
    initChart("chart-workload", "workload");
    initChart("chart-energy", "energy");
    initChart("chart-perms", "perms");
    initChart("chart-domains", "domains");

    refreshCharts();
  }

  function resizeCharts() {
    Object.keys(charts).forEach((k) => charts[k]?.resize());
  }

  const onResize = () => resizeCharts();
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));

  function closeMobile() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    window.setTimeout(() => {
      drawer.hidden = true;
      backdrop.hidden = true;
    }, 220);
  }

  function openMobile() {
    if (!drawer || !backdrop) return;
    drawer.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add("open");
      backdrop.classList.add("open");
    });
  }

  function setOpsTab(tab: string) {
    root.querySelectorAll(".ops-tab").forEach((t) => {
      const on = t.getAttribute("data-ops-tab") === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    root.querySelectorAll<HTMLElement>(".ops-tab-panel").forEach((p) => {
      const on = p.getAttribute("data-ops-panel") === tab;
      p.classList.toggle("active", on);
      p.hidden = !on;
    });
    // Charts in hidden panels need resize after show
    requestAnimationFrame(() => {
      ensureCharts();
      resizeCharts();
      refreshCharts();
    });
  }

  function setPanel(id: string) {
    root.querySelectorAll(".panel").forEach((p) => {
      p.classList.toggle("active", p.id === "panel-" + id);
    });
    root.querySelectorAll(".nav-item").forEach((n) => {
      n.classList.toggle("active", n.getAttribute("data-panel") === id);
    });
    const panel = root.querySelector("#panel-" + id);
    if (panel && titleEl) titleEl.textContent = panel.getAttribute("data-title") || id;
    if (id === "operations") {
      ensureCharts();
      requestAnimationFrame(() => resizeCharts());
    }
    try {
      const hashPath = (window.location.hash || "#/app").split("?")[0] || "#/app";
      const q = id === "operations" ? "?panel=operations" : "";
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hashPath}${q}`);
    } catch {
      /* ignore */
    }
    closeMobile();
  }

  root.querySelectorAll<HTMLElement>(".nav-item[data-panel]").forEach((btn) => {
    const handler = () => setPanel(btn.getAttribute("data-panel") || "overview");
    btn.addEventListener("click", handler);
    cleanups.push(() => btn.removeEventListener("click", handler));
  });

  root
    .querySelectorAll<HTMLElement>(
      ".ops-intro a[data-panel], .product-links a[data-panel], .home-card-link[data-panel], .insight button[data-panel], a[data-panel]",
    )
    .forEach((a) => {
      const handler = (e: Event) => {
        e.preventDefault();
        setPanel(a.getAttribute("data-panel") || "overview");
      };
      a.addEventListener("click", handler);
      cleanups.push(() => a.removeEventListener("click", handler));
    });

  root.querySelectorAll<HTMLElement>(".ops-tab[data-ops-tab]").forEach((tab) => {
    const handler = () => setOpsTab(tab.getAttribute("data-ops-tab") || "summary");
    tab.addEventListener("click", handler);
    cleanups.push(() => tab.removeEventListener("click", handler));
  });

  // Chore done toggles
  root.querySelectorAll<HTMLElement>(".chore-done").forEach((btn) => {
    const handler = () => {
      const li = btn.closest("li");
      if (!li) return;
      li.classList.toggle("done");
      btn.textContent = li.classList.contains("done") ? "Undo" : "Done";
    };
    btn.addEventListener("click", handler);
    cleanups.push(() => btn.removeEventListener("click", handler));
  });

  const params = new URLSearchParams(
    window.location.hash.includes("?")
      ? window.location.hash.slice(window.location.hash.indexOf("?") + 1)
      : window.location.search,
  );
  if (params.get("panel") === "operations" || window.location.hash.includes("operations")) {
    setPanel("operations");
  }

  if (openDrawer) {
    openDrawer.addEventListener("click", openMobile);
    cleanups.push(() => openDrawer.removeEventListener("click", openMobile));
  }
  if (backdrop) {
    backdrop.addEventListener("click", closeMobile);
    cleanups.push(() => backdrop.removeEventListener("click", closeMobile));
  }

  if (themeBtn) {
    const onTheme = () => {
      options.onThemeToggle();
      if (chartsReady) refreshCharts();
    };
    themeBtn.addEventListener("click", onTheme);
    cleanups.push(() => themeBtn.removeEventListener("click", onTheme));
  }

  root.querySelectorAll(".seg").forEach((seg) => {
    seg.querySelectorAll("button").forEach((btn) => {
      const handler = () => {
        seg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
      };
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });
  });

  const filters = root.querySelector("#device-filters");
  const grid = root.querySelector("#devices-grid");
  if (filters && grid) {
    const handler = (e: Event) => {
      const btn = (e.target as HTMLElement).closest(".filter-chip");
      if (!btn) return;
      const f = btn.getAttribute("data-filter") || "all";
      filters.querySelectorAll(".filter-chip").forEach((c) => {
        c.setAttribute("aria-pressed", c === btn ? "true" : "false");
      });
      grid.querySelectorAll<HTMLElement>(".device-card").forEach((card) => {
        const cat = card.getAttribute("data-cat") || "";
        card.hidden = !(f === "all" || cat.includes(f));
      });
    };
    filters.addEventListener("click", handler);
    cleanups.push(() => filters.removeEventListener("click", handler));
  }

  function wireComposer(formId: string, listId: string) {
    const form = root.querySelector<HTMLFormElement>("#" + formId);
    const list = root.querySelector<HTMLElement>("#" + listId);
    if (!form || !list) return;
    const handler = (e: Event) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (!input) return;
      const text = (input.value || "").trim();
      if (!text) return;
      const user = document.createElement("div");
      user.className = "msg user";
      user.innerHTML = '<div class="who">You</div><p></p><div class="time">just now</div>';
      user.querySelector("p")!.textContent = text;
      list.appendChild(user);
      input.value = "";
      list.scrollTop = list.scrollHeight;
      window.setTimeout(() => {
        const reply = agentReply(text);
        const agent = document.createElement("div");
        agent.className = "msg agent";
        agent.innerHTML =
          '<div class="who">Property Manager</div><p></p><div class="trace"></div><div class="time">local</div>';
        agent.querySelector("p")!.textContent = reply.body;
        agent.querySelector(".trace")!.textContent = reply.trace;
        list.appendChild(agent);
        list.scrollTop = list.scrollHeight;
      }, 450);
    };
    form.addEventListener("submit", handler);
    cleanups.push(() => form.removeEventListener("submit", handler));
  }
  wireComposer("composer-overview", "messages-overview");
  wireComposer("composer-manager", "messages-manager");

  return {
    setPanel,
    refreshCharts,
    dispose: () => {
      cleanups.forEach((fn) => fn());
      Object.values(charts).forEach((ch) => ch?.dispose());
    },
  };
}
