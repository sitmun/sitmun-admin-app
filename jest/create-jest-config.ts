import {readFileSync} from 'node:fs';
import {posix} from 'node:path';

import type {Config} from 'jest';

export type SonarJestContract = {
  readonly lcovReportPath: string;
  readonly coverageDirectory: string;
  readonly testExecutionReportPath: string;
  readonly testExecutionOutputDirectory: string;
  readonly testExecutionOutputName: string;
};

export type JestRunMode = {
  readonly collectCoverage: boolean;
};

const HEAVY_GUI_STUBS: Record<string, string> = {
  '^@ag-grid-community/angular$': '<rootDir>/jest/stubs/ag-grid-angular.ts',
  '^@ag-grid-community/core$': '<rootDir>/jest/stubs/ag-grid-core.ts',
  '^@ag-grid-community/client-side-row-model$':
    '<rootDir>/jest/stubs/ag-grid-client-side-row-model.ts',
  '^@ag-grid-community/csv-export$': '<rootDir>/jest/stubs/ag-grid-csv-export.ts',
  '^@ag-grid-community/infinite-row-model$':
    '<rootDir>/jest/stubs/ag-grid-infinite-row-model.ts',
  '^echarts$': '<rootDir>/jest/stubs/echarts.ts',
  '^ngx-echarts$': '<rootDir>/jest/stubs/ngx-echarts.ts'
};

function requiredProperty(text: string, key: string): string {
  const match = text.match(new RegExp(`^${key}=(.*)$`, 'm'));
  const value = match?.[1]?.trim().split(',')[0];
  if (!value) {
    throw new Error(`missing ${key} in sonar-project.properties`);
  }
  return value;
}

export function parseSonarJestContract(propertiesText: string): SonarJestContract {
  const lcovReportPath = requiredProperty(
    propertiesText,
    'sonar.javascript.lcov.reportPaths'
  );
  if (!lcovReportPath.endsWith('lcov.info')) {
    throw new Error(`sonar.javascript.lcov.reportPaths must end with lcov.info`);
  }
  const testExecutionReportPath = requiredProperty(
    propertiesText,
    'sonar.testExecutionReportPaths'
  );
  return {
    lcovReportPath,
    coverageDirectory: posix.dirname(lcovReportPath),
    testExecutionReportPath,
    testExecutionOutputDirectory: posix.dirname(testExecutionReportPath),
    testExecutionOutputName: posix.basename(testExecutionReportPath)
  };
}

export function loadSonarJestContract(
  propertiesPath = 'sonar-project.properties'
): SonarJestContract {
  return parseSonarJestContract(readFileSync(propertiesPath, 'utf8'));
}

export function createJestConfig(
  mode: JestRunMode,
  contract: SonarJestContract = loadSonarJestContract()
): Config {
  const sonarReporter: [string, {outputDirectory: string; outputName: string}] = [
    'jest-sonar',
    {
      outputDirectory: contract.testExecutionOutputDirectory,
      outputName: contract.testExecutionOutputName
    }
  ];
  return {
    preset: 'jest-preset-angular',
    clearMocks: true,
    restoreMocks: true,
    collectCoverage: mode.collectCoverage,
    coverageDirectory: contract.coverageDirectory,
    coverageProvider: 'v8',
    coverageReporters: mode.collectCoverage ? ['lcovonly', 'text'] : undefined,
    coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/jest/'],
    reporters: mode.collectCoverage ? ['default', sonarReporter] : ['default'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      d3: '<rootDir>/node_modules/d3/dist/d3.min.js',
      '^@app/domain$': '<rootDir>/src/app/domain',
      '^@app/domain/(.*)$': '<rootDir>/src/app/domain/$1',
      '^@app/material-module$': '<rootDir>/jest/stubs/material-testing.module.ts',
      '[/\\\\]material-module$': '<rootDir>/jest/stubs/material-testing.module.ts',
      '^@app/frontend-gui/src/lib/public_api$':
        '<rootDir>/src/app/frontend-gui/src/lib/public_api',
      '^@app/core/config/external-configuration.service$':
        '<rootDir>/src/app/core/config/external-configuration.service',
      '^@app/core/hal/resource/resource.service$':
        '<rootDir>/src/app/core/hal/resource/resource.service',
      '^@app/core/hal/config/external.service$':
        '<rootDir>/src/app/core/hal/config/external.service',
      '^@app/(.*)$': '<rootDir>/src/app/$1',
      '^@config$': '<rootDir>/src/config.ts',
      '^@environments/(.*)$': '<rootDir>/src/environments/$1',
      ...HEAVY_GUI_STUBS
    },
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@angular|rxjs)'],
    testMatch: ['**/*.spec.ts'],
    testPathIgnorePatterns: ['/node_modules/']
  };
}
