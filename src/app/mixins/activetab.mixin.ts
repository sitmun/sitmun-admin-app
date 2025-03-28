import {MatTabChangeEvent} from "@angular/material/tabs";

/**
 * Interface defining the properties and methods required for the ActiveTab mixin.
 */
interface ActiveTabMixin {
  /**
   * The index of the currently active tab.
   */
  activeTabIndex: number;
  
  /**
   * Handles tab change events from Material tabs.
   * @param event - The tab change event containing the new tab index
   */
  onTabChange(event: MatTabChangeEvent): void;
}

/**
 * A mixin that adds tab management functionality to a component.
 * This mixin provides tracking of the active tab index and handling of tab change events.
 * 
 * @param Base - The base class to extend with the mixin functionality
 * @returns A new class that extends the base class with ActiveTab functionality
 */
export function activeTabMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements ActiveTabMixin {
    /**
     * The index of the currently active tab, initialized to 0 (first tab).
     */
    activeTabIndex = 0;

    /**
     * Updates the active tab index when a tab change occurs.
     * @param event - The tab change event from Material tabs
     */
    onTabChange(event: MatTabChangeEvent) {
      this.activeTabIndex = event.index;
    }
  }
}
