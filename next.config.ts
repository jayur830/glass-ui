import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    interface RuleItem {
      test?: { test?(str: string): boolean };
      issuer?: unknown;
      resourceQuery?: { not?: RegExp[] };
      exclude?: RegExp;
    }

    const fileLoaderRule = config.module.rules.find((rule: RuleItem) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/] },
        use: ['@svgr/webpack'],
      },
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
