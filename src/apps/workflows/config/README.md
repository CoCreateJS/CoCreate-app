# Organization onboarding workflows

`onboardOrganization` (`onboarding.js`) coordinates signup after `signUp` and
`signIn`. The form sends only the organization name and hostname through named
workflow keys. Both the browser's one-item input array and a direct object invocation
are accepted. The workflow requires an authenticated envelope user and reads trusted
provisioning settings from the platform's enabled `servers_config` record of type
`organizations`; provider credentials and policies are not accepted from the form.

The execution order is:

1. Validate name, hostname, location, storage policy and storage-workflow enablement.
   Location comes from the originating connection's `clientInfo`, falling back to the
   signed-in user's saved profile location. HTTP or remote-worker execution without
   either location fails instead of using the platform server's location.
2. `createOrganization`: create the platform organization and its tenant-bound
   Manager key using the existing managed-cluster role.
3. `createManagedMongoDB`: create Atlas resources and save the returned bootstrap
   connection on the platform organization.
4. `seedOrganization`: copy the organization, create the tenant admin role, copy the
   signed-in user/profile and hashed credential, then create admin/default keys.
   The default permission policy is copied from the platform without evaluating its
   stored authorization expressions.
5. Save the bootstrap connection as a tenant storage API. `createRepository` creates
   the GitHub template repository, registers a writable deploy key, obtains GitHub SSH
   host keys, and writes the SSH connection directly into the tenant's `apis`.
6. `createClusterConfig`: render the startup script using the returned bootstrap
   connection and Manager key. Assign a generated cluster ID, storage API reference,
   repository URL/credential reference, and configured minimum-size override.
7. Save the same cluster in platform and tenant databases; link `cluster_id` on both
   organization records. The stored cluster has no static deployment.

Child workflows execute internally and return to their parent. Only the outer
transport invocation sends a reply. The final `onboardOrganization` result contains
organization/cluster IDs, hostname, `status: 'configured'`, and a sign-in URL; it
contains no Manager key, database password, SSH private key, or rendered startup script.

Signup switches to a simple preparing screen before invoking onboarding. A failed
workflow aborts the action chain and displays its error. Success switches to a
configuration-complete screen with a separate Open workspace link. Configuration
completion does not claim that a node, DNS registration, or AI readiness is complete.
First-node creation remains owned by AutoScaler's organization-peer lifecycle.

## Provider prerequisites and remaining integration

`createManagedMongoDB` remains disabled. Operators must configure its Atlas API and
endpoint records, enable that workflow, and supply `storageProvisioning.cloudProvider`,
`regionName`, and an explicit `cidrBlock` in the organization provisioning settings.
The network entry is deliberately blank in the seed. The GitHub organization API
must also be configured. No providers are enabled or invoked by these local changes.

Atlas can return before a new database is ready. This workflow reports a missing
connection string; readiness polling/resume remains a later step. Partial provider
or cross-database failures stop the chain. There is no automatic rollback or blind
retry of already-created resources. DNS registration/readiness and interrupted
onboarding recovery remain separate work. No runtime node is created by onboarding.

`createRepository` uses the template's existing main branch and saves its SSH URL,
deploy-key credential and known-host verification data for Cluster's repository
lifecycle. It does not create dev/test branches, rewrite repository config, run Git,
or upload the application. Initial upload remains primary-node lifecycle work.

`createClusterConfig` owns the baseline placement/scaling profile and renders
`cluster.startupScript` once. Its caller supplies `name`, `managedOrganization`,
`host`, `bootstrapStorage`, and `manager: { organization_id, host, apiKey }`.
The Manager key is injected into the startup environment and bootstrap config.
The onboarding parent persists the returned cluster; deployments reuse the saved
script. No standalone startup-script config or separate cluster-persistence workflow
is needed.

`dns.js` keeps DNS operations together as four AST workflows:
`addHost` and `removeHost` manage an organization's Bunny DNS record, while
`addServer` and `removeServer` manage a server registration for a host. The
server workflows accept provider endpoint names and registration data because
the provider's location/pool contract is still being defined. They do not infer
DNS ownership from a cluster; the host is the DNS scope. Bunny DNS
records remain disabled until its API credentials and endpoint records are
configured, and server location/pool endpoints still need to be defined.

`createOrganizationServer` (`server.js`) accepts one cluster object containing the current
`deployment`. It reloads the saved platform cluster, checks tenant ownership, the optional cloud API whitelist, enabled
cloud connection, required deployment fields and saved startup script, then reserves server
inventory in platform and tenant scopes. The selected cloud's `name` determines the child
workflow: `aws` calls `createAwsInstance`. Other providers require their corresponding
`create<CloudName>Instance` workflow.

```js
{
    method: 'workflow.createOrganizationServer',
    organization_id: platformOrganizationId,
    managedOrganization: tenantOrganizationId,
    createOrganizationServer: {
        ...cluster,
        deployment: { cloud: cloudApiId, region: 'us-east-1', type: 't3a.small', dns: [] }
    }
}
```

`createAwsInstance` (`aws.js`) owns image lookup, VPC/security-group setup and RunInstances.
It uses `resolve-image`, prepares networking through direct AWS Query actions, and passes
the completed native RunInstances parameters to `create-instance`, using the selected API
ID for credentials. `create-instance` performs only that single AWS request and returns
the native response; the workflow interprets it. The former orchestration endpoint has
been replaced, so callers must supply prepared AWS parameters or use the workflow.

The stored `cluster.startupScript` is appended unchanged to a per-node identity wrapper;
it is not rendered again from a global template. `deployment.dns` is an array containing
the nearest eligible POP from each provider, sorted by distance from the demand centroid.
AutoScaler uses the first POP to select the cloud region. The entire array is saved as
`server.deployment.dns` in both inventory scopes before provider creation, alongside
`master.status: 'provisioning'`. A supplied single object is wrapped in an array; missing
or null dns becomes `[]`. With no eligible POPs, placement uses the demand centroid
directly. The saved cluster configuration is not updated.
The common workflow persists the instance
ID in both inventories; provider errors mark both records failed. The launch response is
`data: { id, ..., server }`. The saved cluster has no static deployment. For first-node placement AutoScaler uses
the organization’s saved `location: { latitude, longitude }`; later launches use
coordinates from demand density. Both paths generate dns, region and size using
the target cluster’s policies and allowed cloud APIs. AutoScaler creates `{ ...cluster, deployment: selectedDeployment }`
for each additional server, replacing the complete deployment in its request copy without
modifying the saved configuration. All provider workflows consume this same shape.

Internal deployment uses `type`; server inventory uses `deployment.id` and
`deployment.type`, separate from the server record's `_id`. Provider workflows and
endpoints translate these into native API fields at the request boundary (for example,
AWS `InstanceType` and `InstanceId.1`) and normalize responses back to `id` and `type`.

Repository lifecycle reads `cluster.repositories`. The onboarding workflow assigns
the returned GitHub SSH URL and tenant API credential reference before persisting
both cluster copies. Cluster primary handles initial enabled/incomplete upload
after node readiness; signup performs no COC upload.


The managed cluster definition stores `managedOrganization` to identify the tenant. Manager identity is resolved from runtime config and is not stored in the cluster document. Signup writes the same managed organization reference in both cluster copies; the workflow checks it against the organization being initialized. Name is a nonempty editable label.
deployment and repositories remain sibling cluster properties. The initial draft
has a repositories array; repository initialization populates both copies before ready.
Platform activation uses AutoScaler `scaleOut(cluster, [], organization.location)`
to generate a deployment and pass it into this same workflow. AutoScaler selects a new deployment and calls the
workflow locally or sends the standard envelope through `server.manager.send`.

`deleteOrganizationServer` accepts the same cluster envelope, including
`deployment.server_id`. It reloads the saved cluster and server in platform scope, checks
tenant/cluster ownership and allowed cloud access, then delegates by cloud name to
`delete<CloudName>Instance`. Provider IDs and region come from stored inventory.
`deleteAwsInstance` maps the ID to native `InstanceId.1`, calls the single-purpose
`delete-instance` endpoint, and validates the matching ID and terminal acknowledgement.
AutoScaler keeps drain/status/shutdown ownership; delayed inventory cleanup remains
separate. DNS registration/removal will be integrated at the parent workflow level.

Cluster cloud selection is optional: absent, empty-string or empty-array `clouds`
permits any enabled cloud API in the workflow's organization; a nonempty selection
restricts creation and deletion to those IDs. AutoScaler applies the same optional
API-ID whitelist convention to `cluster.dns` before choosing POPs. Deployment POPs
carry their connection `apiId`; provider credentials stay in their API records.

`mesh.js` seeds the `peerUnavailable` workflow. Mesh directly invokes it
when abnormal peer recovery is exhausted and independently emits a notification
event. The workflow adds queued messages and observer evidence to the server
record using `$addToSet`, then marks an eligible unreachable peer failed. It
preserves retirement statuses and never invokes a provider termination API.
Publish this seed to the observing server organization's `workflows` array before
enabling failure reporting in its runtime. Editing the stored actions changes
failure policy without rebuilding Mesh.
