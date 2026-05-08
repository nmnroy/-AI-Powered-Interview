<div align="center">

<img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

<br/><br/>

```
██████╗ ██████╗ ███████╗██████╗      █████╗ ██╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗    ██╔══██╗██║
██████╔╝██████╔╝█████╗  ██████╔╝    ███████║██║
██╔═══╝ ██╔══██╗██╔══╝  ██╔═══╝     ██╔══██║██║
██║     ██║  ██║███████╗██║         ██║  ██║██║
╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝         ╚═╝  ╚═╝╚═╝
```

# ⚡ AI-Powered Interview Prep Ecosystem

### *Stop reading. Start practicing. Get AI feedback in seconds.*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-00d4ff?style=for-the-badge)](https://ai-powered-interview-46g2.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-nmnroy-181717?style=for-the-badge&logo=github)](https://github.com/nmnroy/AI-Powered-Interview)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Naman_Roy-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/naman-roy-190105291/)

<br/>

> **"Built this to solve my own problem during placement season.**
> **Now it's the only interview prep tool I actually use."**

<br/>

![Platform Preview](https://img.shields.io/badge/Platform-Web_App-0a0f1e?style=for-the-badge)
![Questions](https://img.shields.io/badge/Questions-500+-00d4ff?style=for-the-badge)
![AI Model](https://img.shields.io/badge/AI-Gemini_2.5_Flash-7c3aed?style=for-the-badge)
![Cost](https://img.shields.io/badge/Cost-Free_Forever-10b981?style=for-the-badge)

</div>

---

## 🧠 What Is This?

Most interview prep tools are **passive** — you read a question, read an answer, move on. You learn nothing.

**PrepAI is different.** You write your own answer. Then Gemini 2.5 Flash scores it on clarity, completeness, and structure — and tells you exactly what to improve. It's the difference between reading a gym guide and actually lifting weights.

```
You write an answer  →  AI scores it 1-10  →  You get specific feedback  →  You improve
```

Built with **Next.js 14**, **TypeScript**, **Prisma 5**, **Supabase**, and **Gemini 2.5 Flash**. Deployed on Vercel. Free to use.

---

## ✨ Features That Actually Matter

<table>
<tr>
<td width="50%">

### 🎯 Smart Practice Engine
- 500+ curated questions
- Filter by **DSA**, **HR**, **System Design**, **Behavioral**
- Filter by **Easy**, **Medium**, **Hard**
- Randomized delivery — never the same twice
- Live timer counting up as you write

</td>
<td width="50%">

### 🤖 Gemini AI Feedback
- Scores your answer **1-10 overall**
- Individual scores: Clarity · Completeness · Structure
- Lists your **strengths** with green bullets
- Lists **specific improvements** with actionable advice
- Multi-key fallback → Groq API (zero downtime)

</td>
</tr>
<tr>
<td width="50%">

### 📊 Progress Analytics
- Score trend chart over last 14 days
- Category breakdown — where you're strongest
- Full answer history with expandable rows
- Streak tracking + longest streak record
- Week-over-week improvement percentages

</td>
<td width="50%">

### ✨ JD Question Generator
- Paste any job description
- Get **8 targeted questions** instantly
- Split into Technical (4) + Behavioral (4)
- Questions reference actual skills in the JD
- "Practice This" saves to your question bank

</td>
</tr>
<tr>
<td width="50%">

### 🎥 AI Proctoring System
- Live camera feed during practice
- **Face detection** via `face-api.js` (100% client-side)
- Warns if face leaves frame or multiple faces detected
- **Tab switch detection** with warning count
- Session report: proctoring score + duration + word count

</td>
<td width="50%">

### 🏆 Gamification
- Daily practice streaks with fire animations
- Streak banner changes based on milestone
- "Questions Left Today" counter
- Best score badge on progress page
- Confetti animation for score ≥ 8

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  Next.js 14 App (React + TypeScript + Tailwind CSS)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Landing     │  │  Dashboard   │  │  Practice Arena  │   │
│  │  Page        │  │  Analytics   │  │  + Proctoring    │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ API Routes (Next.js)
              ┌──────────────┼──────────────────┐
              ▼              ▼                  ▼
     ┌──────────────┐ ┌─────────────┐ ┌──────────────────┐
     │  Clerk Auth  │ │  Prisma 5   │ │  Gemini 2.5 Flash│
     │  Middleware  │ │  ORM        │ │  + Groq Fallback │
     └──────────────┘ └──────┬──────┘ └──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Supabase       │
                    │  PostgreSQL     │
                    │  (Northeast     │
                    │   Asia)         │
                    └─────────────────┘
```

### Shared TypeScript Type Layer

```typescript
// Single source of truth for all data shapes
// Consumed by all API routes and UI components

interface QuestionType {
  id: string
  text: string
  category: 'DSA' | 'HR' | 'SYSTEM_DESIGN' | 'BEHAVIORAL'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string[]
}

interface FeedbackResponse {
  score: number          // 1-10 overall
  clarity: number        // 1-10
  completeness: number   // 1-10
  structure: number      // 1-10
  strengths: string[]
  improvements: string[]
  summary: string
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14 (App Router) | Full-stack in one repo — API routes + SSR + deployment |
| **Language** | TypeScript (strict) | Catches bugs before runtime, shared types across app |
| **Auth** | Clerk | Drop-in auth with middleware route protection |
| **Database** | PostgreSQL on Supabase | Free tier, reliable, Northeast Asia region |
| **ORM** | Prisma 5.22.0 | Type-safe queries, version-locked for stability |
| **AI — Primary** | Gemini 2.5 Flash | Best free model for structured JSON feedback |
| **AI — Fallback** | Groq (LLaMA 3.3 70B) | Auto-failover when Gemini rate limits hit |
| **Styling** | Tailwind CSS | Fast, consistent, no CSS files to maintain |
| **Charts** | Recharts | Lightweight, works perfectly with Next.js |
| **Face Detection** | face-api.js | Runs 100% client-side, no API key needed |
| **Notifications** | Sonner | Clean toast notifications |
| **Deployment** | Vercel | One-click, auto-deploys on git push |

---

## 🤖 AI Feedback Engine

The feedback system uses a **multi-key fallback architecture** — zero downtime even when one API hits its rate limit.

```typescript
// src/lib/ai.ts — Automatic fallback chain

async function generateWithFallback(prompt: string): Promise<string> {
  // Try Gemini Key 1
  // → Rate limited? Try Gemini Key 2
  //   → Rate limited? Try Gemini Key 3
  //     → All exhausted? Fall back to Groq LLaMA 3.3 70B
  //       → All failed? Throw meaningful error
}
```

**Prompt Engineering** — The AI receives strict instructions to return JSON only:

```json
{
  "score": 7,
  "clarity": 8,
  "completeness": 6,
  "structure": 7,
  "strengths": ["Good use of examples", "Clear structure"],
  "improvements": ["Add time complexity", "Mention edge cases"],
  "summary": "Solid answer that covers the basics well..."
}
```

---

## 🎥 Proctoring System (100% Free, No API Keys)

Built entirely on native browser APIs and a client-side ML model.

```
getUserMedia API        → Camera + microphone access
face-api.js (CDN)       → TinyFaceDetector model (client-side ML)
visibilitychange event  → Tab switch detection
MediaRecorder API       → Session recording capability

Detection loop runs every 3 seconds:
  0 faces  → "No face detected" warning
  1 face   → All good ✓
  2+ faces → "Multiple faces detected" warning

After 3 warnings → Proctoring alert banner
Tab switches counted → Reflected in session report
```

**Proctoring Score Formula:**
```
Score = 100 - (tabSwitches × 10) - (faceWarnings × 5)
Minimum: 0 | Maximum: 100
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account (free)
- A Clerk account (free)
- A Google AI Studio account for Gemini API (free)

### 1. Clone

```bash
git clone https://github.com/nmnroy/AI-Powered-Interview.git
cd AI-Powered-Interview/clerk-nextjs
```

### 2. Install

```bash
npm install
```

### 3. Environment Variables

Create `.env` in the `clerk-nextjs` folder:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres.xxxx:[PASS]@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Gemini AI (get free key from aistudio.google.com)
GEMINI_API_KEY_1=AIza...
GEMINI_API_KEY_2=AIza...
GEMINI_API_KEY_3=AIza...

# Groq Fallback (get free key from console.groq.com)
GROQ_API_KEY=gsk_...
```

### 4. Database Setup

> ⚠️ Direct DB connections are blocked on most Indian ISPs (port 5432). Use the SQL method below.

Generate seed SQL:
```bash
npx tsx scripts/seed-sql.ts
```

Copy the output → paste into **Supabase SQL Editor** → Run.

This adds 30 questions across DSA, HR, and System Design.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
clerk-nextjs/
├── prisma/
│   ├── schema.prisma          # DB models: User, Question, Answer, Streak
│   └── seed.ts                # Question seed data
├── scripts/
│   └── seed-sql.ts            # Generates SQL for Supabase editor
├── src/
│   ├── app/
│   │   ├── (auth)/            # Sign-in, Sign-up pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── dashboard/     # Home dashboard
│   │   │   ├── dashboard/practice/    # Practice arena
│   │   │   ├── dashboard/progress/   # Analytics
│   │   │   └── dashboard/generate/   # JD generator
│   │   ├── api/
│   │   │   ├── answers/       # Save answers
│   │   │   ├── feedback/      # AI evaluation
│   │   │   ├── questions/     # Random question fetch
│   │   │   ├── generate-questions/   # JD parser
│   │   │   ├── progress/      # Analytics data
│   │   │   └── user/sync/     # User creation on first login
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Root layout with ClerkProvider
│   ├── components/
│   │   ├── shared/
│   │   │   ├── ProctoringCamera.tsx  # Camera + face detection
│   │   │   └── QuestionCard.tsx      # Reusable question display
│   │   └── ui/
│   │       ├── ThemeToggle.tsx       # Dark/light mode
│   │       └── ScoreBadge.tsx        # Colored score indicator
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts   # Web Speech API hook
│   │   └── useScrollReveal.ts        # Intersection Observer
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   └── ai.ts              # Gemini + Groq with fallback
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces
├── middleware.ts               # Clerk route protection
└── next.config.ts             # Build config
```

---

## 🌐 Deployment on Vercel

```bash
# Push to GitHub
git add .
git commit -m "feat: complete interview prep platform"
git push origin main
```

Then on Vercel:

1. Import `nmnroy/AI-Powered-Interview`
2. Set **Root Directory** to `clerk-nextjs`
3. Set **Framework Preset** to `Next.js`
4. Add all environment variables
5. Set **Build Command** to `prisma generate && next build`
6. Deploy ✅

---

## 🗺️ Roadmap

- [x] Core practice flow with AI feedback
- [x] Progress analytics with charts
- [x] JD-based question generation
- [x] Proctoring with face detection
- [x] Voice-to-text answer input
- [x] Multi-key AI fallback system
- [ ] React Native mobile app
- [ ] Mock interview mode (30 min timed sessions)
- [ ] Peer comparison analytics
- [ ] Company-specific question banks

---

## 💬 Engineering Decisions Worth Knowing

**Why Next.js over plain React?**
Needed API routes, server-side auth, and SSR — all in one deployment. Next.js made the backend free.

**Why Prisma 5 specifically (version-locked)?**
Prisma 7 introduced breaking changes that removed `url = env()` from schema files. Version-locked at 5.22.0 to keep the setup stable and reproducible.

**Why Gemini 2.5 Flash over GPT-4?**
Free tier with 1500 requests/day per key. Three keys + Groq fallback means effectively unlimited free usage for this scale.

**Why face-api.js over a cloud vision API?**
Zero API cost, zero latency, full privacy — the model weights load from CDN and run entirely in the user's browser. No video data ever leaves the device.

---

## 👨‍💻 Built By

**Naman Roy**
Full-Stack Developer · MAIT Delhi · CS & Data Science

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/naman-roy-190105291/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/nmnroy)

---

<div align="center">

**If this helped you prep for an interview, give it a ⭐**

*Built during placement season. Shipped in 2 days. Still improving.*

</div>
