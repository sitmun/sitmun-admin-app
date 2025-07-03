# Example: Refactoring Application Component

This example shows how to refactor an existing component to use the new `EntityListComponent`.

## Before (Original Application Component)

### Template (application.component.html)

```html
<mat-toolbar>
  <span class="spacer"></span>
  <h4>
    <mat-icon aria-hidden="true" svgIcon="menu_aplicacio"></mat-icon>
    <span> {{ "applicationEntity.application" | translate }}</span>
  </h4>
</mat-toolbar>

<app-data-grid id="connection"
               [columnDefs]="columnDefs"
               [getAll]='getAllApplications'
               [globalSearch]=true
               [eventRefreshSubscription]='dataUpdatedEvent.asObservable()'
               [eventSaveAgGridStateSubscription]='saveAgGridStateEvent.asObservable()'
               [discardChangesButton]=true
               [redoButton]=true
               [undoButton]=true
               [applyChangesButton]=true
               [deleteButton]=true
               [newButton]=true
               [actionButton]=true
               (remove)="removeData($event)"
               (new)='newData($event)'
               [defaultColumnSorting]="['name']"
               (gridModified)='setGridModifiedValue($event)'
               (sendChanges)='applyChanges($event)'
               (duplicate)='add($event)'>
</app-data-grid>
```

### Component Class (application.component.ts)

```typescript
export class ApplicationComponent extends BaseListComponent<Application> {
  // ... existing code ...
  
  getAllApplications = () => this.applicationService.getAll();
  
  override async postFetchData(): Promise<void> {
    this.columnDefs = [
      // ... column definitions ...
    ];
  }
  
  // ... other methods ...
}
```

## After (Using EntityListComponent)

### Template (application.component.html)

```html
<app-entity-list
  [config]="entityListConfig"
  (removeData)="removeData($event)"
  (newDataEvent)='newData($event)'
  (gridModifiedEvent)='setGridModifiedValue($event)'
  (sendChangesEvent)='applyChanges($event)'
  (duplicateData)='add($event)'>
</app-entity-list>
```

### Component Class (application.component.ts)

```typescript
import { EntityListConfig } from '@app/components/shared/entity-list';

export class ApplicationComponent extends BaseListComponent<Application> {
  entityListConfig: EntityListConfig<Application> = {
    entityLabel: 'applicationEntity.application',
    iconName: 'menu_aplicacio',
    columnDefs: [],
    dataFetchFn: () => this.applicationService.getAll(),
    defaultColumnSorting: ['name'],
    gridOptions: {
      globalSearch: true,
      discardChangesButton: true,
      redoButton: true,
      undoButton: true,
      applyChangesButton: true,
      deleteButton: true,
      newButton: true,
      actionButton: true,
      hideReplaceButton: false
    }
  };

  // ... existing constructor and other methods ...
  
  override async postFetchData(): Promise<void> {
    this.columnDefs = [
      // ... column definitions ...
    ];
    
    // Update the config with the column definitions
    this.entityListConfig.columnDefs = this.columnDefs;
  }
  
  // ... other methods remain the same ...
}
```

## Benefits of Refactoring

1. **Reduced Template Code**: From 29 lines to 8 lines (72% reduction)
2. **Consistent UI**: All entity lists will have the same structure and behavior
3. **Easier Maintenance**: Changes to the list UI only need to be made in one place
4. **Type Safety**: Configuration is type-checked at compile time
5. **Reusability**: The same component can be used for any entity type

## Migration Steps

1. Import `EntityListComponent` and `EntityListConfig`
2. Create `entityListConfig` property in your component
3. Replace the template with `<app-entity-list>`
4. Update `postFetchData()` to set `entityListConfig.columnDefs`
5. Remove any redundant properties that are now handled by the config

## Components That Can Be Refactored

Based on the codebase analysis, these components can benefit from the reusable `EntityListComponent`:

- `ConnectionComponent` ✅ (already refactored)
- `ApplicationComponent`
- `ServiceComponent`
- `LayersComponent`
- `TreesComponent`
- `BackgroundLayersComponent`
- `LayersPermitsComponent`
- `TerritoryComponent`
- `UserComponent`
- `RoleComponent`
- `TaskGroupComponent`
- `TasksBasicComponent`
- `TasksQueryComponent`
- `TasksEditionComponent`
- `TasksEditionDataTableComponent`
- And many more task-related components 
