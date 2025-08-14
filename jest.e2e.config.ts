import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	rootDir: './tests',
	testRegex: '.e2e.test.ts',
};

export default config;
