import { Component} from '@angular/core';
import { AuthService, LanguageService, LoginService } from '../../frontend-core/src/lib/public_api';

import { config } from 'src/config';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** Login component*/
@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
} )
export class LoginComponent {
    langs:any[];
    /** bad credentials message*/
    badCredentials: string;

    /** translate service*/
    translate;

    languagesLoaded = false;

    /** form */
    form: UntypedFormGroup;

    /** constructor */
    constructor( private fb: UntypedFormBuilder,
        private authService: AuthService,
        private loginService: LoginService,
        private languageService: LanguageService,
        private router: Router,
        private trans: TranslateService ) {
        
        this.translate = trans;
        let navigatorLang=window.navigator.language.split('-')[0];
        let defaultLang=config.defaultLang;
        this.form = this.fb.group( {
            username: ['', Validators.required],
            password: ['', Validators.required],
            lang:[defaultLang, Validators.required],
        } );

        this.loadLanguages();


        // this.langs=config.languages
       
    }
    

    /** login action */
    login() {
        const val = this.form.value;

        if ( val.username && val.password ) {
            this.loginService.login( val ).then(() => {
                this.translate.use(this.form.value.lang)
                this.translate.setDefaultLang(this.form.value.lang);
                localStorage.setItem('lang',this.form.value.lang );
                // this.loadLanguages()
                this.router.navigateByUrl( '/' );
            }, ( err ) => {
                this.translate.use(this.form.value.lang)
                this.translate.setDefaultLang(this.form.value.lang);
                localStorage.setItem('lang',this.form.value.lang );
                this.badCredentials = 'ERROR';

            } );

        }
    }
    async loadLanguages(){
        this.langs = await this.languageService.getAll().toPromise()
        if(this.trans.currentLang){
            
            this.langs.sort((a,b) => this.trans.instant('lang.'+a.name).localeCompare(this.trans.instant('lang.'+b.name)));
            this.languagesLoaded = true;
        }
        else{
            this.langs.sort((a,b) => a.name.localeCompare(b.name));
            this.languagesLoaded = true;
        }

    }

 
}
