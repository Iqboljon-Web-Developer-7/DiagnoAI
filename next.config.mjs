import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        dangerouslyAllowSVG: true,
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
