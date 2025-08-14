import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorPageComponent } from './error-page.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: TranslateService, useValue: { instant: jest.fn() } },
        { provide: 'LoggerService', useValue: { error: jest.fn() } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process string error correctly', () => {
    component.error = 'Test error message';
    component.ngOnInit();
    
    expect(component.errorMessage).toBe('Test error message');
  });

  it('should process error object with message', () => {
    component.error = { message: 'Test error message' };
    component.ngOnInit();
    
    expect(component.errorMessage).toBe('Test error message');
  });

  it('should toggle details visibility', () => {
    expect(component.showDetails).toBeFalsy();
    
    component.toggleDetails();
    expect(component.showDetails).toBeTruthy();
    
    component.toggleDetails();
    expect(component.showDetails).toBeFalsy();
  });

  it('should call window.location.reload on retry', () => {
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation();
    component.retry();
    expect(reloadSpy).toHaveBeenCalled();
  });
}); 