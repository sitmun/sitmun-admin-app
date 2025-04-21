/**
 * Task parameter model
 */
export class TaskQueryParameter {
  /** name*/
  public key: string;

  /** type*/
  public label: string;

  /** value*/
  public type: string;

  /** value*/
  public value: string;

  /** value*/
  public order: number;

  /**
   * Constructor for TaskParameter
   * @param key The key of the parameter
   * @param label The label of the parameter
   * @param type The type of the parameter
   * @param value The value of the parameter
   * @param order The order of the parameter
   */
  constructor(key?: string, label?: string, type?: string, value?: string, order?: number) {
    this.key = key;
    this.label = label;
    this.type = type;
    this.value = value;
    this.order = order;
  }

  /**
   * Creates a new TaskParameter instance copying only the properties declared in TaskParameter class
   * @param source The source object to copy properties from
   * @returns A new TaskParameter instance with copied properties
   */
  public static fromObject(source: any): TaskQueryParameter {
    const parameter = new TaskQueryParameter();
    // Define the properties to copy
    const propertiesToCopy = [
      'key', 'label', 'type', 'value', 'order'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        parameter[prop] = source[prop];
      }
    });
    return parameter;
  }
}

