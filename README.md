<div align="center">

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" />
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

# ⚡ PrepAI: The AI-Powered Interview High-Performance Ecosystem

### *Stop Grinding Blindly. Start Compiling Offers.*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-00d4ff?style=for-the-badge)](https://ai-powered-interview-46g2.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-nmnroy-181717?style=for-the-badge&logo=github)](https://github.com/nmnroy/-AI-Powered-Interview)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Naman_Roy-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/naman-roy-190105291/)

<br/>

> **"Built during placement season to bridge the gap between reading and performing.**
> **Now a premium, high-fidelity practice arena used by top students."**

<br/>

![Aesthetics](https://img.shields.io/badge/UI-Royal_Dark_Mode-f5a623?style=for-the-badge)
![Experience](https://img.shields.io/badge/UX-High_Fidelity-ff6b00?style=for-the-badge)
![AI Model](https://img.shields.io/badge/AI-Gemini_2.5_Flash-7c3aed?style=for-the-badge)
![Cost](https://img.shields.io/badge/Cost-Free_Forever-10b981?style=for-the-badge)

</div>

---

## 🧠 The Philosophy

Most interview prep is passive. PrepAI is **active**. It turns your study sessions into simulated high-stakes interviews. 

**Write code, get critiqued.** Gemini 2.5 Flash doesn't just check if your code works; it analyzes your **Clarity, Completeness, and Structure**—giving you the "why" behind the score.

```
Choose Topic → Code in Premium Editor → Get 1-10 Score → Review AI Feedback → Level Up
```

---

## ✨ Premium Features (Recently Upgraded)

<table>
<tr>
<td width="50%">

### 💡 AI-Powered Hints
- Stuck on a DSA problem? Get a logic nudge.
- AI generates **question-specific hints** without revealing the code.
- Focuses on algorithm patterns and data structures.

</td>
<td width="50%">

### 💻 Elite Code Environment
- Programiz-style JavaScript/TypeScript boilerplates.
- Clean, professional header comments and demo code.
- Real-time execution and output tracking.

</td>
</tr>
<tr>
<td width="50%">

### 📈 Royal Analytics Suite
- High-fidelity **Category Performance** breakdown.
- Color-coded progress (DSA=Blue, System Design=Amber, etc.).
- Score trends with custom styled Recharts tooltips.
- Streak milestones with kinetic animations.

</td>
<td width="50%">

### 🎥 Native AI Proctoring
- **Client-side face detection** (privacy-first).
- Detects multiple faces or frame exits.
- **Tab switch monitoring** to maintain focus.
- 100% free, no external proctoring API keys.

</td>
</tr>
<tr>
<td width="50%">

### 📋 Smart JD Parser
- Paste any job description.
- Generates **8 targeted questions** (Tech + Behavioral).
- Injects specific skills from the JD into practice mode.

</td>
<td width="50%">

### 🎨 Premium Aesthetics
- **Glassmorphism Design System** with neon accent glows.
- Interactive Navbar with click-ripple animations.
- Dynamic scrolling marquee for system stats.
- Responsive "Royal Dark" UI tokens.

</td>
</tr>
</table>

---

## 🛠️ High-Performance Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----|
| **Core** | Next.js 16 (App Router) | Latest React 19 support, Server Components, unified API routes. |
| **Logic** | TypeScript (Strict) | End-to-end type safety from DB to UI components. |
| **Auth** | Clerk | Production-grade auth middleware and user session management. |
| **Database** | PostgreSQL (Supabase) | Reliable, globally distributed relational data. |
| **ORM** | Prisma 5.22.0 | Type-safe schema definitions and high-performance queries. |
| **Primary AI** | Gemini 2.5 Flash | SOTA speed and reasoning for structured JSON grading. |
| **Fallback AI** | Groq (LLaMA 3.3 70B) | Zero-latency failover when primary API limits are hit. |
| **Styling** | Tailwind CSS 4 | Atomic styling with optimized runtime performance. |
| **ML Engine** | face-api.js | Local browser-based face detection (zero server cost). |

---

## 🤖 Multi-Key Fallback Engine

PrepAI is built for **100% uptime**. Our AI service layer features an automatic fallback chain:

```typescript
// Automatic Failover Logic
async function generateWithFallback(prompt: string) {
  // Step 1: Try Primary Gemini Key
  // Step 2: Rate limited? Try Secondary Gemini Key
  // Step 3: All Gemini Keys busy? Fall back to Groq (LLaMA 3.3 70B)
  // Step 4: Final fallback to cached response or error notification
}
```

---

## 🚀 Deployment (Zero-to-One)

### 1. Environment Configuration
Create a `.env` in the root (do not commit this!):
```env
# Database & Auth
DATABASE_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# AI Keys (Gemini & Groq)
GEMINI_API_KEY_1=...
GEMINI_API_KEY_2=...
GROQ_API_KEY=...
```

### 2. Local Setup
```bash
npm install
npx prisma generate
npm run dev
```

### 3. Vercel Push
The project is optimized for Vercel. Ensure your build command is:
`prisma generate && next build`

---

## 👨💻 The Engineer

**Naman Roy**
Full-Stack Developer · MAIT Delhi

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/naman-roy-190105291/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/nmnroy)

---

<div align="center">

**If this project helps you crush your next interview, give it a ⭐**

*Built with passion, polished with AI.*

</div>
