const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/nextjs-mini-proj/' : '',
  basePath: isProd ? '/nextjs-mini-proj' : '',
  output: 'export'
};

export default nextConfig;