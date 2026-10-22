import type { NextConfig } from "next";

/** A week fresh, then served stale for a month while it refreshes behind you. */
const ASSET_CACHE = "public, max-age=604800, stale-while-revalidate=2592000";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    /* How long the client router may reuse a page it has already fetched
       before going back to the server. Every page here is prerendered and
       built from local constants, so there is nothing to go stale: holding
       them makes going back and forth through the site immediate.

       The dynamic figure stays short on purpose — /verify is the only page
       that reads the request, and it is an auth step, not something to
       re-show from cache. */
    staleTimes: { static: 600, dynamic: 30 },
  },

  images: {
    /* Optimised output is content-addressed, so it can be held for a long
       time. The default is 60 seconds, which has every visitor re-optimising
       the same photographs. */
    minimumCacheTTL: 31536000,

    // Add the media/CDN hosts the backend serves images from.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  async headers() {
    return [
      {
        /* Files under public/ are the one thing Next cannot fingerprint, so
           without a rule the browser revalidates every photograph on every
           navigation. Build output under /_next/static already carries an
           immutable hash and needs nothing here. */
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: ASSET_CACHE }],
      },
      {
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: ASSET_CACHE }],
      },
    ];
  },
};

export default nextConfig;
