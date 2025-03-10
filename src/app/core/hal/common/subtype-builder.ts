import { Resource } from '../resource/resource.model';

/** SubTypeBuilder interface */
export interface SubTypeBuilder {
    /** subtypes map */
    subtypes: Map<string, any>;
    
    /** get subtype */
    subtypeBuilder(embeddedClassName: string): { new(): Resource };
}