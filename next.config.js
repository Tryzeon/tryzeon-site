/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js dev needs eval for HMR/turbopack; framer-motion runtime evaluates style strings
  `script-src 'self' 'unsafe-inline' ${isProd ? '' : "'unsafe-eval'"}`.trim(),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "media-src 'self'",
  "connect-src 'self' https://docs.google.com https://www.google.com",
  "form-action 'self' https://docs.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Three.js transpiled as first-party so Turbopack handles its ESM
  // example modules (RoundedBoxGeometry, RoomEnvironment) consistently.
  transpilePackages: ['three'],

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
