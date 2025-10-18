import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true
  },
  reactCompiler: true,
  typedRoutes: true
};

export default nextConfig;
