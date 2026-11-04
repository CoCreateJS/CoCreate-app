# Endpoint configuration

Endpoint AST records are kept in provider-specific folders under `config` so
that records can be inspected and synced by integration. AWS records live in
`AWS/data.js`; MongoDB Atlas records live in `MongoDB/data.js`. Other cloud
provider records remain in the root `data.js` until their own pass.

## AWS endpoints

The AWS folder currently contains the literal AST records for `resolve-image`,
`create-instance`, and `delete-instance`. These use the existing AWS API
provider record and retain their current endpoint IDs and behavior.

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
`data.zoneId` and `data.recordId`. Both endpoint records and the Bunny routing
API seed remain disabled until an API key is configured and the domain/zone
ownership path is confirmed. The API key is sent in the `AccessKey` header.
The managed route workflow and region mapping are documented in the workspace
`Bunny.md`; do not invoke DNS mutations until its public-IP and routing-policy
inputs are available.

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
   `data.databaseName`, `data.username`, and `data.password`. It creates a
   SCRAM user with `readWrite` access only to that database and cluster.
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
