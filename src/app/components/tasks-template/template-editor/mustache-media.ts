/** True when a media src is a Handlebars mustache (should not load as a URL in the editor). */
export function isMustacheMediaSrc(src: string | null | undefined): boolean {
  return typeof src === 'string' && /\{\{[\s\S]*?\}\}/.test(src.trim());
}

/** Visual-only placeholder; serialize still uses renderHTML with literal attrs. */
export function createMustacheMediaPlaceholder(kind: 'img' | 'iframe', src: string): HTMLElement {
  const placeholder = document.createElement('div');
  placeholder.className = 'sitmun-mustache-media-placeholder';
  placeholder.setAttribute('data-sitmun-mustache-media', kind);
  placeholder.contentEditable = 'false';

  const icon = document.createElement('span');
  icon.className = 'sitmun-mustache-media-placeholder__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = kind === 'img' ? 'img' : 'iframe';

  const label = document.createElement('code');
  label.className = 'sitmun-mustache-media-placeholder__src';
  label.textContent = src;

  placeholder.appendChild(icon);
  placeholder.appendChild(label);
  return placeholder;
}
