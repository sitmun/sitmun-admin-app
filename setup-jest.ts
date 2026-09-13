import {setupZoneTestEnv} from 'jest-preset-angular/setup-env/zone';

if (typeof window !== 'undefined') {
  setupZoneTestEnv({
    teardown: {destroyAfterEach: false},
  });

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

  if (!document.body.style.transform) {
    try {
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

  class MockIntersectionObserver {
    readonly root: Element | Document | null;
    readonly rootMargin: string;
    readonly thresholds: ReadonlyArray<number>;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.root = options?.root || null;
      this.rootMargin = options?.rootMargin || '0px';
      this.thresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0];
    }

    observe(target: Element): void {}

    unobserve(target: Element): void {}

    disconnect(): void {}

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  global.IntersectionObserver = MockIntersectionObserver as any;
}

const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const message = args.map((arg) => String(arg)).join(' ');
  if (/Code list .+ not initialized/i.test(message)) {
    return;
  }
  if (/\bNG0304\b/.test(message)) {
    return;
  }
  originalConsoleError(...args);
};
