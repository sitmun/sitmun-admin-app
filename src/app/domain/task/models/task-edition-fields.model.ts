/**
 * Task fields type enum
 */
export enum TaskFieldType {
  TEXT = 'text',
  DATE = 'date',
  IMAGE = 'image',
  NUMBER = 'number',
  LISTBOX = 'listbox'
}

/**
 * Task field model
 */
export class TaskEditionField {

  /** selectable */
  public selectable: boolean;

  /** editable */
  public editable: boolean;

  /** name */
  public name: string;

  /** label */
  public label: string;

  /** type */
  public type: TaskFieldType;

  /** value */
  public value: string;

  /** required */
  public required: boolean;

  /** query */
  public query: string;

  /**
   * Constructor for TaskField
   * @param selectable
   * @param editable
   * @param name The name of the field
   * @param label The label of the field
   * @param type The type of the field
   * @param value default value
   * @param required Whether the field is required
   * @param query
   */
  constructor(selectable?: boolean, editable?: boolean, name?: string, label?: string, type?: TaskFieldType,
    value?: string, required?: boolean, query?: string) {
    this.selectable = selectable;
    this.editable = editable;
    this.name = name;
    this.label = label;
    this.type = type;
    this.value = value;
    this.required = required;

    if (this.type === TaskFieldType.LISTBOX) {
      this.query = query;
    }
  }

  /**
   * Creates a new TaskField instance copying only the properties declared in TaskField class
   * @param source The source object to copy properties from
   * @returns A new TaskField instance with copied properties
   */
  public static fromObject(source: any): TaskEditionField {
    const field = new TaskEditionField();
    // Define the properties to copy
    const propertiesToCopy = [
      'name', 'label', 'type', 'value', 'selectable', 'editable', 'required'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        field[prop] = source[prop];
      }
    });
    if (source.type === TaskFieldType.LISTBOX && source.query !== undefined) {
      field.query = source.query;
    }
    return field;
  }
}

