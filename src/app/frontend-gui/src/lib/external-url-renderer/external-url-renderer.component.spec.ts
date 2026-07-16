import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { TranslateModule } from '@ngx-translate/core';

import { ExternalUrlRendererComponent } from './external-url-renderer.component';

describe('ExternalUrlRendererComponent', () => {
  let component: ExternalUrlRendererComponent;
  let fixture: ComponentFixture<ExternalUrlRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ExternalUrlRendererComponent,
        MatIconModule,
        MatTooltipModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalUrlRendererComponent);
    component = fixture.componentInstance;
  });

  it('renders one new-tab anchor containing text and open_in_new for valid URLs', () => {
    component.agInit({
      value: 'https://example.test/path',
      data: {},
    });
    fixture.detectChanges();

    const anchors = fixture.debugElement.queryAll(By.css('a'));
    expect(anchors.length).toBe(1);
    const anchor = anchors[0].nativeElement as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('https://example.test/path');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener');
    expect(anchor.textContent).toContain('https://example.test/path');
    expect(anchor.textContent).toContain('open_in_new');
    expect(anchor.getAttribute('aria-label')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[mattooltip], [ng-reflect-mat-tooltip], .mat-mdc-tooltip-trigger'))
      .toBeTruthy();
  });

  it('renders plain text for empty or malformed values', () => {
    component.agInit({
      value: 'not-a-url',
      data: {},
    });
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('a')).length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('not-a-url');
  });

  it('refresh replaces the rendered value', () => {
    component.agInit({
      value: 'https://example.test/a',
      data: {},
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href'))
      .toBe('https://example.test/a');

    expect(component.refresh({
      value: 'https://example.test/b',
      data: {},
    })).toBe(true);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href'))
      .toBe('https://example.test/b');
  });

  it('in editable mode keeps URL text plain and links only the open_in_new icon', () => {
    component.agInit({
      value: 'https://example.test/path',
      data: {},
      editable: true,
    });
    fixture.detectChanges();

    const anchors = fixture.debugElement.queryAll(By.css('a'));
    expect(anchors.length).toBe(1);
    const iconLink = anchors[0].nativeElement as HTMLAnchorElement;
    expect(iconLink.getAttribute('href')).toBe('https://example.test/path');
    expect(iconLink.getAttribute('target')).toBe('_blank');
    expect(iconLink.getAttribute('rel')).toBe('noopener');
    expect(iconLink.textContent).toContain('open_in_new');
    expect(iconLink.textContent).not.toContain('https://example.test/path');
    expect(fixture.nativeElement.textContent).toContain('https://example.test/path');
    expect(fixture.debugElement.query(By.css('.external-url-text'))).toBeTruthy();
  });

  it('in editable mode shows no icon action for invalid values', () => {
    component.agInit({
      value: 'not-a-url',
      data: {},
      editable: true,
    });
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('a')).length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('not-a-url');
  });
});
