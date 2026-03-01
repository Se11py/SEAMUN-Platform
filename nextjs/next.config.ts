import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    disableDevLogs: true,
  }
});

const nextConfig: NextConfig = {
  // Output minimal container traces
  output: "standalone",
  // Enable trailing slashes for compatibility with original HTML paths
  trailingSlash: true,

  // Image optimization for external images (if needed)
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Redirects for .html extensions to clean URLs
  async redirects() {
    return [
      // Redirect /pages/*.html to clean URLs
      {
        source: '/pages/:slug.html',
        destination: '/:slug/',
        permanent: true,
      },
      // Redirect root-level .html files
      {
        source: '/:slug.html',
        destination: '/:slug/',
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(withPWA(nextConfig), {
  org: "seamuns",
  project: "seamuns-tracker",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: "/monitoring",
  sourcemaps: {
    disable: true,
  },
  disableLogger: true,
});
