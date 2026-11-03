/********************************************************************************
 * Copyright (C) 2023-2026 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 ********************************************************************************/

/** MongoDB Atlas provisioning endpoint AST records. */
export default {
    "method": "object.update",
    "array": "endpoints",
    "upsert": true,
    "object": [
        {
            "_id": "6a61543c0000000000000002",
            "api_id": "6a61543c0000000000000001", // MongoDB Atlas Administration API Provider Ref
            "name": "create-organization",
            "method": "post",
            "endpoint": "/orgs",
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": ["Bearer ", "$accessToken"]
                },
                "organizationName": {
                    "$if.$payload.data.organizationName.$type": {
                        "string": {
                            "$if.$payload.data.organizationName.$regex": {
                                "\\S": {
                                    "$payload.data.organizationName.trim": []
                                },
                                "$else": {
                                    "$throw": "create-organization requires an organizationName."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "create-organization requires an organizationName."
                        }
                    }
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "data": {
                "name": "$payload.data.organizationName"
            },
            "description": "Creates an Atlas organization with the supplied organizationName. Atlas requires the calling organization to be a paying organization; configure service account credentials and confirm billing eligibility before enabling.",
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000003",
            "api_id": "6a61543c0000000000000001", // MongoDB Atlas Administration API Provider Ref
            "name": "create-project",
            "method": "post",
            "endpoint": "/groups",
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": ["Bearer ", "$accessToken"]
                },
                "projectName": {
                    "$if.$payload.data.projectName.$type": {
                        "string": {
                            "$if.$payload.data.projectName.$regex": {
                                "\\S": {
                                    "$payload.data.projectName.trim": []
                                },
                                "$else": {
                                    "$throw": "create-project requires a projectName."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "create-project requires a projectName."
                        }
                    }
                },
                "atlasOrganizationId": {
                    "$if.$payload.data.atlasOrganizationId.$type": {
                        "string": {
                            "$if.$payload.data.atlasOrganizationId.$regex": {
                                "\\S": {
                                    "$payload.data.atlasOrganizationId.trim": []
                                },
                                "$else": {
                                    "$throw": "create-project requires the Atlas organization ID returned by create-organization."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "create-project requires the Atlas organization ID returned by create-organization."
                        }
                    }
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "data": {
                "name": "$payload.data.projectName",
                "orgId": "$payload.data.atlasOrganizationId"
            },
            "description": "Creates an Atlas project with the supplied projectName in the specified Atlas organization.",
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000004",
            "api_id": "6a61543c0000000000000001", // MongoDB Atlas Administration API Provider Ref
            "name": "create-cluster",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/groups/",
                    "$payload.data.atlasProjectId",
                    "/clusters"
                ]
            },
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": ["Bearer ", "$accessToken"]
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "data": "$payload.data.cluster",
            "description": "Creates an Atlas cluster in the specified project using the supplied cluster specification. Pass the Atlas cluster request body as data.cluster; tier, provider, region, and topology are selected by the caller.",
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000005",
            "api_id": "6a61543c0000000000000001",
            "name": "add-project-ip-access-list-entry",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/groups/",
                    "$payload.data.atlasProjectId",
                    "/accessList"
                ]
            },
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": [
                        "Bearer ",
                        "$accessToken"
                    ]
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "data": [
                {
                    "cidrBlock": "$payload.data.cidrBlock",
                    "comment": "$payload.data.comment"
                }
            ],
            "description": "Adds one IPv4/IPv6 address or CIDR range to the Atlas project database access list. Use 0.0.0.0/0 for an all-IPv4-sources rule only when explicitly desired; the Atlas database user is still required.",
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000006",
            "api_id": "6a61543c0000000000000001",
            "name": "remove-project-ip-access-list-entry",
            "method": "delete",
            "endpoint": {
                "$concat": [
                    "/groups/",
                    "$payload.data.atlasProjectId",
                    "/accessList/",
                    "$payload.data.entryValue"
                ]
            },
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": [
                        "Bearer ",
                        "$accessToken"
                    ]
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "description": "Removes an Atlas project IP access-list entry. For a CIDR entry, pass the slash URL-encoded as %2F.",
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000007",
            "api_id": "6a61543c0000000000000001",
            "name": "create-database-user",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/groups/",
                    "$payload.data.atlasProjectId",
                    "/databaseUsers"
                ]
            },
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": [
                        "Bearer ",
                        "$accessToken"
                    ]
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "data": {
                "databaseName": "admin",
                "username": "$payload.data.username",
                "password": "$payload.data.password",
                "roles": [
                    {
                        "databaseName": "$payload.data.databaseName",
                        "roleName": "readWrite"
                    }
                ],
                "scopes": [
                    {
                        "name": "$payload.data.clusterName",
                        "type": "CLUSTER"
                    }
                ]
            },
            "description": "Creates a SCRAM database user scoped to one Atlas cluster with readWrite on the specified tenant database. Store the password securely; it is not returned by Atlas.",
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000008",
            "api_id": "6a61543c0000000000000001",
            "name": "get-cluster-connection",
            "method": "get",
            "endpoint": {
                "$concat": [
                    "/groups/",
                    "$payload.data.atlasProjectId",
                    "/clusters/",
                    "$payload.data.clusterName"
                ]
            },
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": [
                        "Bearer ",
                        "$accessToken"
                    ]
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "description": "Returns Atlas cluster details, including connectionStrings.standardSrv. Combine that URI with the separately stored database username/password and encode credentials before use.",
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000009",
            "api_id": "6a61543c0000000000000001",
            "name": "invite-organization-user",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/orgs/",
                    "$payload.data.atlasOrganizationId",
                    "/users"
                ]
            },
            "actions": {
                "tokenResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://cloud.mongodb.com",
                        "endpoint": "/api/oauth/token",
                        "encoding": "form",
                        "headers": {
                            "Authorization": {
                                "$concat": [
                                    "Basic ",
                                    {
                                        "$security.base64Encode": {
                                            "$concat": [
                                                "$config.clientId",
                                                ":",
                                                "$config.clientSecret"
                                            ]
                                        }
                                    }
                                ]
                            },
                            "Accept": "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "grant_type": "client_credentials"
                        }
                    }
                },
                "accessToken": "$tokenResponse.data.access_token",
                "authorizationHeader": {
                    "$concat": [
                        "Bearer ",
                        "$accessToken"
                    ]
                },
                "atlasOrganizationId": {
                    "$if.$payload.data.atlasOrganizationId.$type": {
                        "string": {
                            "$if.$payload.data.atlasOrganizationId.$regex": {
                                "\\S": {
                                    "$payload.data.atlasOrganizationId.trim": []
                                },
                                "$else": {
                                    "$throw": "invite-organization-user requires an Atlas organization ID."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "invite-organization-user requires an Atlas organization ID."
                        }
                    }
                },
                "inviteEmail": {
                    "$if.$payload.data.email.$type": {
                        "string": {
                            "$if.$payload.data.email.$regex": {
                                "\\S": {
                                    "$payload.data.email.trim": []
                                },
                                "$else": {
                                    "$throw": "invite-organization-user requires an email address."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "invite-organization-user requires an email address."
                        }
                    }
                },
                "organizationRole": {
                    "$if.$payload.data.organizationRole.$type": {
                        "string": {
                            "$if.$payload.data.organizationRole.$regex": {
                                "\\S": {
                                    "$payload.data.organizationRole.trim": []
                                },
                                "$else": {
                                    "$throw": "invite-organization-user requires an organizationRole."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "invite-organization-user requires an organizationRole."
                        }
                    }
                }
            },
            "headers": {
                "Authorization": "$authorizationHeader",
                "Accept": "application/vnd.atlas.2025-03-12+json",
                "Content-Type": "application/json"
            },
            "data": {
                "username": "$payload.data.email",
                "roles": {
                    "orgRoles": [
                        "$organizationRole"
                    ]
                }
            },
            "description": "Invites the supplied email to the specified Atlas organization with the supplied organizationRole. The response includes the Atlas user ID and membership status; the user must accept the invitation.",
            "enabled": false
        }
    ]
};
