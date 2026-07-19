/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Ensure imported images under content/assets are bundled for the /assets
  // route's on-demand fallback (prerendered assets don't need this, but assets
  // added after build do).
  outputFileTracingIncludes: {
    "/assets/[...path]": ["./content/assets/**"],
  },
};

export default nextConfig;
