import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of, throwError} from 'rxjs';

import {EntityListComponent} from '@app/components/shared/entity-list/entity-list.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {CodeListService, TranslationService, Tree, TreeService} from '@app/domain';
import { DIALOG_EVENTS } from '@app/frontend-gui/src/lib/dialog-message/dialog-message.component';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';

import { TreesComponent } from './trees.component';

describe('TreesComponent', () => {
  let component: TreesComponent;
  let fixture: ComponentFixture<TreesComponent>;
  let treeService: TreeService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let httpMock: HttpTestingController;
  let loadingOverlay: LoadingOverlayService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreesComponent, EntityListComponent ],
      imports : [MatIconTestingModule, SitmunFrontendGuiModule, MaterialModule, RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [TreeService,CodeListService,TranslationService,ResourceService,ExternalService,
        ErrorHandlerService,
        LoadingOverlayService,
        LoggerService,
        UtilsService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TreesComponent);
    component = fixture.componentInstance;
    treeService = TestBed.inject(TreeService);
    codeListService = TestBed.inject(CodeListService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    loadingOverlay = TestBed.inject(LoadingOverlayService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('trees')).forEach((req) =>
      req.flush({ _embedded: { trees: [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate treeService', () => {
    expect(treeService).toBeTruthy();
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

  describe('removeData batch deletion', () => {
    it('deletes all selected trees when deletion is confirmed', async () => {
      const trees = [
        Tree.fromObject({ id: 1, name: 'A' }),
        Tree.fromObject({ id: 2, name: 'B' }),
      ];
      const deleteSpy = jest.spyOn(treeService, 'delete').mockReturnValue(of(null));
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of({ event: DIALOG_EVENTS.ACCEPT }),
      } as any);
      jest.spyOn(loadingOverlay, 'wrap').mockImplementation(async (operation) => operation());
      const refreshSpy = jest.spyOn(component['refreshCommandEvent$'], 'next');

      component.removeData(trees);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(deleteSpy).toHaveBeenCalledTimes(2);
      expect(refreshSpy).toHaveBeenCalledWith(true);
    });

    it('refreshes the grid after partial batch deletion failures', async () => {
      const trees = [
        Tree.fromObject({ id: 1, name: 'A' }),
        Tree.fromObject({ id: 2, name: 'B' }),
      ];
      jest.spyOn(treeService, 'delete')
        .mockReturnValueOnce(of(null))
        .mockReturnValueOnce(throwError(() => new Error('delete failed')));
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of({ event: DIALOG_EVENTS.ACCEPT }),
      } as any);
      jest.spyOn(loadingOverlay, 'wrap').mockImplementation(async (operation) => operation());
      const refreshSpy = jest.spyOn(component['refreshCommandEvent$'], 'next');

      component.removeData(trees);
      await new Promise((resolve) => setTimeout(resolve, 2100));

      expect(refreshSpy).toHaveBeenCalledWith(true);
    });
  });


});
