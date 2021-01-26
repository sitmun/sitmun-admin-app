export const environment = {
  production: false,
  agGridTheme: "ag-theme-balham",
  scopeTypes : ['selectType','Municipal', 'Supramunicipal', 'Total'],
  apiBaseURL: 'https://sitmun-backend-core.herokuapp.com',
  tasksTypes : {
    'basic':1, 
    'download':2,
    'document':3,
    'locator':4,
    'query':5,
    'moreInfo':6,
    'report':7,
    'editionWFS':8,
    'thematic':9,
    'extraction':10,
    'NUMEdition':11,
    'RELEdition':12,
    'VISEdition':13,
    'HIDDENEdition':14
  },
  languages:[
    {id:"ca", name:"catalan"},
    {id:"es", name:"spanish"},
    {id:"en", name:"english"},
  ],
  defaultLang:"ca",
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
