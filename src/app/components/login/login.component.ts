import { Component} from '@angular/core';
import { AuthService, LanguageService, Language } from 'dist/sitmun-frontend-core/';
import { LoginService } from 'dist/sitmun-frontend-core/';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    form: FormGroup;

    /** constructor */
    constructor( private fb: FormBuilder,
        private authService: AuthService,
        private loginService: LoginService,
        private languageService: LanguageService,
        private router: Router,
        private trans: TranslateService ) {
        
        this.translate = trans;
        let navigatorLang=config.languages.find(element => element.id===window.navigator.language);
        let defaultLang=config.defaultLang;
        if( navigatorLang!=undefined){
            defaultLang=window.navigator.language
        }
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
                // this.loadLanguages();
                console.log( 'User is logged in' );
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
        this.languagesLoaded = true;
    }

 
}
