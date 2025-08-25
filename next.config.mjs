import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
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
                protocol: "https",
                hostname: "api.diagnoai.uz",
                port: "",
                pathname: "/media/**", // Updated pathname to specifically allow media directory
            },
        ],
    },
};

export default withNextIntl(nextConfig);
