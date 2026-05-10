"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import s from "./landing.module.css";

const tickerItems = [
  "500+ Questions", "Gemini 2.5 Flash", "DSA · HR · System Design",
  "Free Forever", "Real-time AI Feedback", "Streak Tracking",
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [glowVisible, setGlowVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { setMousePos({ x: e.clientX, y: e.clientY }); setGlowVisible(true); };
    const leave = () => setGlowVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseleave", leave); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className={s.page}>
      {/* Cursor Glow */}
      <div className={s.cursorGlow} style={{ left: mousePos.x - 200, top: mousePos.y - 200, opacity: glowVisible ? 1 : 0 }} />

      {/* ═══ NAVBAR ═══ */}
      <header className={`${s.nav} ${scrolled ? s.navScrolled : ""}`}>
        <div className={s.navInner}>
          <Link href="/" className={s.logo}><span className={s.logoSquare} />PrepAI</Link>
          <nav className={s.navLinks}>
            <a href="#features" className={s.navLink}>Features</a>
            <a href="#how" className={s.navLink}>How it Works</a>
            <a href="#pricing" className={s.navLink}>Pricing</a>
          </nav>
          <div className={s.navRight}>
            <Link href="/sign-in" className={s.signInLink}>Sign in</Link>
            <Link href="/sign-in" className={s.ctaBtn} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f5a623',
              color: '#000000',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--font-syne), sans-serif',
            }}>Get started →</Link>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className={s.hero}>
        <div className={s.heroBlob} />
        <div className={s.heroGrid} />
        <div className={s.heroLine} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className={s.badge}>
            <span className={s.pulseDot} />
            v1.0 · AI scoring live · 500+ questions
          </div>

          <h1 className={s.heroTitle}>
            Ace Every<br />Interview<span className={s.accentDot}>.</span>
          </h1>
          <p className={s.heroSub}>With real AI feedback.</p>
          <p className={s.heroDesc}>
            Practice DSA, HR and System Design. Get scored by Gemini 2.5 Flash on clarity, completeness and structure. Track your growth daily.
          </p>

          <div className={s.heroBtns}>
            <Link href="/sign-in" className={s.primaryBtn} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f5a623',
              color: '#000000',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--font-syne), sans-serif',
            }}>Start practicing free →</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={s.ghostBtn}>View on GitHub</a>
          </div>

          <div className={s.socialProof}>
            <span>Used in 3 active placement seasons</span>
            <span className={s.divider} />
            <span>Built with Gemini 2.5 Flash</span>
          </div>

          {/* PREVIEW CARD */}
          <div className={s.previewWrap}>
            <div className={s.previewInner}>
              <div className={s.termBar}>
                <span className={s.termDot} style={{ background: "#ff5f57" }} />
                <span className={s.termDot} style={{ background: "#febc2e" }} />
                <span className={s.termDot} style={{ background: "#28c840" }} />
                <span className={s.termTitle}>PrepAI — Practice Session — System Design</span>
              </div>
              <div className={s.previewContent}>
                {/* Left: Question */}
                <div className={s.previewPanel}>
                  <div className={s.tagRow}>
                    <span className={s.tag} style={{ background: "var(--indigo-dim)", color: "var(--indigo)" }}>SYSTEM DESIGN</span>
                    <span className={s.tag} style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>MEDIUM</span>
                  </div>
                  <p className={s.questionText}>How would you design a URL shortener like bit.ly? Walk through the full system architecture.</p>
                  <div className={s.fakeTextarea}>Start typing your answer...</div>
                </div>
                {/* Right: Score */}
                <div className={s.previewPanel}>
                  <div className={s.scoreHeader}>AI Feedback</div>
                  <div><span className={s.bigScore}>8.4</span><span className={s.bigScoreSub}>/10</span></div>
                  <div className={s.barWrap}>
                    {[
                      { label: "Clarity", pct: 90, color: "var(--accent)" },
                      { label: "Completeness", pct: 80, color: "var(--indigo)" },
                      { label: "Structure", pct: 85, color: "#22c55e" },
                    ].map((b) => (
                      <div key={b.label}>
                        <div className={s.barLabel}><span style={{ color: "var(--text-muted)" }}>{b.label}</span><span style={{ color: "var(--text-secondary)" }}>{b.pct}%</span></div>
                        <div className={s.barTrack}><div className={s.barFill} style={{ width: `${b.pct}%`, background: b.color }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className={s.feedbackList}>
                    <span style={{ color: "#22c55e" }}>✓ Clear system decomposition</span>
                    <span style={{ color: "var(--accent)" }}>→ Add database sharding details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <div className={s.ticker}>
        <div className={s.tickerTrack}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className={s.tickerItem}>{item} <span className={s.tickerDot}>·</span></span>
          ))}
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className={`animate-section ${s.section}`} style={{ display: 'block', visibility: 'visible' }}>
        <div className={s.label}>FEATURES</div>
        <h2 className={s.sHeading}>Built different.</h2>
        <p className={s.sSub}>Not another flashcard app. A system that makes you actually improve.</p>

        <div className={s.featGrid}>
          <div className={s.featLarge}>
            <div className={s.featIcon}>⚡</div>
            <h3 className={s.featTitle}>AI that actually coaches you</h3>
            <p className={s.featDesc}>Gemini 2.5 Flash scores your answer across three dimensions and gives you specific, actionable improvements. Not just a pass/fail.</p>
            <div className={s.pillRow}>
              <span className={s.pill}>Clarity</span>
              <span className={s.pill}>Completeness</span>
              <span className={s.pill}>Structure</span>
            </div>
          ))}
        </div>
          </div>
          <div className={s.featSmallStack}>
            <div className={s.featSmall}>
              <div className={s.featIconIndigo}>📚</div>
              <h3 className={s.featTitleSm}>500+ Real Questions</h3>
              <p className={s.featDescSm}>DSA, HR, System Design — all levels</p>
            </div>
            <div className={s.featSmall}>
              <div className={s.featIcon}>📊</div>
              <h3 className={s.featTitleSm}>Full Progress Tracking</h3>
              <p className={s.featDescSm}>Streaks, trends, category breakdown</p>
            </div>
          </div>
        </div>

        <div className={s.featRow}>
          <div className={s.featRowCard}>
            <div className={s.featIcon}>👁</div>
            <h3 className={s.featTitleSm}>Proctoring</h3>
            <p className={s.featDescSm}>Face detection + tab switch monitoring</p>
          </div>
          <div className={s.featRowCard}>
            <div className={s.featIconIndigo}>📝</div>
            <h3 className={s.featTitleSm}>JD Generator</h3>
            <p className={s.featDescSm}>Paste a JD, get tailored questions</p>
          </div>
          <div className={s.featRowCard}>
            <div className={s.featIcon}>🎙</div>
            <h3 className={s.featTitleSm}>Voice Input</h3>
            <p className={s.featDescSm}>Speak your answers naturally</p>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" className={`animate-section ${s.sectionAlt}`} style={{ display: 'block', visibility: 'visible' }}>
        <div className={s.sectionAltInner}>
          <div className={s.label}>HOW IT WORKS</div>
          <h2 className={s.sHeading}>Three steps. Real results.</h2>
          <p className={s.sSubCenter}>From zero to interview-ready in minutes a day.</p>

          <div className={s.stepsRow}>
            <div className={s.stepsLine} />
            {[
              { num: "01", title: "Pick a Question", desc: "Choose from DSA, HR or System Design prompts at your difficulty level." },
              { num: "02", title: "Write Your Answer", desc: "Compose an answer like you would in a real interview setting." },
              { num: "03", title: "Get AI Feedback", desc: "Receive instant Gemini scoring with actionable improvement tips." },
            ].map((step) => (
              <div key={step.num} className={s.step}>
                <div className={s.stepNum}>{step.num}</div>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className={`animate-section ${s.section}`} style={{ textAlign: "center", display: 'block', visibility: 'visible' }}>
        <div className={s.label}>PRICING</div>
        <h2 className={s.sHeading}>Honest pricing.</h2>
        <p className={s.sSubCenter}>One real plan. Two coming soon.</p>

        <div className={s.priceGrid}>
          {/* FREE */}
          <div className={`${s.priceCard} ${s.priceHighlight}`}>
            <span className={s.priceBadge} style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>CURRENT</span>
            <div className={s.priceAmount}>$0<span className={s.pricePer}> /forever</span></div>
            <p className={s.priceDesc}>Perfect for getting started</p>
            <div className={s.priceFeatures}>
              {["30 questions per day", "AI feedback on every answer", "Progress tracking", "Streak system", "All 4 categories"].map((f) => (
                <div key={f} className={s.priceFeature}><span className={s.checkAmber}>✓</span>{f}</div>
              ))}
            </div>
            <Link href="/sign-in" className={`${s.primaryBtn} ${s.fullBtn}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f5a623',
              color: '#000000',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--font-syne), sans-serif',
            }}>Start Free</Link>
          </div>

          {/* PRO */}
          <div className={`${s.priceCard} ${s.priceFaded}`}>
            <span className={s.priceBadge} style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>SOON</span>
            <div className={s.priceAmount}>Pro</div>
            <p className={s.priceDesc}>For serious learners</p>
            <div className={`${s.priceFeatures} ${s.priceFadedFeatures}`}>
              {["Everything in Free", "Unlimited questions", "Advanced analytics", "Interview simulation", "Priority AI feedback"].map((f) => (
                <div key={f} className={s.priceFeature}><span className={s.checkAmber}>✓</span>{f}</div>
              ))}
            </div>
            <button disabled className={`${s.ghostBtn} ${s.fullBtn} ${s.disabledBtn}`}>Notify Me</button>
          </div>

          {/* TEAM */}
          <div className={`${s.priceCard} ${s.priceFaded}`}>
            <span className={s.priceBadge} style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>SOON</span>
            <div className={s.priceAmount}>Team</div>
            <p className={s.priceDesc}>For teams and organizations</p>
            <div className={`${s.priceFeatures} ${s.priceFadedFeatures}`}>
              {["Everything in Pro", "Team dashboard", "Bulk practice sessions", "Admin controls", "Custom question banks"].map((f) => (
                <div key={f} className={s.priceFeature}><span className={s.checkAmber}>✓</span>{f}</div>
              ))}
            </div>
            <button disabled className={`${s.ghostBtn} ${s.fullBtn} ${s.disabledBtn}`}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className={`animate-section ${s.ctaSection}`} style={{ display: 'block', visibility: 'visible' }}>
        <div className={s.ctaInner}>
          <h2 className={s.sHeading}>Ready to stop winging it?</h2>
          <p className={s.sSubCenter}>Practice once a day. Get AI feedback. Track what actually improves.</p>
          <div className={s.heroBtns} style={{ marginTop: 36 }}>
            <Link href="/sign-in" className={s.primaryBtn} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f5a623',
              color: '#000000',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--font-syne), sans-serif',
            }}>Start practicing free →</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={s.ghostBtn}>View on GitHub</a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className={s.footer}>
        <div className={s.footerText}><strong>PrepAI</strong> · Built by Naman Roy</div>
        <div className={s.footerLinks}>
          <a href="#features" className={s.footerLink}>Features</a>
          <a href="/privacy" className={s.footerLink}>Privacy</a>
          <a href="https://github.com" className={s.footerLink}>GitHub</a>
        </div>
        <div className={s.footerText}>Made with Next.js + Gemini 2.5 Flash</div>
        <div>Made with Next.js + Gemini 2.5 Flash</div>
      </footer>
    </main>
  );
}