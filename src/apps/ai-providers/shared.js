import { hasCredentialValue } from '../storage-providers/shared.js';

export const aiProviderLabels = {
    openai: 'OpenAI',
    anthropic: 'Claude',
    gemini: 'Google Gemini',
    copilot: 'GitHub Copilot'
};
export const aiProviderUrls = {
    openai: 'https://platform.openai.com/api-keys',
    anthropic: 'https://platform.claude.com/settings/keys',
    gemini: 'https://aistudio.google.com/apikey',
    copilot: 'https://github.com/settings/personal-access-tokens'
};
// The existing AI integrations use the record's key field for authentication.
export const aiKeys = () => ['key'];
export const aiValue = (api, key) => {
    if (hasCredentialValue(api?.[key])) return api[key];
    return api?.credentials?.[key];
};
export const aiIsConfigured = api => aiKeys(api).every(key => hasCredentialValue(aiValue(api, key)));
export const aiQuery = { type: 'ai' };
export const aiFieldLabels = { key: 'API key' };
