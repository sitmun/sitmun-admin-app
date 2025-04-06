import {MatTabChangeEvent} from "@angular/material/tabs";
import { Constructor } from "./common";

/**
 * Interface defining the properties and methods required for the ActiveTab mixin.
 * This interface ensures type safety for components using the ActiveTab functionality.
 */
interface ActiveTabMixin {
  /**
   * The index of the currently active tab.
   * Zero-based index where 0 represents the first tab.
   */
  activeTabIndex: number;

  /**
   * Handles tab change events from Material tabs.
   * @param event - The tab change event containing the new tab index and tab information
   */
  onTabChange(event: MatTabChangeEvent): void;

  /**
   * Checks if a specific tab is currently active.
   * @param index - The zero-based index of the tab to check
   * @returns True if the specified tab is active, false otherwise
   */
  isTabActive(index: number): boolean;
}

/**
 * A mixin that adds tab management functionality to a component.
 * This mixin provides tracking of the active tab index and handling of tab change events.
 * It can be used to enhance any class with tab management capabilities.
 *
 * @example
 * ```typescript
 * class MyComponent extends activeTabMixin(BaseClass) {
 *   // Your component code here
 * }
 * ```
 * 
 * @param Base - The base class to extend with the mixin functionality
 * @returns A new class that extends the base class with ActiveTab functionality
 */
export function activeTabMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements ActiveTabMixin {
    /**
     * The index of the currently active tab, initialized to 0 (first tab).
     * This property is updated automatically when tabs are switched.
     */
    activeTabIndex = 0;

    /**
     * Updates the active tab index when a tab change occurs.
     * This method should be bound to the Material tab group's (selectedTabChange) event.
     * @param event - The tab change event from Material tabs
     */
    onTabChange(event: MatTabChangeEvent) {
      this.activeTabIndex = event.index;
    }

    /**
     * Checks if a specific tab is currently active.
     * Useful for conditional rendering or styling based on tab state.
     * @param index - The zero-based index of the tab to check
     * @returns True if the specified tab is active, false otherwise
     */
    isTabActive(index: number): boolean {
      return this.activeTabIndex === index;
    }
  }
}
