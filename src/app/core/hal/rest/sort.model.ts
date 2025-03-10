/** SortOrder enum */
export type SortOrder = 'DESC' | 'ASC';
/** Sort data interface */
export interface Sort {
    /** sort path */
    path: string;
    /** sort order */
    order: SortOrder;
}

/** Sort data model */
export class Sort {
    /** path */
    public path: string;
    /** order */
    public order: SortOrder;

    /** constructor */
    constructor(path: string, order: SortOrder) {
        this.path = path;
        this.order = order;
    }
}