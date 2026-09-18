export const PDF_HEADER_CLASS = 'sitmun-pdf-header';
export const PDF_FOOTER_CLASS = 'sitmun-pdf-footer';
export const PDF_FULL_BLEED_HEADER_CLASS = 'sitmun-pdf-header-full-bleed';
export const PDF_FULL_BLEED_FOOTER_CLASS = 'sitmun-pdf-footer-full-bleed';

export const PDF_HEADER_CLASSES = new Set([PDF_HEADER_CLASS, PDF_FULL_BLEED_HEADER_CLASS]);
export const PDF_FOOTER_CLASSES = new Set([PDF_FOOTER_CLASS, PDF_FULL_BLEED_FOOTER_CLASS]);
export const PDF_REGION_CLASSES = new Set([...PDF_HEADER_CLASSES, ...PDF_FOOTER_CLASSES]);

export const PDF_REGION_NODE_TYPES = new Set([
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'table',
  'image',
]);

export const PDF_REGION_TAGS = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'table',
  'img',
]);
