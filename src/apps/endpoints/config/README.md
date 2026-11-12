# Endpoint configuration

Endpoint AST records are kept in provider-specific folders under `config` so
that records can be inspected and synced by integration. AWS records live in
`AWS/data.js`; MongoDB Atlas records live in `MongoDB/data.js`. Other cloud
provider records remain in the root `data.js` until their own pass.

## AWS endpoints

The AWS folder currently contains the literal AST records for `resolve-image`,
`create-instance`, and `delete-instance`. These use the existing AWS API
provider record and retain their endpoint IDs.

`create-instance` performs one EC2 `RunInstances` request. Its `data` contains
caller-prepared AWS parameters such as `ImageId`, `InstanceType`, `MinCount`,
`MaxCount`, `SecurityGroupId.1`, and base64 `UserData`. The endpoint supplies the
fixed Action/Version, form encoding, and signature for the EC2 root path, then
returns the native AWS response. It performs no storage reads, startup-script
rendering, image lookup, VPC lookup, security-group setup, or nested API calls.
`createAwsInstance` owns that orchestration and interprets the response.

`create-member-account` starts account creation inside the existing AWS
Organization. It accepts `data.accountName` and a unique,
customer-controlled `data.rootEmail`; its response returns a
`createAccountRequestId`. AWS creates the member account asynchronously.
`get-member-account-creation-status` accepts that request ID and returns the
state and, after success, the new `accountId`. Account creation must be called
with management-account credentials that have `organizations:CreateAccount`
and `organizations:DescribeCreateAccountStatus` permissions. AWS creates the
`OrganizationAccountAccessRole` for management-account access; the endpoint
does not create long-lived IAM access keys in the member account.

AWS calls this a member account rather than a sub-organization. A new member
account's root email must be unique across AWS accounts. If a customer already
has an AWS account, use an account invitation flow rather than `CreateAccount`.
For a future handoff to the customer's AWS Organization, AWS supports direct
account transfer by invitation and acceptance. A created member account must
be at least four days old, and the destination organization must be at least
seven days old. Prepare root access for the customer and remove the old
management account's access role after transfer.

## Bunny DNS routing

Bunny endpoint records live in `Bunny/data.js`. `create-dns-record` accepts
`data.zoneId` and a Bunny-shaped `data.record`; `delete-dns-record` accepts
`data.zoneId` and `data.recordId`. Both endpoint records and the Bunny DNS
API seed remain disabled until an API key is configured and the domain/zone
ownership path is confirmed. The API key is sent in the `AccessKey` header.
The managed route workflow and region mapping are documented in the workspace
`Bunny.md`; do not invoke DNS mutations until its public-IP and routing-policy
inputs are available.

The [Bunny region mapping](Bunny/region-mapping.json) groups cloud regions by
DNS routing region. Select the DNS region first, then a cloud provider and one
of its mapped regions. Provider values are arrays so a DNS region can offer
multiple cloud-region candidates. Region keys are the routing group labels;
cloud-region values are provider region codes.

For autoscaling, aggregate demand and available capacity within the selected
DNS routing region across cloud providers, then choose a cloud region within
that group for provisioning. This mapping supplies the selection data; the
autoscaler does not consume it yet.

## MongoDB Atlas provisioning

MongoDB Atlas provisioning records live in `MongoDB/data.js`. The Atlas
Administration API record (`mongodb-atlas-admin`) remains separate from the
MongoDB storage connection record (`mongodb`). These endpoints are disabled
until Atlas API credentials, permissions, and billing eligibility are confirmed.

Provision in this order:

1. `create-organization` takes `data.organizationName`; its response gives the
   Atlas organization ID.
2. `create-project` takes `data.atlasOrganizationId` and `data.projectName`; its
   response gives the project ID.
3. `create-cluster` takes `data.atlasProjectId` and a provider-native Atlas
   cluster request body in `data.cluster`. The caller selects the tier, provider,
   region, and topology, so the same endpoint can create an M0 or paid cluster.
4. `add-project-ip-access-list-entry` takes `data.atlasProjectId`,
   `data.cidrBlock`, and optionally `data.comment`. The value `0.0.0.0/0`
   allows connections from all IPv4 addresses. Access is still gated by
   database authentication. For ephemeral CoCreate nodes this avoids tracking
   changing node IPs, but it permits network attempts from anywhere.
   `remove-project-ip-access-list-entry` takes `data.atlasProjectId` and
   `data.entryValue`; URL-encode `/` in CIDR values as `%2F`.
5. `create-database-user` takes `data.atlasProjectId`, `data.clusterName`,
   `data.username`, and `data.password`. It creates a SCRAM user with
   `readWriteAnyDatabase` access, scoped to that cluster.
6. `get-cluster-connection` takes `data.atlasProjectId` and
   `data.clusterName`. The response contains `connectionStrings.standardSrv`.
   This is the cluster URI, not a credential-bearing Atlas connection object;
   combine it with the separately stored database username/password, safely
   URL-encoding both credentials.
7. `invite-organization-user` takes `data.atlasOrganizationId`, `data.email`,
   and `data.organizationRole`. It sends an Atlas organization invitation with
   the requested role and returns the Atlas user ID and pending membership
   status. The user can accept with an existing Atlas account or create one
   while accepting. The invitation expires after 30 days.

A database user is distinct from an Atlas API Service Account. The service
account authorizes management calls to the Atlas Admin API. The database user
authenticates clients to MongoDB. The URI is obtained from cluster details.

Atlas documents that creating an organization requires the calling
organization to be a paying organization. Confirm that prerequisite before
enabling `create-organization`. Every endpoint remains disabled in the seed
until its credentials and required permissions are configured. The Atlas
Admin API Service Account must have Organization Owner access to the target
organization to invite an owner.

## Built-in managed-network requests

AutoScaler builds standard workflow envelopes for creation and deletion. Managed
nodes POST them to the platform root through `server.manager.send`, using the manager
API key in the Bearer header; local dispatch uses `server.workflow.run`. Manager
sets platform organization and managed tenant scope, and the receiving central HTTP
transport resolves the authoritative host and authorizes the operation. State patches
still use ordinary managed CRUD envelopes; telemetry is excluded.

The managed role in `api-keys/config/data.json` grants `createOrganizationServer`
and `deleteOrganizationServer`. The organization workflow issues the managed key;
startup supports supplying that key in manager JSON, while the complete signup
handoff remains unwired. Parent workflows validate canonical cluster/server ownership
before provider dispatch. Existing database keys/records need explicit migration or
reseeding; editing source does not update them automatically.

### AWS termination

`delete-instance` performs one signed HTTP Query POST to `/` with
`Action=TerminateInstances`, `Version=2016-11-15`, and caller-prepared native
`InstanceId.1`. It returns the native response without calling other endpoints.
`deleteOrganizationServer` checks stored ownership and delegates to `deleteAwsInstance`,
which validates the returned ID/state and normalizes the acknowledgement. AutoScaler
commits `master.status: terminating` before workflow dispatch and marks failure when
needed; inventory cleanup and DNS removal are separate lifecycle operations.
