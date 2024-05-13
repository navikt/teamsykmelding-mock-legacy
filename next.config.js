/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    eslint: {
        dirs: ['src'],
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    },
}

module.exports = nextConfig
