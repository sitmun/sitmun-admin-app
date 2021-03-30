import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersFormComponent } from './layers-form.component';
import { RouterModule } from '@angular/router';
import {  CartographyService, ServiceService, TerritoryTypeService, ConnectionService, TreeNodeService,
   TerritoryService, CartographyGroupService, CartographyAvailabilityService,CartographyParameterService,TranslationService,
   CodeListService,CartographyFilterService  } from  'dist/sitmun-frontend-core/';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('LayersFormComponent', () => {
  let component: LayersFormComponent;
  let fixture: ComponentFixture<LayersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayersFormComponent ],
      imports: [ RouterModule.forRoot([]), HttpClientTestingModule, SitmunFrontendGuiModule, 
      RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [CartographyService, ServiceService, ConnectionService, TerritoryTypeService, 
        TreeNodeService, TerritoryService, CartographyGroupService, CartographyAvailabilityService, 
        CartographyParameterService, CodeListService, CartographyFilterService, TranslationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
