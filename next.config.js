/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dvztt66ngx2v3.cloudfront.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.shopify.com',
                port: '',
                pathname: '/s/files/**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/policies/privacy-policy',
                destination: '/privacy',
                permanent: true,
            },
            {
                source: '/policies/terms-of-service',
                destination: '/terms',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
