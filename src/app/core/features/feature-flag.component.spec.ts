import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FeatureFlagComponent } from './feature-flag.component';
import { FeatureFlagPipe } from './feature-flag.pipe';
import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagComponent', () => {
  let component: FeatureFlagComponent;
  let fixture: ComponentFixture<FeatureFlagComponent>;
  let featureFlagService: { isFeatureExperimental: jest.Mock };

  beforeEach(async () => {
    featureFlagService = {
      isFeatureExperimental: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      declarations: [FeatureFlagComponent, FeatureFlagPipe],
      imports: [MatIconModule, MatIconTestingModule, NoopAnimationsModule],
      providers: [
        { provide: FeatureFlagService, useValue: featureFlagService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureFlagComponent);
    component = fixture.componentInstance;
    component.text = 'Filters';
    component.flag = 'cartographyFilters' as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks the experimental icon as decorative for screen readers', () => {
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('still renders the visible label text', () => {
    expect(fixture.nativeElement.textContent).toContain('Filters');
  });
});
