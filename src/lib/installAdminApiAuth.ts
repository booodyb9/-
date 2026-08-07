import { supabase } from './supabase';

let installed = false;

export function installAdminApiAuth() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const requestUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const parsedUrl = new URL(requestUrl, window.location.origin);
    const isProtectedAdminApi =
      parsedUrl.origin === window.location.origin &&
      parsedUrl.pathname.startsWith('/api/generate-seo');

    if (!isProtectedAdminApi) {
      return nativeFetch(input, init);
    }

    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return nativeFetch(input, { ...init, headers });
  };
}
