module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            components: "./src/components",
            screens: "./src/screens",
            interfaces: "./src/interfaces",
            providers: "./src/providers",
            constants: "./src/constants",
            assets: "./src/assets",
            utility: "./src/utility",
            navigation: "./src/navigation",
            store: "./src/store",
            api: "./src/api"
          }
        }
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          safe: false,
          allowUndefined: true,
          blocklist: null,
          allowlist: null,
          verbose: false
        }
      ],
      ["react-native-reanimated/plugin"]
    ]
  };
};
