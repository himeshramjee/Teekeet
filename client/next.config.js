module.exports = {
  devIndicators: {
    autoPrerender: true,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 5000;
    return config;
  },
};
