/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Security headers (CSP, HSTS, X-Frame-Options) are served by Amplify via
  // customHttp.yml so they apply to static assets as well as SSR responses.
  poweredByHeader: false,
};

export default nextConfig;
