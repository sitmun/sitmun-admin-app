import {
  encodeHtmlComment,
  htmlCommentToMarker,
  readHtmlComment,
  rewritePlantillaHtml,
} from './template-html-rewrite';

describe('template-html-rewrite', () => {
  it('reads a closed comment including interior tags', () => {
    const source = '<!-- <p>x</p> --><p>y</p>';
    const comment = readHtmlComment(source, 0);
    expect(comment).toEqual({
      kind: 'closed',
      authored: '<!-- <p>x</p> -->',
      encoded: '<!-- <p>x</p> -->',
    });
  });

  it('recovers an unclosed comment at the next real tag', () => {
    const source = '<!-- tip <p>AFTER</p>';
    const comment = readHtmlComment(source, 0);
    expect(comment?.kind).toBe('recovered');
    expect(comment?.authored).toBe('<!-- tip ');
    expect(comment?.encoded).toBe('<!-- tip -->');
  });

  it('keeps mustaches in a recovered comment and stops before the following tag', () => {
    const comment = readHtmlComment('<!-- {{foto.url}} <p>{{x}}</p>', 0);
    expect(comment?.kind).toBe('recovered');
    expect(comment?.authored).toBe('<!-- {{foto.url}} ');
    expect(comment?.authored).not.toContain('<p>');
  });

  it('treats a < b as comment text, not a tag bound', () => {
    const comment = readHtmlComment('<!-- a < b <p>AFTER</p>', 0);
    expect(comment?.kind).toBe('recovered');
    expect(comment?.authored).toBe('<!-- a < b ');
  });

  it('heals near-miss closers without treating -> as a scanner bound', () => {
    expect(encodeHtmlComment('<!-- tip ->')).toBe('<!-- tip -->');
    expect(encodeHtmlComment('<!-- tip -- >')).toBe('<!-- tip -->');
    expect(encodeHtmlComment('<!-- tip --!>')).toBe('<!-- tip -->');
    expect(encodeHtmlComment('<!-- tip')).toBe('<!-- tip-->');
    expect(readHtmlComment('<!-- x -> y -->', 0)?.kind).toBe('closed');
  });

  it('wraps recovered comments as markers and leaves following tags', () => {
    const rewritten = rewritePlantillaHtml('<p>BEFORE</p><!-- tip -- ><p>AFTER</p>', {
      onText: (text) => text,
      onComment: htmlCommentToMarker,
    });
    expect(rewritten).toContain('data-sitmun-html-comment=');
    expect(rewritten).not.toContain('<!--');
    expect(rewritten).toContain('<p>AFTER</p>');
    expect(rewritten).toContain('<p>BEFORE</p>');
  });
});
