import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
//import * as ol from 'openlayers';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import { AngularHalModule } from '@sitmun/frontend-core';
import { ReactiveFormsModule } from '@angular/forms';
import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';
import { SitmunFrontendCoreModule } from '@sitmun/frontend-core';
import { DataGridComponent } from './data-grid/data-grid.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { MaterialModule } from './material-module';
import { BtnEditRenderedComponent } from './btn-edit-rendered/btn-edit-rendered.component';
import { BtnCheckboxRenderedComponent } from './btn-checkbox-rendered/btn-checkbox-rendered.component';
import { BtnCheckboxFilterComponent } from './btn-checkbox-filter/btn-checkbox-filter.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogGridComponent } from './dialog-grid/dialog-grid.component';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { DialogMessageComponent } from './dialog-message/dialog-message.component';
import { DataTreeComponent } from './data-tree/data-tree.component';
import * as i0 from "@angular/core";
import * as i1 from "@ag-grid-community/angular";
import * as i2 from "@ngx-translate/core";
registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');
/** Load translation assets */
export function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
/** SITMUN plugin core module */
export class SitmunFrontendGuiModule {
}
/** @nocollapse */ SitmunFrontendGuiModule.ɵmod = i0.ɵɵdefineNgModule({ type: SitmunFrontendGuiModule });
/** @nocollapse */ SitmunFrontendGuiModule.ɵinj = i0.ɵɵdefineInjector({ factory: function SitmunFrontendGuiModule_Factory(t) { return new (t || SitmunFrontendGuiModule)(); }, providers: [], imports: [[
            RouterModule,
            HttpClientModule,
            CommonModule,
            FormsModule,
            NoopAnimationsModule,
            AngularHalModule,
            ReactiveFormsModule,
            BrowserAnimationsModule,
            AgGridModule.withComponents([]),
            SitmunFrontendCoreModule,
            MaterialModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient]
                }
            })
        ], HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        TranslateModule,
        ReactiveFormsModule,
        SitmunFrontendCoreModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SitmunFrontendGuiModule, { declarations: [DataGridComponent,
        DataTreeComponent,
        BtnEditRenderedComponent,
        BtnCheckboxRenderedComponent,
        BtnCheckboxFilterComponent,
        DialogGridComponent,
        DialogFormComponent,
        DialogMessageComponent], imports: [RouterModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        ReactiveFormsModule,
        BrowserAnimationsModule, i1.AgGridModule, SitmunFrontendCoreModule,
        MaterialModule, i2.TranslateModule], exports: [HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        TranslateModule,
        ReactiveFormsModule,
        DataGridComponent,
        DataTreeComponent,
        DialogGridComponent,
        DialogFormComponent,
        DialogMessageComponent,
        SitmunFrontendCoreModule] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SitmunFrontendGuiModule, [{
        type: NgModule,
        args: [{
                imports: [
                    RouterModule,
                    HttpClientModule,
                    CommonModule,
                    FormsModule,
                    NoopAnimationsModule,
                    AngularHalModule,
                    ReactiveFormsModule,
                    BrowserAnimationsModule,
                    AgGridModule.withComponents([]),
                    SitmunFrontendCoreModule,
                    MaterialModule,
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: (createTranslateLoader),
                            deps: [HttpClient]
                        }
                    })
                ],
                declarations: [
                    DataGridComponent,
                    DataTreeComponent,
                    BtnEditRenderedComponent,
                    BtnCheckboxRenderedComponent,
                    BtnCheckboxFilterComponent,
                    DialogGridComponent,
                    DialogFormComponent,
                    DialogMessageComponent,
                ],
                entryComponents: [],
                providers: [],
                exports: [
                    HttpClientModule,
                    CommonModule,
                    FormsModule,
                    NoopAnimationsModule,
                    AngularHalModule,
                    TranslateModule,
                    ReactiveFormsModule,
                    DataGridComponent,
                    DataTreeComponent,
                    DialogGridComponent,
                    DialogFormComponent,
                    DialogMessageComponent,
                    SitmunFrontendCoreModule
                ]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWd1aS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vc3JjL21haW4vYW5ndWxhci1saWJyYXJ5L3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1ndWkvc3JjL2xpYi8iLCJzb3VyY2VzIjpbInNpdG11bi1mcm9udGVuZC1ndWkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFxQixNQUFNLHNCQUFzQixDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxZQUFZLEVBQVUsTUFBTSxpQkFBaUIsQ0FBQztBQUV2RCxtQ0FBbUM7QUFDbkMsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQW9CLE1BQU0scUJBQXFCLENBQUM7QUFDekYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHekQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckQsT0FBTyxRQUFRLE1BQU0sNEJBQTRCLENBQUM7QUFDbEQsT0FBTyxRQUFRLE1BQU0sNEJBQTRCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDakUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTFELE9BQU8s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QUNuQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7eUJBQ25CO3FCQUNGLENBQUM7aUJBRUg7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLGlCQUFpQjtvQkFDakIsaUJBQWlCO29CQUNqQix3QkFBd0I7b0JBQ3hCLDRCQUE0QjtvQkFDNUIsMEJBQTBCO29CQUMxQixtQkFBbUI7b0JBQ25CLG1CQUFtQjtvQkFDbkIsc0JBQXNCO2lCQUN2QjtnQkFDRCxlQUFlLEVBQUUsRUFDaEI7Z0JBQ0QsU0FBUyxFQUFFLEVBQ1Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsWUFBWTtvQkFDWixXQUFXO29CQUNYLG9CQUFvQjtvQkFDcEIsZ0JBQWdCO29CQUNoQixlQUFlO29CQUNmLG1CQUFtQjtvQkFDbkIsaUJBQWlCO29CQUNqQixpQkFBaUI7b0JBQ2pCLG1CQUFtQjtvQkFDbkIsbUJBQW1CO29CQUNuQixzQkFBc0I7b0JBQ3RCLHdCQUF3QjtpQkFDekI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSwgSHR0cENsaWVudCwgSFRUUF9JTlRFUkNFUFRPUlMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLCBOb29wQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7IFJvdXRlck1vZHVsZSwgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbi8vaW1wb3J0ICogYXMgb2wgZnJvbSAnb3BlbmxheWVycyc7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSwgVHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7IHJlZ2lzdGVyTG9jYWxlRGF0YSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEFuZ3VsYXJIYWxNb2R1bGUgfSBmcm9tICdAc2l0bXVuL2Zyb250ZW5kLWNvcmUnO1xyXG5cclxuXHJcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCBsb2NhbGVDYSBmcm9tICdAYW5ndWxhci9jb21tb24vbG9jYWxlcy9jYSc7XHJcbmltcG9ydCBsb2NhbGVFcyBmcm9tICdAYW5ndWxhci9jb21tb24vbG9jYWxlcy9lcyc7XHJcbmltcG9ydCB7IFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSB9IGZyb20gJ0BzaXRtdW4vZnJvbnRlbmQtY29yZSc7XHJcbmltcG9ydCB7IERhdGFHcmlkQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhLWdyaWQvZGF0YS1ncmlkLmNvbXBvbmVudCc7XHJcblxyXG5pbXBvcnQgeyBBZ0dyaWRNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcblxyXG5pbXBvcnQge01hdGVyaWFsTW9kdWxlfSBmcm9tICcuL21hdGVyaWFsLW1vZHVsZSc7XHJcblxyXG5pbXBvcnQgeyBCdG5FZGl0UmVuZGVyZWRDb21wb25lbnQgfSBmcm9tICcuL2J0bi1lZGl0LXJlbmRlcmVkL2J0bi1lZGl0LXJlbmRlcmVkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJ0bkNoZWNrYm94UmVuZGVyZWRDb21wb25lbnQgfSBmcm9tICcuL2J0bi1jaGVja2JveC1yZW5kZXJlZC9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuL2J0bi1jaGVja2JveC1maWx0ZXIvYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVIdHRwTG9hZGVyIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5pbXBvcnQgeyBEaWFsb2dHcmlkQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2ctZ3JpZC9kaWFsb2ctZ3JpZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEaWFsb2dGb3JtQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2ctZm9ybS9kaWFsb2ctZm9ybS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEaWFsb2dNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2ctbWVzc2FnZS9kaWFsb2ctbWVzc2FnZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEYXRhVHJlZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQnO1xyXG5cclxuXHJcbnJlZ2lzdGVyTG9jYWxlRGF0YShsb2NhbGVDYSwgJ2NhJyk7XHJcbnJlZ2lzdGVyTG9jYWxlRGF0YShsb2NhbGVFcywgJ2VzJyk7XHJcblxyXG4vKiogTG9hZCB0cmFuc2xhdGlvbiBhc3NldHMgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcuLi9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuXHJcbi8qKiBTSVRNVU4gcGx1Z2luIGNvcmUgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgUm91dGVyTW9kdWxlLFxyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgTm9vcEFuaW1hdGlvbnNNb2R1bGUsXHJcbiAgICBBbmd1bGFySGFsTW9kdWxlLFxyXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcclxuICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxyXG4gICAgQWdHcmlkTW9kdWxlLndpdGhDb21wb25lbnRzKFtdKSxcclxuICAgIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSxcclxuICAgIE1hdGVyaWFsTW9kdWxlLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBEYXRhR3JpZENvbXBvbmVudCxcclxuICAgIERhdGFUcmVlQ29tcG9uZW50LFxyXG4gICAgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCxcclxuICAgIEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50LFxyXG4gICAgRGlhbG9nR3JpZENvbXBvbmVudCxcclxuICAgIERpYWxvZ0Zvcm1Db21wb25lbnQsXHJcbiAgICBEaWFsb2dNZXNzYWdlQ29tcG9uZW50LFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZSxcclxuICAgIE5vb3BBbmltYXRpb25zTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZSxcclxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXHJcbiAgICBEYXRhR3JpZENvbXBvbmVudCxcclxuICAgIERhdGFUcmVlQ29tcG9uZW50LFxyXG4gICAgRGlhbG9nR3JpZENvbXBvbmVudCxcclxuICAgIERpYWxvZ0Zvcm1Db21wb25lbnQsXHJcbiAgICBEaWFsb2dNZXNzYWdlQ29tcG9uZW50LFxyXG4gICAgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2l0bXVuRnJvbnRlbmRHdWlNb2R1bGUge1xyXG59XHJcbiJdfQ==