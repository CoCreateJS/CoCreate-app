import { hasCredentialValue } from './storage.js';
export const cloudProviderLabels = {
            aws: "AWS",
            gcp: "Google Cloud",
            azure: "Azure",
            digitalocean: "DigitalOcean",
            oci: "Oracle Cloud",
            hetzner: "Hetzner",
            vultr: "Vultr",
            equinix: "Equinix"
        };
export const cloudProviderFields = {
            aws: ["accessKeyId", "secretAccessKey"],
            gcp: ["projectId", "clientEmail", "privateKey"],
            azure: ["subscriptionId", "accessToken", "resourceGroup"],
            digitalocean: ["token"],
            oci: ["tenancyId", "userId", "fingerprint", "privateKey", "compartmentId"],
            hetzner: ["token"],
            vultr: ["apiKey"],
            equinix: ["projectId", "token"]
        };
export const cloudProviderUrls = {
            aws: "https://console.aws.amazon.com/iam/",
            gcp: "https://console.cloud.google.com/iam-admin/serviceaccounts",
            azure: "https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade",
            digitalocean: "https://cloud.digitalocean.com/account/api/tokens",
            oci: "https://cloud.oracle.com/identity/users",
            hetzner: "https://console.hetzner.cloud/projects",
            vultr: "https://my.vultr.com/settings/#settingsapi",
            equinix: "https://console.equinix.com/"
        };

export const cloudValue = (api, key) => {
    if (hasCredentialValue(api?.[key])) return api[key];
    if (api?.credentials?.[key] !== undefined) return api.credentials[key];
    if (['token', 'apiKey'].includes(key) && api?.key !== undefined) return api.key;
    return api?.[key];
};
export const cloudKeys = api => cloudProviderFields[api?.provider] || ['key'];
export const cloudIsConfigured = api => cloudKeys(api).every(key => hasCredentialValue(cloudValue(api, key)));
export const cloudQuery = { type: 'cloud' };
