export const DEFAULT_BASE_URL = 'https://summitshare.co';
export const ALLOW_INSECURE_BASE_URL_ENV = 'AR_ALLOW_INSECURE_BASE_URL';

/**
 * Resolves the origin that gets baked into printed QR codes.
 *
 * Extracted from the generator so it can be tested directly: a sheet generated
 * against the wrong origin is unrecoverable — the medallions have to be
 * reprinted — so this guard is the one piece of the script that must not
 * regress silently.
 *
 * `env` is injected rather than read from `process.env` so a test can exercise
 * the matrix without mutating global state.
 */
export const normalizeBaseUrl = (env = process.env) => {
   const configured = env.AR_BASE_URL?.trim() || DEFAULT_BASE_URL;
   const url = new URL(configured);
   const isLocalhost =
      url.hostname === 'localhost' ||
      url.hostname.endsWith('.localhost') ||
      url.hostname === '127.0.0.1' ||
      url.hostname === '[::1]';
   const isPlainHttp = url.protocol === 'http:';
   const allowInsecureBaseUrl = env[ALLOW_INSECURE_BASE_URL_ENV]?.trim() === '1';

   if ((isLocalhost || isPlainHttp) && !allowInsecureBaseUrl) {
      const unsafeReasons = [
         isLocalhost ? 'a localhost/loopback host' : null,
         isPlainHttp ? 'a plain-http origin' : null,
      ].filter(Boolean);
      throw new Error(
         `Refusing to generate printable AR markers for ${
            url.origin
         }: the base URL uses ${unsafeReasons.join(
            ' and '
         )}. Use an HTTPS, non-localhost AR_BASE_URL. For intentional local testing only, set ${ALLOW_INSECURE_BASE_URL_ENV}=1.`
      );
   }

   url.hash = '';
   url.search = '';
   if (!url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
   }
   return url;
};
