import { version } from 'webpack';

export const isWebpack5 = (): boolean => version.startsWith('5');
