import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeHtmlPreviewComponent } from './safe-html-preview.component';

describe('SafeHtmlPreviewComponent', () => {
  let fixture: ComponentFixture<SafeHtmlPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeHtmlPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeHtmlPreviewComponent);
  });

  it('uses srcdoc in a sandbox without dangerous permissions', () => {
    fixture.componentInstance.html = '<style>table{width:100%}</style><table><tr><td>Preview</td></tr></table>';
    fixture.detectChanges();

    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement;
    const sandbox = iframe.getAttribute('sandbox');

    expect(iframe.hasAttribute('srcdoc')).toBe(true);
    expect(iframe.srcdoc).toBe(fixture.componentInstance.html);
    expect(sandbox).toBe('');
    expect(sandbox).not.toContain('allow-scripts');
    expect(sandbox).not.toContain('allow-same-origin');
    expect(sandbox).not.toContain('allow-top-navigation');
  });
});
