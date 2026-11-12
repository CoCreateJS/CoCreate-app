# Cluster DNS

Top-level `cluster.clouds` and `cluster.dns` are optional API-ID whitelists.
Missing values, empty strings and empty arrays allow all enabled connections of the
corresponding type in the executing organization. A nonempty selection restricts
connections to those IDs; a single ID string is also accepted for the current UI.
Matching server configs supply catalogs, and only catalogs with an eligible connection
participate in placement. An unusable explicit selection never broadens access.

`cluster.dns` is separate from a launch's `deployment.dns`: each selected POP
includes `apiId` for its DNS connection, along with the provider's POP `id`.
The current UI saves one dns ID; the runtime also accepts an array.

## Deployment and saved server dns

AutoScaler reads enabled DNS catalogs, chooses the nearest eligible POP per
DNS connection, and sorts the results by distance from the demand centroid. The first POP
anchors cloud-region selection; the entire array travels in `deployment.dns`.
Without eligible POPs, placement uses the demand centroid directly and dns is `[]`.

`createOrganizationServer` normalizes a single supplied POP object into an array and
saves the array as `server.deployment.dns` in platform and tenant inventory before creating
the provider instance. The saved cluster configuration is not modified by a launch.

## Workflow ownership

Provider registration and removal belong in the parent server creation/deletion
workflows. Cluster boot, worker readiness and shutdown no longer register or withdraw
routes, and no cleanup request is cached in a runtime dns helper.

The [DNS definitions](../../workflows/config/dns.js) contain `addHost`,
`removeHost`, `addServer` and `removeServer`. These are not yet wired into parent
server lifecycle workflows. Provider endpoint mapping, usable address/readiness and
saved registration IDs still need integration. A selected POP ID alone may not be
sufficient to remove a provider registration later.

This documentation update does not enable provider credentials, upload definitions
or change DNS records.
