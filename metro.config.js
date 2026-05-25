const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Loại trừ thư mục backend khỏi bundle của React Native
config.resolver.blockList = [
    /src\/Api\/.*/,
    /src\/backend\/.*/,
];

module.exports = config;
