import { TaskProperties } from './task.model';

/**
 * Builder for TaskProperties
 */
export class TaskPropertiesBuilder {
  private _scope: string | null = null;
  private _command: string | null = null;
  private _format: string | null = null;
  private _path: string | null = null;
  private _parameters: any[] = [];
  private _fields: any[] = [];

  /**
   * Creates a new TaskPropertiesBuilder
   * @returns A new TaskPropertiesBuilder
   */
  public static create(): TaskPropertiesBuilder {
    return new TaskPropertiesBuilder();
  }

  /**
   * Creates a new TaskPropertiesBuilder from existing TaskProperties
   * @param properties The source properties to copy from
   * @returns A new TaskPropertiesBuilder with copied properties
   */
  public static from(properties: TaskProperties | null | undefined): TaskPropertiesBuilder {
    if (!properties) {
      return new TaskPropertiesBuilder();
    }

    return new TaskPropertiesBuilder()
      .withScope(properties.scope)
      .withCommand(properties.command)
      .withFormat(properties.format)
      .withPath(properties.path)
      .withParameters(properties.parameters ? [...properties.parameters] : [])
      .withFields(properties.fields ? [...properties.fields] : []);
  }

  /**
   * Sets the scope
   * @param scope The scope value
   * @returns This builder for chaining
   */
  public withScope(scope: string | null): TaskPropertiesBuilder {
    this._scope = scope;
    return this;
  }

  /**
   * Sets the command
   * @param command The command value
   * @returns This builder for chaining
   */
  public withCommand(command: string | null): TaskPropertiesBuilder {
    this._command = command;
    return this;
  }

  /**
   * Sets the format
   * @param format The format value
   * @returns This builder for chaining
   */
  public withFormat(format: string | null): TaskPropertiesBuilder {
    this._format = format;
    return this;
  }

  /**
   * Sets the path
   * @param path The path value
   * @returns This builder for chaining
   */
  public withPath(path: string | null): TaskPropertiesBuilder {
    this._path = path;
    return this;
  }

  /**
   * Sets the parameters
   * @param parameters The parameters array
   * @returns This builder for chaining
   */
  public withParameters(parameters: any[]): TaskPropertiesBuilder {
    this._parameters = parameters;
    return this;
  }

  /**
   * Sets the fields
   * @param fields The fields array
   * @returns This builder for chaining
   */
  public withFields(fields: any[]): TaskPropertiesBuilder {
    this._fields = fields;
    return this;
  }

  /**
   * Adds a parameter to the parameters array
   * @param parameter The parameter to add
   * @returns This builder for chaining
   */
  public addParameter(parameter: any): TaskPropertiesBuilder {
    this._parameters.push(parameter);
    return this;
  }

  /**
   * Adds a field to the fields array
   * @param field The field to add
   * @returns This builder for chaining
   */
  public addField(field: any): TaskPropertiesBuilder {
    this._fields.push(field);
    return this;
  }

  /**
   * Builds the TaskProperties object
   * @returns A new TaskProperties object
   */
  public build(): TaskProperties {
    return {
      scope: this._scope,
      command: this._command,
      format: this._format,
      path: this._path,
      parameters: [...this._parameters],
      fields: [...this._fields],
    };
  }
} 