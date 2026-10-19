import type {Config} from 'jest';

import {createJestConfig} from './jest/create-jest-config.ts';

const config: Config = createJestConfig({collectCoverage: true});

export default config;
