/**
 * Task more info parameter model
 */
export class TaskMoreInfoParameter {
  /** label */
  public label: string;

  /** order */
  public order: number | null;

  /** value */
  public value: string;

  /**
   * Constructor for TaskMoreInfoParameter
   */
  constructor(label?: string, order?: number | null, value?: string) {
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
      'label', 'order', 'value'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        parameter[prop] = source[prop];
      }
    });
    return parameter;
  }
}
