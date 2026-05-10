"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

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
    <main style={{ background: 'var(--bg-void)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6, overflowX: 'hidden' }}>
      {/* Cursor Glow */}
      <div style={{ 
        position: 'fixed', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)', 
        pointerEvents: 'none', 
        zIndex: 9998, 
        left: mousePos.x - 200, 
        top: mousePos.y - 200, 
        opacity: glowVisible ? 1 : 0, 
        transition: 'opacity 0.3s ease' 
      }} />

      {/* ═══ NAVBAR ═══ */}
      <style dangerouslySetInnerHTML={{__html: `
        .nav-link { position: relative; color: var(--text-secondary); text-decoration: none; font-size: 13px; font-family: var(--font-body); transition: color 0.2s; padding: 6px 12px; border-radius: 8px; }
        .nav-link:hover { color: #f0f0f5; background: rgba(255,255,255,0.05); }
        .nav-link:active { transform: scale(0.95); background: rgba(245,166,35,0.12); color: var(--accent); }
        .nav-link::after { content: ''; position: absolute; inset: 0; border-radius: 8px; opacity: 0; background: radial-gradient(circle, rgba(245,166,35,0.3) 0%, transparent 70%); transition: opacity 0.3s; }
        .nav-link:active::after { opacity: 1; }
        .nav-signin:hover { color: #f0f0f5; }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 0 20px rgba(245,166,35,0.4); }
        .nav-cta:active { transform: scale(0.97); }
      `}} />
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        height: '56px', 
        background: scrolled ? 'rgba(5,5,7,0.95)' : 'rgba(5,5,7,0.8)', 
        backdropFilter: 'blur(20px)', 
        borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid var(--border-subtle)', 
        zIndex: 1000, 
        transition: 'all 0.3s ease' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '2px', boxShadow: '0 0 8px rgba(245,166,35,0.6)' }} />
            PrepAI
          </Link>
          <nav style={{ display: 'flex', gap: '4px' }}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how" className="nav-link">How it Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/sign-in" className="nav-signin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontFamily: 'var(--font-body)', padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s' }}>Sign in</Link>
            <Link href="/sign-in" className="nav-cta" style={{ 
              background: 'linear-gradient(135deg, var(--accent), #ff6b00)',
              color: '#ffffff', 
              fontWeight: 600, 
              padding: '7px 16px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              textDecoration: 'none', 
              fontFamily: 'var(--font-body)', 
              transition: 'all 0.2s', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              border: '1px solid rgba(245,166,35,0.3)',
              boxShadow: '0 0 12px rgba(245,166,35,0.15)'
            }}>Get started →</Link>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '140px', textAlign: 'center', position: 'relative' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(245,166,35,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', width: '100%', height: '1px', background: 'rgba(245,166,35,0.1)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Status Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'var(--accent-dim)', 
            border: '1px solid var(--border-accent)', 
            borderRadius: '20px', 
            padding: '5px 14px', 
            gap: '8px', 
            fontSize: '12px', 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--accent)', 
            marginBottom: '28px' 
          }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              background: '#22c55e', 
              borderRadius: '50%', 
              boxShadow: '0 0 0 0 rgba(34,197,94,0.4)', 
              animation: 'pulse-ring 1.5s infinite' 
            }} />
            v1.0 · AI scoring live · 500+ questions
          </div>

          {/* Main Heading */}
          <h1 style={{ 
            fontSize: 'clamp(48px, 7vw, 88px)', 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            letterSpacing: '-0.04em', 
            lineHeight: 1.0, 
            color: 'var(--text-primary)', 
            margin: '0 0 16px' 
          }}>
            Ace Every<br />Interview<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '18px', margin: '0 0 20px' }}>With real AI feedback.</p>
          <p style={{ maxWidth: '480px', margin: '0 auto 36px', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Practice DSA, HR and System Design — get instant scores on clarity, completeness, and structure. No fluff. Just growth.
          </p>

          {/* CTA Buttons */}
          <style dangerouslySetInnerHTML={{__html: `
            .cta-main:hover { transform: translateY(-2px); box-shadow: 0 0 32px rgba(245, 166, 35, 0.5); }
            .cta-gh:hover { border-color: rgba(255,255,255,0.3); color: #f0f0f5; }
          `}} />
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px', alignItems: 'center' }}>
            <Link href="/sign-in" className="cta-main" style={{ 
              background: 'linear-gradient(135deg, var(--accent), #ff6b00)', 
              color: '#ffffff', 
              fontWeight: 700, 
              padding: '16px 32px', 
              borderRadius: '14px', 
              fontSize: '15px', 
              textDecoration: 'none', 
              fontFamily: 'var(--font-body)', 
              transition: 'all 0.25s ease',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              border: '1px solid rgba(245, 166, 35, 0.4)',
              boxShadow: '0 0 20px rgba(245, 166, 35, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
              letterSpacing: '-0.01em'
            }}>Start practicing free <ArrowRight size={16} /></Link>
            <a href="https://github.com/nmnroy/-AI-Powered-Interview" target="_blank" rel="noopener noreferrer" className="cta-gh" style={{ 
              background: 'transparent', 
              border: '1px solid var(--border-strong)', 
              color: 'var(--text-secondary)', 
              padding: '16px 28px', 
              borderRadius: '14px', 
              fontSize: '15px', 
              textDecoration: 'none', 
              fontFamily: 'var(--font-body)', 
              transition: 'all 0.2s'
            }}>View on GitHub</a>
          </div>

          {/* Social Proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Used in 3 active placement seasons</span>
            <span style={{ width: '1px', height: '12px', background: 'var(--border-default)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Zero to hired in O(1)</span>
          </div>

          {/* Preview Card */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: 'var(--radius-xl)', 
              padding: '1px', 
              boxShadow: 'var(--shadow-card), var(--shadow-accent)' 
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: 'calc(var(--radius-xl) - 1px)', 
                overflow: 'hidden' 
              }}>
                {/* Terminal Header */}
                <div style={{ 
                  background: 'var(--bg-elevated)', 
                  height: '36px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 16px', 
                  gap: '8px', 
                  borderBottom: '1px solid var(--border-subtle)' 
                }}>
                  <span style={{ width: '10px', height: '10px', background: '#ff5f57', borderRadius: '50%' }} />
                  <span style={{ width: '10px', height: '10px', background: '#febc2e', borderRadius: '50%' }} />
                  <span style={{ width: '10px', height: '10px', background: '#28c840', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: '8px' }}>
                    PrepAI — Practice Session — System Design
                  </span>
                </div>
                
                {/* Content */}
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Left Panel */}
                  <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '16px' 
                  }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ 
                        background: 'var(--indigo-dim)', 
                        color: 'var(--indigo)', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontFamily: 'var(--font-mono)' 
                      }}>SYSTEM DESIGN</span>
                      <span style={{ 
                        background: 'rgba(245,158,11,0.1)', 
                        color: '#f59e0b', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontFamily: 'var(--font-mono)' 
                      }}>MEDIUM</span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                      How would you design a URL shortener like bit.ly? Walk through the full system architecture.
                    </p>
                    <div style={{ 
                      background: '#050507', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: 'var(--radius-sm)', 
                      height: '60px', 
                      padding: '10px', 
                      fontSize: '12px', 
                      color: 'var(--text-muted)', 
                      fontFamily: 'var(--font-mono)', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>Start typing your answer...</div>
                  </div>
                  
                  {/* Right Panel */}
                  <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '16px' 
                  }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>AI Feedback</div>
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '48px', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>8.4</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}> /10</span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      {[
                        { label: "Clarity", pct: 90, color: "var(--accent)" },
                        { label: "Completeness", pct: 80, color: "var(--indigo)" },
                        { label: "Structure", pct: 85, color: "#22c55e" },
                      ].map((b) => (
                        <div key={b.label} style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{b.label}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{b.pct}%</span>
                          </div>
                          <div style={{ height: '3px', background: 'var(--bg-base)', borderRadius: '2px' }}>
                            <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: '2px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#22c55e', fontFamily: 'var(--font-body)' }}>✓ Clear system decomposition</span>
                      <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>→ Add database sharding details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
      <div style={{ 
        width: '100%', 
        background: 'rgba(255,255,255,0.05)', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        height: '48px', 
        overflow: 'hidden', 
        position: 'relative' 
      }}>
        <div style={{ 
          display: 'flex', 
          width: 'max-content',
          animation: 'marquee 20s linear infinite', 
          alignItems: 'center',
          height: '100%'
        }}>
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ 
              fontSize: '13px', 
              color: 'var(--text-muted)', 
              fontFamily: 'var(--font-mono)', 
              paddingRight: '48px', 
              whiteSpace: 'nowrap' 
            }}>
              {item} <span style={{ color: 'var(--accent)' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: '120px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '3px', color: 'var(--accent)', marginBottom: '16px' }}>FEATURES</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Built different.</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
          Not another flashcard app. A system that makes you actually improve.
        </p>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '24px', marginTop: '48px' }}>
          {/* Large Card */}
          <div style={{ 
            background: 'rgba(245, 166, 35, 0.05)', 
            border: '1px solid rgba(245, 166, 35, 0.15)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '40px', 
            height: '320px', 
            display: 'flex', 
            flexDirection: 'column', 
            transition: 'all 0.3s ease' 
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'rgba(245, 166, 35, 0.15)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              marginBottom: '20px' 
            }}>⚡</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>AI that actually coaches you</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'auto' }}>
              Gemini 2.5 Flash scores your answer across three dimensions and gives you specific, actionable improvements. Not just a pass/fail.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <span style={{ 
                fontSize: '11px', 
                fontFamily: 'var(--font-mono)', 
                background: 'var(--bg-elevated)', 
                border: '1px solid var(--border-default)', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                color: 'var(--text-secondary)' 
              }}>Clarity</span>
              <span style={{ 
                fontSize: '11px', 
                fontFamily: 'var(--font-mono)', 
                background: 'var(--bg-elevated)', 
                border: '1px solid var(--border-default)', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                color: 'var(--text-secondary)' 
              }}>Completeness</span>
              <span style={{ 
                fontSize: '11px', 
                fontFamily: 'var(--font-mono)', 
                background: 'var(--bg-elevated)', 
                border: '1px solid var(--border-default)', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                color: 'var(--text-secondary)' 
              }}>Structure</span>
            </div>
          </div>

          {/* Small Cards Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.05)', 
              border: '1px solid rgba(59, 130, 246, 0.15)', 
              borderRadius: 'var(--radius-xl)', 
              padding: '24px', 
              height: '148px' 
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'rgba(59, 130, 246, 0.15)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '16px', 
                marginBottom: '12px' 
              }}>📚</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>500+ Real Questions</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>DSA, HR, System Design — all levels</p>
            </div>
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.05)', 
              border: '1px solid rgba(34, 197, 94, 0.15)', 
              borderRadius: 'var(--radius-xl)', 
              padding: '24px', 
              height: '148px' 
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'rgba(34, 197, 94, 0.15)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '16px', 
                marginBottom: '12px' 
              }}>📊</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Full Progress Tracking</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Streaks, trends, category breakdown</p>
            </div>
          </div>
        </div>

        {/* Row of 3 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
          {[
            { icon: '👁', title: 'Proctoring', desc: 'Face detection + tab switch monitoring', bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.15)', iconBg: 'rgba(239, 68, 68, 0.15)' },
            { icon: '📝', title: 'JD Generator', desc: 'Paste JD, get questions', bg: 'rgba(168, 85, 247, 0.05)', border: 'rgba(168, 85, 247, 0.15)', iconBg: 'rgba(168, 85, 247, 0.15)' },
            { icon: '🎙', title: 'Voice Input', desc: 'Speak your answers naturally', bg: 'rgba(14, 165, 233, 0.05)', border: 'rgba(14, 165, 233, 0.15)', iconBg: 'rgba(14, 165, 233, 0.15)' }
          ].map((feature, i) => (
            <div key={i} style={{ 
              background: feature.bg, 
              border: `1px solid ${feature.border}`, 
              borderRadius: 'var(--radius-xl)', 
              padding: '24px' 
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: feature.iconBg, 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '16px', 
                marginBottom: '12px' 
              }}>{feature.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" style={{ padding: '120px 32px', background: 'var(--bg-surface)', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '3px', color: 'var(--accent)', marginBottom: '16px' }}>HOW IT WORKS</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Three steps. Real results.</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 48px' }}>
          From zero to interview-ready in minutes a day.
        </p>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { num: "01", title: "Pick a Question", desc: "Choose from DSA, HR or System Design prompts at your difficulty level.", bg: "rgba(59, 130, 246, 0.05)", border: "rgba(59, 130, 246, 0.15)", numColor: "#3b82f6" },
            { num: "02", title: "Write Your Answer", desc: "Compose an answer like you would in a real interview setting.", bg: "rgba(249, 115, 22, 0.05)", border: "rgba(249, 115, 22, 0.15)", numColor: "#f97316" },
            { num: "03", title: "Get AI Feedback", desc: "Receive instant Gemini scoring with actionable improvement tips.", bg: "rgba(34, 197, 94, 0.05)", border: "rgba(34, 197, 94, 0.15)", numColor: "#22c55e" }
          ].map((step, i) => (
            <div key={i} style={{ 
              background: step.bg, 
              border: `1px solid ${step.border}`, 
              borderRadius: '16px', 
              padding: '32px 24px',
              textAlign: 'left'
            }}>
              <div style={{ 
                fontSize: '11px', 
                fontFamily: 'var(--font-mono)', 
                color: step.numColor, 
                marginBottom: '16px', 
                display: 'block',
                fontWeight: 600
              }}>{step.num}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '12px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ padding: '120px 32px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '3px', color: 'var(--accent)', marginBottom: '16px' }}>PRICING</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Honest pricing.</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>One real plan. Two coming soon.</p>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '48px' }}>
          {/* FREE */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--accent)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '32px', 
            position: 'relative' 
          }}>
            <span style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              fontSize: '11px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--accent-dim)', 
              color: 'var(--accent)', 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}>CURRENT</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--text-primary)', marginBottom: '8px' }}>
              $0<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}> /forever</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Perfect for getting started</p>
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              {["30 questions per day", "AI feedback on every answer", "Progress tracking", "Streak system", "All 4 categories"].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <Link href="/sign-in" style={{ 
              display: 'block', 
              width: '100%', 
              background: 'var(--accent)', 
              color: '#ffffff', 
              fontWeight: 600, 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '14px', 
              textDecoration: 'none', 
              fontFamily: 'var(--font-body)', 
              textAlign: 'center' 
            }}>Start Free</Link>
          </div>

          {/* PRO */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '32px', 
            opacity: 0.5, 
            filter: 'blur(0.5px)', 
            position: 'relative' 
          }}>
            <span style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              fontSize: '11px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--bg-elevated)', 
              color: 'var(--text-muted)', 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}>SOON</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--text-primary)', marginBottom: '8px' }}>Pro</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For serious learners</p>
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              {["Everything in Free", "Unlimited questions", "Advanced analytics", "Interview simulation", "Priority AI feedback"].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button disabled style={{ 
              display: 'block', 
              width: '100%', 
              background: 'transparent', 
              border: '1px solid var(--border-default)', 
              color: 'var(--text-secondary)', 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '14px', 
              fontFamily: 'var(--font-body)', 
              cursor: 'not-allowed' 
            }}>Notify Me</button>
          </div>

          {/* TEAM */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '32px', 
            opacity: 0.5, 
            filter: 'blur(0.5px)', 
            position: 'relative' 
          }}>
            <span style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              fontSize: '11px', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--bg-elevated)', 
              color: 'var(--text-muted)', 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}>SOON</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--text-primary)', marginBottom: '8px' }}>Team</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For teams and organizations</p>
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              {["Everything in Pro", "Team dashboard", "Bulk practice sessions", "Admin controls", "Custom question banks"].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button disabled style={{ 
              display: 'block', 
              width: '100%', 
              background: 'transparent', 
              border: '1px solid var(--border-default)', 
              color: 'var(--text-secondary)', 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '14px', 
              fontFamily: 'var(--font-body)', 
              cursor: 'not-allowed' 
            }}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '120px 32px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Stop grinding blindly. Start compiling offers.</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '36px' }}>
          Get real-time, actionable feedback from an AI that actually understands your code and system design.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/sign-in" style={{ 
            background: 'var(--accent)', 
            color: '#ffffff', 
            fontWeight: 600, 
            padding: '12px 24px', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: '14px', 
            textDecoration: 'none', 
            fontFamily: 'var(--font-body)', 
            transition: 'all 0.2s', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>Start practicing free <ArrowRight size={16} /></Link>
          <a href="https://github.com/nmnroy/-AI-Powered-Interview" target="_blank" rel="noopener noreferrer" style={{ 
            background: 'transparent', 
            border: '1px solid var(--border-strong)', 
            color: 'var(--text-secondary)', 
            padding: '12px 24px', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: '14px', 
            textDecoration: 'none', 
            fontFamily: 'var(--font-body)', 
            transition: 'all 0.2s' 
          }}>View on GitHub</a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ 
        background: 'var(--bg-void)', 
        borderTop: '1px solid var(--border-subtle)', 
        padding: '32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '13px', 
        color: 'var(--text-muted)' 
      }}>
        <div><strong>PrepAI</strong> · Built by Naman Roy</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Features</a>
          <a href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
          <a href="https://github.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
        </div>
        <div>Made with Next.js + Gemini 2.5 Flash</div>
      </footer>
    </main>
  );
}