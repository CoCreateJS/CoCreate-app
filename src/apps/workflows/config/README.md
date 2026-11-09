# Managed initialization workflows

Signup is coordinated by the server-side `createOrganization` handler:

1. `createManagedMongoDB` (`storage.js`, storage provisioning workflow):
   platform-scoped provider provisioning and bootstrap persistence.
2. `createOrganization` (`organization.js`): creates the platform organization
   and a platform-scoped managed key assigned the managed-cluster role. The
   managed key is returned on the organization result temporarily; startup
   injection and a non-client delivery path remain future work.
3. `seedOrganization` (`organization.js`): tenant-scoped organization,
   authenticated user, role, and key initialization.
4. `createClusterConfig` (`cluster.js`): returns the complete default organization cluster profile with the request's name, host and `managedOrganization`. Signup supplies the generated cluster ID after receiving this object.
5. `createRepository` (`repository.js`): platform-scoped GitHub
   template creation, config commit, dev/test branch creation, and metadata.

`routing.js` keeps routing operations together as four AST workflows:
`addHost` and `removeHost` manage an organization's Bunny DNS record, while
`addServer` and `removeServer` manage a server registration for a host. The
server workflows accept provider endpoint names and registration data because
the provider's location/pool contract is still being defined. They do not infer
routing ownership from a cluster; the host is the routing scope. Bunny DNS
records remain disabled until its API credentials and endpoint records are
configured, and server location/pool endpoints still need to be defined.

Repository creation uses only the template's default branch, required to be
main. Its `initialConfig` AST generates `CoCreate.config.js`; braces in upload
placeholders are constructed explicitly so AST evaluation preserves them. The
recipe creates dev/test from the configured main commit and stores main as the
cluster checkout preference. No cloud VM, DNS entry, local checkout, or initial
application upload is created by this repository workflow.

The prior native Git mirror provisioner and empty-repository creation endpoint
are retired. The existing VM-only `provision-cluster-vm` workflow and the cluster
UI's direct create-instance path remain separate and do not repeat signup.

All configuration records have fixed IDs. Storage provisioning remains disabled
until its provider credentials/settings are configured. GitHub calls are tested
with mocks; a partial initialization requires explicit recovery rather than
blindly overwriting an existing repository or its branches.

`createRepository` generates an SSH key pair, creates a private repository from the configured template using the organization ID as its name, and registers the public key as a write-enabled GitHub deploy key. It stores the private key in the platform `secrets` array and returns the repository metadata with the credential ID. GitHub REST calls use the configured GitHub API credential; the generated SSH key is for later Git clone/push access, not API authentication. The later environment still needs to retrieve the stored private key and perform the clone.

`createClusterConfig` owns the complete baseline cluster profile, including deployment and scaling defaults. Signup supplies its name and `managedOrganization`, assigns the generated cluster `_id` and tenant host, then writes the same cluster object to platform and tenant scope with separate CRUD envelopes. It also links the cluster ID from both organization records. No cluster persistence workflow is needed.

`createOrganizationServer` (`server.js`) creates an organization VM from the cluster passed as workflow `data`. Platform Manager calls it both after Mesh reports no eligible peers and after an authorized tenant scale-out request arrives over `/manager`; both paths resolve the platform cluster and use the same workflow. Manager passes the selected deployment as `data.initialDeployment`, along with the reserved server and prepared startup values. The workflow reads the cloud API reference and deployment fields from the cluster, dispatches `create-instance`, validates the returned instance ID, and persists the provider patch in platform inventory. Manager mirrors that patch into tenant inventory. Server removal remains in Manager's termination path and does not use this create workflow.

Repository lifecycle now reads cluster.repositories rather than repository
servers_config records. After GitHub initialization, the signup handler appends
the returned URL and credential reference plus lifecycle/initialUpload settings
to both cluster copies. That cross-scope registration remains in the trusted
handler; the GitHub workflow still only creates/configures the repository and
returns metadata. Signup itself runs no COC upload; Cluster primary handles the initial enabled/incomplete repository upload after node readiness.


The managed cluster definition stores `managedOrganization` to identify the tenant. Manager identity is resolved from runtime config and is not stored in the cluster document. Signup writes the same managed organization reference in both cluster copies; the workflow checks it against the organization being initialized. Name is a nonempty editable label.
initialDeployment and repositories remain sibling cluster properties. The initial draft
has a repositories array; repository initialization populates both copies before ready.
After preparing these documents, signup awaits server.managerService.createServer(cluster)
with the completed repository configuration before returning success and the tenant
/auth/ redirect. Manager uses initialDeployment and the existing VM workflow. The
client waits one minute with its signup spinner visible before Actions follows href.
This delay does not verify application readiness; checkout and initial upload run
on the new node. Creation failure aborts the signup action chain.
