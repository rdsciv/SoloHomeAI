import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import "../styles/landing.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { toggleTheme } = useTheme();
  const [, setMenuOpen] = useState(false);

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Wire theme + menu via event delegation after mount (ids preserved)
  useEffect(() => {
    const themeBtn = document.getElementById("theme-toggle");
    const menuBtn = document.getElementById("menu-btn");
    const mobileNav = document.getElementById("mobile-nav");
    if (!themeBtn || !menuBtn || !mobileNav) return;

    const onTheme = () => toggleTheme();
    const onMenu = () => {
      setMenuOpen((open) => {
        const next = !open;
        menuBtn.setAttribute("aria-expanded", String(next));
        if (next) {
          mobileNav.hidden = false;
          mobileNav.classList.add("open");
        } else {
          mobileNav.classList.remove("open");
          mobileNav.hidden = true;
        }
        return next;
      });
    };
    const onNavClick = () => {
      setMenuOpen(false);
      menuBtn.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("open");
      mobileNav.hidden = true;
    };

    themeBtn.addEventListener("click", onTheme);
    menuBtn.addEventListener("click", onMenu);
    mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", onNavClick));

    return () => {
      themeBtn.removeEventListener("click", onTheme);
      menuBtn.removeEventListener("click", onMenu);
      mobileNav.querySelectorAll("a").forEach((a) => a.removeEventListener("click", onNavClick));
    };
  }, [toggleTheme]);

  return (
    <>
<header className="site-header" id="site-header">
    <div className="container header-inner">
      <a className="logo" href="#top" aria-label="Solo Home AI home">
        <span className="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2.5 7.5 L8 2.5 L13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 7v5.5h8V7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.5 12.5v-2.5h3v2.5" strokeLinecap="round" />
          </svg>
        </span>
        Solo Home AI
      </a>

      <nav className="nav-desktop" aria-label="Primary">
        <a href="#problem">Approach</a>
        <a href="#pillars">Pillars</a>
        <a href="#how">How it works</a>
        <a href="#robot-ready">Robot-ready</a>
        <a href="#gc">For GCs</a>
        <a href="#trust">Sovereignty</a>
        <Link to="/app">Live app</Link>
        <Link to="/system-map">System map</Link>
      </nav>

      <div className="header-actions">
        <button className="theme-toggle" type="button" id="theme-toggle" aria-label="Toggle light and dark theme">
          <svg className="icon-moon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3 5.5 5.5 0 1 0 13 9.5z" strokeLinejoin="round" />
          </svg>
          <svg className="icon-sun" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1" strokeLinecap="round" />
          </svg>
        </button>
        <Link className="btn btn-secondary" to="/app" id="hdr-secondary">Live app</Link>
        <a className="btn btn-primary" href="#pilot">Request pilot</a>
        <button className="menu-btn" type="button" id="menu-btn" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
    <div className="container mobile-nav" id="mobile-nav" hidden>
      <nav aria-label="Mobile">
        <a href="#problem">Approach</a>
        <a href="#pillars">Pillars</a>
        <a href="#how">How it works</a>
        <a href="#robot-ready">Robot-ready</a>
        <a href="#gc">For GCs</a>
        <a href="#trust">Sovereignty</a>
        <Link to="/app">Live app</Link>
        <Link to="/system-map">System map</Link>
        <a href="#pilot">Request pilot</a>
      </nav>
    </div>
  </header>

  <main id="top">
    {/*  HERO  */}
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="overline">solohome.ai · Local-first property intelligence</p>
          <h1 className="display">The sovereign AI property manager for homes that stay yours.</h1>
          <p className="lead">
            Quiet luxury meets local open-weight AI. Proactive intelligence for high-end homes —
            without cloud lock-in, vendor surveillance, or DIY fragility.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary btn-lg" href="#pilot">For homeowners</a>
            <Link className="btn btn-secondary btn-lg" to="/app">Open live dashboard</Link>
          </div>
          <div className="hero-meta">
            <span><span className="dot" aria-hidden="true"></span> Runs on-prem · open weights</span>
            <span>Permissioned agents</span>
            <span>Seattle custom-home ready</span>
          </div>
        </div>

        <div className="hero-frame" aria-hidden="true">
          <div className="frame-bar">
            <div className="frame-bar-left">
              <span>AI Property Manager</span>
            </div>
            <span className="pill"><span className="pill-dot"></span> Local · Online</span>
          </div>
          <div className="frame-body">
            <div className="insight-card">
              <div className="label">Proactive insight</div>
              <p><strong>West wing is 2.1° above setpoint</strong> while unoccupied for 3 hours. Suggest setback to 66°F until 5:30 PM arrival — estimated 1.8 kWh saved.</p>
            </div>
            <div className="status-row">
              <div className="status-tile">
                <div className="k">Climate</div>
                <div className="v ok">Nominal</div>
              </div>
              <div className="status-tile">
                <div className="k">Security</div>
                <div className="v ok">Armed stay</div>
              </div>
              <div className="status-tile">
                <div className="k">Model</div>
                <div className="v">Local runtime</div>
              </div>
            </div>
            <div className="insight-card" style={{ borderLeftColor: 'var(--color-accent-secondary)' }}>
              <div className="label">Permission</div>
              <p>Allow temporary climate policy for west wing? Scope: 4 hours · Reversible anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*  PROBLEM / SOLUTION  */}
    <section className="section-alt" id="problem">
      <div className="container">
        <div className="section-head">
          <p className="overline">The gap</p>
          <h2 className="h2">Cloud lock-in or fragile DIY. Neither is luxury.</h2>
          <p className="lead">High-end homes deserve intelligence that is as durable as the architecture — not a vendor subscription or a weekend project that breaks on update day.</p>
        </div>

        <div className="split-grid">
          <article className="compare-card problem">
            <span className="compare-tag">Problem landscape</span>
            <h3>Proprietary cloud ecosystems</h3>
            <p>Polished until the policy changes. Your routines, scenes, and history live on someone else’s terms.</p>
            <ul className="compare-list">
              <li><span className="mark" aria-hidden="true">×</span> Data and automations tied to vendor uptime and pricing</li>
              <li><span className="mark" aria-hidden="true">×</span> Opaque “AI” features with no inspectable policy</li>
              <li><span className="mark" aria-hidden="true">×</span> Poor fit for multi-zone custom estates and GC handoff</li>
              <li><span className="mark" aria-hidden="true">×</span> Exit costs measured in months of rewiring logic</li>
            </ul>
          </article>

          <article className="compare-card solution">
            <span className="compare-tag">Solo Home AI</span>
            <h3>Sovereign, open, production-grade</h3>
            <p>Local open-weight models. Permissioned agents. A property manager posture — not another chat toy.</p>
            <ul className="compare-list">
              <li><span className="mark" aria-hidden="true">✓</span> Inference and memory stay on the property by default</li>
              <li><span className="mark" aria-hidden="true">✓</span> Guardrails you can read, audit, and hand to owners</li>
              <li><span className="mark" aria-hidden="true">✓</span> Elevated Home Assistant aesthetics with real hierarchy</li>
              <li><span className="mark" aria-hidden="true">✓</span> Robot-ready packages designed with custom GCs</li>
            </ul>
          </article>
        </div>

        <p className="muted" style={{ marginTop: '1.5rem', fontSize: '0.875rem', maxWidth: '42em' }}>
          DIY Home Assistant is powerful — and often fragile at scale. Solo Home AI respects that craft while delivering the reliability, permissions model, and finish expected in a high-end home.
        </p>
      </div>
    </section>

    {/*  PILLARS  */}
    <section id="pillars">
      <div className="container">
        <div className="section-head">
          <p className="overline">Design pillars</p>
          <h2 className="h2">Five principles. No spectacle.</h2>
          <p className="lead">A restrained system for homes that value calm, craft, and control over novelty.</p>
        </div>

        <div className="pillars-grid">
          <article className="pillar">
            <div className="pillar-num">01</div>
            <h3>Sovereign by default</h3>
            <p>Local open-weight models. Data leaves the property only under explicit policy.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">02</div>
            <h3>Permissioned agency</h3>
            <p>Agents propose. Guardrails decide. Humans remain in the loop where it matters.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">03</div>
            <h3>Proactive, not chatty</h3>
            <p>Insights when useful. Silence when systems are nominal. Respect attention.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">04</div>
            <h3>Built for custom homes</h3>
            <p>Zones, scenes, and contractor packages — not plugin chaos or gadget clutter.</p>
          </article>
          <article className="pillar">
            <div className="pillar-num">05</div>
            <h3>Robot-ready foundation</h3>
            <p>Wiring, sensors, and policy for a sensory platform that can grow with the home.</p>
          </article>
        </div>
      </div>
    </section>

    {/*  HOW IT WORKS  */}
    <section className="section-alt" id="how">
      <div className="container">
        <div className="section-head">
          <p className="overline">Agentic flow</p>
          <h2 className="h2">How the property manager works</h2>
          <p className="lead">A simple loop over a local Home Assistant bridge: observe via WebSocket, reason on-prem, propose within policy, act only with permission.</p>
        </div>

        <div className="flow" role="list">
          <div className="flow-step" role="listitem">
            <div className="flow-index">1</div>
            <h3>Sense</h3>
            <p>HA <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>state_changed</code> events and sensors stream into a filtered local gateway — not a public cloud.</p>
          </div>
          <div className="flow-step" role="listitem">
            <div className="flow-index">2</div>
            <h3>Reason</h3>
            <p>Open-weight models evaluate entity state against home policy, schedules, and learned patterns on-prem.</p>
          </div>
          <div className="flow-step" role="listitem">
            <div className="flow-index">3</div>
            <h3>Propose</h3>
            <p>Suggestions surface as clear insight cards with scope, duration, and expected effect — before any service call.</p>
          </div>
          <div className="flow-step" role="listitem">
            <div className="flow-index">4</div>
            <h3>Act</h3>
            <p>REST tools execute only after Always / Ask / Never. Host-dangerous HA domains stay hard-blocked.</p>
          </div>
        </div>
      </div>
    </section>

    {/*  ROBOT-READY VISION  */}
    <section id="robot-ready">
      <div className="container">
        <div className="vision-panel">
          <div className="vision-copy">
            <p className="overline">Future sensory platform</p>
            <h2 className="h2">Quiet infrastructure for robots that earn their keep.</h2>
            <p>
              Solo Home AI is designed as the policy and intelligence layer for homes that will host
              mobile assistants, inspection platforms, and specialized appliances — without turning
              the architecture into a showroom of LEDs.
            </p>
            <ul className="vision-list">
              <li>Zone graphs and clearance maps suitable for future navigation</li>
              <li>Power, networking, and sensor drops specified at rough-in</li>
              <li>Permission scopes that extend from thermostats to mobile agents</li>
              <li>Open interfaces — no single-vendor robot lock-in</li>
            </ul>
          </div>
          <div className="vision-diagram" aria-hidden="true">
            <svg className="diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
              <line className="line" x1="170" y1="48" x2="80" y2="110" />
              <line className="line" x1="170" y1="48" x2="260" y2="110" />
              <line className="line" x1="170" y1="48" x2="170" y2="120" />
              <line className="line-accent" x1="80" y1="140" x2="170" y2="170" />
              <line className="line-accent" x1="260" y1="140" x2="170" y2="170" />
              <line className="line-accent" x1="170" y1="140" x2="170" y2="170" />
              <rect className="node-accent" x="130" y="28" width="80" height="36" rx="8" />
              <text x="170" y="50" textAnchor="middle" fill="currentColor" style={{ fill: 'var(--color-primary)' }}>Property Manager</text>
              <rect className="node-fill" x="40" y="110" width="80" height="32" rx="6" />
              <text x="80" y="130" textAnchor="middle">Climate</text>
              <rect className="node-fill" x="130" y="110" width="80" height="32" rx="6" />
              <text x="170" y="130" textAnchor="middle">Security</text>
              <rect className="node-fill" x="220" y="110" width="80" height="32" rx="6" />
              <text x="260" y="130" textAnchor="middle">Energy</text>
              <rect className="node-fill" x="100" y="170" width="140" height="36" rx="8" />
              <text x="170" y="192" textAnchor="middle">Policy · Permissions · Audit</text>
              <text x="170" y="228" textAnchor="middle" style={{ fontSize: '9px' }}>Local runtime · open weights</text>
            </svg>
          </div>
        </div>
      </div>
    </section>

    {/*  GC SECTION  */}
    <section className="section-alt" id="gc">
      <div className="container">
        <div className="gc-layout">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="overline">General contractors</p>
            <h2 className="h2">Specify robot-ready once. Hand off with confidence.</h2>
            <p className="lead" style={{ marginTop: '1rem' }}>
              For Seattle-area custom-home builders who want a coherent intelligence package —
              not a shopping list of incompatible gadgets.
            </p>
            <p className="secondary" style={{ marginTop: '1.25rem', fontSize: '0.9375rem', maxWidth: '32em' }}>
              Solo Home AI partners on rough-in standards, zone documentation, and a homeowner
              pilot that continues after certificate of occupancy. One package. Clear scope. Premium finish.
            </p>
            <div className="hero-ctas" style={{ marginTop: '1.75rem', marginBottom: 0 }}>
              <a className="btn btn-primary" href="#pilot">Specify robot-ready</a>
              <a className="btn btn-secondary" href="#trust">Review sovereignty model</a>
            </div>
          </div>

          <div className="package-card">
            <div className="package-header">
              <p className="overline">Standard package</p>
              <h3>Robot-Ready Package</h3>
              <p>Designed for new construction and major renovations on custom estates.</p>
            </div>
            <div className="package-body">
              <div className="package-row">
                <span className="num">01</span>
                <div>
                  <h4>Structured cabling &amp; power plan</h4>
                  <p>Drop locations, PoE budget, and dedicated circuits for local compute and future mobility docks.</p>
                </div>
              </div>
              <div className="package-row">
                <span className="num">02</span>
                <div>
                  <h4>Sensor &amp; zone baseline</h4>
                  <p>Climate, occupancy, contact, and environmental sensing mapped to architectural zones — not room labels alone.</p>
                </div>
              </div>
              <div className="package-row">
                <span className="num">03</span>
                <div>
                  <h4>Local runtime enclosure</h4>
                  <p>Quiet, ventilated housing for open-weight models and integration bridges — serviceable without a cloud account.</p>
                </div>
              </div>
              <div className="package-row">
                <span className="num">04</span>
                <div>
                  <h4>Policy handoff kit</h4>
                  <p>Owner-facing permissions defaults, GC documentation, and commissioning checklist for the AI Property Manager.</p>
                </div>
              </div>
              <div className="package-row">
                <span className="num">05</span>
                <div>
                  <h4>Pilot &amp; support window</h4>
                  <p>Post-occupancy tuning with the homeowner — scenes, guardrails, and seasonal policies.</p>
                </div>
              </div>
            </div>
            <div className="package-footer">
              <p className="note">Seattle metro preferred for early pilots</p>
              <a className="btn btn-primary" href="#pilot">Talk to Solo Home</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*  TRUST  */}
    <section id="trust">
      <div className="container">
        <div className="section-head">
          <p className="overline">Trust &amp; sovereignty</p>
          <h2 className="h2">Control you can inspect.</h2>
          <p className="lead">Premium technology earns trust through clarity — local models, explicit permissions, and open source where it counts.</p>
        </div>

        <div className="trust-grid">
          <article className="trust-card">
            <div className="trust-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="7" width="12" height="8" rx="1.5" />
                <path d="M6 7V5.5a3 3 0 0 1 6 0V7" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Local open-weight models</h3>
            <p>Inference runs on-property. No requirement to stream home state to a third-party model API for day-to-day management.</p>
            <div className="trust-mono">runtime: local · weights: open · egress: policy</div>
          </article>
          <article className="trust-card">
            <div className="trust-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="9" r="6" />
                <path d="M9 6v3.5l2 1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Permissions &amp; guardrails</h3>
            <p>Every capability is Always, Ask, or Never — by zone and by action class. Temporary grants expire. Full audit trail.</p>
            <div className="trust-mono">climate.west · ask · 4h · reversible</div>
          </article>
          <article className="trust-card">
            <div className="trust-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12.5 L9 4.5 L14 12.5z" strokeLinejoin="round" />
                <path d="M9 8v2.5" strokeLinecap="round" />
                <circle cx="9" cy="12" r="0.6" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h3>Open source foundation</h3>
            <p>Core integrations and policy surface are open for inspection. No black-box “trust us” automations for the systems that run your home.</p>
            <div className="trust-mono">license: open · audit: welcome</div>
          </article>
        </div>
      </div>
    </section>

    {/*  FOOTER CTA  */}
    <section className="section-alt footer-cta" id="pilot">
      <div className="container">
        <p className="overline" style={{ marginBottom: '1rem' }}>Pilot program</p>
        <h2 className="display">Bring sovereign intelligence home.</h2>
        <p className="lead">
          Limited pilots for high-end homeowners and Seattle custom-home general contractors.
          We’ll scope zones, runtime, and guardrails with the same care as the build itself.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-lg" href="mailto:pilot@solohome.ai?subject=Homeowner%20pilot%20inquiry">Request a homeowner pilot</a>
          <a className="btn btn-secondary btn-lg" href="mailto:gc@solohome.ai?subject=Robot-ready%20package%20inquiry">Contact for GC packages</a>
        </div>
      </div>
    </section>
  </main>

  <footer className="site-footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="logo" href="#top">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.5 7.5 L8 2.5 L13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 7v5.5h8V7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Solo Home AI
          </a>
          <p>The sovereign, open-source AI property manager. Quiet luxury meets local open-weight AI.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#pillars">Pillars</a>
            <a href="#how">How it works</a>
            <a href="#trust">Sovereignty</a>
            <Link to="/app">Live dashboard</Link>
            <Link to="/app?panel=operations">Operations</Link>
            <Link to="/system-map">System map</Link>
          </div>
          <div className="footer-col">
            <h4>Partners</h4>
            <a href="#gc">General contractors</a>
            <a href="#robot-ready">Robot-ready</a>
            <a href="#pilot">Pilot program</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:pilot@solohome.ai">pilot@solohome.ai</a>
            <a href="mailto:gc@solohome.ai">gc@solohome.ai</a>
            <a href="https://solohome.ai">solohome.ai</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Solo Home AI. All rights reserved.</span>
        <span>Local-first · Permissioned · Open foundation</span>
      </div>
    </div>
  </footer>

    
    </>
  );
}
