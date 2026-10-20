# Instance storage contract

Clusters store `storage` as the `_id` of an `apis` record. The provisioning form
and autoscaler pass that same ID in `create-instance` request `data.storage`.
Credentials are resolved by the endpoint AST for each invocation.

Every cloud `create-instance` endpoint starts with `storageActions`: validate the
ID, read one enabled `type: "storage"` API record through organization-scoped
CRUD, check its name and provider, and encode the returned object as UTF-8 JSON.
The lookup uses `filter.key` to exclude the metadata listed by the API provider
fields template, keeping `name`, `provider`, and the remaining credential fields.
The endpoint passes `object[0]` unchanged, including any incidental ID or routing
fields retained by CRUD. The driver validates its own connection requirements.

The startup-script template uses `$storageBase64` from the endpoint's execution
scope. `data.storage` stays an ID; the rendered script writes the decoded flat
connection object into bootstrap `storage` on the new server. Endpoint actions
render the script once, using `$bootstrapScript` for plain cloud user data and
`$bootstrapScriptBase64` when the cloud expects base64.

Publish the updated endpoint records and startup-script configuration together,
and run an API server build that supports the AST `$throw` operator. Existing
cluster records must save their storage reference under `storage`; the former
`storageProvider` field is not used by this contract. Updating an API credential
affects subsequent launches; already running servers retain their bootstrap
configuration until refreshed.
