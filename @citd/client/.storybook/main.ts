import type { StorybookConfig } from '@storybook/react-webpack5';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
  webpackFinal: (config) => {
    config.plugins?.push(new MonacoWebpackPlugin({ languages: ['html'] }));
    config.module?.rules?.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });
    return config;
  },
};
export default config;
