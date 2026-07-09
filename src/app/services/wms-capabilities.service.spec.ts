import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { CapabilitiesService } from '@app/domain';
import { LoggerService } from '@app/services/logger.service';
import { config } from '@config';

import { WMSCapabilitiesService } from './wms-capabilities.service';

describe('WMSCapabilitiesService', () => {
  let service: WMSCapabilitiesService;
  let capabilitiesService: jest.Mocked<Pick<CapabilitiesService, 'getInfo'>>;

  const originalDefaultLang = config.defaultLang;
  const originalLanguagesToUse = config.languagesToUse;

  const multilingualAbstract = [
    { 'xml:lang': 'ca-ES', content: 'Text catala' },
    { 'xml:lang': 'es-ES', content: 'Texto castellano' },
  ];

  const multilingualTitle = [
    { 'xml:lang': 'ca-ES', content: 'Titol catala' },
    { 'xml:lang': 'es-ES', content: 'Titulo castellano' },
  ];

  function mockCapabilitiesResponse(service: Record<string, unknown>) {
    capabilitiesService.getInfo.mockReturnValue(
      of({
        asJson: {
          WMS_Capabilities: {
            Service: service,
            Capability: { Layer: { CRS: ['EPSG:25831'] } },
          },
        },
      } as never)
    );
  }

  beforeEach(() => {
    config.languagesToUse = [
      { shortname: 'ca', name: 'Catala' } as never,
      { shortname: 'es', name: 'Castellano' } as never,
      { shortname: 'en', name: 'English' } as never,
      { shortname: 'oc-aranes', name: 'Aranes' } as never,
    ];

    capabilitiesService = {
      getInfo: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        WMSCapabilitiesService,
        { provide: CapabilitiesService, useValue: capabilitiesService },
        {
          provide: LoggerService,
          useValue: { debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
        },
      ],
    });

    service = TestBed.inject(WMSCapabilitiesService);
  });

  afterEach(() => {
    config.defaultLang = originalDefaultLang;
    config.languagesToUse = originalLanguagesToUse;
    jest.restoreAllMocks();
  });

  describe('processWMSServiceMetadata multilingual Abstract', () => {
    beforeEach(() => {
      mockCapabilitiesResponse({
        Title: 'Plain title',
        Abstract: multilingualAbstract,
      });
    });

    it('case A: uses default-language match as main and other langs as translations', async () => {
      config.defaultLang = 'ca';

      const result = await service.processWMSServiceMetadata('https://example.org/wms');

      expect(typeof result.abstract).toBe('string');
      expect(result.abstract).toBe('Text catala');
      expect(result.abstractTranslations.get('es')).toBe('Texto castellano');
      expect(result.abstractTranslations.has('ca')).toBe(false);
    });

    it('case B: uses first entry as main and fills its language translation row', async () => {
      config.defaultLang = 'en';

      const result = await service.processWMSServiceMetadata('https://example.org/wms');

      expect(result.abstract).toBe('Text catala');
      expect(result.abstractTranslations.get('ca')).toBe('Text catala');
      expect(result.abstractTranslations.get('es')).toBe('Texto castellano');
    });

    it('case C: keeps plain string abstract without translations', async () => {
      mockCapabilitiesResponse({
        Title: 'Plain title',
        Abstract: 'Plain abstract',
      });

      const result = await service.processWMSServiceMetadata('https://example.org/wms');

      expect(result.abstract).toBe('Plain abstract');
      expect(result.abstractTranslations.size).toBe(0);
    });

    it('accepts text from content, _, and #text keys', async () => {
      mockCapabilitiesResponse({
        Title: 'Plain title',
        Abstract: [
          { 'xml:lang': 'ca-ES', _: 'Text catala underscore' },
          { 'xml:lang': 'es-ES', '#text': 'Texto hash text' },
        ],
      });
      config.defaultLang = 'ca';

      const result = await service.processWMSServiceMetadata('https://example.org/wms');

      expect(result.abstract).toBe('Text catala underscore');
      expect(result.abstractTranslations.get('es')).toBe('Texto hash text');
    });
  });

  describe('processWMSServiceMetadata multilingual Title', () => {
    it('parses title main text and titleTranslations', async () => {
      mockCapabilitiesResponse({
        Title: multilingualTitle,
        Abstract: 'Plain abstract',
      });
      config.defaultLang = 'ca';

      const result = await service.processWMSServiceMetadata('https://example.org/wms');

      expect(typeof result.title).toBe('string');
      expect(result.title).toBe('Titol catala');
      expect(result.titleTranslations.get('es')).toBe('Titulo castellano');
    });
  });

  describe('language normalization', () => {
    it('maps ca-ES to configured ca without reducing oc-aranes to oc', async () => {
      mockCapabilitiesResponse({
        Title: 'Plain title',
        Abstract: [
          { 'xml:lang': 'oc-aranes-ES', content: 'Text aranes' },
          { 'xml:lang': 'ca-ES', content: 'Text catala' },
        ],
      });
      config.defaultLang = 'oc-aranes';

      const result = await service.processWMSServiceMetadata('https://example.org/wms');

      expect(result.abstract).toBe('Text aranes');
      expect(result.abstractTranslations.get('ca')).toBe('Text catala');
      expect(result.abstractTranslations.has('oc-aranes')).toBe(false);
    });

    it('maps ISO 639-2 cat tag to configured ca and selects it as main', async () => {
      mockCapabilitiesResponse({
        Title: 'Plain title',
        Abstract: [
          { 'xml:lang': 'en', content: 'English abstract' },
          { 'xml:lang': 'es-ES', content: 'Spanish abstract' },
          { 'xml:lang': 'cat-ES', content: 'Catalan abstract' },
        ],
      });
      config.defaultLang = 'ca';

      const result = await service.processWMSServiceMetadata('https://example.org/wms');

      expect(result.abstract).toBe('Catalan abstract');
      expect(result.abstractTranslations.get('en')).toBe('English abstract');
      expect(result.abstractTranslations.get('es')).toBe('Spanish abstract');
      expect(result.abstractTranslations.has('ca')).toBe(false);
    });
  });
});
