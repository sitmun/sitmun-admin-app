/**
 * Model for More Info task properties
 */
export class TaskMoreInfoProperties {
  /** Parent task ID (only for child tasks) */
  parentTaskId?: number;

  /** Cartography ID */
  cartographyId?: number;

  /** Data access type: api, sql, or url-redirect */
  dataAccessType?: 'api' | 'sql' | 'url-redirect';

  /** Additional configuration as JSON string */
  configuration?: string;

  /**
   * Creates properties from a plain object
   */
  public static fromObject(source: any): TaskMoreInfoProperties {
    const props = new TaskMoreInfoProperties();
    
    if (!source) {
      return props;
    }

    props.parentTaskId = source.parentTaskId;
    props.cartographyId = source.cartographyId;
    props.dataAccessType = source.dataAccessType;
    props.configuration = source.configuration;

    return props;
  }

  /**
   * Converts properties to a plain object
   */
  public toObject(): any {
    return {
      parentTaskId: this.parentTaskId,
      cartographyId: this.cartographyId,
      dataAccessType: this.dataAccessType,
      configuration: this.configuration
    };
  }
}
