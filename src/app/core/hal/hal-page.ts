/** HAL collection page metadata with row payload */
export interface HalPage<T> {
  rows: T[];
  totalElements: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
