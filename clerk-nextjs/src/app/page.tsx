"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Cursor glow effect
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMousePos({x: e.clientX, y: e.clientY});
      setIsVisible(true);
    };
    const leave = () => setIsVisible(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll reveal refs
  const featuresRef = useScrollReveal();
  const howItWorksRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  // Floating particles
  const [particles, setParticles] = useState<Array<{id: number, size: number, x: number, y: number, delay: number, duration: number}>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setParticles(Array.from({length: 8}, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    })));
  }, []);

  return (
    <main className="min-h-screen" style={{background: 'var(--landing-bg)', color: 'var(--landing-foreground)'}}>
      {/* Cursor Glow Effect */}
      <div style={{
        position: 'fixed',
        left: mousePos.x - 200,
        top: mousePos.y - 200,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'left 0.1s ease, top 0.1s ease',
        opacity: isVisible ? 1 : 0,
      }} />

      {/* NAVBAR */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 50,
        background: scrolled 
          ? 'rgba(10,15,30,0.95)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled 
          ? '1px solid rgba(30,45,74,0.8)' 
          : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: scrolled ? '12px 32px' : '20px 32px',
      }}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 transition backdrop-saturate-150" id="nav-inner">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-bold">
              <svg className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h7l1 8L21 10h-7l-1-8z" fill="currentColor" />
              </svg>
              <span>PrepAI</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition">Features</a>
            <a href="#how" className="hover:text-gray-900 dark:hover:text-white transition">How it Works</a>
            <a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in" className="hidden sm:inline-flex items-center rounded-full border border-gray-200 dark:border-white/10 px-4 py-2 text-sm text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/3 transition">Login</Link>
            <Link href="/sign-in" className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]">Start Free</Link>
          </div>
        </div>
        <style>{`#nav-inner.scrolled { backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255,255,255,0.04); }`}</style>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-20" style={{
        background: 
          'radial-gradient(ellipse 80% 50% at 50% -20%, var(--landing-accent-cyan) 15%, transparent), ' +
          'radial-gradient(ellipse 60% 40% at 80% 80%, var(--landing-accent-purple) 12%, transparent), ' +
          'linear-gradient(180deg, var(--landing-bg) 0%, var(--landing-bg) 100%)',
        paddingTop: '120px' // Compensate for fixed navbar
      }}>
        <div className="absolute inset-0 -z-10" style={{backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '40px 40px, 40px 40px'}} />
        
        {/* Animated Floating Orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          zIndex: -1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite reverse',
          zIndex: -1
        }} />
        
        {/* Floating Particles */}
        {isClient && particles.map((p, i) => (
          <div key={p.id} style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#00d4ff' : '#7c3aed',
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.25,
            animation: `float ${p.duration}s ${p.delay}s infinite ease-in-out alternate`,
            pointerEvents: 'none',
          }} />
        ))}
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) }
            50% { transform: translateY(-20px) }
          }
        `}</style>
        
        {/* Noise Texture Overlay */}
        <div style={{
          position: 'absolute', 
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4
        }} />
        
        {/* Hero Content with Entrance Animation */}
        <div className="mx-auto max-w-7xl" style={{
          animation: 'heroEntrance 0.8s ease forwards'
        }}>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/5 px-4 py-2 text-sm text-cyan-600 dark:text-cyan-200">
              <span className="text-cyan-500 dark:text-cyan-300">✦</span>
              <span className="text-gray-700 dark:text-gray-200">Built for Placement Season</span>
            </div>

            <h1 className="mt-6 bg-clip-text text-5xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
              Ace Every Interview
              <div className="mt-2 text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text">With AI Feedback</div>
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">Practice DSA, HR and System Design. Get scored by Gemini AI. Track your growth.</p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/sign-in" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_10px_30px_rgba(0,212,255,0.08)] transition hover:scale-[1.02]">
                Start Practicing Free
              </Link>
              <a href="#demo" className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 px-5 py-3 text-sm text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/3 transition">
                <svg className="h-4 w-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-6.518-3.76A1 1 0 007 8.203v7.594a1 1 0 001.234.97l6.518-1.88A1 1 0 0016 13.206v-2.038a1 1 0 00-1.248-.999z"/></svg>
                Watch Demo
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Join 500+ students preparing smarter</p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl p-6 text-center" style={{background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)'}}>
                <div className="text-2xl font-bold" style={{color: 'var(--landing-foreground)'}}>30+</div>
                <div className="mt-1 text-sm" style={{color: 'var(--landing-muted)'}}>Questions Daily</div>
              </div>
              <div className="rounded-2xl p-6 text-center" style={{background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)'}}>
                <div className="text-2xl font-bold" style={{color: 'var(--landing-foreground)'}}>2.5 Flash</div>
                <div className="mt-1 text-sm" style={{color: 'var(--landing-muted)'}}>AI Model</div>
              </div>
              <div className="rounded-2xl p-6 text-center" style={{background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)'}}>
                <div className="text-2xl font-bold" style={{color: 'var(--landing-foreground)'}}>100%</div>
                <div className="mt-1 text-sm" style={{color: 'var(--landing-muted)'}}>Free to Start</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={featuresRef} className="reveal mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold tracking-widest text-cyan-600 dark:text-cyan-300">FEATURES</div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Everything you need to crack interviews</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {/* Card 1 - Smart Practice */}
          <div style={{
            background: '#0d1526',
            border: '1px solid #1e2d4a',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--landing-accent-cyan) 20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg className="w-6 h-6" style={{color: 'var(--landing-accent-cyan)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold" style={{color: 'var(--landing-foreground)'}}>Smart Practice</h3>
            <p className="text-sm" style={{color: 'var(--landing-muted)'}}>Filter by DSA, HR or System Design. Get fresh questions every session tailored to your difficulty level.</p>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'var(--landing-accent-cyan) 20%',
              color: 'var(--landing-accent-cyan)',
              marginTop: 'auto',
            }}>
              500+ Questions
            </span>
          </div>

          {/* Card 2 - AI Feedback */}
          <div style={{
            background: 'var(--landing-card-bg)',
            border: '1px solid var(--landing-card-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--landing-accent-purple) 20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg className="w-6 h-6" style={{color: 'var(--landing-accent-purple)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold" style={{color: 'var(--landing-foreground)'}}>AI Feedback</h3>
            <p className="text-sm" style={{color: 'var(--landing-muted)'}}>Gemini 2.5 Flash scores your answer on clarity, completeness and structure. Get specific improvements instantly.</p>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'var(--landing-accent-purple) 20%',
              color: 'var(--landing-accent-purple)',
              marginTop: 'auto',
            }}>
              Powered by Gemini
            </span>
          </div>

          {/* Card 3 - Track Progress */}
          <div style={{
            background: 'var(--landing-card-bg)',
            border: '1px solid var(--landing-card-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--landing-accent-green) 20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg className="w-6 h-6" style={{color: 'var(--landing-accent-green)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold" style={{color: 'var(--landing-foreground)'}}>Track Progress</h3>
            <p className="text-sm" style={{color: 'var(--landing-muted)'}}>Streaks, score trends and category breakdowns that make your growth visible every single day.</p>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'var(--landing-accent-green) 20%',
              color: 'var(--landing-accent-green)',
              marginTop: 'auto',
            }}>
              Real-time Analytics
            </span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding: '0 32px 80px'}}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.03), rgba(124,58,237,0.03))',
          border: '1px solid #1e2d4a',
          borderRadius: 20,
          padding: 32,
        }}>
          {/* Stat 1 */}
          <div style={{
            textAlign: 'center',
            padding: '0 24px',
            borderRight: '1px solid #1e2d4a',
          }}>
            <svg className="w-6 h-6 mx-auto mb-2" style={{color: '#00d4ff'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <div style={{fontSize: '24px', color: 'white', fontWeight: '500'}}>500+</div>
            <div style={{fontSize: '13px', color: '#64748b'}}>Questions Available</div>
          </div>

          {/* Stat 2 */}
          <div style={{
            textAlign: 'center',
            padding: '0 24px',
            borderRight: '1px solid #1e2d4a',
          }}>
            <svg className="w-6 h-6 mx-auto mb-2" style={{color: '#a78bfa'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div style={{fontSize: '24px', color: 'white', fontWeight: '500'}}>Gemini 2.5</div>
            <div style={{fontSize: '13px', color: '#64748b'}}>AI Model Used</div>
          </div>

          {/* Stat 3 */}
          <div style={{
            textAlign: 'center',
            padding: '0 24px',
            borderRight: '1px solid #1e2d4a',
          }}>
            <svg className="w-6 h-6 mx-auto mb-2" style={{color: '#fb923c'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <div style={{fontSize: '24px', color: 'white', fontWeight: '500'}}>4 Categories</div>
            <div style={{fontSize: '13px', color: '#64748b'}}>DSA · HR · System · Behavioral</div>
          </div>

          {/* Stat 4 */}
          <div style={{
            textAlign: 'center',
            padding: '0 24px',
          }}>
            <svg className="w-6 h-6 mx-auto mb-2" style={{color: '#10b981'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <div style={{fontSize: '24px', color: 'white', fontWeight: '500'}}>Free Forever</div>
            <div style={{fontSize: '13px', color: '#64748b'}}>No hidden costs</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Three steps to interview confidence</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#0d1526] border border-[#1e2d4a] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-black font-bold">01</div>
            <h4 className="text-lg font-semibold">Pick a Question</h4>
            <p className="text-sm text-gray-400">Choose from DSA, HR or System Design prompts.</p>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#0d1526] border border-[#1e2d4a] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-black font-bold">02</div>
            <h4 className="text-lg font-semibold">Write Your Answer</h4>
            <p className="text-sm text-gray-400">Compose an answer like in a real interview.</p>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#0d1526] border border-[#1e2d4a] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-black font-bold">03</div>
            <h4 className="text-lg font-semibold">Get AI Feedback</h4>
            <p className="text-sm text-gray-400">Receive instant Gemini scoring and actionable tips.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding: '80px 32px'}}>
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold tracking-widest text-cyan-300">PRICING</div>
          <h2 className="mt-4 text-3xl font-bold text-white">Simple, honest pricing</h2>
          <p className="mt-4 text-gray-300">No credit card required. No hidden fees.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {/* CARD 1 - Free */}
          <div style={{
            background: '#0d1526',
            border: '2px solid rgba(0,212,255,0.4)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 0 40px rgba(0,212,255,0.06)',
            transform: 'scale(1.02)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              display: 'inline-block',
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(16,185,129,0.1)',
              color: '#10b981',
              fontWeight: '500',
              marginBottom: '16px',
            }}>
              Current Plan
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>
              $0 <span style={{fontSize: '16px', fontWeight: 'normal', color: '#64748b'}}>/ forever</span>
            </div>
            <div style={{fontSize: '13px', color: '#94a3b8', marginBottom: '24px'}}>
              Perfect for getting started
            </div>
            
            <div style={{marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> 30 questions per day
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> AI feedback on every answer
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Progress tracking
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Streak system
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> All 4 categories
              </div>
            </div>
            
            <Link href="/sign-in" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}>
              Start Free
            </Link>
          </div>

          {/* CARD 2 - Pro */}
          <div style={{
            background: '#0d1526',
            border: '1px solid #1e2d4a',
            borderRadius: '16px',
            padding: '28px',
            opacity: 0.7,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              display: 'inline-block',
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(124,58,237,0.1)',
              color: '#a78bfa',
              fontWeight: '500',
              marginBottom: '16px',
            }}>
              Coming Soon
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>
              Coming Soon
            </div>
            <div style={{fontSize: '13px', color: '#64748b', marginBottom: '24px'}}>
              For serious learners
            </div>
            
            <div style={{marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Everything in Free
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Unlimited questions
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Advanced analytics
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Interview simulation
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Priority AI feedback
              </div>
            </div>
            
            <button disabled style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid #1e2d4a',
              color: '#64748b',
              fontWeight: '500',
              cursor: 'not-allowed',
            }}>
              Notify Me
            </button>
          </div>

          {/* CARD 3 - Team */}
          <div style={{
            background: '#0d1526',
            border: '1px solid #1e2d4a',
            borderRadius: '16px',
            padding: '28px',
            opacity: 0.7,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              display: 'inline-block',
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(100,116,139,0.1)',
              color: '#64748b',
              fontWeight: '500',
              marginBottom: '16px',
            }}>
              Coming Soon
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>
              Coming Soon
            </div>
            <div style={{fontSize: '13px', color: '#64748b', marginBottom: '24px'}}>
              For teams and organizations
            </div>
            
            <div style={{marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Everything in Pro
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Team dashboard
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Bulk practice sessions
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Admin controls
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8'}}>
                <span style={{color: '#00d4ff'}}>✓</span> Custom question banks
              </div>
            </div>
            
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid #1e2d4a',
              color: '#64748b',
              fontWeight: '500',
              cursor: 'not-allowed',
            }}>
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-600 p-1">
          <div className="rounded-2xl bg-[#0d1526] p-10 text-center">
            <h3 className="text-2xl font-bold">Ready to start practicing?</h3>
            <p className="mt-4 text-gray-300">Hands-on interview practice with instant AI feedback.</p>
            <div className="mt-6">
              <Link href="/sign-in" className="btn-pulse inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#0a0f1e] shadow-lg transition hover:scale-[1.02]">Start Free Today</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-gray-400">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold">PrepAI</div>
            <div className="text-gray-400">Built with Next.js + Gemini AI</div>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
            <a href="https://github.com" className="hover:text-white transition">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}