const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // assetPrefix and basePath are only needed for GitHub Pages
  // assetPrefix: isProd ? '/nextjs-mini-proj/' : '',
  // basePath: isProd ? '/nextjs-mini-proj' : '',
  output: 'export',
  experimental: {
     allowedDevOrigins: ['*'],
  },
};

export default nextConfig;