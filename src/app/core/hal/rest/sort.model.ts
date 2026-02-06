/** Sort order type */
export type SortOrder = 'DESC' | 'ASC';

/** Sort data model (class provides both type and constructor). */
export class Sort {
    /** sort path */
    public path: string;
    /** sort order */
    public order: SortOrder;

    constructor(path: string, order: SortOrder) {
        this.path = path;
        this.order = order;
    }
}