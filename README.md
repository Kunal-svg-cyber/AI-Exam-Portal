# QuestionForge AI — AI-Powered Assessment Platform

QuestionForge AI is a high-performance, dark-themed timed exam and assessment generator designed to empower educators and candidates in accordance with the UN Sustainable Development Goal 4 (Quality Education). 

Enforcing strict **Exam Mode** restrictions, the application provides an interactive testing environment, floating statistics palettes, digital countdown warning alarms, locks to prevent cheating, radial outcome logs, and local browser-memory session outcomes, all running without databases.

---

## 🚀 Core Features

- **Start Exam Lobby:** A structured timelock page showing metadata (Bloom taxonomy, estimated duration) and caution guidelines before active countdowns begin.
- **Distraction-Free taking:** Distraction-free dashboard that hides the navbar and footer, focusing the candidate on the question navigator and digital timer cards.
- **Advanced Question Palette:** A floating, sticky sidebar grid tracking completed, skipped, and bookmarked questions.
- **Digital countdown Warnings:** Color-coded border states (yellow at 10m, orange at 5m, pulsing red at 1m) and toasts alerting candidates to manage their pace.
- **Submit verification:** Confirm counts for answered and skipped questions with estimated completion rate trackers.
- **Outcome review sheets:** Graded review panels highlighting correct checkmarks, Chosen vs Correct response comparisons, and AI cognitive explanations.
- **AI Performance Profile:** Dynamic reports indicating cognitive strengths, areas for development, topic gaps, and study paths.
- **Print-ready PDF compiling:** Dynamically builds clean A4 PDFs for students, master answer key guides for educators, and outcomes reports.
- **Session Results Archive:** Restores previously completed exam records from `sessionStorage` or deletes them, clearing all data when browser tabs close.

---

## 🛠️ Technology Stack

- **Core Framework:** Next.js 14 (App Router)
- **State Management:** React Context API + Browser Session Memory
- **Form Verification:** React Hook Form + Zod Schemas
- **Motion System:** Framer Motion (Hardware-accelerated springs)
- **Style Layout:** CSS Modules & Tailwind CSS (Dark zinc custom theme)
- **PDF Engine:** jsPDF (Dynamic on-demand code-splitting)

---

## 💻 Local Development Setup

To run the application locally on your machine, follow these instructions:

1. **Clone the workspace repository:**
   ```bash
   git clone <repository_url>
   cd "AI EXAM PREP"
   ```

2. **Install dependency packages:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the browser portal:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the homepage.

---

## 🌐 Vercel Production Deployment

To deploy this application to Vercel, refer to the [Vercel Deployment & Developer Guide](file:///C:/Users/kunal/.gemini/antigravity-ide/brain/52c3a4c1-62f0-408a-b685-c2f47b3857ca/deployment_guide.md) generated inside the local workspace diagnostic logs.
