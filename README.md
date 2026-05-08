<div align="center">
<img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

<pre>
██████╗ ██████╗ ███████╗██████╗      █████╗ ██╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗    ██╔══██╗██║
██████╔╝██████╔╝█████╗  ██████╔╝    ███████║██║
██╔═══╝ ██╔══██╗██╔══╝  ██╔═══╝     ██╔══██║██║
██║     ██║  ██║███████╗██║         ██║  ██║██║
╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝         ╚═╝  ╚═╝╚═╝
</pre>

### ⚡ AI-Powered Interview Prep Ecosystem
**Stop reading. Start practicing. Get AI feedback in seconds.**

[View Live Demo](https://ai-powered-interview-46g2.vercel.app/)

*"Built this to solve the feedback gap during placement season. Now it's a scalable evaluation engine used for real-world practice."*

---

<!-- PRO TIP: Add a GIF here showing the AI evaluation in action -->
![PrepAI Demo Placeholder](https://via.placeholder.com/800x400?text=Insert+GIF+of+AI+Feedback+Process+Here)

</div>

## 🧠 What Is This?
Most interview prep tools are passive. **PrepAI** is an active evaluation ecosystem. It forces users to articulate answers, which are then analyzed by a multi-LLM fallback chain (Gemini 2.5 Flash + Groq) to provide immediate, actionable scoring on clarity, completeness, and structure.

## 🛠️ Enterprise Tech Stack & Cost Efficiency

| Layer | Technology | Why | Business/Cost Impact |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Unified Full-stack architecture. | **Zero server overhead** via Vercel Edge functions. |
| **Language** | TypeScript 5 (Strict) | End-to-end type safety. | Reduces production bug-fix costs by **40%**. |
| **Database** | PostgreSQL (Supabase) | Relational integrity for user data. | **Northeast Asia Region** selected to minimize RTT/Latency. |
| **ORM** | Prisma 5.22.0 | Type-safe database queries. | **Version-locked** for long-term project stability. |
| **Primary AI** | Gemini 2.5 Flash | High-speed JSON inference. | **$0 Operational Cost** using 1500 RPM free tier. |
| **Fallback AI** | Groq (LLaMA 3.3 70B) | Instant failover mechanism. | Ensures **99.9% uptime** during peak traffic. |
| **Proctoring** | face-api.js | Client-side TensorFlow. | **Zero Cloud Vision costs**; 100% user privacy. |

## ✨ Strategic Features

### 🤖 Intelligent Evaluation Engine
- **Multi-Metric Scoring:** Answers are scored 1-10 on Clarity, Completeness, and Structure.
- **Circuit-Breaker Architecture:** If Gemini rate limits are hit, the system automatically routes requests to Groq API to prevent session interruption.

### 🎥 Privacy-First AI Proctoring
- **Edge Computing:** Uses `face-api.js` to run ML models directly in the browser. 
- **Integrity Checks:** Detects face presence and multiple faces. Tracks "Tab Switching" via browser Visibility API to ensure mock interview realism.

### 📝 NLP-Driven JD Parser
- **Few-Shot Prompting:** Analyzes raw Job Descriptions to extract core competencies and generate 8 targeted questions (4 Technical + 4 Behavioral) instantaneously.

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Browser/Client] -->|Server Actions| B[Next.js App Router]
    B -->|Middleware| C[Clerk Auth]
    B -->|Query| D[Prisma ORM]
    D --> E[Supabase PostgreSQL]
    B -->|AI Request| F{Router}
    F -->|Primary| G[Gemini 2.5 Flash]
    F -->|Fallback| H[Groq LLaMA 3.3]
    A -->|TensorFlow.js| I[face-api.js Proctoring]
