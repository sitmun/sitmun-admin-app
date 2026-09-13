import {readFileSync} from 'node:fs';
import {posix} from 'node:path';

import coverageConfig from '../jest.coverage.config';
import jestConfig from '../jest.config';
import {loadSonarJestContract, parseSonarJestContract} from './create-jest-config';

function sonarValue(key: string): string {
  const match = readFileSync('sonar-project.properties', 'utf8').match(
    new RegExp(`^${key}=(.*)$`, 'm')
  );
  if (!match) {
    throw new Error(`missing ${key}`);
  }
  return match[1].trim().split(',')[0];
}

function packageScripts(): Record<string, string> {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
    scripts: Record<string, string>;
  };
  return pkg.scripts;
}

function sonarReporterOptions(config: {reporters?: unknown}): {
  outputDirectory: string;
  outputName: string;
} {
  const reporters = config.reporters;
  if (!Array.isArray(reporters)) {
    throw new Error('missing reporters');
  }
  const sonar = reporters.find(
    (entry) => Array.isArray(entry) && entry[0] === 'jest-sonar'
  ) as [string, {outputDirectory: string; outputName: string}] | undefined;
  if (!sonar?.[1]) {
    throw new Error('missing jest-sonar reporter');
  }
  return sonar[1];
}

describe('Sonar Jest contract', () => {
  const lcov = sonarValue('sonar.javascript.lcov.reportPaths');
  const utReport = sonarValue('sonar.testExecutionReportPaths');
  const scripts = packageScripts();
  const contract = parseSonarJestContract(
    readFileSync('sonar-project.properties', 'utf8')
  );

  it('parses the same values Sonar has on disk', () => {
    expect(contract).toEqual(loadSonarJestContract());
    expect(contract.lcovReportPath).toBe(lcov);
    expect(contract.testExecutionReportPath).toBe(utReport);
  });

  it('rejects Sonar properties that omit the lcov path', () => {
    expect(() => parseSonarJestContract('sonar.testExecutionReportPaths=reports/ut_report.xml\n')).toThrow(
      'missing sonar.javascript.lcov.reportPaths'
    );
  });

  it('does not collect coverage on the default config npm test loads', () => {
    expect(jestConfig.collectCoverage).toBe(false);
  });

  it('writes lcov where Sonar already looks', () => {
    expect(jestConfig.coverageDirectory).toBe(posix.dirname(lcov));
    expect(coverageConfig.coverageDirectory).toBe(jestConfig.coverageDirectory);
  });

  it('emits reports/ut_report.xml only from the coverage config', () => {
    expect(coverageConfig.collectCoverage).toBe(true);
    expect(() => sonarReporterOptions(jestConfig)).toThrow('missing jest-sonar reporter');
    const sonar = sonarReporterOptions(coverageConfig);
    expect(sonar.outputDirectory).toBe(contract.testExecutionOutputDirectory);
    expect(sonar.outputName).toBe(contract.testExecutionOutputName);
  });

  it('splits commands: local test never asks for coverage', () => {
    expect(scripts['test']).toBe('jest');
    expect(scripts['test:watch']).toBe('jest --watch');
    expect(scripts['test']).not.toMatch(/coverage/);
    expect(scripts['test:watch']).not.toMatch(/coverage/);
    expect(scripts['test:coverage']).toBeDefined();
    expect(scripts['test:coverage']).not.toMatch(/(?:^|\s)--coverage(?:\s|$)/);
    expect(scripts['test:coverage']).toMatch(/jest\.coverage\.config/);
  });

  it('maps AG Grid, echarts, and Material barrels onto Jest stubs', () => {
    const mapper = jestConfig.moduleNameMapper as Record<string, string>;
    expect(mapper['^@ag-grid-community/angular$']).toContain('jest/stubs/ag-grid-angular');
    expect(mapper['^@ag-grid-community/core$']).toContain('jest/stubs/ag-grid-core');
    expect(mapper['^echarts$']).toContain('jest/stubs/echarts');
    expect(mapper['^ngx-echarts$']).toContain('jest/stubs/ngx-echarts');
    expect(mapper['^@app/material-module$']).toContain('jest/stubs/material-testing.module');
    expect(mapper['[/\\\\]material-module$']).toContain('jest/stubs/material-testing.module');
  });

  it('keeps restoreMocks on for compile-once shared providers', () => {
    expect(jestConfig.restoreMocks).toBe(true);
    expect(coverageConfig.restoreMocks).toBe(true);
  });
});
