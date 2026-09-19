import { hasCredentialValue } from '../storage-providers/shared.js';

export const routingProviderLabels = {
    cloudflare: 'Cloudflare',
    dnsimple: 'DNSimple',
    bunny: 'bunny.net',
    dnsmadeeasy: 'DNS Made Easy',
    easydns: 'easyDNS',
    cloudns: 'ClouDNS'
};
export const routingProviderFields = {
    cloudflare: ['key'],
    dnsimple: ['accountId', 'token'],
    bunny: ['apiKey'],
    dnsmadeeasy: ['apiKey', 'secretKey'],
    easydns: ['userToken', 'apiKey'],
    cloudns: ['authId', 'authPassword']
};
export const routingProviderUrls = {
    cloudflare: 'https://dash.cloudflare.com/profile/api-tokens',
    dnsimple: 'https://developer.dnsimple.com/v2/#authentication',
    bunny: 'https://panel.bunny.net/account/settings',
    dnsmadeeasy: 'https://support.dnsmadeeasy.com/hc/en-us/articles/34326955127451-Finding-or-Generating-API-Keys-In-DNS-Made-Easy',
    easydns: 'https://docs.sandbox.rest.easydns.net/beta_signup.php',
    cloudns: 'https://www.cloudns.net/wiki/article/42/'
};
// Cloudflare uses `key` in the existing API Authorization template.
export const routingValue = (api, key) => {
    if (hasCredentialValue(api?.[key])) return api[key];
    if (hasCredentialValue(api?.credentials?.[key])) return api.credentials[key];
    const aliases = key === 'key' ? ['token', 'apiToken', 'apiKey'] :
        ['token', 'apiKey'].includes(key) ? ['key'] : [];
    for (const alias of aliases) {
        if (hasCredentialValue(api?.[alias])) return api[alias];
        if (hasCredentialValue(api?.credentials?.[alias])) return api.credentials[alias];
    }
    return api?.[key];
};
export const routingKeys = api => routingProviderFields[api?.provider] || ['key'];
export const routingIsConfigured = api => routingKeys(api).every(key => hasCredentialValue(routingValue(api, key)));
export const routingQuery = { type: 'routing' };
