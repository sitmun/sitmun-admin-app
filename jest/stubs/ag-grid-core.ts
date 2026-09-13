export const ModuleRegistry = {
  registerModules(_modules: unknown[]): void {}
};

export type GridOptions = Record<string, unknown>;
export type GridApi = Record<string, unknown>;
export type ColDef = Record<string, unknown>;
export type CellClickedEvent = Record<string, unknown>;
export type FilterChangedEvent = Record<string, unknown>;
export type GridReadyEvent = Record<string, unknown>;
export type IDatasource = Record<string, unknown>;
export type IGetRowsParams = Record<string, unknown>;
export type ColDefField = string;
export type EditableCallback<TData = unknown> = (...args: unknown[]) => boolean;
export type ValueGetterParams<TData = unknown, TValue = unknown> = {
  data?: TData;
  value?: TValue;
};
export type ValueSetterParams<TData = unknown, TValue = unknown> = {
  data?: TData;
  newValue?: TValue;
};
export type ValueGetterFunc<TData = unknown, TValue = unknown> = (
  params: ValueGetterParams<TData, TValue>
) => TValue;
export type ValueSetterFunc<TData = unknown, TValue = unknown> = (
  params: ValueSetterParams<TData, TValue>
) => boolean;
export type IFloatingFilterParams = {
  parentFilterInstance(
    cb: (instance: {onFloatingFilterChanged: (...args: unknown[]) => void}) => void
  ): void;
};
