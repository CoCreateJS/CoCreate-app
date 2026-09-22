export const storageProviderFields = {
    mongodb: ['url'],
    mysql: ['connectionUri'],
    postgresql: ['connectionUri'],
    sqlite: ['databaseUrl', 'authToken'],
    firestore: ['projectId', 'clientEmail', 'privateKey'],
    dynamodb: ['region', 'accessKeyId', 'secretAccessKey']
};
export const storageFieldLabels = {
    url: 'Connection URI',
    connectionUri: 'Connection URI',
    databaseUrl: 'Database URL',
    authToken: 'Auth token',
    projectId: 'Project ID',
    clientEmail: 'Client email',
    privateKey: 'Private key',
    region: 'AWS Region',
    accessKeyId: 'AWS Access Key ID',
    secretAccessKey: 'AWS Secret Access Key'
};
export const storageProviderLabels = {
    mongodb: 'MongoDB', mysql: 'MySQL', postgresql: 'PostgreSQL',
    sqlite: 'SQLite / libSQL', firestore: 'Firestore', dynamodb: 'DynamoDB'
};
export const storageProviderUrls = {
    mongodb: 'https://www.mongodb.com/docs/atlas/connect-to-database-deployment/',
    mysql: 'https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-connecting',
    postgresql: 'https://www.postgresql.org/docs/current/libpq-connect.html',
    sqlite: 'https://app.turso.tech/',
    firestore: 'https://firebase.google.com/docs/firestore/quickstart',
    dynamodb: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html'
};
export const hasCredentialValue = value => {
    if (typeof value === 'string') return value.trim() !== '' && !value.toLowerCase().includes('placeholder');
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') return Object.keys(value).length > 0;
    return value !== undefined && value !== null;
};
export const storageValue = (storage, key) => {
    if (hasCredentialValue(storage?.[key])) return storage[key];
    if (storage?.credentials?.[key] !== undefined) return storage.credentials[key];
    if (key !== 'url' && storage?.url && typeof storage.url === 'object') return storage.url[key];
    return storage?.[key];
};
export const storageKeys = storage => storageProviderFields[storage?.provider] || ['url'];
export const storageIsConfigured = storage => storageKeys(storage).every(key => hasCredentialValue(storageValue(storage, key)));
export const storageIsEnabled = storage => storage.enabled !== false && storage.enabled !== 'false';
export const formatCredentialLabel = key => storageFieldLabels[key] || key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/\bId\b/g, 'ID').replace(/^./, c => c.toUpperCase());
export const createProviderInput = ({ key, configured, storage = false }) => {
    const privateKey = /privateKey/i.test(key);
    const secret = /secret|password|token|privateKey|apiKey|accessKeyId|(^|Api)key$/i.test(key);
    const input = document.createElement(privateKey ? 'textarea' : 'input');
    input.className = 'form-control mt-1';
    input.autocomplete = 'off';
    input.required = !configured;
    if (storage) input.dataset.storageKey = key;
    else input.dataset.credentialKey = key;
    if (privateKey) { input.rows = 5; input.spellcheck = false; }
    else input.type = secret || (storage && ['url', 'connectionUri', 'databaseUrl'].includes(key)) ? 'password' : 'text';
    input.placeholder = configured ? '••••••••' : `Enter ${formatCredentialLabel(key).toLowerCase()}`;
    return input;
};
