// @ts-nocheck — ported from Open Design prototype with DOM mutation patterns
/* Ported from Open Design system-map prototype — interactive architecture + topology */
export type SystemMapController = { dispose: () => void };

export function mountSystemMapInteractions(
  root: HTMLElement,
  options: { onThemeToggle: () => void; theme: "dark" | "light" },
): SystemMapController {
  const cleanups: Array<() => void> = [];
  const document = root.ownerDocument;
  // Scope query helpers to root when possible; fall back to document for SVG ids inside root
  const $ = <T extends Element = Element>(sel: string) =>
    (root.querySelector(sel) || document.querySelector(sel)) as T | null;
  const $$ = <T extends Element = Element>(sel: string) =>
    Array.from(root.querySelectorAll(sel)) as T[];

  const themeBtn = $("#theme-toggle") as HTMLElement | null;
  if (themeBtn) {
    themeBtn.textContent = options.theme === "dark" ? "Light" : "Dark";
    const onTheme = () => {
      options.onThemeToggle();
      // after parent toggles, sync label on next tick
      requestAnimationFrame(() => {
        const t = document.documentElement.getAttribute("data-theme") || "dark";
        themeBtn.textContent = t === "dark" ? "Light" : "Dark";
      });
    };
    themeBtn.addEventListener("click", onTheme);
    cleanups.push(() => themeBtn.removeEventListener("click", onTheme));
  }

  // --- original body below, with document.getElementById → $ and querySelectorAll scoped ---
const nodes = {
        homeowner: {
          title: "Homeowner",
          desc: "Issues natural-language intent and approves Ask-tier actions. Never bypasses hard blocks.",
          badges: [["local", "local"], ["ok", "in residence"]],
          meta: [
            ["Role", "principal"],
            ["Channel", "Property Manager chat"],
            ["Approve", "temporary grants · setbacks"]
          ],
          code: `// User
"Why is the west wing warm?"

// Agent proposes
set climate.west_wing → 68°F
permission: Ask · pending approval`
        },
        runtime: {
          title: "Local runtime",
          desc: "On-prem inference for the property manager. No cloud egress; model weights and house memory stay on the LAN.",
          badges: [["local", "local"], ["ok", "egress denied"]],
          meta: [
            ["Model", "solohome-pm-7b"],
            ["Host", "NUC · LAN only"],
            ["Memory", "house graph · policy"]
          ],
          code: `runtime.status
  model=solohome-pm-7b
  egress=denied
  heartbeat=30s
  reconnect=exp-backoff`
        },
        agent: {
          title: "Property Manager",
          desc: "Local open-weight agent that senses Home Assistant state, reasons under house policy, proposes actions, and calls services only when permissions allow.",
          badges: [["local", "local"], ["ok", "online"]],
          meta: [
            ["Model", "solohome-pm-7b"],
            ["Egress", "denied"],
            ["Path", "Sense → Reason → Propose → Act"]
          ],
          code: `ha_get_state(entity_id="alarm_control_panel.home")
→ armed_stay

ha_call_service(
  domain="climate",
  service="set_temperature",
  entity_id="climate.west_wing",
  data={"temperature": 68}
)  # requires Ask`
        },
        permissions: {
          title: "Permissions",
          desc: "Always / Ask / Never segmented policy for domains and services. Hard-blocks sit above this matrix and cannot be overridden from chat.",
          badges: [["ok", "Always"], ["warn", "Ask"], ["bad", "Never"]],
          meta: [
            ["climate.set_temperature", "Ask"],
            ["light.turn_on", "Always"],
            ["alarm.disarm", "Never"]
          ],
          code: `policy.matrix
  light.*              → Always
  climate.set_*        → Ask
  alarm_control_panel  → Never (disarm)
  shell_command        → HARD BLOCK`
        },
        bridge: {
          title: "HA Bridge",
          desc: "Hermes-style dual path: WebSocket gateway for watched state, REST tools for list/get/call. Heartbeat 30s with reconnect backoff.",
          badges: [["local", "gateway"], ["ok", "connected"]],
          meta: [
            ["URL", "http://homeassistant.local:8123"],
            ["Auth", "long-lived token"],
            ["Tools", "4 · ha_*"]
          ],
          code: `tools
  ha_list_entities
  ha_get_state
  ha_list_services
  ha_call_service

watch: climate · binary_sensor
       alarm_control_panel · light
ignore: noisy motion / lux spam`
        },
        blocks: {
          title: "Hard blocks",
          desc: "Non-negotiable service domains. The agent cannot list, propose, or call these — separate from Always/Ask/Never.",
          badges: [["bad", "non-negotiable"]],
          meta: [
            ["Blocked", "shell_command"],
            ["Blocked", "command_line · python_script"],
            ["Blocked", "pyscript · hassio · rest_command"]
          ],
          code: `HARD_BLOCKS = {
  shell_command,
  command_line,
  python_script,
  pyscript,
  hassio,
  rest_command
}
# no override from chat or Always`
        },
        ha: {
          title: "Home Assistant",
          desc: "Local automation hub. Solo Home talks only to the house instance — never a vendor cloud as the control plane.",
          badges: [["local", "local URL"], ["ok", "heartbeat ok"]],
          meta: [
            ["Endpoint", "homeassistant.local:8123"],
            ["Transport", "WebSocket + REST"],
            ["Token", "long-lived · scoped"]
          ],
          code: `GET /api/
Authorization: Bearer <llt>

WS /api/websocket
  subscribe: state_changed
  filter: watch domains`
        },
        devices: {
          title: "Devices · zones",
          desc: "OHF-inspired inventory with Local vs Requires internet badges. Agent prefers local-control devices for automation.",
          badges: [["local", "11 local"], ["warn", "3 internet"]],
          meta: [
            ["Count", "14 devices"],
            ["Zones", "great room · west wing · suite · garage"],
            ["Source", "OHF device database patterns"]
          ],
          code: `Hue Bridge          local
Shelly Pro 3EM      local
LUMI weather        local
ZBT-1 coordinator   local
IKEA BILRESA        local
… cloud cams        requires internet`
        },
        pipeline: {
          title: "Agent pipeline",
          desc: "Sense filtered HA state → Reason with policy → Propose human-readable plan → Act via ha_call_service when allowed.",
          badges: [["local", "deterministic path"], ["ok", "permissioned"]],
          meta: [
            ["Sense", "ha_get_state · events"],
            ["Reason", "local model + policy"],
            ["Act", "ha_call_service"]
          ],
          code: `Sense   → watch domains + get_state
Reason  → house graph · permissions
Propose → insight card / chat plan
Act     → call_service | wait Ask | deny`
        }
      };

      const insp = {
        title: $("#insp-title"),
        desc: $("#insp-desc"),
        badges: $("#insp-badges"),
        meta: $("#insp-meta"),
        code: $("#insp-code")
      };

      function selectNode(id) {
        const data = nodes[id] || nodes.agent;
        $$(".arch-node").forEach((el) => {
          el.setAttribute("data-selected", el.getAttribute("data-id") === id ? "true" : "false");
        });
        // highlight related edges
        const edgeMap = {
          homeowner: ["e-user-agent"],
          agent: ["e-user-agent", "e-agent-bridge", "e-sense"],
          runtime: ["e-sense"],
          permissions: ["e-reason", "e-propose"],
          pipeline: ["e-sense", "e-reason", "e-propose"],
          bridge: ["e-agent-bridge", "e-bridge-ha"],
          blocks: ["e-block"],
          ha: ["e-bridge-ha", "e-ha-devices"],
          devices: ["e-ha-devices"]
        };
        $$("#edges .edge").forEach((e) => e.classList.remove("active"));
        (edgeMap[id] || []).forEach((eid) => {
          const el = document.getElementById(eid);
          if (el && !el.classList.contains("blocked")) el.classList.add("active");
        });

        insp.title.textContent = data.title;
        insp.desc.textContent = data.desc;
        insp.badges.innerHTML = data.badges
          .map(([cls, label]) => `<span class="badge ${cls}">${label}</span>`)
          .join("");
        insp.meta.innerHTML = data.meta
          .map(([k, v]) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`)
          .join("");
        insp.code.textContent = data.code;
      }

      $$(".arch-node").forEach((el) => {
        const id = el.getAttribute("data-id");
        el.addEventListener("click", () => selectNode(id));
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectNode(id);
          }
        });
      });
      selectNode("agent");

      // Flow particle along architecture path
      const pathPoints = [
        [180, 140], [320, 140], [410, 150], [500, 160],
        [640, 220], [740, 240], [820, 240], [920, 280],
        [990, 320], [1000, 420], [970, 460]
      ];
      let t = 0;
      const dot = $("#flow-dot");
      const rafStore = window as unknown as { __soloMapRaf?: number };
      function animateDot() {
        if (!dot) return;
        t = (t + 0.004) % 1;
        const segs = pathPoints.length - 1;
        const f = t * segs;
        const i = Math.floor(f);
        const u = f - i;
        const a = pathPoints[i];
        const b = pathPoints[Math.min(i + 1, segs)];
        const x = a[0] + (b[0] - a[0]) * u;
        const y = a[1] + (b[1] - a[1]) * u;
        dot.setAttribute("cx", String(x));
        dot.setAttribute("cy", String(y));
        rafStore.__soloMapRaf = requestAnimationFrame(animateDot);
      }
      rafStore.__soloMapRaf = requestAnimationFrame(animateDot);

      // —— Topology on real floor plan (viewBox 1748×1376) ——
      // Coordinates aligned to public/floor-plan.jpg
      const zones = [
        { id: "primary", name: "Primary bedroom", x: 60, y: 50, w: 480, h: 400, area: "area.primary_bedroom" },
        { id: "ensuite", name: "Ensuite bath", x: 60, y: 460, w: 380, h: 280, area: "area.ensuite" },
        { id: "closet", name: "Walk-in closet", x: 60, y: 760, w: 300, h: 280, area: "area.closet" },
        { id: "balcony", name: "Balcony", x: 560, y: 30, w: 300, h: 170, area: "area.balcony" },
        { id: "living", name: "Living room", x: 560, y: 210, w: 520, h: 420, area: "area.living_room" },
        { id: "kitchen", name: "Kitchen", x: 520, y: 650, w: 560, h: 420, area: "area.kitchen" },
        { id: "bedroom2", name: "Bedroom 2", x: 1120, y: 50, w: 520, h: 380, area: "area.bedroom_2" },
        { id: "bath2", name: "Hall bath", x: 1320, y: 450, w: 320, h: 300, area: "area.hall_bath" },
        { id: "office", name: "Office / laundry", x: 1100, y: 780, w: 540, h: 380, area: "area.office_laundry" },
      ];

      const devices = [
        { id: "climate-p", name: "Primary climate", zone: "primary", cat: "climate", conn: "local", entity: "climate.primary_bedroom", x: 280, y: 220 },
        { id: "light-p", name: "Bedside lamps", zone: "primary", cat: "lighting", conn: "local", entity: "light.primary_bedside", x: 200, y: 300 },
        { id: "motion-p", name: "Suite motion", zone: "primary", cat: "security", conn: "local", entity: "binary_sensor.primary_motion", x: 400, y: 160 },
        { id: "light-ens", name: "Ensuite light", zone: "ensuite", cat: "lighting", conn: "local", entity: "light.ensuite", x: 220, y: 560 },
        { id: "tv", name: "Living TV", zone: "living", cat: "infra", conn: "local", entity: "media_player.living_tv", x: 720, y: 280 },
        { id: "hue-living", name: "Living lights", zone: "living", cat: "lighting", conn: "local", entity: "light.living_room", x: 800, y: 420 },
        { id: "hue-motion", name: "Living motion", zone: "living", cat: "lighting", conn: "local", entity: "binary_sensor.living_motion", x: 640, y: 360 },
        { id: "climate-l", name: "Living climate", zone: "living", cat: "climate", conn: "local", entity: "climate.living_room", x: 940, y: 320 },
        { id: "fridge", name: "Fridge sensor", zone: "kitchen", cat: "energy", conn: "local", entity: "sensor.fridge_power", x: 620, y: 780 },
        { id: "stove", name: "Range", zone: "kitchen", cat: "energy", conn: "local", entity: "sensor.range_power", x: 780, y: 980 },
        { id: "light-k", name: "Kitchen lights", zone: "kitchen", cat: "lighting", conn: "local", entity: "light.kitchen", x: 900, y: 820 },
        { id: "leak-k", name: "Under-sink leak", zone: "kitchen", cat: "security", conn: "local", entity: "binary_sensor.kitchen_leak", x: 680, y: 900 },
        { id: "light-b2", name: "Bed 2 lights", zone: "bedroom2", cat: "lighting", conn: "local", entity: "light.bedroom_2", x: 1320, y: 200 },
        { id: "climate-b2", name: "Bed 2 climate", zone: "bedroom2", cat: "climate", conn: "local", entity: "climate.bedroom_2", x: 1450, y: 280 },
        { id: "alarm", name: "Alarm keypad", zone: "office", cat: "security", conn: "local", entity: "alarm_control_panel.home", x: 1180, y: 900 },
        { id: "cam", name: "Entry cam", zone: "office", cat: "security", conn: "cloud", entity: "camera.entry", x: 1280, y: 1040 },
        { id: "washer", name: "Washer", zone: "office", cat: "energy", conn: "local", entity: "sensor.washer_power", x: 1500, y: 1050 },
        { id: "shelly", name: "Shelly Pro 3EM", zone: "office", cat: "energy", conn: "local", entity: "sensor.shelly_3em", x: 1420, y: 880 },
        { id: "inference", name: "LLM node", zone: "office", cat: "infra", conn: "local", entity: "sensor.inference_node_power", x: 1550, y: 920 },
        { id: "zbt", name: "ZBT-1 coord.", zone: "office", cat: "infra", conn: "local", entity: "zha.zbt1", x: 1350, y: 980 },
        { id: "balcony-light", name: "Balcony light", zone: "balcony", cat: "lighting", conn: "local", entity: "light.balcony", x: 700, y: 100 },
        { id: "cloud-wx", name: "Cloud weather", zone: "balcony", cat: "climate", conn: "cloud", entity: "weather.accuweather", x: 640, y: 140 },
      ];

      let topoFilter = "all";
      const topoSvg = $("#topo-svg") as SVGSVGElement | null;

      function deviceVisible(d) {
        if (topoFilter === "all") return true;
        if (topoFilter === "local") return d.conn === "local";
        if (topoFilter === "cloud") return d.conn === "cloud";
        return d.cat === topoFilter;
      }

      function selectDevice(d) {
        $$(".device-node").forEach((el) => {
          el.setAttribute("data-selected", el.getAttribute("data-id") === d.id ? "true" : "false");
        });
        $$(".topo-zone").forEach((el) => {
          el.setAttribute("data-selected", el.getAttribute("data-id") === d.zone ? "true" : "false");
        });
        insp.title.textContent = d.name;
        insp.desc.textContent = `${d.conn === "local" ? "Local control" : "Requires internet"} · ${d.cat} · pinned on floor plan. Prefer local devices for automation paths.`;
        insp.badges.innerHTML =
          `<span class="badge ${d.conn === "local" ? "local" : "warn"}">${d.conn === "local" ? "Local" : "Requires internet"}</span>` +
          `<span class="badge">${d.cat}</span>`;
        insp.meta.innerHTML = [
          ["Entity", d.entity],
          ["Zone", zones.find((z) => z.id === d.zone)?.area || d.zone],
          ["Connection", d.conn],
          ["Category", d.cat]
        ]
          .map(([k, v]) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`)
          .join("");
        insp.code.textContent =
          d.conn === "local"
            ? `ha_get_state(entity_id="${d.entity}")\n→ available · local path\n\n# preferred for agent Act step`
            : `ha_get_state(entity_id="${d.entity}")\n→ available · requires internet\n\n# agent notes cloud dependency\n# not used for offline routines`;
      }

      function selectZone(z) {
        $$(".topo-zone").forEach((el) => {
          el.setAttribute("data-selected", el.getAttribute("data-id") === z.id ? "true" : "false");
        });
        $$(".device-node").forEach((el) => el.setAttribute("data-selected", "false"));
        const kids = devices.filter((d) => d.zone === z.id && deviceVisible(d));
        insp.title.textContent = z.name;
        insp.desc.textContent = `Room on the floor plan mapped to Home Assistant area. ${kids.length} devices in current filter.`;
        insp.badges.innerHTML = `<span class="badge local">HA area</span><span class="badge">${kids.length} devices</span>`;
        insp.meta.innerHTML = [
          ["Area", z.area],
          ["Devices", String(kids.length)],
          ["Local", String(kids.filter((d) => d.conn === "local").length)],
          ["Internet", String(kids.filter((d) => d.conn === "cloud").length)]
        ]
          .map(([k, v]) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`)
          .join("");
        insp.code.textContent = kids
          .map((d) => `${d.entity.padEnd(36)} ${d.conn}`)
          .join("\n") || "# no devices in filter";
      }

      function renderTopo() {
        if (!topoSvg) return;
        const ns = "http://www.w3.org/2000/svg";
        while (topoSvg.firstChild) topoSvg.removeChild(topoSvg.firstChild);

        // Soft room hit areas over the floor plan
        zones.forEach((z) => {
          const g = document.createElementNS(ns, "g");
          g.setAttribute("class", "topo-zone");
          g.setAttribute("data-id", z.id);
          g.setAttribute("tabindex", "0");
          g.setAttribute("role", "button");
          g.setAttribute("aria-label", z.name);
          g.style.cursor = "pointer";
          const rect = document.createElementNS(ns, "rect");
          rect.setAttribute("class", "zone-rect");
          rect.setAttribute("x", String(z.x));
          rect.setAttribute("y", String(z.y));
          rect.setAttribute("width", String(z.w));
          rect.setAttribute("height", String(z.h));
          rect.setAttribute("rx", "18");
          const title = document.createElementNS(ns, "text");
          title.setAttribute("class", "zone-title");
          title.setAttribute("x", String(z.x + 18));
          title.setAttribute("y", String(z.y + 32));
          title.textContent = z.name;
          g.appendChild(rect);
          g.appendChild(title);
          g.addEventListener("click", (e) => {
            e.stopPropagation();
            selectZone(z);
          });
          g.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              selectZone(z);
            }
          });
          topoSvg.appendChild(g);
        });

        // Device pins
        devices.filter(deviceVisible).forEach((d) => {
          const g = document.createElementNS(ns, "g");
          g.setAttribute("class", `device-node pin ${d.conn}`);
          g.setAttribute("data-id", d.id);
          g.setAttribute("tabindex", "0");
          g.setAttribute("role", "button");
          g.setAttribute("aria-label", d.name);
          g.style.cursor = "pointer";
          g.setAttribute("transform", `translate(${d.x}, ${d.y})`);

          const pin = document.createElementNS(ns, "circle");
          pin.setAttribute("class", "pin-dot");
          pin.setAttribute("r", "14");
          pin.setAttribute("cx", "0");
          pin.setAttribute("cy", "0");

          const ring = document.createElementNS(ns, "circle");
          ring.setAttribute("class", "pin-ring");
          ring.setAttribute("r", "22");
          ring.setAttribute("cx", "0");
          ring.setAttribute("cy", "0");

          const labelBg = document.createElementNS(ns, "rect");
          labelBg.setAttribute("class", "pin-label-bg");
          labelBg.setAttribute("x", "18");
          labelBg.setAttribute("y", "-14");
          labelBg.setAttribute("height", "28");
          labelBg.setAttribute("rx", "6");
          const labelW = Math.max(72, d.name.length * 7.2 + 16);
          labelBg.setAttribute("width", String(labelW));

          const t1 = document.createElementNS(ns, "text");
          t1.setAttribute("class", "pin-label");
          t1.setAttribute("x", "26");
          t1.setAttribute("y", "5");
          t1.textContent = d.name;

          g.appendChild(ring);
          g.appendChild(pin);
          g.appendChild(labelBg);
          g.appendChild(t1);
          g.addEventListener("click", (e) => {
            e.stopPropagation();
            selectDevice(d);
          });
          g.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              selectDevice(d);
            }
          });
          topoSvg.appendChild(g);
        });
      }

      $$(".filter-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          topoFilter = btn.getAttribute("data-filter") || "all";
          $$(".filter-chip").forEach((b) => {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          renderTopo();
        });
      });
      renderTopo();
      selectZone(zones.find((z) => z.id === "living") || zones[0]);

      // —— Map views (Architecture | Topology) ——
      const views = {
        architecture: $("#view-architecture"),
        topology: $("#view-topology")
      };

      $$(".view-tabs [data-view]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const v = btn.getAttribute("data-view");
          $$(".view-tabs [data-view]").forEach((b) => {
            const on = b === btn;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
          });
          Object.entries(views).forEach(([key, el]) => {
            if (!el) return;
            const on = key === v;
            el.classList.toggle("active", on);
            el.hidden = !on;
          });
          if (v === "architecture") selectNode("agent");
          if (v === "topology") selectZone(zones.find((z) => z.id === "living") || zones[0]);
        });
      });

  return {
    dispose: () => {
      cleanups.forEach((fn) => fn());
      if (typeof rafStore.__soloMapRaf === "number") {
        cancelAnimationFrame(rafStore.__soloMapRaf);
      }
    },
  };
}
