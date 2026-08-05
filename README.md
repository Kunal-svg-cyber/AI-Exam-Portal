# 🛠️ QuestionForge AI — AI-Powered Timed Exam & Assessment Generator

QuestionForge AI is a high-performance, dark-themed educational timed exam and assessment generator. Built with **Next.js 14 (App Router)** and **Tailwind CSS**, it aligns with the **UN Sustainable Development Goal 4 (Quality Education)**. The platform enables educators and candidates to build, conduct, and analyze custom academic assessments on-demand.

The application operates entirely **without databases**, utilizing client-provided Groq API keys and local browser-memory session outcomes (`sessionStorage`). It includes anti-cheating mechanisms, responsive stats palettes, custom digital countdown triggers, radial grade visualizers, and code-split PDF compile engines.

---

## 🚀 Key Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW                                 │
│                                                                        │
│  ┌──────────────┐      ┌────────────────┐      ┌────────────────────┐  │
│  │  Groq API    │ ───> │ Generator Form │ ───> │ Timed Lobby Page   │  │
│  │  Key Setup   │      │ (Custom Spec)  │      │ (Bloom Metadata)   │  │
│  └──────────────┘      └────────────────┘      └────────────────────┘  │
│                                                          │             │
│                                                          v             │
│  ┌──────────────┐      ┌────────────────┐      ┌────────────────────┐  │
│  │ PDF Export   │ <─── │ Outcome Review │ <─── │ Distraction-Free   │  │
│  │ (A4 / Key)   │      │ & AI Analytics │      │ Exam Environment   │  │
│  └──────────────┘      └────────────────┘      └────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Granular Assessment Generator Form
*   **Targeted Settings:** Configure assessments by subject area, precise topics, difficulty rating (Easy, Medium, Hard, Expert), and educational levels (Primary, Middle, High School, University, Professional).
*   **Bloom's Taxonomy Alignment:** Target cognitive levels (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating, or Mixed Full-Spectrum).
*   **Bespoke Directives:** Supply optional custom instructions for specific formatting, code blocks, or mathematical notation requirements.
*   **Multi-Language support:** Support for English, Spanish, French, German, Hindi, Arabic, Portuguese, and Chinese.
*   **Various Question Formats:** Generate Multiple Choice (MCQ), True/False, Short Answer, Fill-in-the-Blank, or Mixed exams.

### 2. Strict Exam Mode Dashboard
*   **Distraction-Free Environment:** Hides global layout bars (navbars and footers) to maximize focus.
*   **Question Navigator Palette:** A floating, sticky control board marking current, answered, skipped, and bookmarked questions.
*   **Countdown Warning Indicators:** Integrated visual alert borders that transition from standard slate to warning yellow (10 min), alert orange (5 min), and pulsing alert red (1 min) with warning toasts.
*   **Submit Guard Confirmations:** Verifies unanswered or skipped items before final submission, estimating completion rates to avoid premature exam termination.

### 3. Dynamic Outcomes & Cognitive Analytics
*   **Detailed Correction Board:** Compares candidate answers alongside correct solutions with detailed AI explanations.
*   **AI Performance Profile:** Analyzes strengths and growth areas based on Bloom's taxonomy categories.
*   **Recommended Study Path:** Generates a custom study route with topic-gap analysis to help learners improve.
*   **Session Results Archive:** Restores previously completed exam records from `sessionStorage` or deletes them, clearing all data when browser tabs close.

### 4. Dual-Mode PDF Compilation
*   **Student Question Booklet:** Clean, optimized A4 layouts stripped of answers for traditional offline exam taking.
*   **Educator Master Answer Key:** A master key sheet containing correct answers, Bloom's categorization levels, and AI justifications for classroom review.

---

## 🛠️ Technology Stack

| Component | Library/Framework | Description |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 14 (App Router) | Optimizes performance, static SEO metadata, and edge-ready API route handling. |
| **Styling Engine** | Tailwind CSS | Sleek, modern dark UI styling using custom zinc design systems. |
| **Animation System**| Framer Motion | High-performance, hardware-accelerated spring configurations and transitions. |
| **Form Management**| React Hook Form + Zod | Performs schema validation and handles state changes. |
| **PDF Compiler**   | jsPDF | Uses client-side code-splitting to compile structured print-ready PDFs. |
| **Icons Palette**  | Lucide React | Provides modern, lightweight SVG icons. |
| **AI Integration** | Groq Client SDK | Serves completions via serverless API middleware using the `openai/gpt-oss-120b` schema. |

---

## 📁 Codebase Directory Structure

```text
AI EXAM PREP/
├── public/                       # Static public assets (logos, vectors)
├── src/
│   ├── app/                      # Application views & core routing
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts      # Vercel-ready Serverless generation route
│   │   ├── layout.tsx            # Global layout configuration
│   │   ├── page.tsx              # Application hub (Landing, Form, Dashboard views)
│   │   ├── providers.tsx         # Global context providers (API Keys, Exam State)
│   │   ├── robots.ts             # Search engine robot configurations
│   │   └── sitemap.ts            # Dynamic SEO sitemap compiler
│   ├── components/               # Component architecture
│   │   ├── features/             # Feature-specific dashboard components
│   │   │   ├── api-key-modal.tsx      # Secure Groq API connection modal
│   │   │   ├── assessment-viewer.tsx  # Timed exam taking interface
│   │   │   ├── error-view.tsx         # User-facing error classification layouts
│   │   │   ├── generator-form.tsx     # Custom options generator form
│   │   │   ├── pdf-export-button.tsx  # Dual-mode A4 compiler & downloader
│   │   │   ├── processing-loader.tsx  # Animated loading indicator
│   │   │   ├── question-renderer.tsx  # Active question card controller
│   │   │   ├── results-dashboard.tsx  # Radial progress charts & cognitive profiles
│   │   │   ├── session-results.tsx    # sessionStorage index tables
│   │   │   └── start-exam.tsx         # Guidelines & prep lobby page
│   │   ├── shared/               # Reusable presentation layout templates
│   │   │   ├── api-status.tsx         # Real-time connectivity indicator
│   │   │   ├── empty-state.tsx        # Fallback card displays
│   │   │   ├── footer.tsx             # Brand credentials layout
│   │   │   ├── glass-card.tsx         # Glassmorphism container wrapper
│   │   │   └── navbar.tsx             # Interactive header controllers
│   │   └── ui/                   # Modular UI primitive templates
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── slider.tsx
│   ├── lib/                      # Core business services layer
│   │   ├── services/
│   │   │   └── ai/               # Groq orchestrator module
│   │   │       ├── api-client.ts       # Retries, timeouts & credentials sanitization
│   │   │       ├── error-handler.ts    # HTTP response mapping
│   │   │       ├── index.ts            # Module entrypoint
│   │   │       ├── json-parser.ts      # Regex JSON parser & cleaning
│   │   │       ├── prompt-builder.ts   # System/user prompt constructors
│   │   │       ├── response-parser.ts  # Response extractor
│   │   │       └── validator.ts        # Zod validation & normalization
│   │   ├── evaluation-engine.ts  # Grade calculating module
│   │   ├── schemas.ts            # Input Zod schemas
│   │   ├── types.ts              # Global TypeScript interfaces
│   │   └── utils.ts              # Layout helpers (clsx, tailwind-merge)
│   └── styles/
│       └── globals.css           # Global custom Tailwind classes
├── next.config.js                # Performance optimizations & security headers
├── package.json                  # Dependencies & execution scripts
└── tsconfig.json                 # TypeScript build configurations
```

---

## 💻 Local Setup & Installation

To run the application locally, follow these steps:

### 1. System Requirements
*   **Node.js:** version `18.17.0` or higher
*   **Package Manager:** `npm` (included with Node.js)

### 2. Installation
Clone the project repository and install its dependencies:
```bash
# Clone the repository
git clone <repository_url>
cd "AI EXAM PREP"

# Install packages
npm install
```

### 3. Start Development Server
Launch Next.js in development mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build and Production Run
Test compile targets and run the optimized production server locally:
```bash
# Compile and build Next.js application
npm run build

# Start the build application
npm run start
```

---

## 🔑 Groq AI Connection Setup

The application uses Groq's high-speed API endpoints. To retrieve an API key:

1.  Create an account at [console.groq.com](https://console.groq.com).
2.  Navigate to **API Keys** in the dashboard side panel.
3.  Click **Create API Key**, name it (e.g. `QuestionForge-Local`), and copy the key string (starts with `gsk_`).
4.  Launch the application, click **Connect API Key** in the header or generator card, paste your key, and save.
5.  *Security Note:* Keys are stored purely client-side in browser session storage (`sessionStorage`) and are never written to server disks or databases.

---

## 🌐 Deployment Configuration

The application is optimized for deployment on the [Vercel](https://vercel.com) cloud platform.

*   **Serverless Timeout Limits:** The API route in `src/app/api/generate/route.ts` configures `maxDuration = 60` (60 seconds) to accommodate longer Groq API response generation times for large question sets.
*   **Environment Variables:** No backend environment variables are required, as authorization headers pass keys directly from client requests.

---

## 📄 License

All rights reserved. Copyright © 2026 Kunal.

This software and its documentation are proprietary and confidential. Unauthorized copying, distribution, modification, or public execution of this software via any medium is strictly prohibited.
