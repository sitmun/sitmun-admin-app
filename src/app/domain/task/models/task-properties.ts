/**
 * Opaque task properties storage.
 *
 * The backend persists this as a schemaless map, so the admin app should only
 * read/write known keys through this helper and preserve unknown keys.
 */
export type TaskProperties = Record<string, unknown>;

/**
 * Accessor and updater utilities for task properties.
 */
export class TaskPropertiesContract {
  private static readonly SCOPE = 'scope';
  private static readonly COMMAND = 'command';
  private static readonly PARAMETERS = 'parameters';
  private static readonly FIELDS = 'fields';
  private static readonly MIME_TYPE = 'mimeType';
  private static readonly FILENAME = 'filename';
  private static readonly HEADERS = 'headers';
  private static readonly QUERY_PARAMS = 'queryParams';
  private static readonly AUTHENTICATION_MODE = 'authenticationMode';
  private static readonly API_KEY_TYPE = 'apiKeyType';
  private static readonly TEMPLATE_HTML = 'templateHtml';
  private static readonly TEMPLATE_EDITOR_STATE = 'templateEditorState';

  /**
   * Normalizes unknown input into a safe properties record.
   */
  public static fromRaw(raw: unknown): TaskProperties {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    return { ...(raw as TaskProperties) };
  }

  /**
   * Clones properties to plain JSON-serializable object.
   */
  public static toRaw(properties: TaskProperties | null | undefined): TaskProperties {
    return { ...TaskPropertiesContract.fromRaw(properties) };
  }

  /**
   * Gets task scope.
   */
  public static getScope(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.SCOPE];
    return typeof value === 'string' ? value : null;
  }

  /**
   * Gets the authentication mode ('None', 'HTTP Basic authentication', 'API key', etc.).
   */
  public static getAuthenticationMode(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.AUTHENTICATION_MODE];
    return typeof value === 'string' ? value : null;
  }

  /**
   * Gets the HTTP Basic authentication username.
   */
  public static getUser(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)['user'];
    return typeof value === 'string' ? value : null;
  }

  /**
   * Gets the HTTP Basic authentication password.
   */
  public static getPassword(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)['password'];
    return typeof value === 'string' ? value : null;
  }

  /**
   * Gets task MIME type.
   */
  public static getMimeType(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.MIME_TYPE];
    return typeof value === 'string' ? value : null;
  }

  /**
   * Gets task resource filename.
   */
  public static getFilename(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.FILENAME];
    return typeof value === 'string' ? value : null;
  }

  public static getTemplateHtml(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.TEMPLATE_HTML];
    return typeof value === 'string' ? value : null;
  }

  public static getTemplateEditorState(properties: TaskProperties | null | undefined): unknown {
    return TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.TEMPLATE_EDITOR_STATE] ?? null;
  }

  /**
   * Gets the API key transport type: 'X-API-Key' (HTTP header), 'Cookie' or 'QueryParam'.
   * Note: this is NOT the authenticationMode value — it indicates how the key is sent.
   * Reads from the explicit 'apiKeyType' property if present (new format),
   * otherwise infers from the headers/queryParams structure (legacy format).
   */
  public static getApiKeyType(properties: TaskProperties | null | undefined): string | null {
    const props = TaskPropertiesContract.fromRaw(properties);
    // New format: type stored explicitly
    const stored = props[TaskPropertiesContract.API_KEY_TYPE];
    if (typeof stored === 'string' && stored.length > 0) return stored;
    // Legacy fallback: infer from structure
    const headers = props[TaskPropertiesContract.HEADERS] as Record<string, unknown> | null;
    if (headers && typeof headers === 'object') {
      if ('X-API-Key' in headers) return 'X-API-Key';
      if ('Cookie' in headers) return 'Cookie';
    }
    const qParams = props[TaskPropertiesContract.QUERY_PARAMS] as Record<string, unknown> | null;
    if (qParams && typeof qParams === 'object' && Object.keys(qParams).length > 0) return 'QueryParam';
    return null;
  }

  private static parseCookieKey(cookieVal: string): string | null {
    const eqIdx = cookieVal.indexOf('=');
    return eqIdx > 0 ? cookieVal.substring(0, eqIdx) : null;
  }

  private static parseCookieValue(cookieVal: string): string {
    const eqIdx = cookieVal.indexOf('=');
    return eqIdx > 0 ? cookieVal.substring(eqIdx + 1) : cookieVal;
  }

  private static getFirstHeaderEntry(
    props: TaskProperties,
    excludeKey?: string
  ): { key: string; value: string } | null {
    const headers = props[TaskPropertiesContract.HEADERS] as Record<string, unknown> | null;
    if (!headers || typeof headers !== 'object') return null;
    const key = Object.keys(headers).find(k => k !== excludeKey && typeof headers[k] === 'string');
    return key ? { key, value: headers[key] as string } : null;
  }

  /**
   * Gets the specific key name within the selected type.
   * For Cookie: extracts the name part from 'name=value' cookie format.
   * For header/QueryParam: returns the key name directly.
   */
  public static getApiKeyKeyName(properties: TaskProperties | null | undefined): string | null {
    const props = TaskPropertiesContract.fromRaw(properties);
    const type = TaskPropertiesContract.getApiKeyType(properties);
    if (type === 'Cookie') {
      const headers = props[TaskPropertiesContract.HEADERS] as Record<string, unknown> | null;
      if (headers && typeof headers['Cookie'] === 'string') {
        return TaskPropertiesContract.parseCookieKey(headers['Cookie']);
      }
      return null;
    }
    if (type === 'QueryParam') {
      const qParams = props[TaskPropertiesContract.QUERY_PARAMS] as Record<string, unknown> | null;
      if (qParams && typeof qParams === 'object') {
        const keys = Object.keys(qParams);
        return keys.length > 0 ? keys[0] : null;
      }
      return null;
    }
    if (type === 'X-API-Key') {
      return TaskPropertiesContract.getFirstHeaderEntry(props, 'Cookie')?.key ?? null;
    }
    return null;
  }

  /**
   * Gets the API key value.
   * For Cookie: extracts the value part from 'name=value' cookie format.
   * For header/queryParam: returns the value directly.
   */
  public static getApiKeyHeaderValue(properties: TaskProperties | null | undefined): string | null {
    const props = TaskPropertiesContract.fromRaw(properties);
    const type = TaskPropertiesContract.getApiKeyType(properties);
    if (type === 'Cookie') {
      const headers = props[TaskPropertiesContract.HEADERS] as Record<string, unknown> | null;
      if (headers && typeof headers['Cookie'] === 'string') {
        return TaskPropertiesContract.parseCookieValue(headers['Cookie']);
      }
      return null;
    }
    if (type === 'QueryParam') {
      const qParams = props[TaskPropertiesContract.QUERY_PARAMS] as Record<string, unknown> | null;
      if (qParams && typeof qParams === 'object') {
        const values = Object.values(qParams);
        return values.length > 0 && typeof values[0] === 'string' ? values[0] : null;
      }
      return null;
    }
    if (type === 'X-API-Key') {
      return TaskPropertiesContract.getFirstHeaderEntry(props, 'Cookie')?.value ?? null;
    }
    return null;
  }

  /**
   * Gets task command.
   */
  public static getCommand(properties: TaskProperties | null | undefined): string | null {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.COMMAND];
    return typeof value === 'string' ? value : null;
  }

  /**
   * Gets task parameters list.
   */
  public static getParameters(
    properties: TaskProperties | null | undefined
  ): Array<Record<string, unknown>> {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.PARAMETERS];
    return Array.isArray(value)
      ? value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      : [];
  }

  /**
   * Gets task fields list.
   */
  public static getFields(
    properties: TaskProperties | null | undefined
  ): Array<Record<string, unknown>> {
    const value = TaskPropertiesContract.fromRaw(properties)[TaskPropertiesContract.FIELDS];
    return Array.isArray(value)
      ? value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      : [];
  }

  /**
   * Sets task scope preserving unknown keys.
   */
  public static withScope(
    properties: TaskProperties | null | undefined,
    scope: string | null
  ): TaskProperties {
    return {
      ...TaskPropertiesContract.fromRaw(properties),
      [TaskPropertiesContract.SCOPE]: scope
    };
  }

  /**
   * Sets task command preserving unknown keys.
   */
  public static withCommand(
    properties: TaskProperties | null | undefined,
    command: string | null
  ): TaskProperties {
    return {
      ...TaskPropertiesContract.fromRaw(properties),
      [TaskPropertiesContract.COMMAND]: command
    };
  }

  /**
   * Sets task parameters preserving unknown keys.
   */
  public static withParameters(
    properties: TaskProperties | null | undefined,
    parameters: object[]
  ): TaskProperties {
    return {
      ...TaskPropertiesContract.fromRaw(properties),
      [TaskPropertiesContract.PARAMETERS]: [...parameters]
    };
  }

  /**
   * Sets task fields preserving unknown keys.
   */
  public static withFields(
    properties: TaskProperties | null | undefined,
    fields: object[]
  ): TaskProperties {
    return {
      ...TaskPropertiesContract.fromRaw(properties),
      [TaskPropertiesContract.FIELDS]: [...fields]
    };
  }

  public static withTemplateHtml(
    properties: TaskProperties | null | undefined,
    templateHtml: string | null
  ): TaskProperties {
    return {
      ...TaskPropertiesContract.fromRaw(properties),
      [TaskPropertiesContract.TEMPLATE_HTML]: templateHtml
    };
  }

  public static withTemplateEditorState(
    properties: TaskProperties | null | undefined,
    templateEditorState: unknown
  ): TaskProperties {
    return {
      ...TaskPropertiesContract.fromRaw(properties),
      [TaskPropertiesContract.TEMPLATE_EDITOR_STATE]: templateEditorState
    };
  }
}
