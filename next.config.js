/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // качване на снимки и документи от админ панела
  experimental: { serverActions: { bodySizeLimit: '50mb' } },
  // стари адреси → нови (за запазени връзки и търсачките)
  async redirects() {
    return [
      { source: '/za-nas/vatreshni-dokumenti', destination: '/za-nas/dokumenti-v-tsop', permanent: true },
    ];
  },
};

module.exports = nextConfig;

// Локалната разработка (next dev) вижда D1/R2 връзките от wrangler.jsonc
// без отдалечени връзки (напр. Workers AI) — те работят само в Cloudflare, а билдът и локалният тест не ги изискват
require('@opennextjs/cloudflare').initOpenNextCloudflareForDev({ remoteBindings: false });
