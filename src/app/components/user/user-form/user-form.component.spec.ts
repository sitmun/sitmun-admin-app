import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { UserService, RoleService, TerritoryService, UserConfigurationService, 
  CodeListService, UserPositionService,TranslationService,ResourceService,ExternalService } from 'dist/sitmun-frontend-core/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormComponent ],
      imports: [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,
         RouterModule.forRoot([]), MaterialModule, MatIconTestingModule],
      providers: [UserService,RoleService, TerritoryService, UserPositionService, 
        CodeListService,UserConfigurationService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 