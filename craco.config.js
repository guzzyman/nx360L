const tailwindcss = require("tailwindcss");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 

module.exports = {
  style: {
    postcss: {
      plugins: [
        tailwindcss("./src/tailwind.config.js"),
        require("autoprefixer"),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin || (plugin.options && plugin.options.ignoreOrder != null),
      );
      instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;

      return webpackConfig;
    },
  }
};
