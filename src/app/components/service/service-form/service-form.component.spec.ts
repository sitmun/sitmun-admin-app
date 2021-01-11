import { ServiceFormComponent } from '../service-form/service-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ServiceService, CartographyService } from 'dist/sitmun-frontend-core/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { RouterTestingModule } from '@angular/router/testing';
import { CodeListService } from 'dist/sitmun-frontend-core';

describe('ServiceFormComponent', () => {
  let component: ServiceFormComponent;
  let fixture: ComponentFixture<ServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceFormComponent ],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [ServiceService, CartographyService, CodeListService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
