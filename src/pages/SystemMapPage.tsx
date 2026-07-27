import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import { mountSystemMapInteractions } from "../lib/systemMapInteractions";
import "../styles/system-map.css";
import { Link } from "react-router-dom";

export default function SystemMapPage() {
  const { theme, toggleTheme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctrl = mountSystemMapInteractions(rootRef.current, {
      onThemeToggle: toggleTheme,
      theme,
    });
    return () => ctrl.dispose();
    // Mount once; theme button label updates itself on toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleTheme]);

  return (
    <div ref={rootRef} className="system-map-root">
<div className="app">
    <header className="top">
      <div className="brand">
        <div className="mark" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 8h4l2-4 2 8 2-4h2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1>Solo Home AI · System Map</h1>
          <p>Architecture &amp; home topology · diagram tool</p>
        </div>
      </div>
      <div className="top-actions">
        <nav className="page-nav" aria-label="Product sections">
          <Link to="/">Home</Link>
          <Link to="/app">Dashboard</Link>
          <span className="sep" aria-hidden="true"></span>
          <span className="sub-label">Sub</span>
          <Link to="/app?panel=operations" id="nav-ops">Operations</Link>
        </nav>
        <span className="pill local"><span className="dot"></span> local · egress denied</span>
        <span className="pill"><span className="dot"></span> HA bridge · connected</span>
        <button type="button" className="btn" id="theme-toggle" aria-label="Toggle theme">Theme</button>
      </div>
    </header>

    <div className="shell" id="shell">
      <main className="main">
        {/*  Diagram: Architecture + Topology  */}
        <div className="page active" id="page-map" data-page-panel="map">
        <div className="intro">
          <div>
            <p className="eyebrow">Diagram · architecture &amp; topology</p>
            <h2>How intelligence reaches the house</h2>
            <p className="lead">
              Interactive map of the sovereign property manager: filtered Home Assistant gateway,
              permissioned actions, and OHF-style local-first device inventory.
              Household telemetry lives under Dashboard → Operations.
            </p>
          </div>
          <div className="view-tabs" role="tablist" aria-label="Map view">
            <button type="button" className="btn active" role="tab" aria-selected="true" data-view="architecture">Architecture</button>
            <button type="button" className="btn" role="tab" aria-selected="false" data-view="topology">Home topology</button>
          </div>
        </div>

        <section className="stage" aria-live="polite">
          {/*  Architecture  */}
          <div className="view active" id="view-architecture" role="tabpanel">
            <svg id="arch-canvas" viewBox="0 0 1100 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Solo Home AI architecture diagram">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="currentColor" style={{ color: 'var(--color-border)' }} />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="currentColor" style={{ color: 'var(--color-primary)' }} />
                </marker>
                <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
                </filter>
              </defs>

              {/*  Layer labels  */}
              <text className="layer-label" x="48" y="36">Edge · on-prem</text>
              <text className="layer-label" x="360" y="36">Control plane</text>
              <text className="layer-label" x="700" y="36">Home fabric</text>

              {/*  Edges (drawn first)  */}
              <g id="edges">
                <path className="edge" id="e-user-agent" d="M180 140 C240 140, 260 140, 320 140" markerEnd="url(#arrow)" />
                <path className="edge" id="e-agent-bridge" d="M500 160 C560 160, 580 200, 640 220" markerEnd="url(#arrow)" />
                <path className="edge" id="e-bridge-ha" d="M820 240 C860 240, 880 260, 920 280" markerEnd="url(#arrow)" />
                <path className="edge" id="e-ha-devices" d="M1000 320 C1020 360, 1020 380, 1000 420" markerEnd="url(#arrow)" />
                <path className="edge" id="e-sense" d="M320 200 C300 280, 280 340, 320 400" markerEnd="url(#arrow)" />
                <path className="edge" id="e-reason" d="M420 400 C480 400, 500 400, 560 400" markerEnd="url(#arrow)" />
                <path className="edge" id="e-propose" d="M660 400 C700 400, 720 360, 740 300" markerEnd="url(#arrow)" />
                <path className="edge blocked" id="e-block" d="M740 260 C780 200, 820 160, 900 120" />
                <text className="edge-label" x="250" y="128">chat / intent</text>
                <text className="edge-label" x="540" y="188">ha_* tools</text>
                <text className="edge-label" x="850" y="268">WS + REST</text>
                <text className="edge-label" x="1010" y="380">entities</text>
                <text className="edge-label" x="820" y="140" style={{ fill: 'var(--color-danger)' }}>hard-block</text>
              </g>

              {/*  Animated flow particle path uses CSS + SMIL-free JS  */}
              <circle className="flow-dot" id="flow-dot" r="3.5" opacity={0.9} cx="180" cy="140" />

              {/*  Nodes  */}
              <g className="arch-node" data-id="homeowner" transform="translate(48,100)" tabIndex={0} role="button" aria-label="Homeowner">
                <rect className="node-body" width="132" height="80" rx="8" />
                <text className="node-label" x="16" y="32">Homeowner</text>
                <text className="node-sub" x="16" y="52">intent · approve</text>
              </g>

              <g className="arch-node" data-id="runtime" transform="translate(48,300)" tabIndex={0} role="button" aria-label="Local runtime">
                <rect className="node-body primary" width="200" height="100" rx="8" />
                <text className="node-label" x="16" y="32">Local runtime</text>
                <text className="node-sub" x="16" y="52">solohome-pm-7b</text>
                <text className="node-sub" x="16" y="70">egress: denied</text>
              </g>

              <g className="arch-node" data-id="agent" transform="translate(320,100)" tabIndex={0} role="button" aria-label="Property Manager agent">
                <rect className="node-body primary" width="180" height="100" rx="8" filter="url(#soft)" />
                <text className="node-label" x="16" y="32">Property Manager</text>
                <text className="node-sub" x="16" y="52">sense · reason</text>
                <text className="node-sub" x="16" y="70">propose · act</text>
              </g>

              <g className="arch-node" data-id="permissions" transform="translate(320,360)" tabIndex={0} role="button" aria-label="Permissions">
                <rect className="node-body" width="180" height="88" rx="8" />
                <text className="node-label" x="16" y="30">Permissions</text>
                <text className="node-sub" x="16" y="50">Always · Ask · Never</text>
                <text className="node-sub" x="16" y="68">+ HA hard-blocks</text>
              </g>

              <g className="arch-node" data-id="bridge" transform="translate(640,180)" tabIndex={0} role="button" aria-label="HA Bridge">
                <rect className="node-body primary" width="180" height="120" rx="8" filter="url(#soft)" />
                <text className="node-label" x="16" y="30">HA Bridge</text>
                <text className="node-sub" x="16" y="50">list · get · services</text>
                <text className="node-sub" x="16" y="68">call_service</text>
                <text className="node-sub" x="16" y="90">watch filters</text>
              </g>

              <g className="arch-node" data-id="blocks" transform="translate(640,80)" tabIndex={0} role="button" aria-label="Hard blocks">
                <rect className="node-body danger" width="180" height="72" rx="8" />
                <text className="node-label" x="16" y="28">Hard blocks</text>
                <text className="node-sub" x="16" y="48">shell · hassio · pyscript</text>
              </g>

              <g className="arch-node" data-id="ha" transform="translate(920,240)" tabIndex={0} role="button" aria-label="Home Assistant">
                <rect className="node-body" width="140" height="100" rx="8" />
                <text className="node-label" x="14" y="32">Home Assistant</text>
                <text className="node-sub" x="14" y="52">:8123 local</text>
                <text className="node-sub" x="14" y="70">long-lived token</text>
              </g>

              <g className="arch-node" data-id="devices" transform="translate(880,420)" tabIndex={0} role="button" aria-label="Devices and zones">
                <rect className="node-body" width="180" height="88" rx="8" />
                <text className="node-label" x="16" y="30">Devices · zones</text>
                <text className="node-sub" x="16" y="50">14 entities · OHF catalog</text>
                <text className="node-sub" x="16" y="68">local-first badges</text>
              </g>

              <g className="arch-node" data-id="pipeline" transform="translate(520,360)" tabIndex={0} role="button" aria-label="Agent pipeline">
                <rect className="node-body" width="120" height="88" rx="8" />
                <text className="node-label" x="14" y="30">Pipeline</text>
                <text className="node-sub" x="14" y="50">Sense → Reason</text>
                <text className="node-sub" x="14" y="68">→ Propose → Act</text>
              </g>
            </svg>
          </div>

          {/*  Topology  */}
          <div className="view" id="view-topology" role="tabpanel" hidden>
            <div className="topo-wrap">
              <div className="topo-toolbar">
                <button type="button" className="filter-chip" data-filter="all" aria-pressed="true">All</button>
                <button type="button" className="filter-chip" data-filter="local" aria-pressed="false">Local only</button>
                <button type="button" className="filter-chip" data-filter="cloud" aria-pressed="false">Requires internet</button>
                <button type="button" className="filter-chip" data-filter="lighting" aria-pressed="false">Lighting</button>
                <button type="button" className="filter-chip" data-filter="energy" aria-pressed="false">Energy</button>
                <button type="button" className="filter-chip" data-filter="security" aria-pressed="false">Security</button>
                <span className="hint" style={{ marginLeft: 'auto' }}>Click a zone or device · OHF connection badges</span>
              </div>
              <svg id="topo-svg" viewBox="0 0 1100 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Home zone and device topology"></svg>
            </div>
          </div>
        </section>
        </div>{/*  /page-map  */}
      </main>

      <aside className="inspector" id="inspector">
        <div>
          <p className="section-label">Selection</p>
          <h3 id="insp-title">Property Manager</h3>
          <p className="desc" id="insp-desc">
            Local open-weight agent that senses Home Assistant state, reasons under house policy,
            proposes actions, and calls services only when permissions allow.
          </p>
        </div>
        <div className="badge-row" id="insp-badges">
          <span className="badge local">local</span>
          <span className="badge ok">online</span>
        </div>
        <ul className="meta-list" id="insp-meta">
          <li><span className="k">Model</span><span className="v">solohome-pm-7b</span></li>
          <li><span className="k">Egress</span><span className="v">denied</span></li>
          <li><span className="k">Path</span><span className="v">Sense → Reason → Propose → Act</span></li>
        </ul>
        <pre className="code-block" id="insp-code">ha_get_state(entity_id="alarm_control_panel.home")
→ armed_stay

ha_call_service(
  domain="climate",
  service="set_temperature",
  entity_id="climate.west_wing",
  data=&#123;"temperature": 68&#125;
)  # requires Ask</pre>
        <div className="legend">
          <p className="section-label">Legend</p>
          <div className="legend-items">
            <div className="legend-item"><span className="swatch" style={{ background: 'var(--color-primary-muted)', borderColor: 'var(--color-primary)' }}></span> Control plane / local path</div>
            <div className="legend-item"><span className="swatch line"></span> Allowed data / service flow</div>
            <div className="legend-item"><span className="swatch dashed"></span> Hard-blocked domain</div>
            <div className="legend-item"><span className="swatch" style={{ background: 'oklch(0.82 0.12 85 / 0.2)', borderColor: 'var(--color-warning)' }}></span> Requires internet (OHF)</div>
          </div>
          <p className="hint" style={{ marginTop: '12px' }}>This file is the architecture diagram. Marketing home → landing. Ops charts → Dashboard · Operations.</p>
        </div>
      </aside>
    </div>
  </div>

    
    </div>
  );
}
