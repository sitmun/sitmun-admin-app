import {Injectable} from '@angular/core';
import {Configuration, FormConfiguration} from './configuration';

/**
 * Service that provides access to SITMUN form configurations.
 * This service centralizes the management of form properties and makes it
 * easy for components to access their specific configuration.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  /**
   * Get configuration for a specific form by ID
   * @param id The form ID (e.g., 'connection', 'service', etc.)
   * @returns The form configuration or undefined if not found
   */
  getFormConfiguration(id: string): FormConfiguration | undefined {
    return Configuration.getConfigurationById(id);
  }

  /**
   * Get all form configurations
   * @returns Array of all form configurations
   */
  getAllFormConfigurations(): FormConfiguration[] {
    return Configuration.getAllConfigurations();
  }

  /**
   * Get menu structure for the side menu
   * @returns The menu structure as used by the side menu component
   */
  getMenuStructure() {
    return Configuration.getMenuStructure();
  }

  /**
   * Get form configuration for a component by its route
   * @param route The route path (e.g., 'connection', 'service')
   * @returns The form configuration or undefined if not found
   */
  getFormConfigurationByRoute(route: string): FormConfiguration | undefined {
    return this.getAllFormConfigurations().find(config => config.route === route);
  }

  /**
   * Get form configuration for a component by its component name
   * @param componentName The component name (e.g., 'ConnectionComponent')
   * @returns The form configuration or undefined if not found
   */
  getFormConfigurationByComponent(componentName: string): FormConfiguration | undefined {
    return this.getAllFormConfigurations().find(config => config.component === componentName);
  }

  /**
   * Get form configuration for a form component by its component name
   * @param formComponentName The form component name (e.g., 'ConnectionFormComponent')
   * @returns The form configuration or undefined if not found
   */
  getFormConfigurationByFormComponent(formComponentName: string): FormConfiguration | undefined {
    return this.getAllFormConfigurations().find(config => config.formComponent === formComponentName);
  }
}
