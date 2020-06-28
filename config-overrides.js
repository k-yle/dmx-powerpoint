// eslint-disable-next-line import/no-extraneous-dependencies
const { override } = require('customize-cra');

module.exports = override((config) => {
  return {
    ...config,
    externals: {
      // webpack will mock these modules for the browser by default
      // https://engineering.mixmax.com/blog/requiring-node-builtins-with-webpack

      // you also need to update public/index.html
      os: '__real_os',
      sacn: '__real_sacn',
      slideshow: '__real_slideshow',
    },
  };
});
