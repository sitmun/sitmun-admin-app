import { Resource } from '@app/core/hal/resource/resource.model';

import {Cartography} from './cartography.model';

/** Format options stored in PGI_OPTIONS. Unknown keys are kept. */
export class FeatureInfoFormatOptions {
  public fractionDigits?: number | null;
  public padFractionDigits?: boolean | null;
  public dateStyle?: string | null;
  public maxWidth?: number | null;
  public maxHeight?: number | null;
  [key: string]: unknown;
}

function imageLimit(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }
  return null;
}

/**
 * Copies stored options onto the fields the feature-information grid edits.
 */
export function withEditableFormatOptions<T extends CartographyParameter>(row: T): T {
  const options = row.options ?? {};
  row.fractionDigits = typeof options.fractionDigits === 'number' ? options.fractionDigits : null;
  row.padFractionDigits = options.padFractionDigits === true;
  row.dateStyle = typeof options.dateStyle === 'string' && options.dateStyle ? options.dateStyle : null;
  row.maxWidth = imageLimit(options.maxWidth);
  row.maxHeight = imageLimit(options.maxHeight);
  return row;
}

/**
 * Returns a copy whose options JSON matches the grid, without the grid-only fields.
 */
export function persistedCartographyParameter<T extends CartographyParameter>(row: T): T {
  const options: FeatureInfoFormatOptions = {...(row.options ?? {})};
  if (typeof row.fractionDigits === 'number') {
    options.fractionDigits = row.fractionDigits;
  } else {
    delete options.fractionDigits;
  }
  if (row.padFractionDigits === true) {
    options.padFractionDigits = true;
  } else {
    delete options.padFractionDigits;
  }
  if (typeof row.dateStyle === 'string' && row.dateStyle) {
    options.dateStyle = row.dateStyle;
  } else {
    delete options.dateStyle;
  }
  const maxWidth = imageLimit(row.maxWidth);
  const maxHeight = imageLimit(row.maxHeight);
  if (maxWidth == null) {
    delete options.maxWidth;
  } else {
    options.maxWidth = maxWidth;
  }
  if (maxHeight == null) {
    delete options.maxHeight;
  } else {
    options.maxHeight = maxHeight;
  }
  const copy = Object.assign(new CartographyParameter(), row) as T;
  copy.options = Object.keys(options).length ? options : null;
  delete copy.fractionDigits;
  delete copy.padFractionDigits;
  delete copy.dateStyle;
  delete copy.maxWidth;
  delete copy.maxHeight;
  return copy;
}

/**
 * Service parameter model
 */
export class CartographyParameter extends Resource {

  public override id: number;

  public name: string;

  public type: string;

  /** value*/
  public value: string;

  public order: string;

  /** format*/
  public format: string;

  /** format options persisted as JSON*/
  public options?: FeatureInfoFormatOptions | null;

  /** fraction digits for N and P. Grid field; persisted inside options.*/
  public fractionDigits: number;

  /** pad fraction digits for N and P*/
  public padFractionDigits: boolean;

  /** date or datetime for F*/
  public dateStyle: string;

  /** maximum image width in pixels for I. Grid field; persisted inside options.*/
  public maxWidth: number | null;

  /** maximum image height in pixels for I. Grid field; persisted inside options.*/
  public maxHeight: number | null;

  /** cartography*/
  public cartography: Cartography;

}
