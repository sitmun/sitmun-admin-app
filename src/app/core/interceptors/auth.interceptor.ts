import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

function parseHttpUrl(value: string, applicationUrl?: URL): URL | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }
  try {
    const parsed = /^https?:\/\//i.test(normalized)
      ? new URL(normalized)
      : normalized.startsWith('//')
        ? new URL(`${applicationUrl?.protocol ?? ''}${normalized}`)
        : normalized.startsWith('/')
          ? applicationUrl && new URL(normalized, applicationUrl)
          : applicationUrl && new URL(`${applicationUrl.protocol}//${normalized}`);
    return parsed && (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? parsed : null;
  } catch {
    return null;
  }
}

/** True when the request targets the configured backend origin and path. */
export function isBackendApiUrl(
  url: string,
  apiBaseURL: string = environment.apiBaseURL,
  applicationOrigin: string | undefined = globalThis.location?.origin,
): boolean {
  const applicationUrl = parseHttpUrl(applicationOrigin ?? '');
  const requestUrl = parseHttpUrl(url, applicationUrl ?? undefined);
  const baseUrl = parseHttpUrl(apiBaseURL, applicationUrl ?? undefined);
  if (!requestUrl || !baseUrl || requestUrl.origin !== baseUrl.origin) {
    return false;
  }

  const basePath = baseUrl.pathname.replace(/\/+$/, '') || '/';
  return basePath === '/'
    || requestUrl.pathname === basePath
    || requestUrl.pathname.startsWith(`${basePath}/`);
}

/** Adds credentials and the admin client-selector header to backend requests. */
export class AuthInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isBackend = isBackendApiUrl(request.url);
        request = request.clone({
            withCredentials: true,
            ...(isBackend ? { setHeaders: { 'X-SITMUN-Client': 'admin' } } : {})
        });
        return next.handle(request);
    }

}
