module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets:
      {
        esmodules: true,
        browsers: [
          'defaults',
          'not ie <= 11',
          'not edge <= 50',
          'not chrome <= 50',
          'not safari <= 11',
          'not firefox <= 50',
        ],
      },
    }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    '@babel/plugin-transform-runtime',
  ],
};