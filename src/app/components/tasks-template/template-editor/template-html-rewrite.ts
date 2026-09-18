import { handlebarsBlockHtmlAttribute } from './handlebars-block.extension';
import { handlebarsExpressionHtmlAttribute } from './handlebars-expression.extension';
import { handlebarsSystemVariableHtmlAttribute } from './handlebars-system-variable.extension';
import { htmlCommentHtmlAttribute } from './html-comment.extension';

export type WellFormedHtmlComment = string & { readonly __wellFormedHtmlComment: unique symbol };

export type HtmlComment =
  | {
      readonly kind: 'closed';
      readonly authored: WellFormedHtmlComment;
      readonly encoded: WellFormedHtmlComment;
    }
  | {
      readonly kind: 'recovered';
      readonly authored: string;
      readonly encoded: WellFormedHtmlComment;
    };

export type PlantillaHtmlHandlers = {
  readonly onText: (text: string) => string;
  readonly onComment: (comment: HtmlComment) => string;
};

const CHIP_SKIP_OPENERS: Array<{ attr: string; openTag: string; closeTag: string }> = [
  { attr: handlebarsExpressionHtmlAttribute, openTag: 'span', closeTag: '</span>' },
  { attr: handlebarsSystemVariableHtmlAttribute, openTag: 'span', closeTag: '</span>' },
  { attr: handlebarsBlockHtmlAttribute, openTag: 'div', closeTag: '</div>' },
  { attr: htmlCommentHtmlAttribute, openTag: 'div', closeTag: '</div>' },
  { attr: handlebarsBlockHtmlAttribute, openTag: 'tr', closeTag: '</tr>' },
];

function brandWellFormedComment(value: string): WellFormedHtmlComment {
  return value as WellFormedHtmlComment;
}

export function encodeHtmlComment(authored: string): WellFormedHtmlComment {
  if (authored.endsWith('-->')) {
    return brandWellFormedComment(authored);
  }
  if (authored.endsWith('--!>')) {
    return brandWellFormedComment(`${authored.slice(0, -4)}-->`);
  }
  const whitespaceClose = authored.match(/^(.*)--\s+>$/s);
  if (whitespaceClose) {
    return brandWellFormedComment(`${whitespaceClose[1]}-->`);
  }
  if (authored.endsWith('->')) {
    return brandWellFormedComment(`${authored.slice(0, -2)}-->`);
  }
  return brandWellFormedComment(`${authored}-->`);
}

function findNextTagStart(source: string, from: number): number {
  let search = from;
  while (search < source.length) {
    const lt = source.indexOf('<', search);
    if (lt < 0) {
      return -1;
    }
    const next = source[lt + 1];
    if (next && /[A-Za-z/]/.test(next)) {
      return lt;
    }
    search = lt + 1;
  }
  return -1;
}

export function readHtmlComment(source: string, index: number): HtmlComment | null {
  if (!source.startsWith('<!--', index)) {
    return null;
  }

  const canonicalEnd = source.indexOf('-->', index + 4);
  if (canonicalEnd >= 0) {
    const authored = brandWellFormedComment(source.slice(index, canonicalEnd + 3));
    return { kind: 'closed', authored, encoded: authored };
  }

  const tagStart = findNextTagStart(source, index + 4);
  const end = tagStart >= 0 ? tagStart : source.length;
  const authored = source.slice(index, end);
  return { kind: 'recovered', authored, encoded: encodeHtmlComment(authored) };
}

export function htmlCommentToMarker(comment: HtmlComment): string {
  switch (comment.kind) {
    case 'closed':
    case 'recovered':
      return `<div ${htmlCommentHtmlAttribute}="${encodeURIComponent(comment.encoded)}" class="sitmun-html-comment-node"></div>`;
    default: {
      const unexpected: never = comment;
      return unexpected;
    }
  }
}

export function rewritePlantillaHtml(html: string, handlers: PlantillaHtmlHandlers): string {
  let result = '';
  let index = 0;
  const source = html || '';

  while (index < source.length) {
    if (source.startsWith('<!--', index)) {
      const comment = readHtmlComment(source, index);
      if (!comment) {
        result += source[index];
        index += 1;
        continue;
      }
      result += handlers.onComment(comment);
      index += comment.authored.length;
      continue;
    }

    if (source[index] === '<') {
      const chipSkip = matchChipSkip(source, index);
      if (chipSkip) {
        result += source.slice(index, chipSkip);
        index = chipSkip;
        continue;
      }

      if (/^<t\b/i.test(source.slice(index))) {
        const close = findClosingTag(source, index, 't');
        if (close > index) {
          result += source.slice(index, close);
          index = close;
          continue;
        }
      }

      const tagEnd = findTagEnd(source, index);
      result += source.slice(index, tagEnd);
      index = tagEnd;
      continue;
    }

    const nextTag = source.indexOf('<', index);
    const textEnd = nextTag < 0 ? source.length : nextTag;
    result += handlers.onText(source.slice(index, textEnd));
    index = textEnd;
  }

  return result;
}

export function stripPlantillaHtmlComments(html: string): string {
  return rewritePlantillaHtml(html || '', {
    onText: (text) => text,
    onComment: () => '',
  });
}

function matchChipSkip(source: string, index: number): number | null {
  for (const chip of CHIP_SKIP_OPENERS) {
    const openPattern = new RegExp(`^<${chip.openTag}\\b[^>]*\\b${chip.attr}\\b[^>]*>`, 'i');
    const openMatch = openPattern.exec(source.slice(index));
    if (!openMatch) {
      continue;
    }
    const afterOpen = index + openMatch[0].length;
    const closeIndex = source.toLowerCase().indexOf(chip.closeTag, afterOpen);
    if (closeIndex < 0) {
      return source.length;
    }
    return closeIndex + chip.closeTag.length;
  }
  return null;
}

function findClosingTag(source: string, openIndex: number, tagName: string): number {
  const openEnd = findTagEnd(source, openIndex);
  if (source[openEnd - 2] === '/') {
    return openEnd;
  }
  const closePattern = new RegExp(`</${tagName}\\s*>`, 'i');
  const rest = source.slice(openEnd);
  const match = closePattern.exec(rest);
  return match ? openEnd + match.index + match[0].length : -1;
}

function findTagEnd(source: string, start: number): number {
  let quote: '"' | "'" | null = null;
  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '>') {
      return index + 1;
    }
  }
  return source.length;
}
