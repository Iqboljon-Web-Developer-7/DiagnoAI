import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    devIndicators: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    compress: true, // Enable gzip compression
    poweredByHeader: false, // Remove X-Powered-By header
    images: {
        formats: ['image/avif', 'image/webp'], // Modern formats
        dangerouslyAllowSVG: true,
        minimumCacheTTL: 60 * 60 * 24 * 30, // Cache for 30 days
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.ytimg.com",
                port: "",
                pathname: "/vi/**",
            },
            {
                protocol: 'http',
                hostname: "api.diagnoai.uz",
                port: "",
                pathname: "/media/**",  
            },
            {
                protocol: 'https',
                hostname: "api.diagnoai.uz",
                port: "",
                pathname: "/media/**", 
            },
        ],
    },
    //  experimental: {
    // ppr: 'incremental',
//   },
};

export default withNextIntl(nextConfig);
