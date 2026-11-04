# Cluster routing

`clusters.routing` stores one routing API record ID, just as `clusters.storage`
stores a storage API record ID. It is a string, not a provider name or a list.
The cluster form saves that selection; the shared cluster seed leaves it empty
until a provider is chosen.

## Initialization

`../../workflows/config/routing.js` seeds a single platform workflow, `configure-cluster-routing`. The node's
primary invokes it once after readiness. It reads the managed server and its
cluster, resolves the selected enabled routing API, checks its endpoint aliases,
and calls `add-routing`.

The workflow uses stored node/cluster data rather than input to select a
different cluster, provider, database, or storage. Provider credentials are
not returned. Existing scope enforcement keeps CRUD and API execution in the
invoking node's configured organization and host.

## Prepared removal

The workflow returns `configure-cluster-routing[0].remove`:

```js
{
  api: 'selected-provider-name',
  endpoint: 'remove-routing',
  data: {
    server_id,
    cluster_id,
    ip,
    host,
    infrastructure,
    location,
    registration: { /* provider registration result, such as zone/record IDs */ }
  }
}
```

Cluster's node-owned `routing.js` retains this request in memory. Graceful
shutdown calls `server.api.send` directly with it, adding the shutdown reason.
There is no `removeRouting` workflow and no server/cluster/provider-selection
lookup repeated by a removal workflow. The API dispatcher still loads the
enabled provider configuration and endpoint using their names.

Identity-based cleanup is prepared before the registration API call, then
filled with the registration result after success. If registration fails,
shutdown can still receive the prepared identity-based request. Adapters must
support cleanup by server identity when registration IDs are unavailable.
If initialization never prepared cleanup, shutdown does not attempt to
rediscover it. Restarting the process runs initialization again.

## Provider endpoint contract

Every supported routing API supplies `add-routing` and `remove-routing`.
Endpoint records are associated with the API by `api_id` and selected by name;
each endpoint owns its HTTP method, path, AST actions, and payload mapping.
The initialization workflow does not impose an HTTP method on either operation.

Both receive the node fields shown above. Removal also receives the saved
registration result and shutdown reason. The add endpoint should return
nonsecret registration details sufficient for the remove endpoint, such as
provider record IDs. Repeat registration/removal should be safe for the same
server. Provider settings and routing policy belong in trusted configuration.

Both aliases are checked before registration because an unmatched endpoint
name otherwise becomes a literal API request path. Keep the configured aliases
available for nodes using their prepared cleanup requests.

## Bunny integration still required

These aliases do not simply rename `create-dns-record`/`delete-dns-record`.
The existing Bunny endpoints accept provider-shaped zone/record fields; the
agreed scripted cluster routing also needs a verified node-list update mechanism
and fallback cluster reference. Implement those adapters before enabling live
routing. This source change does not enable credentials or alter DNS records.
