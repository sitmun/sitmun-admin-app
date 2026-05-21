import { TestBed } from '@angular/core/testing';

import { normalizeHandlebarsMarkup, TemplateEditorComponent } from './template-editor.component';

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;

  const mockRect = (element: HTMLElement, rect: { left: number; top: number; width: number; height: number; }) => {
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      x: rect.left,
      y: rect.top,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      toJSON: () => '',
    } as DOMRect);
  };

  const configureVisualEditorHost = (root?: HTMLElement) => {
    const host = document.createElement('div');
    Object.defineProperty(host, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(host, 'scrollLeft', { value: 0, writable: true });
    mockRect(host, { left: 20, top: 10, width: 600, height: 400 });
    (component as any).editorHost = { nativeElement: host };
    const surface = document.createElement('div');
    Object.defineProperty(surface, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(surface, 'scrollLeft', { value: 0, writable: true });
    mockRect(surface, { left: 10, top: 5, width: 640, height: 420 });
    (component as any).visualSurface = { nativeElement: surface };
    surface.appendChild(host);
    if (root) {
      (component as any).quill = {
        getModule: () => ({ hideTools: jest.fn() }),
        root,
      };
      host.appendChild(root);
    }
    return host;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateEditorComponent],
    });

    component = new TemplateEditorComponent();
    component.html = '<p>Hello</p>';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should strip html tags from inside Handlebars placeholders', () => {
    expect(
      normalizeHandlebarsMarkup(
        '<p><strong>hola</strong> {{task_32281.<span style="color:red">geometryType</span>}}</p>',
      ),
    ).toBe('<p><strong>hola</strong> {{task_32281.geometryType}}</p>');
  });

  it('should not merge paragraphs when a typed Handlebars opener reaches a later closer', () => {
    const html = '<p>1-hola</p><p>{{</p><p>2-que tal</p><p>}}</p>';

    expect(normalizeHandlebarsMarkup(html)).toBe(html);
  });

  it('should allow switching to html source mode', () => {
    expect(component.editorMode).toBe('visual');

    component.setEditorMode('html');

    expect(component.editorMode).toBe('html');
    expect(component.htmlSource).toBe('<p>Hello</p>');
  });

  it('should emit raw html edits in source mode', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));
    component.setEditorMode('html');

    component.onHtmlSourceChanged('<p>Hello</p><iframe src="https://example.com"></iframe>');

    expect(component.htmlSource).toContain('<iframe');
    expect(emitted).toEqual(['<p>Hello</p><iframe src="https://example.com"></iframe>']);
  });

  it('should not emit duplicated html source changes when content is unchanged', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));
    component.setEditorMode('html');

    component.onHtmlSourceChanged('<p>Hello</p>');

    expect(emitted).toEqual([]);
  });

  it('should serialize the editor DOM html to preserve table resize metadata', () => {
    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      getSemanticHTML: () => '<table><tbody><tr><td>Clean</td></tr></tbody></table>',
      root: {
        innerHTML: '<table class="ql-table-better" style="width: 640px"><colgroup><col style="width: 240px"></colgroup><tbody><tr><td>Styled</td></tr></tbody></table>',
      },
    };

    expect((component as any).getEditorHtml())
      .toBe('<table class="ql-table-better" style="width: 640px"><colgroup><col style="width: 240px"></colgroup><tbody><tr><td>Styled</td></tr></tbody></table>');
  });

  it('should sync live editor DOM when switching to html source mode', () => {
    component.htmlSource = '<p>Old</p>';
    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      root: {
        innerHTML: '<table class="ql-table-better"><colgroup><col width="260"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>',
      },
    };

    component.setEditorMode('html');

    expect(component.htmlSource)
      .toBe('<table class="ql-table-better"><colgroup><col width="260"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>');
  });

  it('should emit live editor DOM changes that do not trigger Quill text-change', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));
    component.htmlSource = '<p>Old</p>';
    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      root: {
        innerHTML: '<table class="ql-table-better"><colgroup><col width="300"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>',
      },
    };

    (component as any).syncHtmlSourceFromEditorDom();

    expect(emitted).toEqual([
      '<table class="ql-table-better"><colgroup><col width="300"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>',
    ]);
  });

  it('should select a directly clicked image and match the overlay to its rendered rect', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', 'https://example.com/image.png');
    root.appendChild(image);
    configureVisualEditorHost(root);
    mockRect(image, { left: 70, top: 45, width: 180, height: 120 });

    component.onEditorHostClick({ target: image } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toEqual({ tagName: 'img' });
    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 180,
      height: 120,
    });
  });

  it('should select a directly clicked iframe and match the overlay to its rendered rect', () => {
    const root = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://example.com/doc.pdf');
    root.appendChild(iframe);
    configureVisualEditorHost(root);
    mockRect(iframe, { left: 80, top: 60, width: 260, height: 190 });

    component.onEditorHostClick({ target: iframe } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toEqual({ tagName: 'iframe' });

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'iframe',
      top: 55,
      left: 70,
      width: 260,
      height: 190,
    });
  });

  it('should select an iframe from parent click coordinates when iframe content does not bubble clicks', () => {
    const root = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://example.com/doc.pdf');
    root.appendChild(iframe);
    configureVisualEditorHost(root);
    mockRect(iframe, { left: 80, top: 60, width: 260, height: 190 });

    component.onEditorHostClick({
      target: root,
      clientX: 120,
      clientY: 90,
    } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toEqual({ tagName: 'iframe' });
    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'iframe',
      top: 55,
      left: 70,
      width: 260,
      height: 190,
    });
  });

  it('should position the resize overlay relative to the visual surface context', () => {
    const image = document.createElement('img');
    configureVisualEditorHost();
    mockRect(image, { left: 70, top: 45, width: 180, height: 120 });

    component.selectVisualElement(image);

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 180,
      height: 120,
    });
  });

  it('should refresh the resize overlay when the editor surface scrolls or window resizes', () => {
    const image = document.createElement('img');
    const host = configureVisualEditorHost();
    const surface = (component as any).visualSurface.nativeElement as HTMLDivElement;
    mockRect(image, { left: 70, top: 45, width: 180, height: 120 });

    component.selectVisualElement(image);
    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 180,
      height: 120,
    });

    surface.scrollTop = 30;
    surface.scrollLeft = 15;
    host.dispatchEvent(new Event('scroll'));

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 70,
      left: 75,
      width: 180,
      height: 120,
    });

    mockRect(surface, { left: 20, top: 15, width: 640, height: 420 });
    window.dispatchEvent(new Event('resize'));

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 60,
      left: 65,
      width: 180,
      height: 120,
    });
  });

  it('should not select an embed when clicking its wrapper instead of the element', () => {
    const root = document.createElement('div');
    const wrapper = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://example.com/doc.pdf');
    iframe.setAttribute('width', '260');
    iframe.setAttribute('height', '190');
    wrapper.appendChild(iframe);
    root.appendChild(wrapper);
    configureVisualEditorHost(root);
    mockRect(wrapper, { left: 40, top: 30, width: 12, height: 12 });
    mockRect(iframe, { left: 90, top: 60, width: 260, height: 190 });

    component.onEditorHostClick({ target: wrapper } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
  });

  it('should refresh overlay from the actual rendered element rect when drag resize ends', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', 'https://example.com/image.png');
    root.appendChild(image);
    configureVisualEditorHost(root);
    const rectSpy = jest.spyOn(image, 'getBoundingClientRect');
    rectSpy.mockReturnValueOnce({
      x: 70, y: 45, left: 70, top: 45, width: 180, height: 120, right: 250, bottom: 165, toJSON: () => '',
    } as DOMRect);
    rectSpy.mockReturnValueOnce({
      x: 72, y: 48, left: 72, top: 48, width: 255, height: 188, right: 327, bottom: 236, toJSON: () => '',
    } as DOMRect);

    component.selectVisualElement(image);
    (component as any).startVisualResize({ clientX: 250, clientY: 165, preventDefault: jest.fn(), stopPropagation: jest.fn() });
    (component as any).updateVisualResize({ clientX: 330, clientY: 235 });
    (component as any).endVisualResize();

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 43,
      left: 62,
      width: 255,
      height: 188,
    });
  });

  it('should keep a resized broken template image visual box at the applied dimensions', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', '{{task_32317.contentUrl}}');
    root.appendChild(image);
    configureVisualEditorHost(root);
    const rectSpy = jest.spyOn(image, 'getBoundingClientRect');
    rectSpy.mockReturnValue({
      x: 70, y: 45, left: 70, top: 45, width: 16, height: 16, right: 86, bottom: 61, toJSON: () => '',
    } as DOMRect);

    component.selectVisualElement(image);
    (component as any).startVisualResize({ clientX: 86, clientY: 61, preventDefault: jest.fn(), stopPropagation: jest.fn() });
    (component as any).updateVisualResize({ clientX: 310, clientY: 205 });
    (component as any).endVisualResize();

    expect(image.getAttribute('width')).toBe('240');
    expect(image.getAttribute('height')).toBe('160');
    expect(image.style.width).toBe('240px');
    expect(image.style.height).toBe('160px');
    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 240,
      height: 160,
    });
  });

  it('should use applied image width when a broken image keeps a narrower alt-text rect', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', '{{task_32317.contentUrl}}');
    image.setAttribute('width', '240');
    image.setAttribute('height', '160');
    image.style.width = '240px';
    image.style.height = '160px';
    root.appendChild(image);
    configureVisualEditorHost(root);
    mockRect(image, { left: 70, top: 45, width: 118, height: 160 });

    component.selectVisualElement(image);

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 240,
      height: 160,
    });
  });

  it('should use applied image width and measured height when only width is set on a broken template image', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', '{{task_32317.contentUrl}}');
    image.setAttribute('width', '240');
    image.style.width = '240px';
    root.appendChild(image);
    configureVisualEditorHost(root);
    mockRect(image, { left: 70, top: 45, width: 118, height: 72 });

    component.selectVisualElement(image);

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 240,
      height: 72,
    });
  });

  it('should use measured width and applied height when only height is set on a broken template image', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', '{{task_32317.contentUrl}}');
    image.setAttribute('height', '160');
    image.style.height = '160px';
    root.appendChild(image);
    configureVisualEditorHost(root);
    mockRect(image, { left: 70, top: 45, width: 118, height: 16 });

    component.selectVisualElement(image);

    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 118,
      height: 160,
    });
  });

  it('should not select an unrelated embed from a higher ancestor subtree', () => {
    const root = document.createElement('div');
    const embedWrapper = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://example.com/doc.pdf');
    embedWrapper.appendChild(iframe);

    const textWrapper = document.createElement('div');
    const unrelatedText = document.createElement('span');
    unrelatedText.textContent = 'plain text';
    textWrapper.appendChild(unrelatedText);

    root.appendChild(embedWrapper);
    root.appendChild(textWrapper);
    configureVisualEditorHost(root);

    component.onEditorHostClick({ target: unrelatedText } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
  });

  it('should not select an embed when clicking a mixed container that also contains caption/content', () => {
    const root = document.createElement('div');
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const caption = document.createElement('figcaption');
    const captionText = document.createElement('span');

    image.setAttribute('src', 'https://example.com/image.png');
    captionText.textContent = 'caption';
    caption.appendChild(captionText);
    figure.appendChild(image);
    figure.appendChild(caption);
    root.appendChild(figure);
    configureVisualEditorHost(root);

    component.onEditorHostClick({ target: figure } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
  });

  it('should not select an embed when wrapper contains non-empty text nodes mixed with the embed', () => {
    const root = document.createElement('div');
    const wrapper = document.createElement('div');
    const image = document.createElement('img');

    wrapper.appendChild(document.createTextNode('texto '));
    image.setAttribute('src', 'https://example.com/image.png');
    wrapper.appendChild(image);
    root.appendChild(wrapper);
    configureVisualEditorHost(root);

    component.onEditorHostClick({ target: wrapper } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
  });

  it('should not select an embed when a nested wrapper path contains non-empty text nodes', () => {
    const root = document.createElement('div');
    const outerWrapper = document.createElement('div');
    const innerWrapper = document.createElement('span');
    const image = document.createElement('img');

    innerWrapper.appendChild(document.createTextNode('texto '));
    image.setAttribute('src', 'https://example.com/image.png');
    innerWrapper.appendChild(image);
    outerWrapper.appendChild(innerWrapper);
    root.appendChild(outerWrapper);
    configureVisualEditorHost(root);

    component.onEditorHostClick({ target: outerWrapper } as unknown as MouseEvent);

    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
  });

  it('should resize a selected image from the visual resize handle', () => {
    const emitted: string[] = [];
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', 'https://example.com/image.png');
    root.appendChild(image);
    component.htmlChange.subscribe((value) => emitted.push(value));
    configureVisualEditorHost(root);
    const rectSpy = jest.spyOn(image, 'getBoundingClientRect');
    rectSpy.mockReturnValueOnce({
      x: 70, y: 45, left: 70, top: 45, width: 180, height: 120, right: 250, bottom: 165, toJSON: () => '',
    } as DOMRect);
    rectSpy.mockReturnValueOnce({
      x: 70, y: 45, left: 70, top: 45, width: 240, height: 160, right: 310, bottom: 205, toJSON: () => '',
    } as DOMRect);

    component.selectVisualElement(image);
    (component as any).startVisualResize({ clientX: 250, clientY: 165, preventDefault: jest.fn(), stopPropagation: jest.fn() });
    (component as any).updateVisualResize({ clientX: 310, clientY: 205 });
    (component as any).endVisualResize();

    expect(image.getAttribute('width')).toBe('240');
    expect(image.getAttribute('height')).toBe('160');
    expect(component.selectedVisualElement).toEqual({ tagName: 'img' });
    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 240,
      height: 160,
    });
    expect(component.htmlSource).toBe('<img src="https://example.com/image.png" width="240" height="160" style="width: 240px; height: 160px;">');
    expect(emitted).toEqual(['<img src="https://example.com/image.png" width="240" height="160" style="width: 240px; height: 160px;">']);
  });

  it('should resize a selected iframe from the visual resize handle', () => {
    const emitted: string[] = [];
    const root = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://example.com/doc.pdf');
    iframe.style.width = '320px';
    iframe.style.height = '180px';
    root.appendChild(iframe);
    component.htmlChange.subscribe((value) => emitted.push(value));
    configureVisualEditorHost(root);
    mockRect(iframe, { left: 80, top: 60, width: 200, height: 140 });

    component.selectVisualElement(iframe);
    (component as any).startVisualResize({ clientX: 280, clientY: 200, preventDefault: jest.fn(), stopPropagation: jest.fn() });
    (component as any).updateVisualResize({ clientX: 340, clientY: 250 });
    (component as any).endVisualResize();

    expect(iframe.getAttribute('width')).toBe('260');
    expect(iframe.getAttribute('height')).toBe('190');
    expect(iframe.style.width).toBe('260px');
    expect(iframe.style.height).toBe('190px');
    expect(component.htmlSource).toBe('<iframe src="https://example.com/doc.pdf" style="width: 260px; height: 190px;" width="260" height="190"></iframe>');
    expect(emitted).toEqual(['<iframe src="https://example.com/doc.pdf" style="width: 260px; height: 190px;" width="260" height="190"></iframe>']);
  });

  it('should remove the selected visual element on delete and sync html source', () => {
    const emitted: string[] = [];
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', '{{task_32317.contentUrl}}');
    image.setAttribute('width', '240');
    image.setAttribute('height', '160');
    root.appendChild(document.createTextNode('Before'));
    root.appendChild(image);
    root.appendChild(document.createTextNode('After'));
    component.htmlSource = root.innerHTML;
    component.htmlChange.subscribe((value) => emitted.push(value));
    configureVisualEditorHost(root);
    mockRect(image, { left: 70, top: 45, width: 240, height: 160 });
    component.selectVisualElement(image);

    component.onEditorHostKeydown({ key: 'Delete', preventDefault: jest.fn(), stopPropagation: jest.fn() } as unknown as KeyboardEvent);

    expect(root.querySelector('img')).toBeNull();
    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
    expect(component.htmlSource).toBe('BeforeAfter');
    expect(emitted).toEqual(['BeforeAfter']);
  });

  it('should not expose manual width and height panel actions', () => {
    expect((component as any).applySelectedElementDimensions).toBeUndefined();
    expect((component as any).applyIframePreset).toBeUndefined();
    expect((component as any).selectedElementWidth).toBeUndefined();
    expect((component as any).selectedElementHeight).toBeUndefined();
  });

  it('should update image inline width and height styles when drag resizing', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', 'https://example.com/image.png');
    image.style.width = '320px';
    image.style.height = '180px';
    root.appendChild(image);
    configureVisualEditorHost(root);
    mockRect(image, { left: 70, top: 45, width: 180, height: 120 });

    component.selectVisualElement(image);
    (component as any).startVisualResize({ clientX: 250, clientY: 165, preventDefault: jest.fn(), stopPropagation: jest.fn() });
    (component as any).updateVisualResize({ clientX: 310, clientY: 205 });

    expect(image.getAttribute('width')).toBe('240');
    expect(image.getAttribute('height')).toBe('160');
    expect(image.style.width).toBe('240px');
    expect(image.style.height).toBe('160px');
  });

  it('should clear selected element state when switching to html mode', () => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '600');
    configureVisualEditorHost();
    mockRect(iframe, { left: 80, top: 60, width: 200, height: 140 });

    component.selectVisualElement(iframe);
    expect((component as any).resizeOverlay).toBeTruthy();
    component.setEditorMode('html');

    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
  });

  it('should clear selected element state when reloading editor content', () => {
    const iframe = document.createElement('iframe');
    const convert = jest.fn().mockReturnValue({ ops: [] });
    const setContents = jest.fn();
    const updateContents = jest.fn();
    (component as any).quill = {
      clipboard: { convert },
      setContents,
      updateContents,
    };
    configureVisualEditorHost();
    mockRect(iframe, { left: 80, top: 60, width: 200, height: 140 });

    component.selectVisualElement(iframe);
    expect((component as any).resizeOverlay).toBeTruthy();

    (component as any).loadHtmlIntoEditor('<p>Reloaded</p>');

    expect(component.selectedVisualElement).toBeNull();
    expect((component as any).resizeOverlay).toBeNull();
    expect(convert).toHaveBeenCalledWith({ html: '<p>Reloaded</p>' });
    expect(setContents).toHaveBeenCalledWith([], 'silent');
    expect(updateContents).toHaveBeenCalledWith({ ops: [] }, 'silent');
  });

  it('should replace unresolved template image and iframe sources with editor placeholders', () => {
    const root = document.createElement('div');
    root.innerHTML = [
      '<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" width="240" height="160">',
      '<iframe src="{{task_32315.contentUrl}}" title="Documento PDF" width="320" height="360"></iframe>',
    ].join('');

    (component as any).applyEditorOnlyTemplatePlaceholders(root);

    const image = root.querySelector('img') as HTMLImageElement;
    const iframe = root.querySelector('iframe') as HTMLIFrameElement;
    const imageWrapper = image.parentElement as HTMLElement;
    const imageLabel = imageWrapper.querySelector('[data-sitmun-template-placeholder-label="img"]') as HTMLElement;

    expect(image.getAttribute('src')).toContain('data:image/gif');
    expect(image.getAttribute('src')).not.toContain('data:image/svg+xml');
    expect(image.getAttribute('data-sitmun-original-src')).toBe('{{task_32317.contentUrl}}');
    expect(image.getAttribute('data-sitmun-template-placeholder')).toBe('img');
    expect(imageWrapper.getAttribute('data-sitmun-template-placeholder-wrapper')).toBe('img');
    expect(imageLabel.textContent).toContain('sitmun logo (mime image)');
    expect(iframe.getAttribute('src')).toBe('about:blank');
    expect(iframe.getAttribute('srcdoc')).toContain('Documento PDF');
    expect(iframe.getAttribute('data-sitmun-original-src')).toBe('{{task_32315.contentUrl}}');
    expect(iframe.getAttribute('data-sitmun-template-placeholder')).toBe('iframe');
  });

  it('should keep unresolved placeholder label text at fixed 12px size', () => {
    const root = document.createElement('div');
    root.innerHTML = '<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" width="480" height="320">';

    (component as any).applyEditorOnlyTemplatePlaceholders(root);

    const image = root.querySelector('img') as HTMLImageElement;
    const imageWrapper = image.parentElement as HTMLElement;
    const imageLabel = imageWrapper.querySelector('[data-sitmun-template-placeholder-label="img"]') as HTMLElement;

    expect(imageLabel.getAttribute('style')).toContain('font-size: 12px');
    expect(image.getAttribute('src')).not.toContain('data:image/svg+xml');
  });

  it('should restore original unresolved template sources when serializing editor html', () => {
    const root = document.createElement('div');
    root.innerHTML = [
      '<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" width="240" height="160">',
      '<iframe src="{{task_32315.contentUrl}}" title="Documento PDF" width="320" height="360"></iframe>',
    ].join('');
    (component as any).applyEditorOnlyTemplatePlaceholders(root);
    const image = root.querySelector('img') as HTMLImageElement;
    const iframe = root.querySelector('iframe') as HTMLIFrameElement;
    image.style.width = '240px';
    image.style.height = '160px';
    iframe.style.width = '320px';
    iframe.style.height = '360px';
    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      root,
    };

    expect((component as any).getEditorHtml()).toBe(
      '<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" width="240" height="160"><iframe src="{{task_32315.contentUrl}}" title="Documento PDF" width="320" height="360"></iframe>',
    );
  });

  it('should emit clean unresolved template html after visual resize without editor-only placeholder attrs or styles', () => {
    const emitted: string[] = [];
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', '{{task_32317.contentUrl}}');
    image.setAttribute('alt', 'sitmun logo (mime image)');
    root.appendChild(image);
    component.htmlChange.subscribe((value) => emitted.push(value));
    configureVisualEditorHost(root);
    (component as any).applyEditorOnlyTemplatePlaceholders(root);
    const rectSpy = jest.spyOn(image, 'getBoundingClientRect');
    rectSpy.mockReturnValue({
      x: 70, y: 45, left: 70, top: 45, width: 16, height: 16, right: 86, bottom: 61, toJSON: () => '',
    } as DOMRect);

    component.selectVisualElement(image);
    (component as any).startVisualResize({ clientX: 86, clientY: 61, preventDefault: jest.fn(), stopPropagation: jest.fn() });
    (component as any).updateVisualResize({ clientX: 310, clientY: 205 });
    (component as any).endVisualResize();

    expect(image.style.width).toBe('240px');
    expect(image.style.height).toBe('160px');
    expect(component.htmlSource).toBe('<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" width="240" height="160">');
    expect(emitted).toEqual(['<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" width="240" height="160">']);
  });

  it('should keep wrapped unresolved image placeholder wrapper and overlay aligned after resize', () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    image.setAttribute('src', '{{task_32317.contentUrl}}');
    image.setAttribute('alt', 'sitmun logo (mime image)');
    root.appendChild(image);
    configureVisualEditorHost(root);
    (component as any).applyEditorOnlyTemplatePlaceholders(root);

    const wrapper = image.parentElement as HTMLElement;
    const rectSpy = jest.spyOn(image, 'getBoundingClientRect');
    rectSpy.mockReturnValue({
      x: 70, y: 45, left: 70, top: 45, width: 16, height: 16, right: 86, bottom: 61, toJSON: () => '',
    } as DOMRect);

    component.selectVisualElement(image);
    (component as any).startVisualResize({ clientX: 86, clientY: 61, preventDefault: jest.fn(), stopPropagation: jest.fn() });
    (component as any).updateVisualResize({ clientX: 310, clientY: 205 });

    expect(wrapper.style.width).toBe('240px');
    expect(wrapper.style.height).toBe('160px');
    expect((component as any).resizeOverlay).toEqual({
      visible: true,
      tagName: 'img',
      top: 40,
      left: 60,
      width: 240,
      height: 160,
    });
  });

  it('should preserve original inline styles after placeholder round-trip while removing editor-only resized styles', () => {
    const root = document.createElement('div');
    root.innerHTML = '<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" style="border: 1px solid red; width: 111px; height: 77px;" width="111" height="77">';
    (component as any).applyEditorOnlyTemplatePlaceholders(root);
    const image = root.querySelector('img') as HTMLImageElement;

    image.style.width = '240px';
    image.style.height = '160px';

    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      root,
    };

    expect((component as any).getEditorHtml()).toBe(
      '<img src="{{task_32317.contentUrl}}" alt="sitmun logo (mime image)" style="border: 1px solid red; width: 111px; height: 77px;" width="111" height="77">',
    );
  });

  it('should configure quill modules without the resize plugin', () => {
    const modules = (component as any).buildQuillModules({ keyboardBindings: {} });

    expect(modules.resize).toBeUndefined();
  });
});
