module.exports = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  typescript: {
    check: true,
    checkOptions: {},
  },
};
