import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { magic } from '@environments/constants';

import { TasksDocumentExportComponent } from './tasks-document-export.component';

describe('TasksDocumentExportComponent', () => {
  const createComponent = () => {
    TestBed.configureTestingModule({});

    return TestBed.runInInjectionContext(() => new TasksDocumentExportComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {
        getSelCheckboxColumnDef: jest.fn().mockReturnValue({ field: '_select' }),
        getRouterLinkColumnDef: jest.fn().mockImplementation((_label: string, field: string) => ({ field })),
      } as any,
      { navigate: jest.fn() } as any,
      {} as any,
      { fetchAllItems: jest.fn(), update: jest.fn(), delete: jest.fn() } as any,
    ));
  };

  it('filters list requests by document export type id', () => {
    const component = createComponent();
    const fetchAllItems = jest.fn().mockReturnValue(of([]));
    (component as any).taskService.fetchAllItems = fetchAllItems;

    component.entityListConfig.dataFetchFn();

    expect(fetchAllItems).toHaveBeenCalledWith(
      { params: [{ key: 'type.id', value: magic.taskDocumentExportTypeId }] },
      undefined,
      'tasks',
    );
  });

  it('navigates to document export creation route', async () => {
    const component = createComponent();
    const navigate = jest.fn().mockResolvedValue(true);
    (component as any).router.navigate = navigate;

    await component.newData();

    expect(navigate).toHaveBeenCalledWith(['taskDocumentExport', -1, magic.taskDocumentExportTypeId]);
  });

  it('navigates to duplicate document export route', async () => {
    const component = createComponent();
    const navigate = jest.fn().mockResolvedValue(true);
    (component as any).router.navigate = navigate;

    await component.duplicateItem(9);

    expect(navigate).toHaveBeenCalledWith(['taskDocumentExport', -1, magic.taskDocumentExportTypeId, 9]);
  });
});
