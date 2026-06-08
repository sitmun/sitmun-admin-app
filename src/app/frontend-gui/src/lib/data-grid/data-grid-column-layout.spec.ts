import {
  estimateHeaderMinWidth,
  prepareClientSideColumnDefs,
  prepareInfiniteColumnDefs,
  usesContentBasedColumnSizing,
  usesFlexColumnLayout,
} from './data-grid-column-layout';

describe('data-grid-column-layout', () => {
  describe('prepareInfiniteColumnDefs', () => {
    it('narrows checkbox and disables wrap/autoHeight', () => {
      const checkboxSelection = (params: {data?: unknown}) => !!params.data;
      const result = prepareInfiniteColumnDefs([
        {checkboxSelection, width: 56, maxWidth: 56, flex: 0, wrapText: true, autoHeight: true},
        {field: 'name', wrapText: true, autoHeight: true, width: 150, maxWidth: 300},
        {field: 'description', wrapText: true, autoHeight: true, flex: 2, maxWidth: 400},
      ]);

      expect(result[0]).toEqual(
        expect.objectContaining({checkboxSelection, width: 56, maxWidth: 56, flex: 0, wrapText: false, autoHeight: false})
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          field: 'name',
          wrapText: false,
          autoHeight: false,
          flex: 0,
          width: 150,
          maxWidth: 300,
          resizable: true,
        })
      );
      expect(result[2]).toEqual(
        expect.objectContaining({field: 'description', wrapText: false, autoHeight: false, flex: 2, resizable: true})
      );
      expect(result[2].width).toBeUndefined();
      expect(result[2].maxWidth).toBeUndefined();
    });
  });

  describe('prepareClientSideColumnDefs', () => {
    it('honors explicit flex columns and 56px checkbox', () => {
      const checkboxSelection = () => true;
      const result = prepareClientSideColumnDefs([
        {headerCheckboxSelection: true, checkboxSelection, maxWidth: 80},
        {field: 'role', flex: 2, minWidth: 140},
        {field: 'territory', flex: 3, minWidth: 160},
        {field: 'status', flex: 0, minWidth: 180, maxWidth: 180},
      ]);

      expect(result[0]).toEqual(
        expect.objectContaining({checkboxSelection, flex: 0, width: 56, maxWidth: 56, minWidth: 56})
      );
      expect(result[1]).toEqual(
        expect.objectContaining({field: 'role', flex: 2, minWidth: 140, wrapText: false, autoHeight: false})
      );
      expect(result[1].width).toBeUndefined();
      expect(result[2]).toEqual(expect.objectContaining({field: 'territory', flex: 3, minWidth: 160}));
      expect(result[3]).toEqual(
        expect.objectContaining({field: 'status', flex: 0, minWidth: 180, maxWidth: 180})
      );
      expect(usesFlexColumnLayout(result)).toBe(true);
    });

    it('gives last column flex when no explicit flex grow columns exist', () => {
      const result = prepareClientSideColumnDefs([
        {field: 'a', width: 100},
        {field: 'b'},
      ]);

      expect(result[0].flex).toBe(0);
      expect(result[0].width).toBe(100);
      expect(result[1].flex).toBe(1);
      expect(result[1].width).toBeUndefined();
    });

    it('raises minWidth to fit header text and sort chrome', () => {
      const result = prepareClientSideColumnDefs([
        {field: 'email', headerName: 'Correo electrónico', flex: 2, minWidth: 120},
      ]);

      expect(result[0].minWidth).toBeGreaterThanOrEqual(
        estimateHeaderMinWidth('Correo electrónico') + 32
      );
    });
  });

  describe('estimateHeaderMinWidth', () => {
    it('returns zero for blank headers', () => {
      expect(estimateHeaderMinWidth('   ')).toBe(0);
    });

    it('scales with header label length', () => {
      expect(estimateHeaderMinWidth('Tipo')).toBeLessThan(estimateHeaderMinWidth('Correo electrónico'));
    });
  });

  describe('usesContentBasedColumnSizing', () => {
    it('is false for infinite mode', () => {
      expect(usesContentBasedColumnSizing('infinite', [{field: 'a', flex: 2}])).toBe(false);
    });

    it('is false for clientSide flex layouts', () => {
      expect(usesContentBasedColumnSizing('clientSide', [{field: 'a', flex: 2}])).toBe(false);
    });

    it('is true for legacy clientSide grids without flex grow', () => {
      expect(usesContentBasedColumnSizing('clientSide', [{field: 'a'}, {field: 'b'}])).toBe(true);
    });
  });
});
