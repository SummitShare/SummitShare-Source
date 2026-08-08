import { describe, expect, it } from 'vitest';
import {
   ALLOW_INSECURE_BASE_URL_ENV,
   DEFAULT_BASE_URL,
   normalizeBaseUrl,
} from './baseUrl.mjs';

describe('normalizeBaseUrl', () => {
   it('defaults to the production origin', () => {
      expect(normalizeBaseUrl({}).href).toBe('https://summitshare.co/');
   });

   it('does not default to a localhost origin', () => {
      // The regression this guard exists for: markers printed against a
      // localhost default are unrecoverable.
      expect(DEFAULT_BASE_URL).not.toMatch(/localhost|127\.0\.0\.1|\[::1\]/);
      expect(DEFAULT_BASE_URL.startsWith('https://')).toBe(true);
   });

   it.each([
      'http://localhost:3000',
      'https://localhost:3000',
      'https://app.localhost',
      'http://127.0.0.1:3000',
      'http://[::1]:3000',
      'http://summitshare.co',
   ])('refuses %s', (base) => {
      expect(() => normalizeBaseUrl({ AR_BASE_URL: base })).toThrow(
         /Refusing to generate printable AR markers/
      );
   });

   it('names every reason an origin was refused', () => {
      expect(() =>
         normalizeBaseUrl({ AR_BASE_URL: 'http://localhost:3000' })
      ).toThrow(/a localhost\/loopback host and a plain-http origin/);
   });

   it.each(['http://localhost:3000', 'http://127.0.0.1:3000'])(
      'allows %s only behind the opt-out',
      (base) => {
         const env = {
            AR_BASE_URL: base,
            [ALLOW_INSECURE_BASE_URL_ENV]: '1',
         };
         expect(normalizeBaseUrl(env).origin).toBe(new URL(base).origin);
      }
   );

   it('treats any opt-out value other than "1" as unset', () => {
      expect(() =>
         normalizeBaseUrl({
            AR_BASE_URL: 'http://localhost:3000',
            [ALLOW_INSECURE_BASE_URL_ENV]: 'true',
         })
      ).toThrow(/Refusing to generate/);
   });

   it.each(['https://summitshare.co', 'https://staging.summitshare.co'])(
      'accepts %s',
      (base) => {
         expect(normalizeBaseUrl({ AR_BASE_URL: base }).origin).toBe(base);
      }
   );

   it('strips the query and hash, which would corrupt the encoded marker URL', () => {
      const url = normalizeBaseUrl({
         AR_BASE_URL: 'https://summitshare.co/x?utm=print#frag',
      });
      expect(url.search).toBe('');
      expect(url.hash).toBe('');
      expect(url.href).toBe('https://summitshare.co/x/');
   });

   it('ensures a trailing slash so marker paths resolve against the full base', () => {
      expect(
         new URL('ar/drum', normalizeBaseUrl({ AR_BASE_URL: 'https://s.co/v2' }))
            .href
      ).toBe('https://s.co/v2/ar/drum');
   });

   it('trims surrounding whitespace before parsing', () => {
      expect(
         normalizeBaseUrl({ AR_BASE_URL: '  https://summitshare.co  ' }).origin
      ).toBe('https://summitshare.co');
   });
});
