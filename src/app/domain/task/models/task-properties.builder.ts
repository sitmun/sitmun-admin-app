import { TaskProperties, TaskPropertiesContract } from './task-properties';

/** Keys written by {@link TaskPropertiesBuilder.build}; excluded from preserved extras. */
const MANAGED_PROPERTY_KEYS = new Set([
  'scope',
  'command',
  'format',
  'path',
  'parameters',
  'fields',
  'authenticationMode',
  'user',
  'password',
  'apiKeyType',
  'mimeType',
  'filename',
  'headers',
  'queryParams',
]);

/** Copies keys not managed by the builder so schemaless properties survive round-trips. */
function extractExtraProperties(properties: TaskProperties): TaskProperties {
  const raw = TaskPropertiesContract.fromRaw(properties);
  const extras: TaskProperties = {};
  for (const key of Object.keys(raw)) {
    if (!MANAGED_PROPERTY_KEYS.has(key)) {
      extras[key] = raw[key];
    }
  }
  return extras;
}

/** Coerce unknown to string | null for TaskProperties string fields. */
function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

/** Coerce unknown to Record<string, string> | null for headers. */
function asHeaders(v: unknown): Record<string, string> | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const k of Object.keys(o)) if (typeof o[k] === 'string') out[k] = o[k] as string;
  return Object.keys(out).length ? out : null;
}

/**
 * Builder for TaskProperties
 */
export class TaskPropertiesBuilder {
  private readonly _extras: TaskProperties;
  private _scope: string | null = null;
  private _command: string | null = null;
  private _format: string | null = null;
  private _path: string | null = null;
  private _parameters: any[] = [];
  private _fields: any[] = [];
  private _authenticationMode: string | null = null;
  private _user: string | null = null;
  private _password: string | null = null;
  private _apiKeyType: string | null = null;
  private _headers: Record<string, string> | null = null;
  private _queryParams: Record<string, string> | null = null;
  private _mimeType: string | null = null;
  private _filename: string | null = null;

  private constructor(extras: TaskProperties = {}) {
    this._extras = extras;
  }

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
    const p = properties as Record<string, unknown>;
    return new TaskPropertiesBuilder(extractExtraProperties(properties))
      .withScope(TaskPropertiesContract.getScope(properties))
      .withCommand(TaskPropertiesContract.getCommand(properties))
      .withFormat(asString(p.format))
      .withPath(asString(p.path))
      .withParameters(TaskPropertiesContract.getParameters(properties))
      .withFields(TaskPropertiesContract.getFields(properties))
      .withAuthenticationMode(TaskPropertiesContract.getAuthenticationMode(properties))
      .withUser(TaskPropertiesContract.getUser(properties))
      .withPassword(TaskPropertiesContract.getPassword(properties))
      .withApiKeyType(TaskPropertiesContract.getApiKeyType(properties))
      .withHeaders(asHeaders(p.headers))
      .withQueryParams(asHeaders(p.queryParams))
      .withMimeType(TaskPropertiesContract.getMimeType(properties))
      .withFilename(TaskPropertiesContract.getFilename(properties));
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
   * Sets the authentication mode
   * @param authenticationMode The authentication mode value
   * @returns This builder for chaining
   */
  public withAuthenticationMode(authenticationMode: string | null): TaskPropertiesBuilder {
    this._authenticationMode = authenticationMode;
    return this;
  }

  /**
   * Sets the user name for authentication
   * @param user The user value
   * @returns This builder for chaining
   */
  public withUser(user: string | null): TaskPropertiesBuilder {
    this._user = user;
    return this;
  }

  /**
   * Sets the password for authentication
   * @param password The password value
   * @returns This builder for chaining
   */
  public withPassword(password: string | null): TaskPropertiesBuilder {
    this._password = password;
    return this;
  }

  /**
   * Sets the API key type ('X-API-Key', 'Cookie' or 'QueryParam')
   * @param apiKeyType The API key type value
   * @returns This builder for chaining
   */
  public withApiKeyType(apiKeyType: string | null): TaskPropertiesBuilder {
    this._apiKeyType = apiKeyType;
    return this;
  }

  /**
   * Sets the HTTP headers
   * @param headers The headers map
   * @returns This builder for chaining
   */
  public withHeaders(headers: Record<string, string> | null): TaskPropertiesBuilder {
    this._headers = headers;
    return this;
  }

  /**
   * Sets the query parameters map
   * @param queryParams The query parameters map
   * @returns This builder for chaining
   */
  public withQueryParams(queryParams: Record<string, string> | null): TaskPropertiesBuilder {
    this._queryParams = queryParams;
    return this;
  }

  /**
   * Sets the response MIME type
   * @param mimeType The MIME type value
   * @returns This builder for chaining
   */
  public withMimeType(mimeType: string | null): TaskPropertiesBuilder {
    this._mimeType = mimeType;
    return this;
  }

  /**
   * Sets the resource filename
   * @param filename The filename value
   * @returns This builder for chaining
   */
  public withFilename(filename: string | null): TaskPropertiesBuilder {
    this._filename = filename;
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
   * Builds the TaskProperties object, preserving unknown keys from {@link from}.
   * @returns A new TaskProperties object
   */
  public build(): TaskProperties {
    const properties: TaskProperties = {
      ...this._extras,
      scope: this._scope,
      command: this._command,
      format: this._format,
      path: this._path,
      parameters: [...this._parameters],
      fields: [...this._fields],
      authenticationMode: this._authenticationMode,
      user: this._user,
      password: this._password,
    };

    if (this._apiKeyType) {
      properties.apiKeyType = this._apiKeyType;
    }

    if (this._mimeType) {
      properties.mimeType = this._mimeType;
    }

    if (this._filename) {
      properties.filename = this._filename;
    }

    if (this._headers && Object.keys(this._headers).length > 0) {
      properties.headers = {...this._headers};
    }

    if (this._queryParams && Object.keys(this._queryParams).length > 0) {
      properties.queryParams = {...this._queryParams};
    }

    return properties;
  }
}
