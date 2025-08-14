import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        
        remotePatterns: [
         {
          protocol: "https",
          hostname: "i.ytimg.com",
          port: "",
          pathname: "/vi/**",
         },
     ],
    }
};

export default withNextIntl(nextConfig);
