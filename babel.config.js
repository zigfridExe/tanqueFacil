module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript',
      ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@src': './src',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
    ],
  };
};