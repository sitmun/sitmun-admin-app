import 'zone.js/bundles/zone-testing-bundle.umd.js';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Initialize TestBed for all tests
try {
  getTestBed().resetTestEnvironment();
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
} catch (e) {
  console.log('TestBed already initialized, skipping initialization');
}

// Global mocks for jsdom
const mock = () => {
  let storage: {[key: string]: string} = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {})
  };
};

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

// Only define transform property if it doesn't already exist
if (!document.body.style.transform) {
  try {
    // Use Object.defineProperty carefully to avoid redefining issues
    Object.defineProperty(document.body.style, 'transform', {
      configurable: true,
      enumerable: true,
      value: () => ({
        enumerable: true,
        configurable: true
      })
    });
  } catch (e) {
    console.log('Cannot define transform property, it may already be defined:', e);
  }
}

// Angular material mocks
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.root = options?.root || null;
    this.rootMargin = options?.rootMargin || '0px';
    this.thresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0];
  }

  observe(target: Element): void {
    // Mock implementation - do nothing
  }

  unobserve(target: Element): void {
    // Mock implementation - do nothing
  }

  disconnect(): void {
    // Mock implementation - do nothing
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Add to global
global.IntersectionObserver = MockIntersectionObserver as any;

// Output test console logs
// global.console = {
//   ...console,
//   log: console.log,
//   error: console.error,
//   warn: console.warn,
// };
