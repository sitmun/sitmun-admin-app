import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { TranslateModule } from '@ngx-translate/core';

import { ExternalUrlLinkComponent } from './external-url-link.component';

describe('ExternalUrlLinkComponent', () => {
  let component: ExternalUrlLinkComponent;
  let fixture: ComponentFixture<ExternalUrlLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalUrlLinkComponent],
      imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalUrlLinkComponent);
    component = fixture.componentInstance;
  });

  function setUrl(url: string | null | undefined): void {
    component.url = url;
    fixture.detectChanges();
  }

  it('renders an open_in_new anchor for https URLs', () => {
    setUrl('https://example.test/path');

    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
    expect(anchor.nativeElement.getAttribute('href')).toBe('https://example.test/path');
    expect(anchor.nativeElement.getAttribute('target')).toBe('_blank');
    expect(anchor.nativeElement.getAttribute('rel')).toBe('noopener');
    expect(anchor.nativeElement.textContent).toContain('open_in_new');
    expect(anchor.nativeElement.getAttribute('aria-label')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[mattooltip], [ng-reflect-mat-tooltip], .mat-mdc-tooltip-trigger'))
      .toBeTruthy();
  });

  it('renders an open_in_new anchor for http URLs', () => {
    setUrl('http://example.test');

    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
    expect(anchor.nativeElement.getAttribute('href')).toBe('http://example.test');
  });

  it('renders no anchor for empty, whitespace, malformed, ftp, or JDBC values', () => {
    for (const value of ['', '   ', 'not-a-url', 'ftp://example.test', 'jdbc:oracle:thin:@host:1521:sid']) {
      setUrl(value);
      expect(fixture.debugElement.query(By.css('a'))).toBeNull();
    }
  });

  it('updates or removes the rendered action when the url input changes', () => {
    setUrl('https://example.test/a');
    expect(fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href'))
      .toBe('https://example.test/a');

    setUrl('https://example.test/b');
    expect(fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href'))
      .toBe('https://example.test/b');

    setUrl('not-a-url');
    expect(fixture.debugElement.query(By.css('a'))).toBeNull();
  });
});
