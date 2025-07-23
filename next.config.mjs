import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    images: {
        dangerouslyAllowSVG: true
    }
};

export default withNextIntl(nextConfig);