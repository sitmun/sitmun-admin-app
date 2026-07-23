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

  /** description */
  public description?: string;

  /** whether the parameter value is provided/fixed (not from client) */
  public provided?: boolean;

  /**
   * Constructor for TaskMoreInfoParameter
   */
  constructor(label?: string, order?: number | null, value?: string, description?: string, provided?: boolean) {
    this.label = label;
    this.order = order ?? null;
    this.value = value;
    this.description = description;
    this.provided = provided;
  }

  /**
   * Creates a new TaskMoreInfoParameter instance copying only the properties declared in TaskMoreInfoParameter class
   * @param source The source object to copy properties from
   * @returns A new TaskMoreInfoParameter instance with copied properties
   */
  public static fromObject(source: any): TaskMoreInfoParameter {
    const parameter = new TaskMoreInfoParameter();
    const propertiesToCopy = [
      'label', 'order', 'value', 'description', 'provided'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        parameter[prop] = source[prop];
      }
    });
    return parameter;
  }
}
