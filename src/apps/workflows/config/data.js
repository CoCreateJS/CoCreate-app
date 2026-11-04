/** Platform database provisioning workflow. Keep disabled until provider settings are configured. */
export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6ae8f65df9ff5cc3e661eeb3",
            "name": "create-organization-database",
            "enabled": false,
            "description": "Provision the initial Atlas database, persist its provider-owned bootstrapStorage on the platform organization, and return the same object.",
            "actions": {
                "organizationId": {
                    "$if.$payload.create-organization-database.0.organizationId.$type": {
                        "string": {
                            "$if.$payload.create-organization-database.0.organizationId.$regex": {
                                "\\S": {
                                    "$payload.create-organization-database.0.organizationId.trim": []
                                },
                                "$else": {
                                    "$throw": "create-organization-database requires an organizationId."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "create-organization-database requires an organizationId."
                        }
                    }
                },
                "cloudProvider": {
                    "$if.$payload.create-organization-database.0.cloudProvider.$type": {
                        "string": {
                            "$if.$payload.create-organization-database.0.cloudProvider.$regex": {
                                "\\S": {
                                    "$payload.create-organization-database.0.cloudProvider.trim": []
                                },
                                "$else": {
                                    "$throw": "The Atlas provisioning workflow requires cloudProvider."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The Atlas provisioning workflow requires cloudProvider."
                        }
                    }
                },
                "regionName": {
                    "$if.$payload.create-organization-database.0.regionName.$type": {
                        "string": {
                            "$if.$payload.create-organization-database.0.regionName.$regex": {
                                "\\S": {
                                    "$payload.create-organization-database.0.regionName.trim": []
                                },
                                "$else": {
                                    "$throw": "The Atlas provisioning workflow requires regionName."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The Atlas provisioning workflow requires regionName."
                        }
                    }
                },
                "cidrBlock": {
                    "$if.$payload.create-organization-database.0.cidrBlock.$type": {
                        "string": {
                            "$if.$payload.create-organization-database.0.cidrBlock.$regex": {
                                "\\S": {
                                    "$payload.create-organization-database.0.cidrBlock.trim": []
                                },
                                "$else": {
                                    "$throw": "The Atlas provisioning workflow requires cidrBlock."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The Atlas provisioning workflow requires cidrBlock."
                        }
                    }
                },
                "organizationLookup": {
                    "$crud.send": {
                        "method": "object.read",
                        "database": "$organization_id",
                        "array": "organizations",
                        "filter": {
                            "query": {
                                "_id": "$actions.organizationId"
                            },
                            "key": {
                                "_id": 1
                            },
                            "limit": 1
                        }
                    }
                },
                "organization": {
                    "$if.$actions.organizationLookup.error.length.$gt": {
                        "0": {
                            "$throw": "The platform organization is unavailable."
                        },
                        "$else": {
                            "$if.$actions.organizationLookup.object.0.$exists": {
                                "$true": "$actions.organizationLookup.object.0",
                                "$else": {
                                    "$throw": "The platform organization is unavailable."
                                }
                            }
                        }
                    }
                },
                "clusterName": {
                    "$concat": [
                        [
                            "cocreate-",
                            "$actions.organizationId",
                            "-production"
                        ]
                    ]
                },
                "databaseName": "production",
                "databaseUsername": {
                    "$concat": [
                        [
                            "cocreate-",
                            {
                                "$uuid": [
                                    20
                                ]
                            }
                        ]
                    ]
                },
                "databasePassword": {
                    "$uuid": []
                },
                "createOrganization": {
                    "$api.send": {
                        "api": "mongodb-atlas-admin",
                        "method": "post",
                        "endpoint": "create-organization",
                        "data": {
                            "organizationName": "$actions.organizationId"
                        }
                    }
                },
                "createOrganizationResult": {
                    "$if.$actions.createOrganization.error.length.$gt": {
                        "0": {
                            "$throw": "Atlas createOrganization failed."
                        },
                        "$else": {
                            "$if.$actions.createOrganization.success.$eq": {
                                "$false": {
                                    "$throw": "Atlas createOrganization rejected the request."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "atlasOrganizationId": "$actions.createOrganization.data.organization.id",
                "createProject": {
                    "$api.send": {
                        "api": "mongodb-atlas-admin",
                        "method": "post",
                        "endpoint": "create-project",
                        "data": {
                            "atlasOrganizationId": "$actions.atlasOrganizationId",
                            "projectName": "production"
                        }
                    }
                },
                "createProjectResult": {
                    "$if.$actions.createProject.error.length.$gt": {
                        "0": {
                            "$throw": "Atlas createProject failed."
                        },
                        "$else": {
                            "$if.$actions.createProject.success.$eq": {
                                "$false": {
                                    "$throw": "Atlas createProject rejected the request."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "atlasProjectId": "$actions.createProject.data.id",
                "createCluster": {
                    "$api.send": {
                        "api": "mongodb-atlas-admin",
                        "method": "post",
                        "endpoint": "create-cluster",
                        "data": {
                            "atlasProjectId": "$actions.atlasProjectId",
                            "cluster": {
                                "name": "$actions.clusterName",
                                "clusterType": "REPLICASET",
                                "replicationSpecs": [
                                    {
                                        "regionConfigs": [
                                            {
                                                "regionName": "$actions.regionName",
                                                "providerName": "TENANT",
                                                "backingProviderName": "$actions.cloudProvider",
                                                "electableSpecs": {
                                                    "instanceSize": "M0",
                                                    "nodeCount": 3
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                },
                "createClusterResult": {
                    "$if.$actions.createCluster.error.length.$gt": {
                        "0": {
                            "$throw": "Atlas createCluster failed."
                        },
                        "$else": {
                            "$if.$actions.createCluster.success.$eq": {
                                "$false": {
                                    "$throw": "Atlas createCluster rejected the request."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "addNetworkAccess": {
                    "$api.send": {
                        "api": "mongodb-atlas-admin",
                        "method": "post",
                        "endpoint": "add-project-ip-access-list-entry",
                        "data": {
                            "atlasProjectId": "$actions.atlasProjectId",
                            "cidrBlock": "$actions.cidrBlock",
                            "comment": "CoCreate tenant database access"
                        }
                    }
                },
                "addNetworkAccessResult": {
                    "$if.$actions.addNetworkAccess.error.length.$gt": {
                        "0": {
                            "$throw": "Atlas addNetworkAccess failed."
                        },
                        "$else": {
                            "$if.$actions.addNetworkAccess.success.$eq": {
                                "$false": {
                                    "$throw": "Atlas addNetworkAccess rejected the request."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "createDatabaseUser": {
                    "$api.send": {
                        "api": "mongodb-atlas-admin",
                        "method": "post",
                        "endpoint": "create-database-user",
                        "data": {
                            "atlasProjectId": "$actions.atlasProjectId",
                            "clusterName": "$actions.clusterName",
                            "databaseName": "$actions.databaseName",
                            "username": "$actions.databaseUsername",
                            "password": "$actions.databasePassword"
                        }
                    }
                },
                "createDatabaseUserResult": {
                    "$if.$actions.createDatabaseUser.error.length.$gt": {
                        "0": {
                            "$throw": "Atlas createDatabaseUser failed."
                        },
                        "$else": {
                            "$if.$actions.createDatabaseUser.success.$eq": {
                                "$false": {
                                    "$throw": "Atlas createDatabaseUser rejected the request."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "clusterDetails": {
                    "$api.send": {
                        "api": "mongodb-atlas-admin",
                        "method": "get",
                        "endpoint": "get-cluster-connection",
                        "data": {
                            "atlasProjectId": "$actions.atlasProjectId",
                            "clusterName": "$actions.clusterName"
                        }
                    }
                },
                "clusterDetailsResult": {
                    "$if.$actions.clusterDetails.error.length.$gt": {
                        "0": {
                            "$throw": "Atlas clusterDetails failed."
                        },
                        "$else": {
                            "$if.$actions.clusterDetails.success.$eq": {
                                "$false": {
                                    "$throw": "Atlas clusterDetails rejected the request."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "connectionString": {
                    "$if.$actions.clusterDetails.data.connectionStrings.standardSrv.$regex": {
                        "\\S": {
                            "$actions.clusterDetails.data.connectionStrings.standardSrv.replace": [
                                "mongodb+srv://",
                                {
                                    "$concat": [
                                        [
                                            "mongodb+srv://",
                                            {
                                                "$encodeURIComponent": "$actions.databaseUsername"
                                            },
                                            ":",
                                            {
                                                "$encodeURIComponent": "$actions.databasePassword"
                                            },
                                            "@"
                                        ]
                                    ]
                                }
                            ]
                        },
                        "$else": null
                    }
                },
                "bootstrapConnectionString": {
                    "$if.$actions.connectionString.$type": {
                        "string": {
                            "$if.$actions.connectionString.$regex": {
                                "\\S": {
                                    "$actions.connectionString.trim": []
                                },
                                "$else": {
                                    "$throw": "Atlas has not returned a usable connection string; bootstrap storage was not attached."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "Atlas has not returned a usable connection string; bootstrap storage was not attached."
                        }
                    }
                },
                "bootstrapStorage": {
                    "name": "mongodb",
                    "provider": "mongodb",
                    "connectionString": "$actions.bootstrapConnectionString"
                },
                "persistBootstrap": {
                    "$crud.send": {
                        "method": "object.update",
                        "database": "$organization_id",
                        "array": "organizations",
                        "object": {
                            "_id": "$actions.organizationId",
                            "bootstrapStorage": "$actions.bootstrapStorage",
                            "atlas": {
                                "organizationId": "$actions.atlasOrganizationId",
                                "projectId": "$actions.atlasProjectId",
                                "clusterName": "$actions.clusterName"
                            }
                        }
                    }
                },
                "persistedOrganization": {
                    "$if.$actions.persistBootstrap.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to persist bootstrap storage on the platform organization."
                        },
                        "$else": {
                            "$if.$actions.persistBootstrap.object.0.$exists": {
                                "$true": "$actions.persistBootstrap.object.0",
                                "$else": {
                                    "$throw": "Unable to persist bootstrap storage on the platform organization."
                                }
                            }
                        }
                    }
                },
                "$data.create-organization-database.0.bootstrapStorage": "$actions.bootstrapStorage",
                "$data.create-organization-database.0.provisioned": true,
                "$data.create-organization-database.0.atlasOrganizationId": "$actions.atlasOrganizationId",
                "$data.create-organization-database.0.atlasProjectId": "$actions.atlasProjectId",
                "$data.create-organization-database.0.clusterName": "$actions.clusterName",
                "$data.create-organization-database.0.clusterState": "$actions.clusterDetails.data.stateName",
                "$data.create-organization-database.0.databaseName": "$actions.databaseName",
                "$data.create-organization-database.0.databaseUsername": "$actions.databaseUsername",
                "$data.create-organization-database.0.connectionString": "$actions.connectionString",
                "inviteOrganizationOwner": {
                    "$if.$payload.create-organization-database.0.inviteEmail.$regex": {
                        "\\S": {
                            "$api.send": {
                                "api": "mongodb-atlas-admin",
                                "method": "post",
                                "endpoint": "invite-organization-user",
                                "data": {
                                    "atlasOrganizationId": "$actions.atlasOrganizationId",
                                    "email": "$payload.create-organization-database.0.inviteEmail",
                                    "organizationRole": "ORG_OWNER"
                                }
                            }
                        },
                        "$else": null
                    }
                },
                "$data.create-organization-database.0.invitation": "$actions.inviteOrganizationOwner.data",
                "$data.create-organization-database.0.handoff": {
                    "$if.$payload.create-organization-database.0.inviteEmail.$regex": {
                        "\\S": {
                            "atlasOrganizationId": "$actions.atlasOrganizationId",
                            "email": "$payload.create-organization-database.0.inviteEmail",
                            "organizationRole": "ORG_OWNER",
                            "invitation": "$actions.inviteOrganizationOwner.data"
                        },
                        "$else": null
                    }
                },
                "$data.create-organization-database.0.organizationId": "$actions.organizationId"
            }
        }
    ]
};
