import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, of} from 'rxjs';

import {BaseFormComponent} from '@app/components/base-form.component';
import {Resource} from '@app/core';
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {CodeListService, TranslationService} from '@app/domain';
import {DIALOG_EVENTS, DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

interface TestEntity extends Resource {
  id: number;
  name: string;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return {promise, resolve, reject};
}

@Component({ template: '', standalone: false })
class TestFormComponent extends BaseFormComponent<Resource> {
  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
    });
  }

  override empty(): Resource {
    return {} as Resource;
  }
}

@Component({ template: '', standalone: false })
class RouteLoadingTestFormComponent extends BaseFormComponent<TestEntity> {
  readonly deferredById = new Map<number, ReturnType<typeof deferred<TestEntity>>>();
  readonly postFetchEntityIds: number[] = [];
  readonly afterFetchEntityIds: number[] = [];
  readonly fetchOriginalStarts: number[] = [];

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
  }

  ensureDeferred(id: number): ReturnType<typeof deferred<TestEntity>> {
    let pending = this.deferredById.get(id);
    if (!pending) {
      pending = deferred<TestEntity>();
      this.deferredById.set(id, pending);
    }
    return pending;
  }

  override empty(): TestEntity {
    return {id: -1, name: ''} as TestEntity;
  }

  override async preFetchData(): Promise<void> {
    return Promise.resolve();
  }

  override async fetchRelatedData(): Promise<void> {
    return Promise.resolve();
  }

  override async fetchOriginal(): Promise<TestEntity> {
    this.fetchOriginalStarts.push(this.entityID);
    return this.ensureDeferred(this.entityID).promise;
  }

  override postFetchData(): void {
    this.postFetchEntityIds.push(this.entityToEdit.id);
    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, Validators.required),
    });
  }

  override afterFetch(): void {
    this.afterFetchEntityIds.push(this.entityToEdit?.id ?? this.entityID);
    super.afterFetch();
  }
}

describe('BaseFormComponent canDeactivate', () => {
  let component: TestFormComponent;
  let dialogOpenSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestFormComponent],
      providers: [
        provideErrorHandlerForTests(),
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key },
        },
        {
          provide: TranslationService,
          useValue: {},
        },
        {
          provide: CodeListService,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: LoadingOverlayService,
          useValue: { wrap: (_label: string, fn: () => Promise<unknown>) => fn() },
        },
        {
          provide: MessagesInterceptorStateService,
          useValue: { isEnabled: () => true, enable: jest.fn(), disable: jest.fn() },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    dialogOpenSpy = jest.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({
      afterClosed: () => of({ event: DIALOG_EVENTS.CANCEL }),
    } as MatDialogRef<DialogMessageComponent>);
  });

  it('allows navigation when pristine', async () => {
    await expect(component.canDeactivate()).resolves.toBe(true);
    expect(dialogOpenSpy).not.toHaveBeenCalled();
  });

  it('blocks navigation when dirty and user keeps editing', async () => {
    component.entityForm.markAsDirty();
    await expect(component.canDeactivate()).resolves.toBe(false);
    expect(dialogOpenSpy).toHaveBeenCalled();
  });

  it('allows navigation when dirty and user discards changes', async () => {
    dialogOpenSpy.mockReturnValue({
      afterClosed: () => of({ event: DIALOG_EVENTS.ACCEPT }),
    } as MatDialogRef<DialogMessageComponent>);
    component.entityForm.markAsDirty();
    await expect(component.canDeactivate()).resolves.toBe(true);
  });
});

describe('BaseFormComponent route loading', () => {
  let fixture: ComponentFixture<RouteLoadingTestFormComponent>;
  let component: RouteLoadingTestFormComponent;
  let params$: BehaviorSubject<Params>;
  let route: { params: ReturnType<BehaviorSubject<Params>['asObservable']>; snapshot: { params: Params; url: unknown[] } };
  let handleErrorSpy: jest.SpyInstance;

  function emitRouteId(id: number): void {
    const nextParams = {id: String(id)};
    route.snapshot.params = nextParams;
    params$.next(nextParams);
  }

  async function flushMicrotasks(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
  }

  async function waitFor(predicate: () => boolean, label: string): Promise<void> {
    for (let attempt = 0; attempt < 50; attempt++) {
      if (predicate()) {
        return;
      }
      await flushMicrotasks();
    }
    throw new Error(`Timed out waiting for ${label}`);
  }

  beforeEach(async () => {
    params$ = new BehaviorSubject<Params>({id: '1'});
    route = {
      params: params$.asObservable(),
      snapshot: {params: {id: '1'}, url: []},
    };

    await TestBed.configureTestingModule({
      declarations: [RouteLoadingTestFormComponent],
      providers: [
        provideErrorHandlerForTests(),
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key },
        },
        {
          provide: TranslationService,
          useValue: {},
        },
        {
          provide: CodeListService,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: route,
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: LoadingOverlayService,
          useValue: { wrap: (_label: string, fn: () => Promise<unknown>) => fn() },
        },
        {
          provide: MessagesInterceptorStateService,
          useValue: { isEnabled: () => true, enable: jest.fn(), disable: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteLoadingTestFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    handleErrorSpy = jest.spyOn(TestBed.inject(ErrorHandlerService), 'handleError').mockImplementation(() => undefined);
    component.ensureDeferred(1);
    component.ensureDeferred(2);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('hides stale controls immediately when the route id changes', async () => {
    fixture.detectChanges();
    await waitFor(() => component.fetchOriginalStarts.includes(1), 'fetch for id 1 to start');

    component.ensureDeferred(1).resolve({id: 1, name: 'entity-1'} as TestEntity);
    await waitFor(() => component.dataLoaded && component.entityForm?.get('name')?.value === 'entity-1', 'id 1 form load');

    emitRouteId(2);
    expect(component.dataLoaded).toBe(false);

    await waitFor(() => component.fetchOriginalStarts.includes(2), 'fetch for id 2 to start');
    component.ensureDeferred(2).resolve({id: 2, name: 'entity-2'} as TestEntity);
    await waitFor(() => component.dataLoaded && component.entityForm?.get('name')?.value === 'entity-2', 'id 2 form load');
  });

  it('commits only the latest route id when an earlier fetch resolves later', async () => {
    fixture.detectChanges();
    await waitFor(() => component.fetchOriginalStarts.includes(1), 'fetch for id 1 to start');

    emitRouteId(2);
    expect(component.dataLoaded).toBe(false);

    component.ensureDeferred(1).resolve({id: 1, name: 'entity-1'} as TestEntity);
    await waitFor(() => component.fetchOriginalStarts.includes(2), 'fetch for id 2 to start after obsolete id 1');

    expect(component.postFetchEntityIds).toEqual([]);
    expect(component.afterFetchEntityIds).toEqual([]);
    expect(component.dataLoaded).toBe(false);
    expect(component.fetchOriginalStarts).toEqual([1, 2]);

    component.ensureDeferred(2).resolve({id: 2, name: 'entity-2'} as TestEntity);
    await waitFor(() => component.dataLoaded && component.entityForm?.get('name')?.value === 'entity-2', 'id 2 form commit');

    expect(component.postFetchEntityIds).toEqual([2]);
    expect(component.afterFetchEntityIds).toEqual([2]);
    expect(component.entityID).toBe(2);
    expect(component.entityToEdit.id).toBe(2);
  });

  it('keeps controls hidden when the current fetch fails', async () => {
    fixture.detectChanges();
    await waitFor(() => component.fetchOriginalStarts.includes(1), 'fetch for id 1 to start');

    component.ensureDeferred(1).reject(new Error('load failed'));
    await waitFor(() => handleErrorSpy.mock.calls.length > 0, 'error handler');

    expect(component.dataLoaded).toBe(false);
    expect(component.postFetchEntityIds).toEqual([]);
    expect(component.afterFetchEntityIds).toEqual([]);
    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
