import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import { mountDashboardInteractions } from "../lib/dashboardInteractions";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { toggleTheme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctrl = mountDashboardInteractions(rootRef.current, {
      onThemeToggle: toggleTheme,
    });
    return () => ctrl.dispose();
  }, [toggleTheme]);

  return (
    <div ref={rootRef} className="dashboard-root">
<div className="app">
    {/*  Desktop rail  */}
    <aside className="rail" aria-label="Primary navigation">
      <div className="rail-brand">
        <span className="logo-mark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2.5 7.5 L8 2.5 L13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 7v5.5h8V7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Solo Home AI
      </div>

      <div className="runtime-chip">
        <div className="label">Local runtime</div>
        <div className="row">
          <span className="status-pill"><span className="dot" aria-hidden="true"></span> Online</span>
        </div>
        <div className="meta">model · solohome-pm-7b<br />egress · denied by policy</div>
        <div className="meta" style={{ marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px solid var(--color-border-subtle)' }}>
          ha gateway · websocket<br />
          rest tools · 4 enabled<br />
          http://homeassistant.local:8123
        </div>
      </div>

      <nav className="nav-group" aria-label="Dashboard">
        <div className="nav-group-label">Home</div>
        <button type="button" className="nav-item active" data-panel="overview">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2.5 7.5 L8 2.5 L13.5 7.5M4 7v5.5h8V7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Overview
        </button>
        <button type="button" className="nav-item" data-panel="manager">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 12.5c1.5-2 3-3 5-3s3.5 1 5 3M8 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" strokeLinecap="round" /></svg>
          Property Manager
        </button>
        <button type="button" className="nav-item" data-panel="zones">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2.5" y="2.5" width="5" height="5" rx="1" /><rect x="8.5" y="2.5" width="5" height="5" rx="1" /><rect x="2.5" y="8.5" width="5" height="5" rx="1" /><rect x="8.5" y="8.5" width="5" height="5" rx="1" /></svg>
          Zones
        </button>
        <button type="button" className="nav-item" data-panel="devices">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2.5" y="3" width="11" height="10" rx="1.5" /><path d="M5.5 6.5h5M5.5 9.5h3" strokeLinecap="round" /></svg>
          Devices
        </button>
        <button type="button" className="nav-item" data-panel="bridge">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 8h8M8 4v8" strokeLinecap="round" /><circle cx="4" cy="8" r="1.5" /><circle cx="12" cy="8" r="1.5" /></svg>
          HA Bridge
        </button>
        <button type="button" className="nav-item" data-panel="permissions">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="7" width="10" height="6.5" rx="1.5" /><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" strokeLinecap="round" /></svg>
          Permissions
        </button>
        <button type="button" className="nav-item" data-panel="operations">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2.5 11.5l3-3.5 2.5 2 3.5-5 2 2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 13.5h11" strokeLinecap="round" /></svg>
          Operations
        </button>
      </nav>

      <div className="rail-footer">
        <div className="home-select">
          <div className="home-avatar">MH</div>
          <div>
            <div className="name">Mercer House</div>
            <div className="sub">Seattle · custom build</div>
          </div>
        </div>
      </div>
    </aside>

    {/*  Main column  */}
    <div className="main">
      <header className="topbar">
        <div className="topbar-left">
          <button type="button" className="mobile-menu" id="open-drawer" aria-label="Open navigation">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h1 id="view-title">Overview</h1>
            <div className="sub">Mercer House · local-first</div>
          </div>
        </div>
        <div className="topbar-actions">
          <nav className="product-links" aria-label="Product">
            <Link to="/">Home</Link>
            <Link to="/system-map">System map</Link>
            <a href="#operations" data-panel="operations" id="ops-top-link">Operations</a>
          </nav>
          <span className="status-pill" title="Local inference online">
            <span className="dot" aria-hidden="true"></span> Local
          </span>
          <button type="button" className="icon-btn theme-toggle" id="theme-toggle" aria-label="Toggle theme">
            <svg className="icon-moon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3 5.5 5.5 0 1 0 13 9.5z" strokeLinejoin="round" />
            </svg>
            <svg className="icon-sun" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="8" cy="8" r="3" />
              <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="main-scroll">
        {/*  OVERVIEW  */}
        <div className="panel active" id="panel-overview" data-title="Overview">
          <div className="section-label">Home status</div>
          <div className="status-grid status-grid-6">
            <article className="stat-card">
              <div className="k">Climate <span className="status-pill" style={{ height: '20px', fontSize: '0.625rem' }}><span className="dot"></span> OK</span></div>
              <div className="v">68.4°F</div>
              <div className="hint">climate.main · 6 areas</div>
            </article>
            <article className="stat-card">
              <div className="k">Security</div>
              <div className="v ok">Armed stay</div>
              <div className="hint">alarm_control_panel.home</div>
            </article>
            <article className="stat-card">
              <div className="k">Energy now</div>
              <div className="v">2.4 kW</div>
              <div className="hint">of which AI 0.18 kW</div>
            </article>
            <article className="stat-card">
              <div className="k">Inference</div>
              <div className="v ok">Online</div>
              <div className="hint">solohome-pm-7b · 85 W idle</div>
            </article>
            <article className="stat-card">
              <div className="k">Homelab</div>
              <div className="v ok">Healthy</div>
              <div className="hint">UPS 98% · NAS 42°C</div>
            </article>
            <article className="stat-card">
              <div className="k">HA bridge</div>
              <div className="v ok">Linked</div>
              <div className="hint">ws + rest · 47 entities</div>
            </article>
          </div>

          <div className="home-features">
            <article className="home-card">
              <div className="home-card-head">
                <h3>Family today</h3>
                <span className="home-card-meta">Jul 27</span>
              </div>
              <ul className="family-list">
                <li>
                  <span className="event-time">5:30 PM</span>
                  <span className="event-body">
                    <strong>Soccer game</strong>
                    <span className="event-sub">Emma · Riverside fields</span>
                  </span>
                  <span className="event-tag sport">Sport</span>
                </li>
                <li>
                  <span className="event-time">7:30 PM</span>
                  <span className="event-body">
                    <strong>Movie night</strong>
                    <span className="event-sub">Living room · Easy Rider</span>
                  </span>
                  <span className="event-tag movie">Movie</span>
                </li>
                <li>
                  <span className="event-time">Chore</span>
                  <span className="event-body">
                    <strong>Take out recycling</strong>
                    <span className="event-sub">Alex · due tonight</span>
                  </span>
                  <button type="button" className="btn btn-secondary btn-sm chore-done">Done</button>
                </li>
                <li>
                  <span className="event-time">Chore</span>
                  <span className="event-body">
                    <strong>Empty dishwasher</strong>
                    <span className="event-sub">Jordan · morning</span>
                  </span>
                  <button type="button" className="btn btn-ghost btn-sm chore-done">Done</button>
                </li>
              </ul>
              <p className="home-card-ai">Garage usually opens ~5:20 on game days — arm stay after leave?</p>
            </article>

            <article className="home-card">
              <div className="home-card-head">
                <h3>Dinner ideas</h3>
                <span className="home-card-meta">From fridge</span>
              </div>
              <p className="fridge-stock">Chicken · spinach · eggs · rice · cheddar · tortillas · yogurt</p>
              <ul className="dinner-list">
                <li>
                  <strong>Chicken spinach tacos</strong>
                  <span>25 min · uses chicken, spinach, tortillas, cheddar</span>
                  <span className="dinner-badge best">Best match</span>
                </li>
                <li>
                  <strong>Spinach egg fried rice</strong>
                  <span>20 min · add soy sauce if you have it</span>
                </li>
                <li>
                  <strong>Cheddar omelette + greens</strong>
                  <span>15 min · light night before movie</span>
                </li>
              </ul>
              <div className="insight-actions" style={{ marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-primary btn-sm">Cook tacos</button>
                <button type="button" className="btn btn-secondary btn-sm">Shopping list</button>
              </div>
            </article>

            <article className="home-card energy-mini">
              <div className="home-card-head">
                <h3>Energy distribution today</h3>
                <a href="#operations" data-panel="operations" className="home-card-link">Full ops →</a>
              </div>
              <div className="energy-nodes" aria-hidden="true">
                <div className="enode solar"><span className="enode-label">Solar</span><span className="enode-val">10.3 kWh</span></div>
                <div className="enode grid"><span className="enode-label">Grid</span><span className="enode-val">↓1.3 · ↑6.4</span></div>
                <div className="enode home"><span className="enode-label">Home</span><span className="enode-val">15.4 kWh</span></div>
                <div className="enode infer"><span className="enode-label">LLM</span><span className="enode-val">1.4 kWh</span></div>
                <div className="enode lab"><span className="enode-label">Homelab</span><span className="enode-val">3.2 kWh</span></div>
                <div className="enode batt"><span className="enode-label">Battery</span><span className="enode-val">0 kWh</span></div>
              </div>
              <div className="energy-mini-stats">
                <div><span className="k">AI share</span><span className="v">9%</span></div>
                <div><span className="k">On solar</span><span className="v">72%</span></div>
                <div><span className="k">Wh / kTok</span><span className="v">0.66</span></div>
              </div>
            </article>

            <article className="home-card">
              <div className="home-card-head">
                <h3>Local intelligence</h3>
                <span className="status-pill"><span className="dot"></span> Local</span>
              </div>
              <dl className="kv-list">
                <div><dt>Model</dt><dd>solohome-pm-7b</dd></div>
                <div><dt>Today</dt><dd>47 turns · 2.1 M tokens</dd></div>
                <div><dt>Energy</dt><dd>1.4 kWh · 85 W idle</dd></div>
                <div><dt>Egress</dt><dd className="ok">Denied by policy</dd></div>
              </dl>
              <div className="lab-strip" aria-label="Homelab services">
                <span className="lab-svc ok">HA</span>
                <span className="lab-svc ok">LLM</span>
                <span className="lab-svc ok">NAS</span>
                <span className="lab-svc ok">VPN</span>
                <span className="lab-svc warn">Cams</span>
              </div>
            </article>
          </div>

          <div className="insights-mobile">
            <div className="section-label">Proactive insights</div>
            <article className="insight">
              <div className="label"><span>Suggestion</span><span>2m ago</span></div>
              <h3>West wing setback</h3>
              <p>Unoccupied 3h · 2.1° above setpoint. Propose 66°F until 5:30 PM — ~1.8 kWh.</p>
              <div className="insight-actions">
                <button type="button" className="btn btn-primary btn-sm">Accept</button>
                <button type="button" className="btn btn-secondary btn-sm">Review</button>
                <button type="button" className="btn btn-ghost">Dismiss</button>
              </div>
            </article>
            <article className="insight priority">
              <div className="label"><span>Permission ask</span><span>Expires 4h</span></div>
              <h3>Temporary climate policy</h3>
              <p>Allow autonomous setbacks in west wing for this window only?</p>
              <div className="insight-actions">
                <button type="button" className="btn btn-primary btn-sm">Allow 4h</button>
                <button type="button" className="btn btn-secondary btn-sm">Deny</button>
              </div>
            </article>
          </div>

          <div className="section-label">AI Property Manager</div>
          <div className="chat-shell" aria-label="Conversation with AI Property Manager">
            <div className="chat-header">
              <div>
                <h2>Conversation</h2>
                <div className="desc">Proactive · permissioned · local model</div>
              </div>
              <span className="status-pill"><span className="dot"></span> Online</span>
            </div>
            <div className="messages" id="messages-overview">
              <div className="msg agent">
                <div className="who">Property Manager</div>
                <p>Good afternoon. HA gateway is linked. One open suggestion for west wing climate — details on the right.</p>
                <div className="time">14:02 · local</div>
              </div>
              <div className="msg user">
                <div className="who">You</div>
                <p>Keep guests comfortable in the great room this evening. Dinner at 7.</p>
                <div className="time">14:04</div>
              </div>
              <div className="msg agent">
                <div className="who">Property Manager</div>
                <p>Understood. Staging climate hold and interior scene for the great room. Security stays <strong>armed_stay</strong>.</p>
                <div className="trace">ha_call_service(domain="climate", service="set_temperature",
  entity_id="climate.great_room", data=&#123;"temperature": 70&#125;)
ha_call_service(domain="scene", service="turn_on",
  entity_id="scene.evening_host")
ha_get_state(entity_id="alarm_control_panel.home") → armed_stay</div>
                <div className="time">14:04 · local</div>
              </div>
              <div className="msg system">
                <div className="who">Guardrail</div>
                <p>Lighting + climate staged via HA REST tools. Exterior locks untouched. Blocked domains remain offline: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75em' }}>shell_command · hassio · python_script</span></p>
              </div>
            </div>
            <form className="composer" id="composer-overview" autoComplete="off">
              <input type="text" name="q" placeholder="Message the property manager…" aria-label="Message" />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>

        {/*  MANAGER (full chat focus)  */}
        <div className="panel" id="panel-manager" data-title="Property Manager">
          <div className="chat-shell" style={{ minHeight: 'min(640px, 80vh)', maxHeight: 'none' }}>
            <div className="chat-header">
              <div>
                <h2>AI Property Manager</h2>
                <div className="desc">solohome-pm-7b · on-prem · no cloud egress</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="status-pill"><span className="dot"></span> Local · Online</span>
              </div>
            </div>
            <div className="messages" id="messages-manager" style={{ minHeight: '360px' }}>
              <div className="msg agent">
                <div className="who">Property Manager</div>
                <p>Monitoring Mercer House via local runtime + HA WebSocket. Ask about entities, security, energy, or temporary grants. Try: “Is the house secure?”</p>
                <div className="time">ready</div>
              </div>
              <div className="msg user">
                <div className="who">You</div>
                <p>Why is the west wing warm?</p>
                <div className="time">14:06</div>
              </div>
              <div className="msg agent">
                <div className="who">Property Manager</div>
                <p><strong>West wing</strong> is 70.1°F vs 68°F setpoint. Occupancy empty 3h 12m. South glass solar gain elevated. Propose setback to 66°F until 17:30 (~1.8 kWh).</p>
                <div className="trace">ha_get_state(entity_id="climate.west_wing")
  → heat · current 70.1 · target 68
ha_list_entities(domain="binary_sensor", area="west wing")
  → binary_sensor.west_wing_occupancy = off (3h12m)
ha_get_state(entity_id="sensor.lumi_weather_west")
  → 72.4°F · humidity 38%</div>
                <div className="time">14:06 · local</div>
              </div>
              <div className="msg system">
                <div className="who">Permission required</div>
                <p>Autonomous setbacks in west wing are set to <strong>Ask</strong>. Accept the insight card or change the guardrail under Permissions before <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75em' }}>ha_call_service(climate.set_temperature)</code>.</p>
              </div>
            </div>
            <form className="composer" id="composer-manager" autoComplete="off">
              <input type="text" name="q" placeholder="Ask about status, scenes, or permissions…" aria-label="Message property manager" />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>

        {/*  ZONES  */}
        <div className="panel" id="panel-zones" data-title="Zones">
          <div className="section-label">Architectural zones · HA areas</div>
          <div className="zones-grid">
            <article className="zone-card">
              <header>
                <h3>Great room</h3>
                <span className="status-pill" style={{ height: '22px' }}><span className="dot"></span> Occupied</span>
              </header>
              <div className="zone-meta">
                <div><span>Climate</span>climate.great_room · 70°F</div>
                <div><span>Lights</span>scene.evening_host</div>
                <div><span>Media</span>media_player.great_room · idle</div>
                <div><span>Policy</span>Always · interior</div>
              </div>
            </article>
            <article className="zone-card">
              <header>
                <h3>West wing</h3>
                <span className="status-pill warn" style={{ height: '22px' }}><span className="dot"></span> Setback proposed</span>
              </header>
              <div className="zone-meta">
                <div><span>Climate</span>climate.west_wing · 70.1°F</div>
                <div><span>Occupancy</span>binary_sensor…off · 3h</div>
                <div><span>Lights</span>light.west_wing · off</div>
                <div><span>Policy</span>Ask · climate</div>
              </div>
            </article>
            <article className="zone-card">
              <header>
                <h3>Primary suite</h3>
                <span className="status-pill" style={{ height: '22px' }}><span className="dot"></span> Quiet</span>
              </header>
              <div className="zone-meta">
                <div><span>Climate</span>climate.primary_suite · 67°F</div>
                <div><span>Shades</span>cover.primary_shades · 40%</div>
                <div><span>Air</span>sensor.primary_aqi · good</div>
                <div><span>Policy</span>Never · guests</div>
              </div>
            </article>
            <article className="zone-card">
              <header>
                <h3>Garage / dock</h3>
                <span className="status-pill" style={{ height: '22px' }}><span className="dot"></span> Robot-ready</span>
              </header>
              <div className="zone-meta">
                <div><span>Power</span>switch.robot_dock · idle</div>
                <div><span>Network</span>PoE ok · ZBT-1</div>
                <div><span>Access</span>binary_sensor.garage · sealed</div>
                <div><span>Policy</span>Never · exterior</div>
              </div>
            </article>
          </div>
        </div>

        {/*  DEVICES (OHF-style inventory)  */}
        <div className="panel" id="panel-devices" data-title="Devices">
          <div className="section-label">Device inventory · local-first catalog</div>
          <div className="stats-strip">
            <article className="stat-card">
              <div className="k">Devices</div>
              <div className="v">14</div>
              <div className="hint">catalog · mercer house</div>
            </article>
            <article className="stat-card">
              <div className="k">Local path</div>
              <div className="v ok">12</div>
              <div className="hint">no cloud required</div>
            </article>
            <article className="stat-card">
              <div className="k">Entities</div>
              <div className="v">47</div>
              <div className="hint">ha_list_entities</div>
            </article>
            <article className="stat-card">
              <div className="k">Internet req.</div>
              <div className="v">2</div>
              <div className="hint">flagged · policy watch</div>
            </article>
          </div>

          <div className="filter-row" role="group" aria-label="Filter devices by category" id="device-filters">
            <button type="button" className="filter-chip" data-filter="all" aria-pressed="true">All</button>
            <button type="button" className="filter-chip" data-filter="lighting" aria-pressed="false">Lighting</button>
            <button type="button" className="filter-chip" data-filter="climate" aria-pressed="false">Climate</button>
            <button type="button" className="filter-chip" data-filter="energy" aria-pressed="false">Energy</button>
            <button type="button" className="filter-chip" data-filter="security" aria-pressed="false">Security</button>
            <button type="button" className="filter-chip" data-filter="hub" aria-pressed="false">Hubs</button>
            <button type="button" className="filter-chip" data-filter="media" aria-pressed="false">Media</button>
          </div>

          <div className="devices-grid" id="devices-grid">
            <article className="device-card" data-cat="hub lighting">
              <header>
                <div>
                  <div className="cat">Lighting · Hub</div>
                  <h3>Hue Bridge</h3>
                  <div className="maker">Signify Netherlands B.V.</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>light.great_room</code><span className="state">on · 42%</span></div>
                <div className="entity-row"><code>light.west_wing</code><span className="state">off</span></div>
                <div className="entity-row"><code>sensor.hue_bridge_status</code><span className="state">connected</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="lighting">
              <header>
                <div>
                  <div className="cat">Lighting</div>
                  <h3>Hue motion sensor</h3>
                  <div className="maker">Signify Netherlands B.V.</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>binary_sensor.hallway_motion</code><span className="state">clear</span></div>
                <div className="entity-row"><code>sensor.hallway_illuminance</code><span className="state">18 lx</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="lighting">
              <header>
                <div>
                  <div className="cat">Lighting</div>
                  <h3>Hue dimmer switch</h3>
                  <div className="maker">Signify Netherlands B.V.</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>sensor.great_room_dimmer</code><span className="state">idle</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="energy">
              <header>
                <div>
                  <div className="cat">Energy</div>
                  <h3>Shelly Pro 3EM</h3>
                  <div className="maker">Shelly</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>sensor.shelly_pro_3em_power</code><span className="state">2.4 kW</span></div>
                <div className="entity-row"><code>sensor.shelly_pro_3em_energy</code><span className="state">18.2 kWh</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="energy">
              <header>
                <div>
                  <div className="cat">Energy · Switch</div>
                  <h3>Shelly Plus 1PM</h3>
                  <div className="maker">Shelly</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>switch.robot_dock</code><span className="state">off</span></div>
                <div className="entity-row"><code>sensor.robot_dock_power</code><span className="state">0 W</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="climate">
              <header>
                <div>
                  <div className="cat">Climate · Sensor</div>
                  <h3>lumi.weather</h3>
                  <div className="maker">LUMI / Aqara</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>sensor.lumi_weather_west</code><span className="state">72.4°F</span></div>
                <div className="entity-row"><code>sensor.lumi_weather_west_humidity</code><span className="state">38%</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="security">
              <header>
                <div>
                  <div className="cat">Security · Contact</div>
                  <h3>lumi.sensor_magnet.aq2</h3>
                  <div className="maker">LUMI / Aqara</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>binary_sensor.front_door</code><span className="state">closed</span></div>
                <div className="entity-row"><code>binary_sensor.garage_door</code><span className="state">closed</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="hub">
              <header>
                <div>
                  <div className="cat">Hub · Zigbee</div>
                  <h3>Home Assistant Connect ZBT-1</h3>
                  <div className="maker">Nabu Casa</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>sensor.zbt1_channel</code><span className="state">15</span></div>
                <div className="entity-row"><code>sensor.zbt1_network</code><span className="state">healthy</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="hub">
              <header>
                <div>
                  <div className="cat">Networking</div>
                  <h3>USMINI</h3>
                  <div className="maker">Ubiquiti Networks</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>binary_sensor.poe_garage</code><span className="state">on</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="media">
              <header>
                <div>
                  <div className="cat">Entertainment</div>
                  <h3>Google Nest Mini</h3>
                  <div className="maker">Google Inc.</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>media_player.kitchen_speaker</code><span className="state">off</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="media">
              <header>
                <div>
                  <div className="cat">Entertainment</div>
                  <h3>SHIELD Android TV</h3>
                  <div className="maker">NVIDIA</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>media_player.great_room_tv</code><span className="state">idle</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="security">
              <header>
                <div>
                  <div className="cat">Security · Chime</div>
                  <h3>Reolink Chime</h3>
                  <div className="maker">Reolink</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>binary_sensor.front_doorbell</code><span className="state">clear</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="hub">
              <header>
                <div>
                  <div className="cat">Control · Button</div>
                  <h3>BILRESA dual button</h3>
                  <div className="maker">IKEA of Sweden</div>
                </div>
                <span className="conn-pill local">Local</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>sensor.primary_scene_btn</code><span className="state">idle</span></div>
              </div>
            </article>

            <article className="device-card" data-cat="media">
              <header>
                <div>
                  <div className="cat">Networking · Group</div>
                  <h3>Speaker Group</h3>
                  <div className="maker">Amazon</div>
                </div>
                <span className="conn-pill cloud">Requires internet</span>
              </header>
              <div className="entity-list">
                <div className="entity-row"><code>media_player.whole_home</code><span className="state">unavailable · policy</span></div>
              </div>
            </article>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-fg-muted)', maxWidth: '52em' }}>
            Inventory pattern inspired by the Open Home Foundation Device Database (local vs internet). Device names are representative of a custom Seattle build — not a live HA registry dump.
          </p>
        </div>

        {/*  HA BRIDGE  */}
        <div className="panel" id="panel-bridge" data-title="HA Bridge">
          <div className="section-label">Home Assistant integration</div>
          <div className="stats-strip">
            <article className="stat-card">
              <div className="k">Gateway</div>
              <div className="v ok">WebSocket</div>
              <div className="hint">heartbeat 30s</div>
            </article>
            <article className="stat-card">
              <div className="k">Tools</div>
              <div className="v">4</div>
              <div className="hint">REST · LLM-callable</div>
            </article>
            <article className="stat-card">
              <div className="k">Watch domains</div>
              <div className="v">4</div>
              <div className="hint">events filtered</div>
            </article>
            <article className="stat-card">
              <div className="k">Cooldown</div>
              <div className="v ok">On-prem</div>
              <div className="hint">token · long-lived</div>
            </article>
          </div>

          <div className="bridge-grid">
            <div className="bridge-card">
              <header>
                <div>
                  <h2>Agent tools</h2>
                  <p>Four REST tools for query and control — same surface as production agent HA adapters.</p>
                </div>
                <span className="status-pill"><span className="dot"></span> Enabled</span>
              </header>
              <div className="bridge-body">
                <div className="tool-list">
                  <div className="tool-item">
                    <code>ha_list_entities</code>
                    <p>List entities, optionally filtered by domain or area (friendly name match).</p>
                    <div className="params">domain? · area?  →  id, state, friendly_name</div>
                  </div>
                  <div className="tool-item">
                    <code>ha_get_state</code>
                    <p>Detailed state for one entity — attributes, last changed, last updated.</p>
                    <div className="params">entity_id  →  state + attributes</div>
                  </div>
                  <div className="tool-item">
                    <code>ha_list_services</code>
                    <p>Discover callable services and accepted parameters for a domain.</p>
                    <div className="params">domain?  →  service catalog</div>
                  </div>
                  <div className="tool-item">
                    <code>ha_call_service</code>
                    <p>Execute a service. Entity IDs validated; dangerous domains blocked.</p>
                    <div className="params">domain · service · entity_id? · data?</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bridge-card">
              <header>
                <div>
                  <h2>Connection</h2>
                  <p>Long-lived token · local URL · no cloud relay.</p>
                </div>
              </header>
              <div className="bridge-body">
                <div className="kv-table">
                  <div className="kv-row"><span className="k">HASS_URL</span><span className="v">http://homeassistant.local:8123</span></div>
                  <div className="kv-row"><span className="k">Auth</span><span className="v">long-lived access token</span></div>
                  <div className="kv-row"><span className="k">Events</span><span className="v">websocket · state_changed</span></div>
                  <div className="kv-row"><span className="k">Outbound</span><span className="v">persistent_notification.create</span></div>
                  <div className="kv-row"><span className="k">Reconnect</span><span className="v">5s → 10s → 30s → 60s</span></div>
                  <div className="kv-row"><span className="k">Cooldownout</span><span className="v">30s per entity</span></div>
                </div>
              </div>
            </div>

            <div className="bridge-card">
              <header>
                <div>
                  <h2>Event watch filters</h2>
                  <p>Default is silent — only configured domains/entities reach the agent.</p>
                </div>
              </header>
              <div className="bridge-body">
                <div className="section-label" style={{ marginBottom: '0.5rem' }}>watch_domains</div>
                <div className="tag-list">
                  <span className="tag">climate</span>
                  <span className="tag">binary_sensor</span>
                  <span className="tag">alarm_control_panel</span>
                  <span className="tag">light</span>
                </div>
                <div className="section-label" style={{ margin: '1rem 0 0.5rem' }}>watch_entities</div>
                <div className="tag-list">
                  <span className="tag">sensor.front_door_battery</span>
                </div>
                <div className="section-label" style={{ margin: '1rem 0 0.5rem' }}>ignore_entities</div>
                <div className="tag-list">
                  <span className="tag">sensor.uptime</span>
                  <span className="tag">sensor.cpu_usage</span>
                  <span className="tag">sensor.memory_usage</span>
                </div>
              </div>
            </div>

            <div className="bridge-card">
              <header>
                <div>
                  <h2>Security hard-blocks</h2>
                  <p>Service domains that must never reach the HA host via the agent.</p>
                </div>
                <span className="status-pill warn"><span className="dot"></span> Enforced</span>
              </header>
              <div className="bridge-body">
                <div className="tag-list">
                  <span className="tag blocked">shell_command</span>
                  <span className="tag blocked">command_line</span>
                  <span className="tag blocked">python_script</span>
                  <span className="tag blocked">pyscript</span>
                  <span className="tag blocked">hassio</span>
                  <span className="tag blocked">rest_command</span>
                </div>
                <p style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: 'var(--color-fg-muted)', lineHeight: 1.45 }}>
                  Entity IDs must match <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7em' }}>^[a-z_][a-z0-9_]*\.[a-z0-9_]+$</span> — injection attempts are rejected before dispatch.
                </p>
              </div>
            </div>
          </div>

          <div className="bridge-card" style={{ marginTop: '1rem' }}>
            <header>
              <div>
                <h2>Live event feed</h2>
                <p>Domain-formatted state changes from the gateway — reactive automation surface.</p>
              </div>
              <span className="status-pill"><span className="dot"></span> Streaming</span>
            </header>
            <div className="bridge-body">
              <div className="event-feed" id="event-feed" aria-live="polite">
                <div className="event-item domain-climate">
                  <div className="src"><span>Home Assistant · climate</span><time>14:01:12</time></div>
                  <div className="body"><strong>climate.west_wing</strong> — HVAC mode changed from 'auto' to 'heat' (current: 70.1, target: 68)</div>
                </div>
                <div className="event-item domain-binary">
                  <div className="src"><span>Home Assistant · binary_sensor</span><time>13:58:40</time></div>
                  <div className="body"><strong>binary_sensor.west_wing_occupancy</strong> — cleared</div>
                </div>
                <div className="event-item domain-light">
                  <div className="src"><span>Home Assistant · light</span><time>13:52:03</time></div>
                  <div className="body"><strong>light.great_room</strong> — turned on</div>
                </div>
                <div className="event-item domain-alarm">
                  <div className="src"><span>Home Assistant · alarm</span><time>08:14:22</time></div>
                  <div className="body"><strong>alarm_control_panel.home</strong> — alarm state changed from 'disarmed' to 'armed_stay'</div>
                </div>
                <div className="event-item domain-binary">
                  <div className="src"><span>Home Assistant · binary_sensor</span><time>07:41:09</time></div>
                  <div className="body"><strong>binary_sensor.front_door</strong> — triggered → cleared (cooldown held follow-ups 30s)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  PERMISSIONS  */}
        <div className="panel" id="panel-permissions" data-title="Permissions">
          <div className="perm-card">
            <div className="perm-header">
              <div>
                <h2>Guardrails</h2>
                <p>Agents propose; these rules decide. Temporary grants expire automatically. Color is never the only signal — mode labels stay visible.</p>
              </div>
              <span className="status-pill"><span className="dot"></span> Local audit on</span>
            </div>

            <div className="perm-row">
              <div>
                <h3>Control lights — interior</h3>
                <div className="scope">All interior zones · scenes included</div>
                <div className="id">cap.lights.interior</div>
              </div>
              <div className="seg" role="group" aria-label="Lights interior permission">
                <button type="button" data-mode="always" aria-pressed="true">Always</button>
                <button type="button" data-mode="ask" aria-pressed="false">Ask</button>
                <button type="button" data-mode="never" aria-pressed="false">Never</button>
              </div>
              <span className="badge">active</span>
            </div>

            <div className="perm-row">
              <div>
                <h3>Climate adjustments — west wing</h3>
                <div className="scope">Setpoints &amp; setbacks · ±3°F band</div>
                <div className="id">cap.climate.west_wing</div>
              </div>
              <div className="seg" role="group" aria-label="Climate west wing permission">
                <button type="button" data-mode="always" aria-pressed="false">Always</button>
                <button type="button" data-mode="ask" aria-pressed="true">Ask</button>
                <button type="button" data-mode="never" aria-pressed="false">Never</button>
              </div>
              <span className="badge">ask · default</span>
            </div>

            <div className="perm-row">
              <div>
                <h3>Security arm / disarm</h3>
                <div className="scope">Partition: main house</div>
                <div className="id">cap.security.arm</div>
              </div>
              <div className="seg" role="group" aria-label="Security permission">
                <button type="button" data-mode="always" aria-pressed="false">Always</button>
                <button type="button" data-mode="ask" aria-pressed="true">Ask</button>
                <button type="button" data-mode="never" aria-pressed="false">Never</button>
              </div>
              <span className="badge">ask</span>
            </div>

            <div className="perm-row">
              <div>
                <h3>Exterior locks</h3>
                <div className="scope">Doors &amp; gates · never auto-unlock</div>
                <div className="id">cap.locks.exterior</div>
              </div>
              <div className="seg" role="group" aria-label="Locks permission">
                <button type="button" data-mode="always" aria-pressed="false">Always</button>
                <button type="button" data-mode="ask" aria-pressed="false">Ask</button>
                <button type="button" data-mode="never" aria-pressed="true">Never</button>
              </div>
              <span className="badge">denied</span>
            </div>

            <div className="perm-row">
              <div>
                <h3>Cloud model fallback</h3>
                <div className="scope">Optional remote inference if local offline</div>
                <div className="id">cap.model.cloud_fallback</div>
              </div>
              <div className="seg" role="group" aria-label="Cloud fallback permission">
                <button type="button" data-mode="always" aria-pressed="false">Always</button>
                <button type="button" data-mode="ask" aria-pressed="false">Ask</button>
                <button type="button" data-mode="never" aria-pressed="true">Never</button>
              </div>
              <span className="badge">sovereign</span>
            </div>
          </div>

          <div className="perm-card">
            <div className="perm-header">
              <div>
                <h2>Active temporary grants</h2>
                <p>Time-boxed exceptions. Empty means steady-state policy only.</p>
              </div>
            </div>
            <div className="perm-row">
              <div>
                <h3>No open temporary grants</h3>
                <div className="scope">Systems nominal · awaiting west wing decision</div>
              </div>
              <div></div>
              <span className="badge">—</span>
            </div>
          </div>

          <div className="perm-card">
            <div className="perm-header">
              <div>
                <h2>HA service hard-blocks</h2>
                <p>Host-level domains the agent cannot call — separate from Always / Ask / Never guardrails. Prevents code execution and SSRF via the home controller.</p>
              </div>
              <span className="status-pill warn"><span className="dot"></span> Non-negotiable</span>
            </div>
            <div className="perm-row">
              <div>
                <h3>Blocked service domains</h3>
                <div className="scope">shell_command · command_line · python_script · pyscript · hassio · rest_command</div>
                <div className="id">policy.ha.blocked_domains</div>
              </div>
              <div></div>
              <span className="badge">enforced</span>
            </div>
            <div className="perm-row">
              <div>
                <h3>Entity ID validation</h3>
                <div className="scope">Rejects malformed IDs before REST dispatch</div>
                <div className="id">^[a-z_][a-z0-9_]*\.[a-z0-9_]+$</div>
              </div>
              <div></div>
              <span className="badge">active</span>
            </div>
          </div>
        </div>

        {/*  OPERATIONS — energy + local LLM inference  */}
        <div className="panel" id="panel-operations" data-title="Operations">
          <div className="ops-intro ops-intro-wide">
            <p className="breadcrumb">
              <a href="#" data-panel="overview">Overview</a>
              <span aria-hidden="true">/</span>
              <span>Operations</span>
            </p>
            <div className="ops-tabs" role="tablist" aria-label="Operations views">
              <button type="button" className="ops-tab active" data-ops-tab="summary" aria-selected="true">Summary</button>
              <button type="button" className="ops-tab" data-ops-tab="electricity" aria-selected="false">Electricity</button>
              <button type="button" className="ops-tab" data-ops-tab="intelligence" aria-selected="false">Intelligence</button>
              <button type="button" className="ops-tab" data-ops-tab="control" aria-selected="false">Control</button>
            </div>
            <h2>Energy &amp; intelligence</h2>
            <p>
              Household load with local LLM inference and homelab as first-class sources —
              whole-home Shelly, inference node plug, rack PDU.
            </p>
            <div className="live-power-badge" aria-live="polite">
              <span className="dot" aria-hidden="true"></span>
              Power usage <strong>2.4 kW</strong>
              <span className="sep">·</span>
              Inference <strong>180 W</strong>
            </div>
          </div>

          {/* Summary tab */}
          <div className="ops-tab-panel active" id="ops-summary" data-ops-panel="summary">
            <div className="energy-layout">
              <div className="chart-card energy-dist-card">
                <h3>Energy distribution</h3>
                <p className="sub">Today · solar · grid · inference · homelab</p>
                <div className="dist-diagram">
                  <div className="dist-node n-solar">
                    <span className="dist-icon" aria-hidden="true">☀</span>
                    <span className="dist-name">Solar</span>
                    <span className="dist-val">10.3 kWh</span>
                  </div>
                  <div className="dist-node n-grid">
                    <span className="dist-icon" aria-hidden="true">⚡</span>
                    <span className="dist-name">Grid</span>
                    <span className="dist-val">↓1.3 · ↑6.4 kWh</span>
                  </div>
                  <div className="dist-node n-home">
                    <span className="dist-icon" aria-hidden="true">⌂</span>
                    <span className="dist-name">Home</span>
                    <span className="dist-val">15.4 kWh</span>
                  </div>
                  <div className="dist-node n-infer">
                    <span className="dist-icon" aria-hidden="true">◆</span>
                    <span className="dist-name">Inference</span>
                    <span className="dist-val">1.4 kWh</span>
                  </div>
                  <div className="dist-node n-lab">
                    <span className="dist-icon" aria-hidden="true">▣</span>
                    <span className="dist-name">Homelab</span>
                    <span className="dist-val">3.2 kWh</span>
                  </div>
                  <div className="dist-node n-batt">
                    <span className="dist-icon" aria-hidden="true">▮</span>
                    <span className="dist-name">Battery</span>
                    <span className="dist-val">0 kWh</span>
                  </div>
                  <svg className="dist-lines" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M100 40 C100 100, 200 80, 200 110" fill="none" stroke="var(--en-solar)" strokeWidth="2" opacity="0.7" />
                    <path d="M40 110 C100 110, 160 110, 200 110" fill="none" stroke="var(--en-grid)" strokeWidth="2" opacity="0.7" />
                    <path d="M200 110 C240 110, 300 70, 340 50" fill="none" stroke="var(--en-infer)" strokeWidth="2" opacity="0.7" />
                    <path d="M200 110 C240 140, 300 150, 340 160" fill="none" stroke="var(--en-lab)" strokeWidth="2" opacity="0.7" />
                    <path d="M200 110 C200 150, 160 180, 100 190" fill="none" stroke="var(--en-batt)" strokeWidth="2" opacity="0.45" />
                  </svg>
                </div>
              </div>

              <div className="chart-card">
                <h3>Sources</h3>
                <p className="sub">Usage today · local metering</p>
                <table className="sources-table">
                  <thead>
                    <tr><th>Source</th><th>Usage</th><th>Cost</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><span className="swatch sw-solar"></span> Solar total</td><td>10.3 kWh</td><td>—</td></tr>
                    <tr><td><span className="swatch sw-grid"></span> Grid total</td><td>1.3 kWh</td><td>$0.18</td></tr>
                    <tr><td><span className="swatch sw-infer"></span> Inference total</td><td>1.4 kWh</td><td>$0.19</td></tr>
                    <tr><td><span className="swatch sw-lab"></span> Homelab total</td><td>3.2 kWh</td><td>$0.44</td></tr>
                    <tr><td><span className="swatch sw-batt"></span> Battery total</td><td>0 kWh</td><td>—</td></tr>
                    <tr className="row-muted"><td>AI share of home</td><td>9%</td><td>—</td></tr>
                    <tr className="row-muted"><td>Inference on solar</td><td>72%</td><td>—</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="chart-card gauges-card">
                <h3>Self-sufficiency</h3>
                <p className="sub">Home · intelligence on solar</p>
                <div className="gauge-row">
                  <div className="gauge-item">
                    <div className="chart-el gauge" id="chart-gauge-self"></div>
                    <div className="gauge-label">Self-sufficiency</div>
                  </div>
                  <div className="gauge-item">
                    <div className="chart-el gauge" id="chart-gauge-solar-ai"></div>
                    <div className="gauge-label">AI on solar</div>
                  </div>
                  <div className="gauge-item">
                    <div className="chart-el gauge" id="chart-gauge-net"></div>
                    <div className="gauge-label">Net import</div>
                  </div>
                </div>
                <div className="ops-stat-row" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                  <div className="ops-stat">
                    <div className="k">Net from grid</div>
                    <div className="v" style={{ fontSize: '1rem' }}>1.3 kWh</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Wh / kTok</div>
                    <div className="v" style={{ fontSize: '1rem' }}>0.66</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Cost of AI today</div>
                    <div className="v" style={{ fontSize: '1rem' }}>$0.19</div>
                  </div>
                </div>
              </div>

              <div className="chart-card span-full">
                <h3>Power sources</h3>
                <p className="sub">24h · Solar · Grid · Homelab · Inference · Consumption</p>
                <div className="chart-el tall" id="chart-power-sources"></div>
              </div>

              <div className="chart-card span-full">
                <h3>Current power flow</h3>
                <p className="sub">Live Sankey · sources → sinks including local model</p>
                <div className="chart-el tall" id="chart-sankey"></div>
              </div>
            </div>
          </div>

          {/* Electricity tab */}
          <div className="ops-tab-panel" id="ops-electricity" data-ops-panel="electricity" hidden>
            <div className="energy-layout">
              <div className="chart-card span-full">
                <h3>Electricity usage</h3>
                <p className="sub">Stacked by category · HVAC · house · homelab · inference · untracked</p>
                <div className="ops-stat-row">
                  <div className="ops-stat">
                    <div className="k">Today</div>
                    <div className="v">28.4<span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', fontWeight: 500 }}> kWh</span></div>
                    <div className="d down">↓ 8% vs 7d</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Inference</div>
                    <div className="v">1.4<span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', fontWeight: 500 }}> kWh</span></div>
                    <div className="d">9% of home</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Homelab</div>
                    <div className="v">3.2<span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', fontWeight: 500 }}> kWh</span></div>
                    <div className="d">rack + NAS + HA</div>
                  </div>
                </div>
                <div className="chart-el tall" id="chart-electricity"></div>
              </div>
              <div className="chart-card span-full">
                <h3>Individual devices</h3>
                <p className="sub">Smart plugs · PDU circuits · inference node</p>
                <div className="chart-el" id="chart-devices"></div>
              </div>
            </div>
          </div>

          {/* Intelligence tab */}
          <div className="ops-tab-panel" id="ops-intelligence" data-ops-panel="intelligence" hidden>
            <div className="energy-layout">
              <div className="chart-card">
                <h3>Inference power · 24h</h3>
                <p className="sub">sensor.inference_node_power · W</p>
                <div className="ops-stat-row">
                  <div className="ops-stat">
                    <div className="k">Now</div>
                    <div className="v">180<span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', fontWeight: 500 }}> W</span></div>
                    <div className="d">generating</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Idle baseline</div>
                    <div className="v">85<span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', fontWeight: 500 }}> W</span></div>
                    <div className="d">model resident</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Peak today</div>
                    <div className="v">420<span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', fontWeight: 500 }}> W</span></div>
                    <div className="d">vision + tools</div>
                  </div>
                </div>
                <div className="chart-el" id="chart-inference"></div>
              </div>
              <div className="chart-card">
                <h3>Workload mix</h3>
                <p className="sub">Energy by job type today</p>
                <div className="chart-el" id="chart-workload"></div>
              </div>
              <div className="chart-card span-full">
                <h3>Efficiency</h3>
                <p className="sub">Local model · no cloud egress for day-to-day</p>
                <div className="eff-grid">
                  <div className="ops-stat">
                    <div className="k">Tokens today</div>
                    <div className="v" style={{ fontSize: '1.1rem' }}>2.1 M</div>
                    <div className="d">47 turns</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Wh / 1k tokens</div>
                    <div className="v" style={{ fontSize: '1.1rem' }}>0.66</div>
                    <div className="d">↓ better than yesterday</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">tok/s per W</div>
                    <div className="v" style={{ fontSize: '1.1rem' }}>0.07</div>
                    <div className="d">at 180 W active</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Duty cycle</div>
                    <div className="v" style={{ fontSize: '1.1rem' }}>18%</div>
                    <div className="d">generating vs idle</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Avoided cloud $</div>
                    <div className="v" style={{ fontSize: '1.1rem' }}>~$4.20</div>
                    <div className="d">est. vs API tokens</div>
                  </div>
                  <div className="ops-stat">
                    <div className="k">Quiet hours</div>
                    <div className="v" style={{ fontSize: '1.1rem' }}>11p–6a</div>
                    <div className="d">index paused</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control tab (perms + domains) */}
          <div className="ops-tab-panel" id="ops-control" data-ops-panel="control" hidden>
            <div className="ops-grid">
              <div className="chart-card">
                <h3>Permission outcomes · 7d</h3>
                <p className="sub">Always / Ask / Never vs hard-block denials</p>
                <div className="chart-el" id="chart-perms"></div>
              </div>
              <div className="chart-card">
                <h3>Domain watch volume</h3>
                <p className="sub">Events retained after noisy-sensor filter</p>
                <div className="chart-el" id="chart-domains"></div>
              </div>
              <div className="chart-card span-full" style={{ gridColumn: '1 / -1' }}>
                <h3>Household load · 24h</h3>
                <p className="sub">Whole-home vs setback target</p>
                <div className="chart-el" id="chart-energy"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/*  Right insights (desktop)  */}
    <aside className="insights" aria-label="Proactive insights">
      <div className="insights-head">
        <h2>Insights</h2>
        <p>Proactive suggestions · local only</p>
      </div>
      <div className="insights-body">
        <article className="insight">
          <div className="label"><span>Suggestion</span><span>2m</span></div>
          <h3>West wing setback</h3>
          <p>Unoccupied 3h · 2.1° above setpoint. Setback to 66°F until 5:30 PM · ~1.8 kWh via <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>climate.west_wing</span>.</p>
          <div className="insight-actions">
            <button type="button" className="btn btn-primary btn-sm">Accept</button>
            <button type="button" className="btn btn-secondary btn-sm">Review</button>
            <button type="button" className="btn btn-ghost">Dismiss</button>
          </div>
        </article>
        <article className="insight priority">
          <div className="label"><span>Permission</span><span>4h window</span></div>
          <h3>Temporary climate policy</h3>
          <p>Allow autonomous setbacks in west wing for this evening only? Fully reversible.</p>
          <div className="insight-actions">
            <button type="button" className="btn btn-primary btn-sm">Allow 4h</button>
            <button type="button" className="btn btn-secondary btn-sm">Deny</button>
          </div>
        </article>
        <article className="insight" style={{ borderLeftColor: 'var(--color-accent-secondary)' }}>
          <div className="label"><span>Energy</span><span>Today</span></div>
          <h3>AI used 9% of kWh</h3>
          <p>Inference 1.4 kWh · 72% solar-backed. Wh/kTok 0.66. Load calm overall.</p>
          <div className="insight-actions">
            <button type="button" className="btn btn-secondary btn-sm" data-panel="operations">Ops</button>
            <button type="button" className="btn btn-ghost">Dismiss</button>
          </div>
        </article>
        <article className="insight">
          <div className="label"><span>Family</span><span>Tonight</span></div>
          <h3>Movie night 7:30</h3>
          <p>Pause heavy indexing during movie? Living room scene ready after soccer pickup.</p>
          <div className="insight-actions">
            <button type="button" className="btn btn-primary btn-sm">Pause index</button>
            <button type="button" className="btn btn-ghost">Dismiss</button>
          </div>
        </article>
      </div>
    </aside>
  </div>

  {/*  Mobile drawer  */}
  <div className="drawer-backdrop" id="drawer-backdrop" hidden></div>
  <aside className="drawer" id="drawer" aria-label="Mobile navigation" hidden>
    <div className="rail-brand">
      <span className="logo-mark" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2.5 7.5 L8 2.5 L13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 7v5.5h8V7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      Solo Home AI
    </div>
    <div className="runtime-chip">
      <div className="label">Local runtime</div>
      <span className="status-pill"><span className="dot"></span> Online</span>
      <div className="meta">model · solohome-pm-7b<br />ha · websocket linked</div>
    </div>
    <nav className="nav-group">
      <button type="button" className="nav-item active" data-panel="overview">Overview</button>
      <button type="button" className="nav-item" data-panel="manager">Property Manager</button>
      <button type="button" className="nav-item" data-panel="zones">Zones</button>
      <button type="button" className="nav-item" data-panel="devices">Devices</button>
      <button type="button" className="nav-item" data-panel="bridge">HA Bridge</button>
      <button type="button" className="nav-item" data-panel="permissions">Permissions</button>
      <button type="button" className="nav-item" data-panel="operations">Operations</button>
    </nav>
  </aside>

    
    </div>
  );
}
