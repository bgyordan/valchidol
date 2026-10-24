/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // стари адреси → нови (за запазени връзки и търсачките)
  async redirects() {
    return [
      { source: '/za-nas/vatreshni-dokumenti', destination: '/za-nas/dokumenti-v-tsop', permanent: true },
    ];
  },
};

module.exports = nextConfig;

// Локалната разработка (next dev) вижда D1/R2 връзките от wrangler.jsonc
require('@opennextjs/cloudflare').initOpenNextCloudflareForDev();
