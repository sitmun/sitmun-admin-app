import { Injectable } from '@angular/core';

import { firstValueFrom } from "rxjs";

import { CapabilitiesService, Cartography, CartographyStyle } from "@app/domain";
import {LoggerService} from '@app/services/logger.service';
import { config } from "@config";

/** Parsed WMS field with main text and per-language translations. */
export interface WMSMultilingualField {
  main: string;
  translations: Map<string, string>;
}

/**
 * Class representing WMS service capabilities metadata.
 * Contains service information retrieved from WMS GetCapabilities request.
 */
export class WMSServiceCapabilities {
  /**
   * Creates a new WMS service capabilities object.
   *
   * @param capabilities - Raw capabilities data from the WMS response
   * @param title - Service title in the selected main language
   * @param titleTranslations - Map of language codes to translated titles
   * @param abstract - Service description/abstract in the selected main language
   * @param abstractTranslations - Map of language codes to translated abstracts
   * @param supportedSRS - Array of supported spatial reference systems (projections)
   */
  constructor(
    public capabilities: unknown,
    public title: string,
    public titleTranslations: Map<string, string>,
    public abstract: string,
    public abstractTranslations: Map<string, string>,
    public supportedSRS: string[]
  ) {}
}

/**
 * Class representing WMS layers and their associated styles.
 * Used to store and manage layer information from GetCapabilities.
 */
export class WMSLayersCapabilities {
  /**
   * Array of cartography objects representing WMS layers.
   * Each object contains name, description, and other layer properties.
   */
  layers: Cartography[] = [];

  /**
   * Map of layer names to their available styles.
   * Key is the layer name, value is an array of style objects.
   */
  styles: Map<string, CartographyStyle[]> = new Map<string, CartographyStyle[]>()
}

/**
 * Service for processing WMS capabilities.
 * Provides methods to retrieve and process GetCapabilities responses from WMS services.
 */
@Injectable({
  providedIn: 'root'
})
export class WMSCapabilitiesService {
  /**
   * Creates a new WMSCapabilitiesService.
   *
   * @param capabilitiesService - Service for retrieving capabilities
   * @param loggerService - Service for logging messages and errors
   */
  constructor(
    private capabilitiesService: CapabilitiesService,
    private loggerService: LoggerService
  ) {}

  /**
   * Processes WMS service metadata from a GetCapabilities request.
   * Extracts service information including title, abstract, and supported projections.
   *
   * @param url - URL of the WMS service
   * @returns Promise resolving to WMSServiceCapabilities object with service metadata
   * @throws Error if the service is not a valid WMS 1.1.1 or 1.3.0 service
   */
  async processWMSServiceMetadata(url: string): Promise<WMSServiceCapabilities> {
    const result = await this.wmsGetCapabilitiesRequest(url);

    if (result.success) {
      const body = result.asJson.asJson;
      const wms_1_1_1 = body.WMT_MS_Capabilities;
      const wms_1_3_0 = body.WMS_Capabilities;
      if (!wms_1_1_1 && !wms_1_3_0) {
        return Promise.reject("Not WMS 1.1.1 or WMS 1.3.0");
      }
      const service = wms_1_1_1?.Service || wms_1_3_0?.Service;
      const capability = wms_1_1_1?.Capability || wms_1_3_0?.Capability;
      const title = this.parseMultilingualField(service?.Title);
      const abstract = this.parseMultilingualField(service?.Abstract);
      return Promise.resolve(
        new WMSServiceCapabilities(
          result.asJson,
          title.main,
          title.translations,
          abstract.main,
          abstract.translations,
          this.extractProjections(capability)
        )
      );
    } else {
      return Promise.reject("Error retrieving WMS capabilities");
    }
  }

  /**
   * Processes WMS service capabilities to extract layer information.
   * Retrieves and processes layer metadata including names, titles, and styles.
   *
   * @param url - URL of the WMS service
   * @returns Promise resolving to WMSLayersCapabilities object with layers and styles
   * @throws Error if the service is not a valid WMS 1.1.1 or 1.3.0 service
   */
  async processWMSServiceCapabilities(url: string): Promise<WMSLayersCapabilities> {
    const result = await this.wmsGetCapabilitiesRequest(url);
    if (result.success) {
      const body = result.asJson.asJson;
      const wms_1_1_1 = body.WMT_MS_Capabilities;
      const wms_1_3_0 = body.WMS_Capabilities;
      if (!wms_1_1_1 && !wms_1_3_0) {
        return Promise.reject("Not WMS 1.1.1 or WMS 1.3.0");
      }
      const capability = wms_1_1_1?.Capability || wms_1_3_0?.Capability;
      return this.extractLayers(capability);
    } else {
      return Promise.reject("Error retrieving WMS capabilities");
    }
  }

  /**
   * Makes a GetCapabilities request to a WMS service.
   * Handles URL formatting and adds necessary request parameters.
   *
   * @param url - Base URL of the WMS service
   * @returns Promise resolving to an object with success status and response data
   */
  private async wmsGetCapabilitiesRequest(url: string): Promise<{success: boolean, asJson: any}> {
    if (!url.includes(config.capabilitiesRequest.simpleRequest)) {
      if (!url.endsWith('?')) {
        url += '?';
      }
      url += config.capabilitiesRequest.requestWithWMS;
    }
    try {
      const response = await firstValueFrom(this.capabilitiesService.getInfo(url));
      return { success: true, asJson: response };
    } catch (_) {
      return { success: false, asJson: null };
    }
  }

  /**
   * Parses a WMS metadata field that may be a plain string or a multilingual array.
   *
   * @param value - Title or Abstract from the capabilities response
   * @returns Main text and translations keyed by normalized language shortname
   */
  private parseMultilingualField(value: unknown): WMSMultilingualField {
    const empty: WMSMultilingualField = { main: '', translations: new Map() };

    if (value == null) {
      return empty;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return { main: String(value), translations: new Map() };
    }

    if (!Array.isArray(value)) {
      const text = this.extractTextContent(value);
      return text ? { main: text, translations: new Map() } : empty;
    }

    const entries = value
      .map(item => ({
        lang: this.extractRawLang(item),
        text: this.extractTextContent(item),
      }))
      .filter(entry => entry.text.length > 0);

    if (entries.length === 0) {
      return empty;
    }

    const defaultLang = this.normalizeLanguage(config.defaultLang);
    const mainIndex = entries.findIndex(
      entry => entry.lang != null && this.normalizeLanguage(entry.lang) === defaultLang
    );
    const selectedIndex = mainIndex >= 0 ? mainIndex : 0;
    const mainEntry = entries[selectedIndex];

    const caseB = mainIndex < 0;
    const translations = new Map<string, string>();
    entries.forEach((entry, index) => {
      if (index === selectedIndex || entry.lang == null) {
        return;
      }
      const lang = this.normalizeLanguage(entry.lang);
      if (!translations.has(lang)) {
        translations.set(lang, entry.text);
      }
    });

    // Case B: default language absent — main uses first entry, but its language row
    // must still be filled (e.g. default en, first ca-ES → ca translation + main field).
    if (caseB && mainEntry.lang != null) {
      const mainLang = this.normalizeLanguage(mainEntry.lang);
      if (!translations.has(mainLang)) {
        translations.set(mainLang, mainEntry.text);
      }
    }

    return { main: mainEntry.text, translations };
  }

  /**
   * Normalizes an xml:lang value to a configured language shortname when possible.
   */
  private normalizeLanguage(rawLang: string): string {
    const raw = rawLang.trim().toLowerCase();
    const knownShortnames = this.getKnownLanguageShortnames();

    for (const shortname of knownShortnames) {
      const normalizedShortname = shortname.toLowerCase();
      if (raw === normalizedShortname || raw.startsWith(`${normalizedShortname}-`)) {
        return shortname;
      }
    }

    const primarySubtag = this.primaryLanguageSubtag(raw);
    const aliasedShortname = this.resolveLanguageAlias(primarySubtag, knownShortnames);
    if (aliasedShortname) {
      return aliasedShortname;
    }

    return primarySubtag;
  }

  /** Primary language subtag before the first hyphen. */
  private primaryLanguageSubtag(rawLang: string): string {
    const dashIndex = rawLang.indexOf('-');
    return dashIndex === -1 ? rawLang : rawLang.substring(0, dashIndex);
  }

  /**
   * Maps ISO 639-2 bibliographic codes to configured ISO 639-1 shortnames.
   * Some WMS services use `cat-ES` instead of `ca-ES` for Catalan.
   */
  private resolveLanguageAlias(
    primarySubtag: string,
    knownShortnames: string[],
  ): string | undefined {
    const aliases: Record<string, string> = {
      cat: 'ca',
      spa: 'es',
      eng: 'en',
      fre: 'fr',
      fra: 'fr',
      ger: 'de',
      deu: 'de',
    };
    const target = aliases[primarySubtag];
    if (!target) {
      return undefined;
    }
    return knownShortnames.find(shortname => shortname.toLowerCase() === target);
  }

  /** Returns configured language shortnames, longest first for prefix matching. */
  private getKnownLanguageShortnames(): string[] {
    const shortnames = new Set<string>();
    if (config.defaultLang) {
      shortnames.add(config.defaultLang);
    }
    config.languagesToUse?.forEach(language => {
      if (language.shortname) {
        shortnames.add(language.shortname);
      }
    });
    return Array.from(shortnames).sort((a, b) => b.length - a.length);
  }

  /** Reads xml:lang from a parsed capabilities item. */
  private extractRawLang(item: unknown): string | undefined {
    if (item == null || typeof item !== 'object') {
      return undefined;
    }
    const record = item as Record<string, unknown>;
    const lang = record['xml:lang'] ?? record['@xml:lang'];
    return typeof lang === 'string' && lang.length > 0 ? lang : undefined;
  }

  /** Extracts text from plain values or org.json/xml-to-json object shapes. */
  private extractTextContent(value: unknown): string {
    if (value == null) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }
    if (typeof value !== 'object') {
      return '';
    }
    const record = value as Record<string, unknown>;
    for (const key of ['content', '_', '#text'] as const) {
      const candidate = record[key];
      if (typeof candidate === 'string' || typeof candidate === 'number') {
        return String(candidate);
      }
    }
    return '';
  }

  /**
   * Extracts supported projections from WMS capabilities.
   * Handles both SRS (WMS 1.1.1) and CRS (WMS 1.3.0) formats.
   *
   * @param data - Capability section from GetCapabilities response
   * @returns Array of supported projection identifiers (EPSG codes)
   */
  private extractProjections(data: any): string[] {
    const layer = data.Layer;
    const capabilitiesList = layer.SRS ?? layer.CRS;
    const supportedSRS: string[] = [];
    if (capabilitiesList) {
      supportedSRS.push(...capabilitiesList);
    }
    return supportedSRS;
  }

  /**
   * Validates if a string is a valid URL.
   * 
   * @param url - String to validate as URL
   * @returns True if valid URL, false otherwise
   */
  private isValidUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extracts layer information from WMS capabilities.
   * Processes the layer hierarchy and creates cartography objects.
   *
   * @param capability - Capability section from GetCapabilities response
   * @returns WMSLayersCapabilities object containing layers and styles
   */
  private extractLayers(capability: any): WMSLayersCapabilities {
    try {
      const layerCapability = capability?.Layer;
      if (!layerCapability) {
        this.loggerService.warn('No Layer capability found in WMS response');
        return new WMSLayersCapabilities();
      }
      const layersTable = this.flatLayers(layerCapability)
        .filter(layer => layer.Name !== null && layer.Name !== undefined);
      
      if (layersTable.length === 0) {
        this.loggerService.warn('No valid layers found in WMS capabilities');
      } else {
        this.loggerService.debug(`Processing ${layersTable.length} WMS layers`);
      }
      
      const result = new WMSLayersCapabilities();
      layersTable.forEach(layer => {
        try {
          this.extractCartography(layer, result);
        } catch (error) {
          this.loggerService.error(`Failed to extract layer "${layer.Name}": ${error.message}`);
        }
      });
      return result;
    } catch (error) {
      this.loggerService.error('Error extracting layers from WMS capabilities', error);
      return new WMSLayersCapabilities();
    }
  }

  /**
   * Extracts cartography information from a WMS layer.
   * Creates a Cartography object with layer metadata and associated styles.
   *
   * @param layer - Layer object from GetCapabilities response
   * @param registry - WMSLayersCapabilities object to store results
   */
  private extractCartography(layer: any, registry: WMSLayersCapabilities) {
    const cartography = new Cartography();
    cartography.name = layer.Title;
    cartography.description = layer.Abstract;
    cartography.layers = [String(layer.Name)];

    if (layer.Style) {
      const styles: any[] = Array.isArray(layer.Style) ? layer.Style : [layer.Style];
      if (styles.length > 0) {
        const newStyles = styles
          .map(item => this.createStyle(item))
          .filter(style => style !== null);
        if (newStyles.length > 0) {
          newStyles[0].defaultStyle = true;
          cartography.legendURL = styles[0].LegendURL?.OnlineResource?.['xlink:href'];
          registry.styles.set(String(layer.Name), newStyles);
        }
      }
    }

    // Single string fields on cartography: keep first entry only when OGC repeats MetadataURL/DataURL.
    const metadataURL = Array.isArray(layer.MetadataURL)
      ? layer.MetadataURL[0]
      : layer.MetadataURL;
    cartography.metadataURL = metadataURL?.OnlineResource?.['xlink:href'];

    const dataURL = Array.isArray(layer.DataURL) ? layer.DataURL[0] : layer.DataURL;
    cartography.datasetURL = dataURL?.OnlineResource?.['xlink:href'];

    registry.layers.push(cartography);
  }

  /**
   * Flattens a hierarchical layer structure from WMS capabilities.
   * Recursively processes nested layers to create a flat array.
   *
   * @param layer - Root layer object that may contain nested layers
   * @returns Flat array of all layers in the hierarchy
   */
  private flatLayers(layer: any): any[] {
    if (!layer) {
      return [];
    }

    let result = [layer];

    if (layer.Layer) {
      const childLayers = Array.isArray(layer.Layer) ? layer.Layer : [layer.Layer];
      const flattenedChildren = childLayers.flatMap(child => this.flatLayers(child));
      result = result.concat(flattenedChildren);
    }

    return result;
  }

  /**
   * Creates a CartographyStyle object from a WMS style definition.
   * Extracts style metadata including name, title, and legend URL.
   *
   * @param style - Style object from WMS capabilities
   * @returns CartographyStyle object with style properties, or null if invalid
   */
  private createStyle(style: any): CartographyStyle | null {
    if (!style) {
      this.loggerService.warn('Encountered null or undefined style object');
      return null;
    }

    const newStyle = Object.assign(new CartographyStyle(), {
      name: style.Name,
      description: style.Abstract,
      title: style.Title
    });

    if (style.LegendURL?.OnlineResource) {
      let onlineResource: any;
      onlineResource = style.LegendURL.OnlineResource['xlink:href'] || 
                       style.LegendURL.OnlineResource['xlink:link'];
      
      if (onlineResource && !this.isValidUrl(onlineResource)) {
        this.loggerService.warn(`Invalid legend URL detected for style "${style.Name}": ${onlineResource}`);
        onlineResource = undefined;
      }

      newStyle.legendURL = {
        format: style.LegendURL.Format,
        onlineResource: onlineResource,
        height: style.LegendURL.height,
        width: style.LegendURL.width
      };
    }
    return newStyle;
  }
}
