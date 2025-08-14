/**
 * Task parameter model
 */
export class TaskParameter {
  /** name*/
  public name: string;

  /** type*/
  public type: string;

  /** value*/
  public value: string;

  /**
   * Constructor for TaskParameter
   * @param name The name of the parameter
   * @param type The type of the parameter
   * @param value The value of the parameter
   */
  constructor(name?: string, type?: string, value?: string) {
    this.name = name;
    this.type = type;
    this.value = value;
  }

  /**
   * Creates a new TaskParameter instance copying only the properties declared in TaskParameter class
   * @param source The source object to copy properties from
   * @returns A new TaskParameter instance with copied properties
   */
  public static fromObject(source: any): TaskParameter {
    const parameter = new TaskParameter();
    // Define the properties to copy
    const propertiesToCopy = [
      'name', 'type', 'value'
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

