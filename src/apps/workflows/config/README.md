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
recipe creates dev/test from the configured main commit and stores dev as the
future AI checkout preference. No cloud VM, DNS entry, local checkout, or initial
application upload is created by this repository workflow.

The prior native Git mirror provisioner and empty-repository creation endpoint
are retired. The existing VM-only `provision-cluster-vm` workflow and the cluster
UI's direct create-instance path remain separate and do not repeat signup.

All configuration records have fixed IDs. Database provisioning remains disabled
until its provider credentials/settings are configured. GitHub calls are tested
with mocks; a partial initialization requires explicit recovery rather than
blindly overwriting an existing repository or its branches.

Signup repository initialization also registers the server-generated public key through `create-repository-deploy-key` and fetches trusted GitHub host keys through `get-github-ssh-host-keys`. The private key is generated and stored by the organization handler in the tenant's `apis`, never passed through workflow data. The handler activates that record only after successful registration and metadata persistence. Repository metadata points to the credential using `git.api`; the clone URL uses SSH. There is no automatic expiration/rotation or initial app upload in this flow.

Organization cluster deployment defaults come from trusted `organizations.clusterProvisioning`; the minimum defaults explicitly to zero. This workflow creates no VM and makes no startup-script changes. It supplies a stable managed cluster identity for the platform's later deployment processor.
