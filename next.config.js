/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Core Web Vitals: Compression ──────────────────
  compress: true,

  // ── Core Web Vitals: Image Optimization ───────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // ── Core Web Vitals: Font Optimization ────────────
  optimizeFonts: true,

  // ── Performance: Strict Mode ──────────────────────
  reactStrictMode: true,

  // ── Performance: SWC Minification ─────────────────
  swcMinify: true,

  // ── SEO: Trailing Slash Consistency ────────────────
  trailingSlash: false,

  // ── SEO: Powered-By Header Removal ────────────────
  poweredByHeader: false,

  // ── Security Headers ──────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
