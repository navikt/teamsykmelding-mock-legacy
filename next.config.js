/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    eslint: {
        dirs: ['src'],
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
