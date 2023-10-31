module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets:
      {
        esmodules: true,
      },
    }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    '@babel/plugin-transform-runtime',
  ],
};