import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {FormConfiguration} from './configuration';

/**
 * Base class for form components that provides automatic configuration
 * from the Configuration. This class centralizes form properties
 * and makes it easy for components to access their specific configuration.
 */
@Component({template: ''})
export abstract class BaseConfigurationComponent implements OnInit {

  /**
   * The form configuration for this component
   */
  protected formConfiguration: FormConfiguration;

  /**
   * The entity type label for this form
   */
  protected entityType: string;

  /**
   * The icon for this form
   */
  protected icon: string;

  /**
   * The font for the icon (if specified)
   */
  protected font?: string;

  /**
   * The component name for configuration lookup
   */
  protected componentName: string;

  constructor(
    protected configurationService: ConfigurationService
  ) {
  }

  /**
   * Initialize the component configuration
   */
  ngOnInit(): void {
    this.initializeConfiguration();
  }

  /**
   * Get the form configuration
   */
  getFormConfiguration(): FormConfiguration | undefined {
    return this.formConfiguration;
  }

  /**
   * Get the entity type label
   */
  getEntityType(): string {
    return this.entityType;
  }

  /**
   * Get the icon
   */
  getIcon(): string {
    return this.icon;
  }

  /**
   * Get the font
   */
  getFont(): string | undefined {
    return this.font;
  }

  /**
   * Get the route for this form
   */
  getRoute(): string {
    return this.formConfiguration?.route || '';
  }

  /**
   * Get the form route for this form
   */
  getFormRoute(): string {
    return this.formConfiguration?.formRoute || '';
  }

  /**
   * Get the duplicate route for this form
   */
  getDuplicateRoute(): string {
    return this.formConfiguration?.duplicateRoute || '';
  }

  /**
   * Set the component name for configuration lookup
   * This should be called by child classes in their constructor
   */
  protected setComponentName(componentName: string): void {
    this.componentName = componentName;
  }

  /**
   * Initialize the form configuration based on the component name
   */
  protected initializeConfiguration(): void {
    this.formConfiguration = this.configurationService
      .getFormConfigurationByComponent(this.componentName);

    if (this.formConfiguration) {
      this.entityType = this.formConfiguration.labelPlural;
      this.icon = this.formConfiguration.icon;
      this.font = this.formConfiguration.font;
    } else {
      console.warn(`No configuration found for component: ${this.componentName}`);
    }
  }
}
