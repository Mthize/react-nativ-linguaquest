const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@tanstack/query-core": path.dirname(
    require.resolve("@tanstack/query-core/package.json"),
  ),
};

module.exports = withNativewind(config);
