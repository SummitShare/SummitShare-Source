import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Default OpenNext config for Cloudflare. Add an incremental cache override
// (R2) here only if pages use ISR or revalidation.
export default defineCloudflareConfig();
