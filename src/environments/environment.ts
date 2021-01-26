// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  agGridTheme: "ag-theme-balham",
  scopeTypes: ['selectType', 'Municipal', 'Supramunicipal', 'Total'],
  apiBaseURL: `http://localhost:8080`,
  tasksTypes: {
    'basic': 1,
    'download': 2,
    'document': 3,
    'locator': 4,
    'query': 5,
    'moreInfo': 6,
    'report': 7,
    'editionWFS': 8,
    'thematic': 9,
    'extraction': 10,
    'NUMEdition': 11,
    'RELEdition': 12,
    'VISEdition': 13,
    'HIDDENEdition': 14
  },
  languages: [
    { id: "ca", name: "catalan" },
    { id: "es", name: "spanish" },
    { id: "en", name: "english" },
  ],
  defaultLang: "ca",
  selCheckboxColumnDef: {
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    editable: false,
    filter: false,
    minWidth: 45,
    maxWidth: 45,
    lockPosition: true
  },
  editBtnColumnDef:{
    headerName: '',
    field: 'id',
    editable: false,
    filter: false,
    minWidth: 48,
    maxWidth: 48,
    lockPosition: true,
    cellRenderer: 'btnEditRendererComponent',
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
