import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { RouterLinkRendererComponent } from './router-link-renderer.component';

describe('RouterLinkRendererComponent', () => {
  let component: RouterLinkRendererComponent;
  let fixture: ComponentFixture<RouterLinkRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterLinkRendererComponent,
        MatIconModule,
        MatTooltipModule,
        TranslateModule.forRoot(),
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RouterLinkRendererComponent);
    component = fixture.componentInstance;
  });

  function initWithData(): void {
    component.agInit({
      value: 'Demo connection',
      route: '/connection/:id/connectionForm',
      paramFields: { id: 'connectionId' },
      data: { connectionId: 2 },
    });
    fixture.detectChanges();
  }

  it('renders same-tab text and matching new-tab icon for the computed route', () => {
    initWithData();

    const anchors = fixture.debugElement.queryAll(By.css('a'));
    expect(anchors.length).toBe(2);

    const textLink = anchors[0];
    const iconLink = anchors[1];
    const expectedRoute = ['', 'connection', 2, 'connectionForm'];

    expect(textLink.nativeElement.textContent.trim()).toBe('Demo connection');
    expect(textLink.attributes['ng-reflect-router-link'] ?? textLink.properties['routerLink'])
      .toBeTruthy();
    expect(component.getRouterLink()).toEqual(expectedRoute);
    expect(textLink.attributes['target']).toBeUndefined();
    expect(textLink.nativeElement.getAttribute('target')).toBeNull();

    expect(iconLink.nativeElement.getAttribute('target')).toBe('_blank');
    expect(iconLink.nativeElement.getAttribute('rel')).toBe('noopener');
    expect(iconLink.nativeElement.textContent).toContain('open_in_new');
    expect(iconLink.attributes['aria-label'] || iconLink.nativeElement.getAttribute('aria-label'))
      .toBeTruthy();
    expect(fixture.nativeElement.querySelector('[mattooltip], [ng-reflect-mat-tooltip], .mat-mdc-tooltip-trigger'))
      .toBeTruthy();
  });

  it('expands route placeholders from paramFields and row data', () => {
    component.agInit({
      value: 'Task',
      route: '/tasks/:id/:typeId',
      paramFields: { id: 'id', typeId: 'typeId' },
      data: { id: 7, typeId: 12 },
    });

    expect(component.getRouterLink()).toEqual(['', 'tasks', 7, 12]);
  });

  it('renders no links when row data is absent', () => {
    component.agInit({
      value: '',
      route: '/connection/:id/connectionForm',
      paramFields: { id: 'id' },
      data: null,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
  });

  it('renders plain text when a required route param is missing', () => {
    component.agInit({
      value: 'Unregistered layer',
      route: '/layers/:id/layersForm',
      paramFields: { id: 'id' },
      data: { name: 'Unregistered layer' },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Unregistered layer');
    expect(component.canNavigate()).toBe(false);
  });

  it('stops click propagation on both links', () => {
    initWithData();

    const anchors = fixture.debugElement.queryAll(By.css('a'));
    for (const anchor of anchors) {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const stopSpy = jest.spyOn(event, 'stopPropagation');
      anchor.nativeElement.dispatchEvent(event);
      expect(stopSpy).toHaveBeenCalled();
    }
  });
});
