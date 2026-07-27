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
      function animateDot() {
        const _rafStore = window as unknown as { __soloMapRaf?: number };
        t = (t + 0.004) % 1;
        const segs = pathPoints.length - 1;
        const f = t * segs;
        const i = Math.floor(f);
        const u = f - i;
        const a = pathPoints[i];
        const b = pathPoints[Math.min(i + 1, segs)];
        const x = a[0] + (b[0] - a[0]) * u;
        const y = a[1] + (b[1] - a[1]) * u;
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);
        _rafStore.__soloMapRaf = requestAnimationFrame(animateDot);
      }
      _rafStore.__soloMapRaf = requestAnimationFrame(animateDot);

      // —— Topology data ——
      const zones = [
        { id: "great", name: "Great room", x: 40, y: 40, w: 320, h: 200, area: "area.great_room" },
        { id: "west", name: "West wing", x: 400, y: 40, w: 320, h: 200, area: "area.west_wing" },
        { id: "suite", name: "Primary suite", x: 760, y: 40, w: 300, h: 200, area: "area.primary_suite" },
        { id: "garage", name: "Garage / dock", x: 40, y: 280, w: 480, h: 170, area: "area.garage_dock" },
        { id: "plant", name: "Utility plant", x: 560, y: 280, w: 500, h: 170, area: "area.utility" }
      ];

      const devices = [
        { id: "hue", name: "Hue Bridge", zone: "great", cat: "lighting", conn: "local", entity: "bridge.hue", x: 60, y: 90 },
        { id: "hue-motion", name: "Hue motion", zone: "great", cat: "lighting", conn: "local", entity: "binary_sensor.hue_motion_great", x: 200, y: 90 },
        { id: "bilresa", name: "IKEA BILRESA", zone: "great", cat: "lighting", conn: "local", entity: "light.bilresa_floor", x: 60, y: 150 },
        { id: "lumi-w", name: "LUMI weather", zone: "west", cat: "climate", conn: "local", entity: "sensor.lumi_weather_west", x: 420, y: 90 },
        { id: "climate-w", name: "West climate", zone: "west", cat: "climate", conn: "local", entity: "climate.west_wing", x: 560, y: 90 },
        { id: "light-w", name: "West lights", zone: "west", cat: "lighting", conn: "local", entity: "light.west_wing", x: 420, y: 150 },
        { id: "alarm", name: "Alarm panel", zone: "suite", cat: "security", conn: "local", entity: "alarm_control_panel.home", x: 780, y: 90 },
        { id: "cam", name: "Entry cam", zone: "suite", cat: "security", conn: "cloud", entity: "camera.entry", x: 920, y: 90 },
        { id: "lock", name: "Primary lock", zone: "suite", cat: "security", conn: "local", entity: "lock.primary_suite", x: 780, y: 150 },
        { id: "zbt", name: "ZBT-1 coord.", zone: "garage", cat: "infra", conn: "local", entity: "zha.zbt1", x: 60, y: 330 },
        { id: "robot", name: "Robot dock", zone: "garage", cat: "infra", conn: "local", entity: "vacuum.dock", x: 220, y: 330 },
        { id: "ev", name: "EVSE (local)", zone: "garage", cat: "energy", conn: "local", entity: "switch.evse", x: 380, y: 330 },
        { id: "shelly", name: "Shelly Pro 3EM", zone: "plant", cat: "energy", conn: "local", entity: "sensor.shelly_3em", x: 580, y: 330 },
        { id: "cloud-wx", name: "Cloud weather", zone: "plant", cat: "climate", conn: "cloud", entity: "weather.accuweather", x: 760, y: 330 },
        { id: "voice", name: "Voice cloud", zone: "plant", cat: "infra", conn: "cloud", entity: "assist.cloud", x: 920, y: 330 }
      ];

      let topoFilter = "all";
      const topoSvg = $("#topo-svg");

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
        insp.desc.textContent = `${d.conn === "local" ? "Local control" : "Requires internet"} · ${d.cat} · bound to zone area. Prefer local devices for automation paths.`;
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
        const kids = devices.filter((d) => d.zone === z.id);
        insp.title.textContent = z.name;
        insp.desc.textContent = `Architectural zone mapped to Home Assistant area. ${kids.length} devices currently filtered into this map.`;
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
        const ns = "http://www.w3.org/2000/svg";
        while (topoSvg.firstChild) topoSvg.removeChild(topoSvg.firstChild);

        // links from zone center to devices
        devices.filter(deviceVisible).forEach((d) => {
          const z = zones.find((x) => x.id === d.zone);
          if (!z) return;
          const line = document.createElementNS(ns, "path");
          const zx = z.x + z.w / 2;
          const zy = z.y + 36;
          line.setAttribute("d", `M${zx} ${zy} L${d.x + 70} ${d.y + 18}`);
          line.setAttribute("class", `link-line ${d.conn}`);
          topoSvg.appendChild(line);
        });

        zones.forEach((z) => {
          const g = document.createElementNS(ns, "g");
          g.setAttribute("class", "topo-zone");
          g.setAttribute("data-id", z.id);
          g.setAttribute("tabindex", "0");
          g.setAttribute("role", "button");
          g.style.cursor = "pointer";
          const rect = document.createElementNS(ns, "rect");
          rect.setAttribute("class", "zone-rect");
          rect.setAttribute("x", z.x);
          rect.setAttribute("y", z.y);
          rect.setAttribute("width", z.w);
          rect.setAttribute("height", z.h);
          rect.setAttribute("rx", "8");
          const title = document.createElementNS(ns, "text");
          title.setAttribute("class", "zone-title");
          title.setAttribute("x", z.x + 16);
          title.setAttribute("y", z.y + 28);
          title.textContent = z.name;
          const meta = document.createElementNS(ns, "text");
          meta.setAttribute("class", "zone-meta");
          meta.setAttribute("x", z.x + 16);
          meta.setAttribute("y", z.y + 46);
          meta.textContent = z.area;
          g.appendChild(rect);
          g.appendChild(title);
          g.appendChild(meta);
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

        devices.filter(deviceVisible).forEach((d) => {
          const g = document.createElementNS(ns, "g");
          g.setAttribute("class", `device-node ${d.conn}`);
          g.setAttribute("data-id", d.id);
          g.setAttribute("tabindex", "0");
          g.setAttribute("role", "button");
          g.style.cursor = "pointer";
          const rect = document.createElementNS(ns, "rect");
          rect.setAttribute("x", d.x);
          rect.setAttribute("y", d.y);
          rect.setAttribute("width", 140);
          rect.setAttribute("height", 44);
          rect.setAttribute("rx", "6");
          const t1 = document.createElementNS(ns, "text");
          t1.setAttribute("x", d.x + 10);
          t1.setAttribute("y", d.y + 18);
          t1.textContent = d.name;
          const t2 = document.createElementNS(ns, "text");
          t2.setAttribute("class", "dev-sub");
          t2.setAttribute("x", d.x + 10);
          t2.setAttribute("y", d.y + 34);
          t2.textContent = d.conn === "local" ? "local" : "internet";
          g.appendChild(rect);
          g.appendChild(t1);
          g.appendChild(t2);
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
          topoFilter = btn.getAttribute("data-filter");
          $$(".filter-chip").forEach((b) => {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          renderTopo();
        });
      });
      renderTopo();

      // —— Map views (Architecture | Topology) ——
      // Operations lives on the dashboard as a sub-page.
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
            const on = key === v;
            el.classList.toggle("active", on);
            el.hidden = !on;
          });
          if (v === "architecture") selectNode("agent");
          if (v === "topology") selectZone(zones[0]);
        });
      });
    

  return {
    dispose: () => {
      cleanups.forEach((fn) => fn());
      // stop flow animation if present
      if (typeof (window as unknown as { __soloMapRaf?: number }).__soloMapRaf === "number") {
        cancelAnimationFrame((window as unknown as { __soloMapRaf: number }).__soloMapRaf);
      }
    },
  };
}
