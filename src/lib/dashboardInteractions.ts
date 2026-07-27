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
  if (/energy|power|kwh|draw|usage/.test(t)) {
    return {
      body: "House draw is 2.4 kW — 12% below the 7-day baseline. Shelly Pro 3EM is local; no cloud path.",
      trace: 'ha_get_state(entity_id="sensor.shelly_pro_3em_power")\n  → 2400 W',
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

  function refreshCharts() {
    if (!charts.energy) return;
    const primary = cssVar("--color-primary");
    const accent = cssVar("--color-accent-secondary");
    const success = cssVar("--color-success");
    const warn = cssVar("--color-warning");
    const danger = cssVar("--color-danger");
    const fg = cssVar("--color-fg");
    const muted = cssVar("--color-fg-muted");
    const grid = cssVar("--chart-grid");
    const surface = cssVar("--color-surface");
    const series = loadSeries();
    const textStyle = { color: muted, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11 };

    charts.energy!.setOption(
      {
        color: [primary, accent],
        textStyle,
        grid: { left: 44, right: 16, top: 28, bottom: 36 },
        tooltip: {
          trigger: "axis",
          backgroundColor: surface,
          borderColor: cssVar("--color-border"),
          textStyle: { color: fg, fontSize: 12 },
        },
        legend: {
          data: ["Load kW", "Setback target"],
          textStyle: { color: muted, fontSize: 11 },
          top: 0,
        },
        xAxis: {
          type: "category",
          data: hours24(),
          axisLine: { lineStyle: { color: grid } },
          axisLabel: { color: muted, interval: 3, fontSize: 10 },
          axisTick: { show: false },
        },
        yAxis: {
          type: "value",
          name: "kW",
          nameTextStyle: { color: muted, fontSize: 10 },
          splitLine: { lineStyle: { color: grid, type: "dashed" } },
          axisLabel: { color: muted, fontSize: 10 },
        },
        series: [
          {
            name: "Load kW",
            type: "line",
            smooth: 0.35,
            symbol: "none",
            lineStyle: { width: 2, color: primary },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(74,158,154,0.28)" },
                { offset: 1, color: "rgba(74,158,154,0.02)" },
              ]),
            },
            data: series,
          },
          {
            name: "Setback target",
            type: "line",
            smooth: false,
            symbol: "none",
            lineStyle: { width: 1.25, type: "dashed", color: accent },
            data: series.map((_, i) => (i >= 9 && i <= 16 ? 1.35 : 2.4)),
          },
        ],
      },
      true,
    );

    charts.perms!.setOption(
      {
        color: [success, warn, muted, danger],
        textStyle,
        tooltip: {
          trigger: "item",
          backgroundColor: surface,
          borderColor: cssVar("--color-border"),
          textStyle: { color: fg, fontSize: 12 },
        },
        series: [
          {
            type: "pie",
            radius: ["42%", "68%"],
            center: ["50%", "52%"],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 4, borderColor: surface, borderWidth: 2 },
            label: { color: muted, fontSize: 11 },
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

    charts.domains!.setOption(
      {
        color: [primary],
        textStyle,
        grid: { left: 100, right: 24, top: 12, bottom: 24 },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: surface,
          borderColor: cssVar("--color-border"),
          textStyle: { color: fg, fontSize: 12 },
        },
        xAxis: {
          type: "value",
          splitLine: { lineStyle: { color: grid, type: "dashed" } },
          axisLabel: { color: muted, fontSize: 10 },
        },
        yAxis: {
          type: "category",
          data: ["light", "climate", "binary_sensor", "alarm", "sensor*"],
          axisLabel: { color: muted, fontSize: 11, fontFamily: "JetBrains Mono, monospace" },
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
                { offset: 1, color: primary },
              ]),
            },
            label: { show: true, position: "right", color: muted, fontSize: 10 },
          },
        ],
      },
      true,
    );
  }

  function ensureCharts() {
    if (chartsReady) return;
    const elE = root.querySelector<HTMLElement>("#chart-energy");
    const elP = root.querySelector<HTMLElement>("#chart-perms");
    const elD = root.querySelector<HTMLElement>("#chart-domains");
    if (!elE || !elP || !elD) return;
    chartsReady = true;
    charts.energy = echarts.init(elE);
    charts.perms = echarts.init(elP);
    charts.domains = echarts.init(elD);
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
    if (history.replaceState) {
      history.replaceState(null, "", id === "operations" ? "#operations" : "#");
    }
    closeMobile();
  }

  root.querySelectorAll<HTMLElement>(".nav-item[data-panel]").forEach((btn) => {
    const handler = () => setPanel(btn.getAttribute("data-panel") || "overview");
    btn.addEventListener("click", handler);
    cleanups.push(() => btn.removeEventListener("click", handler));
  });

  root.querySelectorAll<HTMLElement>(".ops-intro a[data-panel], .product-links a[data-panel]").forEach((a) => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPanel(a.getAttribute("data-panel") || "overview");
    };
    a.addEventListener("click", handler);
    cleanups.push(() => a.removeEventListener("click", handler));
  });

  if (location.hash === "#operations") setPanel("operations");

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
      Object.values(charts).forEach((c) => c?.dispose());
    },
  };
}
