import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeSelection, Selection } from '@tiptap/pm/state';

import { handlebarsBlockHtmlAttribute } from './handlebars-block.extension';
import { handlebarsExpressionHtmlAttribute } from './handlebars-expression.extension';
import { handlebarsSystemVariableHtmlAttribute, isSystemVariableMustache } from './handlebars-system-variable.extension';
import { htmlCommentHtmlAttribute } from './html-comment.extension';
import { PDF_REGION_CLASSES, PDF_REGION_NODE_TYPES } from './pdf-region.constants';

export const CHIP_SKIP_OPENERS = [
  { attr: handlebarsExpressionHtmlAttribute, openTag: 'span', closeTag: '</span>' },
  { attr: handlebarsSystemVariableHtmlAttribute, openTag: 'span', closeTag: '</span>' },
  { attr: handlebarsBlockHtmlAttribute, openTag: 'div', closeTag: '</div>' },
  { attr: htmlCommentHtmlAttribute, openTag: 'div', closeTag: '</div>' },
  { attr: handlebarsBlockHtmlAttribute, openTag: 'tr', closeTag: '</tr>' },
];

export function updateHtmlClass(value: string | null | undefined, add: string | null, remove: string[]): string | null {
  const classes = new Set((value || '').split(/\s+/).filter(Boolean));
  remove.forEach((className) => classes.delete(className));
  if (add) classes.add(add);
  return classes.size > 0 ? Array.from(classes).join(' ') : null;
}

export function resolveSelectedPdfRegionNode(selection: Selection): { node: ProseMirrorNode; pos: number } | null {
  if (selection instanceof NodeSelection && PDF_REGION_NODE_TYPES.has(selection.node.type.name)) {
    return { node: selection.node, pos: selection.from };
  }
  if (selection.$from.depth < 1) return null;
  for (let depth = selection.$from.depth; depth >= 1; depth--) {
    const node = selection.$from.node(depth);
    const classes = String(node.attrs['class'] || '').split(/\s+/);
    if (PDF_REGION_NODE_TYPES.has(node.type.name) && classes.some((className) => PDF_REGION_CLASSES.has(className))) {
      return { node, pos: selection.$from.before(depth) };
    }
  }
  for (let depth = selection.$from.depth; depth >= 1; depth--) {
    const node = selection.$from.node(depth);
    if (node.type.name === 'bulletList' || node.type.name === 'orderedList') {
      return { node, pos: selection.$from.before(depth) };
    }
  }
  for (let depth = selection.$from.depth; depth >= 1; depth--) {
    const node = selection.$from.node(depth);
    if (PDF_REGION_NODE_TYPES.has(node.type.name)) return { node, pos: selection.$from.before(depth) };
  }
  return null;
}

export function normalizeHandlebarsMarkup(html: string): string {
  return (html || '').replace(/\{\{\{[\s\S]*?\}\}\}|\{\{[\s\S]*?}}/g, (placeholder) => {
    if (/<\/?(?:p|div|section|article|table|thead|tbody|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|pre|br)\b/i.test(placeholder)) return placeholder;
    return placeholder.replace(/<[^>]+>/g, '');
  });
}

export function normalizeEditorColorValue(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const normalizedValue = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(normalizedValue)) return normalizedValue;
  const shortHexMatch = normalizedValue.match(/^#([0-9a-f]{3})$/i);
  if (shortHexMatch) return `#${shortHexMatch[1].split('').map((part) => `${part}${part}`).join('')}`;
  const rgbMatch = normalizedValue.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)$/i);
  if (rgbMatch) return `#${rgbMatch.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
  return fallback;
}

export function protectTableHandlebarsBlocks(html: string): string {
  return (html || '').replace(/(<(?:tbody|thead|tfoot)\b[^>]*>|<\/tr>)\s*(\{\{[#/][\s\S]*?}})\s*(?=<tr\b|<\/(?:tbody|thead|tfoot)>)/gi,
    (_match, previousTag: string, block: string) => `${previousTag}<tr ${handlebarsBlockHtmlAttribute}="${encodeURIComponent(block)}"><td><p>Handlebars block</p></td></tr>`);
}

export function protectSystemVariableMustaches(html: string): string {
  return transformHtmlTextSegments(html || '', (text) => protectMustachesInText(text, 'sysvar'));
}

export function editorHtmlHasUnprotectedMustaches(editorHtml: string): boolean {
  let found = false;
  transformHtmlTextSegments(editorHtml || '', (text) => {
    if (found) return text;
    let index = 0;
    while (index < text.length) {
      const mustacheStart = text.indexOf('{{', index);
      if (mustacheStart < 0) break;
      const mustache = readMustache(text, mustacheStart);
      if (!mustache) { index = mustacheStart + 2; continue; }
      found = true;
      break;
    }
    return text;
  });
  return found;
}

export function protectStructuralHandlebarsBlocks(html: string): string {
  return transformHtmlTextSegments(protectTableHandlebarsBlocks(html || ''), (text) => protectMustachesInText(text, 'structural'));
}

export function protectHandlebarsExpressions(html: string): string {
  return transformHtmlTextSegments(html || '', (text) => protectMustachesInText(text, 'expression'));
}

export function protectTemplateEditorHtml(html: string): string {
  return protectHtmlComments(transformHtmlTextSegments(protectTableHandlebarsBlocks(html || ''), (text) => protectMustachesInText(text, 'all')));
}

export function protectHtmlComments(html: string): string {
  return (html || '').replace(/<!--([\s\S]*?)-->/g, (full) => `<div ${htmlCommentHtmlAttribute}="${encodeURIComponent(full)}" class="sitmun-html-comment-node"></div>`);
}

export function restoreHandlebarsChipsFromHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  restoreHandlebarsChipsInDocument(doc);
  return restoreHtmlCommentMarkers(doc.body.innerHTML);
}

export function restoreHtmlCommentMarkers(html: string): string {
  return (html || '').replace(/<div\b[^>]*\bdata-sitmun-html-comment="([^"]*)"[^>]*>\s*<\/div>/gi, (_match, encoded: string) => decodeStoredAttribute(encoded));
}

export function restoreHandlebarsChipsInDocument(doc: Document): void {
  for (const row of Array.from(doc.body.querySelectorAll<HTMLTableRowElement>(`tr[${handlebarsBlockHtmlAttribute}]`))) row.replaceWith(doc.createTextNode(`\n${decodeStoredAttribute(row.getAttribute(handlebarsBlockHtmlAttribute))}\n`));
  for (const block of Array.from(doc.body.querySelectorAll<HTMLElement>(`div[${handlebarsBlockHtmlAttribute}]`))) block.replaceWith(doc.createTextNode(decodeStoredAttribute(block.getAttribute(handlebarsBlockHtmlAttribute))));
  for (const node of Array.from(doc.body.querySelectorAll<HTMLElement>(`span[${handlebarsSystemVariableHtmlAttribute}]`))) node.replaceWith(doc.createTextNode(decodeStoredAttribute(node.getAttribute(handlebarsSystemVariableHtmlAttribute))));
  for (const node of Array.from(doc.body.querySelectorAll<HTMLElement>(`span[${handlebarsExpressionHtmlAttribute}]`))) node.replaceWith(doc.createTextNode(decodeStoredAttribute(node.getAttribute(handlebarsExpressionHtmlAttribute))));
}

function decodeStoredAttribute(value: string | null): string {
  if (!value) return '';
  try { return decodeURIComponent(value); } catch { return value; }
}

type ProtectMode = 'sysvar' | 'structural' | 'expression' | 'all';

function protectMustachesInText(text: string, mode: ProtectMode): string {
  let result = '';
  let index = 0;
  while (index < text.length) {
    const mustacheStart = text.indexOf('{{', index);
    if (mustacheStart < 0) { result += text.slice(index); break; }
    result += text.slice(index, mustacheStart);
    const mustache = readMustache(text, mustacheStart);
    if (!mustache) { result += '{{'; index = mustacheStart + 2; continue; }
    result += chipMustache(mustache.value, mode);
    index = mustache.end;
  }
  return result;
}

function chipMustache(match: string, mode: ProtectMode): string {
  if (isSystemVariableMustache(match)) {
    if (mode === 'expression' || mode === 'structural') return match;
    return `<span ${handlebarsSystemVariableHtmlAttribute}="${encodeURIComponent(match)}" class="sitmun-handlebars-system-variable-node">${escapeHtml(match)}</span>`;
  }
  if (isStructuralMustache(match)) {
    if (mode === 'expression' || mode === 'sysvar') return match;
    return `<div ${handlebarsBlockHtmlAttribute}="${encodeURIComponent(match)}">${escapeHtml(match)}</div>`;
  }
  if (mode === 'sysvar' || mode === 'structural') return match;
  return `<span ${handlebarsExpressionHtmlAttribute}="${encodeURIComponent(match)}" class="sitmun-handlebars-expression-node">${escapeHtml(match)}</span>`;
}

function isStructuralMustache(match: string): boolean { return /^\{\{\s*(?:[#/]|else(?:\s+if\b)?)\b/i.test(match); }

export function readMustache(source: string, start: number): { value: string; end: number } | null {
  if (source.slice(start, start + 2) !== '{{') return null;
  let index = start + 2;
  const triple = source[index] === '{';
  if (triple) index += 1;
  let quote: '"' | "'" | null = null;
  while (index < source.length) {
    const char = source[index];
    if (quote) { if (char === '\\') index += 2; else { if (char === quote) quote = null; index += 1; } continue; }
    if (char === '"' || char === "'") { quote = char; index += 1; continue; }
    if (char === '}' && source[index + 1] === '}') {
      if (triple) { if (source[index + 2] === '}') return { value: source.slice(start, index + 3), end: index + 3 }; index += 1; continue; }
      return { value: source.slice(start, index + 2), end: index + 2 };
    }
    index += 1;
  }
  return null;
}

export function transformHtmlTextSegments(html: string, transformText: (text: string) => string): string {
  let result = '';
  let index = 0;
  const source = html || '';
  while (index < source.length) {
    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4);
      if (end < 0) { result += source.slice(index); break; }
      result += source.slice(index, end + 3); index = end + 3; continue;
    }
    if (source[index] === '<') {
      const chipSkip = matchChipSkip(source, index);
      if (chipSkip) { result += source.slice(index, chipSkip); index = chipSkip; continue; }
      if (/^<t\b/i.test(source.slice(index))) {
        const close = findClosingTag(source, index, 't');
        if (close > index) { result += source.slice(index, close); index = close; continue; }
      }
      const tagEnd = findTagEnd(source, index); result += source.slice(index, tagEnd); index = tagEnd; continue;
    }
    const nextTag = source.indexOf('<', index); const textEnd = nextTag < 0 ? source.length : nextTag;
    result += transformText(source.slice(index, textEnd)); index = textEnd;
  }
  return result;
}

function matchChipSkip(source: string, index: number): number | null {
  for (const chip of CHIP_SKIP_OPENERS) {
    const openMatch = new RegExp(`^<${chip.openTag}\\b[^>]*\\b${chip.attr}\\b[^>]*>`, 'i').exec(source.slice(index));
    if (!openMatch) continue;
    const afterOpen = index + openMatch[0].length;
    const closeIndex = source.toLowerCase().indexOf(chip.closeTag, afterOpen);
    return closeIndex < 0 ? source.length : closeIndex + chip.closeTag.length;
  }
  return null;
}

function findClosingTag(source: string, openIndex: number, tagName: string): number {
  const openEnd = findTagEnd(source, openIndex);
  if (source[openEnd - 2] === '/') return openEnd;
  const match = new RegExp(`</${tagName}\\s*>`, 'i').exec(source.slice(openEnd));
  return match ? openEnd + match.index + match[0].length : -1;
}

function findTagEnd(source: string, start: number): number {
  let quote: '"' | "'" | null = null;
  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (quote) { if (char === quote) quote = null; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '>') return index + 1;
  }
  return source.length;
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
