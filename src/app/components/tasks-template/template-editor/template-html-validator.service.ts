import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
}

const SELF_CLOSED_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

@Injectable({ providedIn: 'root' })
export class TemplateHtmlValidatorService {
  constructor(private readonly translateService: TranslateService) {}

  validate(html: string): TemplateValidationResult {
    const value = html || '';
    const errors: string[] = [];

    if (/<\s*script\b/i.test(value)) {
      errors.push(this.translateService.instant('entity.task.template.editor.validation.scriptTag'));
    }

    if (/<\s*style\b/i.test(value)) {
      errors.push(this.translateService.instant('entity.task.template.editor.validation.styleTag'));
    }

    const javascriptAttributes = Array.from(value.matchAll(/\s(on[a-z0-9:_-]+)\s*=/gi)).map((match) => match[1].toLowerCase());
    for (const attribute of new Set(javascriptAttributes)) {
      errors.push(this.translateService.instant('entity.task.template.editor.validation.javaScriptAttribute', { attribute }));
    }

    if (/\b(?:href|src)\s*=\s*(["'])\s*javascript:/i.test(value) || /\b(?:href|src)\s*=\s*javascript:/i.test(value)) {
      errors.push(this.translateService.instant('entity.task.template.editor.validation.javaScriptUrl'));
    }

    errors.push(...this.validateTagBalance(value));
    errors.push(...this.validateTranslationTagBalance(value));

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateTagBalance(html: string): string[] {
    const errors: string[] = [];
    const stack: string[] = [];
    const sanitized = html
      .replaceAll(/<!--([\s\S]*?)-->/g, '')
      .replaceAll(/\{\{[\s\S]*?}}/g, 'HANDLEBARS_PLACEHOLDER');
    const tagPattern = /<\s*(\/)?\s*([a-zA-Z][\w:-]*)([^<>]*?)(\/)?\s*>/g;

    let match: RegExpExecArray | null;
    while ((match = tagPattern.exec(sanitized)) !== null) {
      const isClosing = Boolean(match[1]);
      const tagName = match[2].toLowerCase();
      const isSelfClosing = Boolean(match[4]) || SELF_CLOSED_TAGS.has(tagName);

      if (isClosing) {
        const last = stack.pop();
        if (last !== tagName) {
          errors.push(this.translateService.instant('entity.task.template.editor.validation.unbalancedTag', { tag: tagName }));
          break;
        }
        continue;
      }

      if (!isSelfClosing) {
        stack.push(tagName);
      }
    }

    if (errors.length === 0 && stack.length > 0) {
      errors.push(this.translateService.instant('entity.task.template.editor.validation.unclosedTag', { tag: stack.at(-1) }));
    }

    return errors;
  }

  private validateTranslationTagBalance(html: string): string[] {
    const errors: string[] = [];
    const tagPattern = /<\s*(\/)?\s*t\b[^>]*>/gi;
    let nesting = 0;
    let match: RegExpExecArray | null;

    while ((match = tagPattern.exec(html)) !== null) {
      const isClosing = Boolean(match[1]);
      if (!isClosing) {
        if (nesting > 0) {
          errors.push(this.translateService.instant('entity.task.template.editor.validation.nestedT'));
          break;
        }
        nesting += 1;
        continue;
      }

      if (nesting === 0) {
        errors.push(this.translateService.instant('entity.task.template.editor.validation.unopenedT'));
        break;
      }
      nesting -= 1;
    }

    if (errors.length === 0 && nesting > 0) {
      errors.push(this.translateService.instant('entity.task.template.editor.validation.unclosedT'));
    }

    return errors;
  }
}
