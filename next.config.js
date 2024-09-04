/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['storage.yandexcloud.net'], // Добавляем домен для загрузки изображений
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

module.exports = nextConfig;