import { Resource } from '../angular-hal/src/lib/resource';
import { Language } from './language.model';
/** Task model */
export declare class Translation extends Resource {
    /** id */
    id: number;
    /** id */
    element: number;
    /** name */
    translation: string;
    /** column */
    column: string;
    /** name */
    language: Language;
}
