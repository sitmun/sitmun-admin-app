import { Resource } from '@app/core/hal/resource/resource.model';

export class LiteralTranslationItem extends Resource {
  override id!: number;
  literal = '';
  translation: string | null = null;
  sourceLanguage = '';
  complete = false;

  static fromObject(value: Partial<LiteralTranslationItem>): LiteralTranslationItem {
    return Object.assign(new LiteralTranslationItem(), value);
  }
}
