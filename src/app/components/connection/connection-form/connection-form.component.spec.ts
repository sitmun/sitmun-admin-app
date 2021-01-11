import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionService, CartographyService, TaskService } from 'dist/sitmun-frontend-core/';
import { ConnectionFormComponent } from '../connection-form/connection-form.component';
import { MaterialModule } from '../../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { CodeListService } from 'dist/sitmun-frontend-core';
describe('ConnectionFormComponent', () => {
  let component: ConnectionFormComponent;
  let fixture: ComponentFixture<ConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule],
      providers: [ConnectionService, CartographyService, TaskService, CodeListService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
