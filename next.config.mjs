/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://catsheue-001-site5.atempurl.com/api/:path*', // Correctly include the path pattern
            },
        ]
    },
};

export default nextConfig;
