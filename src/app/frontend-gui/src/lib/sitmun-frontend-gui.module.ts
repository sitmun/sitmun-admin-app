import {CommonModule,registerLocaleData} from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';
import {
  NgModule,
} from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, } from '@angular/router';

//import * as ol from 'openlayers';
import {AgGridModule} from '@ag-grid-community/angular';
import {TranslateModule} from '@ngx-translate/core';
import {NgxEchartsModule} from 'ngx-echarts';
//import { AngularHalModule } from '@sitmun/frontend-core';



// import { SitmunFrontendCoreModule } from '@sitmun/frontend-core';
import {CharacterCountPipe} from '@app/components/shared/character-counter-hint/character-count.pipe';

import {BtnCheckboxFilterComponent} from './btn-checkbox-filter/btn-checkbox-filter.component';
import {BtnCheckboxRenderedComponent} from './btn-checkbox-rendered/btn-checkbox-rendered.component';
import {BtnEditRenderedComponent} from './btn-edit-rendered/btn-edit-rendered.component';
import {DatagraphComponent} from './data-graph/datagraph.component';
import {DataTreeComponent} from './data-tree/data-tree.component';
import {DialogFormComponent} from './dialog-form/dialog-form.component';
import {DialogMessageComponent} from './dialog-message/dialog-message.component';
import {DialogTranslationComponent} from './dialog-translation/dialog-translation.component';
import {FormValidationBannerComponent} from './form-validation-banner/form-validation-banner.component';
import {MapTreeComponent} from './map-tree/map-tree.component';
import {MaterialModule} from './material-module';


registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');


/** SITMUN plugin core module */
@NgModule({ declarations: [
        DataTreeComponent,
        BtnEditRenderedComponent,
        BtnCheckboxRenderedComponent,
        BtnCheckboxFilterComponent,
        DialogFormComponent,
        DialogMessageComponent,
        DialogTranslationComponent,
        DatagraphComponent,
        MapTreeComponent,
        CharacterCountPipe,
        FormValidationBannerComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        //AngularHalModule,
        TranslateModule,
        ReactiveFormsModule,
        NgxEchartsModule,
        DataTreeComponent,
        DialogFormComponent,
        DialogMessageComponent,
        DialogTranslationComponent,
        DatagraphComponent,
        // SitmunFrontendCoreModule
        MapTreeComponent,
        CharacterCountPipe,
        FormValidationBannerComponent,
        // DataGridComponent and DialogGridComponent are standalone and should be imported directly where needed
    ], imports: [RouterModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        //AngularHalModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AgGridModule,
        // SitmunFrontendCoreModule,
        MaterialModule,
        TranslateModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        })
        // NOTE: DataGridComponent and DialogGridComponent NOT imported here to avoid circular dependency
        // They're standalone and imported directly in AppModule and components that need them
    ], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class SitmunFrontendGuiModule {
}
