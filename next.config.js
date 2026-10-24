/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // стари адреси → нови (за запазени връзки и търсачките)
  async redirects() {
    return [
      { source: '/za-nas/vatreshni-dokumenti', destination: '/za-nas/dokumenti-v-tsop', permanent: true },
    ];
  },
};

module.exports = nextConfig;
