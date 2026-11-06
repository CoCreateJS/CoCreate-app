# Managed initialization workflows

Signup is coordinated by the server-side `createOrganization` handler:

1. `create-organization-database` (`data.js`, existing database workflow ID):
   platform-scoped provider provisioning and bootstrap persistence.
2. `create-organization` (`organization.js`, existing tenant initialization ID):
   tenant-scoped organization, authenticated user, and key initialization. The
   server installs this trusted platform definition in the new tenant first.
3. `create-organization-cluster` (`cluster.js`): writes the server-prepared organization cluster and its organization reference. Signup calls the same trusted definition in platform and tenant scope, preserving one cluster ID and using the organization ID as its name.
4. `create-organization-repository` (`repository.js`): platform-scoped GitHub
   template creation, config commit, dev/test branch creation, and metadata.

`configure-cluster-routing` (`routing.js`, existing routing workflow ID) belongs
only to the node lifecycle. It registers ready nodes and returns a prepared
remove-routing endpoint request. Shutdown still calls that endpoint directly.

Repository creation uses only the template's default branch, required to be
main. Its `initialConfig` AST generates `CoCreate.config.js`; braces in upload
placeholders are constructed explicitly so AST evaluation preserves them. The
recipe creates dev/test from the configured main commit and stores main as the
cluster checkout preference. No cloud VM, DNS entry, local checkout, or initial
application upload is created by this repository workflow.

The prior native Git mirror provisioner and empty-repository creation endpoint
are retired. The existing VM-only `provision-cluster-vm` workflow and the cluster
UI's direct create-instance path remain separate and do not repeat signup.

All configuration records have fixed IDs. Database provisioning remains disabled
until its provider credentials/settings are configured. GitHub calls are tested
with mocks; a partial initialization requires explicit recovery rather than
blindly overwriting an existing repository or its branches.

Signup repository initialization also registers the server-generated public key through `create-repository-deploy-key` and fetches trusted GitHub host keys through `get-github-ssh-host-keys`. The private key is generated and stored by the organization handler in the tenant's `apis`, never passed through workflow data. The handler activates that record only after successful registration and metadata persistence. Repository metadata points to the credential using `git.api`; the clone URL uses SSH. There is no automatic expiration/rotation or initial app upload in this flow.

Organization cluster deployment defaults come from trusted `organizations.clusterProvisioning`; the minimum defaults explicitly to zero. The workflow requires `initialDeployment.cloud`, `initialDeployment.region` and `initialDeployment.vmType`. Signup supplies static AWS API `65f8ca227b39a3c1a8904e02`, region `us-east-1`, and VM type `t3a.small` through trusted `organizations.clusterProvisioning` for now; future selection can populate the same fields. This workflow creates no VM and makes no startup-script changes. It supplies a stable managed cluster identity for the platform's later deployment processor.

`create-organization-server` (`server.js`) is the separate first-VM workflow. Signup invokes Manager.createServer(cluster) after document and repository setup. Later Mesh activation queries running servers for the cluster identified by manager.for and manager.organization_id, then calls the same method when empty. Manager consumes the exact cloud, region and VM type in cluster.initialDeployment, creates server inventory in both scopes, and prepares the startup AST using manager.for as the tenant identity. This workflow dispatches the prepared script through the selected platform cloud's `create-instance`, validates its instance ID and persists the provider patch in platform inventory. Cluster applies the identical patch in tenant scope without changing cloud execution scope. It does not run signup, create databases/repositories, or repeat tenant initialization. The existing generic `provision-cluster-vm` workflow remains separate from this managed-organization entry.

Repository lifecycle now reads cluster.repositories rather than repository
servers_config records. After GitHub initialization, the signup handler appends
the returned URL and credential reference plus lifecycle/initialUpload settings
to both cluster copies. That cross-scope registration remains in the trusted
handler; the GitHub workflow still only creates/configures the repository and
returns metadata. Signup itself runs no COC upload; Cluster primary handles the initial enabled/incomplete repository upload after node readiness.


The managed cluster definition stores manager: { organization_id, host, for }, where
organization_id/host identify the platform and for identifies the tenant. Signup writes
identical metadata in both cluster copies. The workflow requires those fields and checks
manager.for against the organization being initialized; name is a nonempty editable label.
initialDeployment and repositories remain sibling cluster properties. The initial draft
has a repositories array; repository initialization populates both copies before ready.
After preparing these documents, signup awaits server.manager.createServer(cluster)
with the completed repository configuration before returning success and the tenant
/auth/ redirect. Manager uses initialDeployment and the existing VM workflow. The
client waits one minute with its signup spinner visible before Actions follows href.
This delay does not verify application readiness; checkout and initial upload run
on the new node. Creation failure aborts the signup action chain.
