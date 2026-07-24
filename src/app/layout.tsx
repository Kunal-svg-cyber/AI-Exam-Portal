import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const SITE_URL = "https://questionforge.ai";
const SITE_NAME = "QuestionForge AI";
const SITE_DESCRIPTION =
  "Generate professional exam papers, interactive assessments, and answer keys instantly using AI. Built for educators aligned with SDG 4 — free, private, and browser-based.";

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────
  title: {
    default: `${SITE_NAME} — AI-Powered Exam & Assessment Generator`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI exam generator",
    "assessment platform",
    "quiz maker",
    "MCQ generator",
    "Grok AI",
    "educational technology",
    "SDG 4",
    "Bloom taxonomy",
    "teacher tools",
    "exam paper creator",
    "coding questions",
    "interview questions",
    "PDF exam export",
  ],
  authors: [{ name: "QuestionForge Team", url: SITE_URL }],
  creator: "QuestionForge Team",
  publisher: "QuestionForge AI",

  // ── Canonical & Alternates ────────────────────────
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // ── Open Graph ────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Generate Professional Exams with AI`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "QuestionForge AI — AI-Powered Assessment Platform",
      },
    ],
  },

  // ── Twitter Cards ─────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — AI Exam Generator for Educators`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@questionforge",
  },

  // ── Icons & Manifest ──────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",

  // ── Robots ────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Category ──────────────────────────────────────
  category: "education",
};

// Viewport export (Next.js 14+ best practice — avoids CLS shift)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
    { media: "(prefers-color-scheme: light)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "QuestionForge Team",
    url: SITE_URL,
  },
  educationalAlignment: {
    "@type": "AlignmentObject",
    alignmentType: "educationalFramework",
    educationalFramework: "UN Sustainable Development Goal 4",
    targetName: "Quality Education",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" dir="ltr">
      <head>
        {/* Preconnect to Google Fonts for faster font loading (Core Web Vitals: LCP) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased flex flex-col min-h-screen">
        <Providers>
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />
          <Navbar />
          <main className="flex-grow flex flex-col relative z-10" id="main-content">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
