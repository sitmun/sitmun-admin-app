import { Resource } from '@app/core/hal/resource/resource.model';

/**
 * Represents a capability within the system.
 * 
 * A capability defines a specific URL-based resource or service that can be accessed.
 * This class extends the base Resource model to provide capability-specific functionality.
 * 
 * @extends Resource
 */
export class Capabilities extends Resource {
  /**
   * The URL associated with this capability.
   * This URL typically points to the endpoint or resource that this capability represents.
   * 
   * @type {string}
   */
  public url: string;
}
