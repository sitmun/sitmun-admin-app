import { Resource } from '@app/core';

/** SubTypeBuilder interface */
export interface SubTypeBuilder {
    /** subtypes map */
    subtypes: Map<string, any>;

    /** get subtype */
    subtypeBuilder(embeddedClassName: string): { new(): Resource };
}
