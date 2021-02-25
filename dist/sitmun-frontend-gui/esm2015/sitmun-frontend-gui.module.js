/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
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
import { DialogTranslationComponent } from './dialog-translation/dialog-translation.component';
registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');
/**
 * Load translation assets
 * @param {?} http
 * @return {?}
 */
export function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
const ɵ0 = (createTranslateLoader);
/**
 * SITMUN plugin core module
 */
export class SitmunFrontendGuiModule {
}
SitmunFrontendGuiModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    RouterModule,
                    HttpClientModule,
                    CommonModule,
                    FormsModule,
                    NoopAnimationsModule,
                    AngularHalModule,
                    ReactiveFormsModule,
                    BrowserAnimationsModule,
                    AgGridModule,
                    SitmunFrontendCoreModule,
                    MaterialModule,
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: ɵ0,
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
                    DialogTranslationComponent
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
                    DialogTranslationComponent,
                    SitmunFrontendCoreModule
                ]
            },] }
];
export { ɵ0 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWd1aS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vc3JjL21haW4vYW5ndWxhci1saWJyYXJ5L3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1ndWkvc3JjL2xpYi8iLCJzb3VyY2VzIjpbInNpdG11bi1mcm9udGVuZC1ndWkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNyRyxPQUFPLEVBQUUsWUFBWSxFQUFVLE1BQU0saUJBQWlCLENBQUM7QUFHdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQW9CLE1BQU0scUJBQXFCLENBQUM7QUFDekYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHekQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckQsT0FBTyxRQUFRLE1BQU0sNEJBQTRCLENBQUM7QUFDbEQsT0FBTyxRQUFRLE1BQU0sNEJBQTRCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDakUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTFELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVqRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUMzRixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx5REFBeUQsQ0FBQztBQUN2RyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUNqRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUcvRixrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFHbkMsTUFBTSxVQUFVLHFCQUFxQixDQUFDLElBQWdCO0lBQ3BELE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDbEU7V0FvQm1CLENBQUMscUJBQXFCLENBQUM7Ozs7QUFzQzNDLE1BQU0sT0FBTyx1QkFBdUI7OztZQXREbkMsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLGdCQUFnQjtvQkFDaEIsWUFBWTtvQkFDWixXQUFXO29CQUNYLG9CQUFvQjtvQkFDcEIsZ0JBQWdCO29CQUNoQixtQkFBbUI7b0JBQ25CLHVCQUF1QjtvQkFDdkIsWUFBWTtvQkFDWix3QkFBd0I7b0JBQ3hCLGNBQWM7b0JBQ2QsZUFBZSxDQUFDLE9BQU8sQ0FBQzt3QkFDdEIsTUFBTSxFQUFFOzRCQUNOLE9BQU8sRUFBRSxlQUFlOzRCQUN4QixVQUFVLElBQXlCOzRCQUNuQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7eUJBQ25CO3FCQUNGLENBQUM7aUJBRUg7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLGlCQUFpQjtvQkFDakIsaUJBQWlCO29CQUNqQix3QkFBd0I7b0JBQ3hCLDRCQUE0QjtvQkFDNUIsMEJBQTBCO29CQUMxQixtQkFBbUI7b0JBQ25CLG1CQUFtQjtvQkFDbkIsc0JBQXNCO29CQUN0QiwwQkFBMEI7aUJBQzNCO2dCQUNELGVBQWUsRUFBRSxFQUNoQjtnQkFDRCxTQUFTLEVBQUUsRUFDVjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZ0JBQWdCO29CQUNoQixZQUFZO29CQUNaLFdBQVc7b0JBQ1gsb0JBQW9CO29CQUNwQixnQkFBZ0I7b0JBQ2hCLGVBQWU7b0JBQ2YsbUJBQW1CO29CQUNuQixpQkFBaUI7b0JBQ2pCLGlCQUFpQjtvQkFDakIsbUJBQW1CO29CQUNuQixtQkFBbUI7b0JBQ25CLHNCQUFzQjtvQkFDdEIsMEJBQTBCO29CQUMxQix3QkFBd0I7aUJBQ3pCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUsIEh0dHBDbGllbnQsIEhUVFBfSU5URVJDRVBUT1JTIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSwgTm9vcEFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUsIFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG4vL2ltcG9ydCAqIGFzIG9sIGZyb20gJ29wZW5sYXllcnMnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUsIFRyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQgeyByZWdpc3RlckxvY2FsZURhdGEgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBBbmd1bGFySGFsTW9kdWxlIH0gZnJvbSAnQHNpdG11bi9mcm9udGVuZC1jb3JlJztcclxuXHJcblxyXG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgbG9jYWxlQ2EgZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2xvY2FsZXMvY2EnO1xyXG5pbXBvcnQgbG9jYWxlRXMgZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2xvY2FsZXMvZXMnO1xyXG5pbXBvcnQgeyBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUgfSBmcm9tICdAc2l0bXVuL2Zyb250ZW5kLWNvcmUnO1xyXG5pbXBvcnQgeyBEYXRhR3JpZENvbXBvbmVudCB9IGZyb20gJy4vZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgQWdHcmlkTW9kdWxlIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5cclxuaW1wb3J0IHtNYXRlcmlhbE1vZHVsZX0gZnJvbSAnLi9tYXRlcmlhbC1tb2R1bGUnO1xyXG5cclxuaW1wb3J0IHsgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi9idG4tZWRpdC1yZW5kZXJlZC9idG4tZWRpdC1yZW5kZXJlZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi9idG4tY2hlY2tib3gtcmVuZGVyZWQvYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9idG4tY2hlY2tib3gtZmlsdGVyL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVHJhbnNsYXRlSHR0cExvYWRlciB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuaW1wb3J0IHsgRGlhbG9nR3JpZENvbXBvbmVudCB9IGZyb20gJy4vZGlhbG9nLWdyaWQvZGlhbG9nLWdyaWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGlhbG9nRm9ybUNvbXBvbmVudCB9IGZyb20gJy4vZGlhbG9nLWZvcm0vZGlhbG9nLWZvcm0uY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGlhbG9nTWVzc2FnZUNvbXBvbmVudCB9IGZyb20gJy4vZGlhbG9nLW1lc3NhZ2UvZGlhbG9nLW1lc3NhZ2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGF0YVRyZWVDb21wb25lbnQgfSBmcm9tICcuL2RhdGEtdHJlZS9kYXRhLXRyZWUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGlhbG9nVHJhbnNsYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2RpYWxvZy10cmFuc2xhdGlvbi9kaWFsb2ctdHJhbnNsYXRpb24uY29tcG9uZW50JztcclxuXHJcblxyXG5yZWdpc3RlckxvY2FsZURhdGEobG9jYWxlQ2EsICdjYScpO1xyXG5yZWdpc3RlckxvY2FsZURhdGEobG9jYWxlRXMsICdlcycpO1xyXG5cclxuLyoqIExvYWQgdHJhbnNsYXRpb24gYXNzZXRzICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnLi4vYXNzZXRzL2kxOG4vJywgJy5qc29uJyk7XHJcbn1cclxuXHJcblxyXG4vKiogU0lUTVVOIHBsdWdpbiBjb3JlIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIFJvdXRlck1vZHVsZSxcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZSxcclxuICAgIE5vb3BBbmltYXRpb25zTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSxcclxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXHJcbiAgICBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSxcclxuICAgIEFnR3JpZE1vZHVsZSxcclxuICAgIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSxcclxuICAgIE1hdGVyaWFsTW9kdWxlLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBEYXRhR3JpZENvbXBvbmVudCxcclxuICAgIERhdGFUcmVlQ29tcG9uZW50LFxyXG4gICAgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCxcclxuICAgIEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50LFxyXG4gICAgRGlhbG9nR3JpZENvbXBvbmVudCxcclxuICAgIERpYWxvZ0Zvcm1Db21wb25lbnQsXHJcbiAgICBEaWFsb2dNZXNzYWdlQ29tcG9uZW50LFxyXG4gICAgRGlhbG9nVHJhbnNsYXRpb25Db21wb25lbnRcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGUsXHJcbiAgICBOb29wQW5pbWF0aW9uc01vZHVsZSxcclxuICAgIEFuZ3VsYXJIYWxNb2R1bGUsXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgRGF0YUdyaWRDb21wb25lbnQsXHJcbiAgICBEYXRhVHJlZUNvbXBvbmVudCxcclxuICAgIERpYWxvZ0dyaWRDb21wb25lbnQsXHJcbiAgICBEaWFsb2dGb3JtQ29tcG9uZW50LFxyXG4gICAgRGlhbG9nTWVzc2FnZUNvbXBvbmVudCxcclxuICAgIERpYWxvZ1RyYW5zbGF0aW9uQ29tcG9uZW50LFxyXG4gICAgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2l0bXVuRnJvbnRlbmRHdWlNb2R1bGUge1xyXG59XHJcbiJdfQ==