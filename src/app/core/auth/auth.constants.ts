/** Cookie name for OIDC JWT set by backend after successful OIDC login. */
export const OIDC_TOKEN_COOKIE = 'oidc_token';

/** Query param name for OIDC client type; backend uses it to pick redirect URL. */
export const OIDC_CLIENT_TYPE_QUERY_PARAM = 'client_type';

/** Value for client_type when this app is the OIDC client. */
export const OIDC_CLIENT_TYPE_ADMIN = 'admin';
