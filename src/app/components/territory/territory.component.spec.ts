import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerritoryComponent } from './territory.component';
import { TerritoryService, UserService, RoleService, UserConfigurationService, 
  CodeListService,TranslationService,ResourceService,ExternalService, TerritoryTypeService } from '../../frontend-core/src/lib/public_api';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '../../frontend-gui/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';


describe('TerritoryComponent', () => {
  let component: TerritoryComponent;
  let fixture: ComponentFixture<TerritoryComponent>;
  let territoryService: TerritoryService;
  let territoryTypeService: TerritoryTypeService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule, MatIconTestingModule,
         MaterialModule, RouterModule, MatIconTestingModule],
      providers: [TerritoryService, TerritoryTypeService, UserService, RoleService, CodeListService,UserConfigurationService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryComponent);
    component = fixture.componentInstance;
    territoryService= TestBed.inject(TerritoryService);
    territoryTypeService= TestBed.inject(TerritoryTypeService);
    codeListService= TestBed.inject(CodeListService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate territoryService', () => {
    expect(territoryService).toBeTruthy();
  });

  it('should instantiate territoryTypeService', () => {
    expect(territoryTypeService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate translationService', () => {
    expect(translationService).toBeTruthy();
  });
 
  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });
});
