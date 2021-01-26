import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BackgroundService,CartographyGroupService, CodeListService } from '@sitmun/frontend-core';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { RouterTestingModule } from '@angular/router/testing';
import { BackgroundLayersFormComponent } from './background-layers-form.component';

describe('BackgroundLayersFormComponent', () => {
  let component: BackgroundLayersFormComponent;
  let fixture: ComponentFixture<BackgroundLayersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundLayersFormComponent ],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [BackgroundService,CodeListService,CartographyGroupService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });
 
  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
