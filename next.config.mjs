/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        KEYTOEKN: process.env.KEYTOEKN,
      },
    images: {
        domains : ['localhost'],
        remotePatterns: [
            {
                protocol:'https',
                hostname:'**'
            }
        ]
    },
};

export default nextConfig;
