import { Resource } from '@app/core/hal/resource/resource.model';

import {Cartography} from './cartography.model';

/** Format options stored in PGI_OPTIONS. Unknown keys are kept. */
export class FeatureInfoFormatOptions {
  public fractionDigits?: number | null;
  public padFractionDigits?: boolean | null;
  public dateStyle?: string | null;
  [key: string]: unknown;
}

/**
 * Copies stored options onto the fields the feature-information grid edits.
 */
export function withEditableFormatOptions<T extends CartographyParameter>(row: T): T {
  const options = row.options ?? {};
  row.fractionDigits = typeof options.fractionDigits === 'number' ? options.fractionDigits : null;
  row.padFractionDigits = options.padFractionDigits === true;
  row.dateStyle = typeof options.dateStyle === 'string' && options.dateStyle ? options.dateStyle : null;
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
  const copy = Object.assign(new CartographyParameter(), row) as T;
  copy.options = Object.keys(options).length ? options : null;
  delete copy.fractionDigits;
  delete copy.padFractionDigits;
  delete copy.dateStyle;
  return copy;
}

/**
 * Service parameter model
 */
export class CartographyParameter extends Resource {

  public override id: number;

  /** name*/
  public name: string;

  /** type*/
  public type: string;

  /** value*/
  public value: string;

  /** order*/
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

  /** cartography*/
  public cartography: Cartography;

}
