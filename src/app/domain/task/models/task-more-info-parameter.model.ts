/**
 * Task more info parameter model
 */
export class TaskMoreInfoParameter {
  /** key */
  public key: string;

  /** label */
  public label: string;

  /** order */
  public order: number | null;

  /** value */
  public value: string;

  /** name (legacy compatibility) */
  public name?: string;

  /** type (legacy compatibility) */
  public type?: string;

  /**
   * Constructor for TaskMoreInfoParameter
   */
  constructor(key?: string, label?: string, order?: number | null, value?: string) {
    this.key = key;
    this.label = label;
    this.order = order ?? null;
    this.value = value;
  }

  /**
   * Creates a new TaskMoreInfoParameter instance copying only the properties declared in TaskMoreInfoParameter class
   * @param source The source object to copy properties from
   * @returns A new TaskMoreInfoParameter instance with copied properties
   */
  public static fromObject(source: any): TaskMoreInfoParameter {
    const parameter = new TaskMoreInfoParameter();
    const propertiesToCopy = [
      'key', 'label', 'order', 'value', 'name', 'type'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        parameter[prop] = source[prop];
      }
    });
    if (!parameter.key && parameter.name) {
      parameter.key = parameter.name;
    }
    if (!parameter.name && parameter.key) {
      parameter.name = parameter.key;
    }
    return parameter;
  }
}
