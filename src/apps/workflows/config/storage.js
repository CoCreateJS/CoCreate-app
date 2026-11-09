/** MongoDB Atlas provisioning workflow. Keep disabled until provider settings are configured. */
export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6ae8f65df9ff5cc3e661eeb3",
            "name": "createManagedMongoDB",
            "enabled": false,
            "description": "Creates isolated MongoDB Atlas storage for an organization and returns its bootstrap storage object.",
            "actions": {
                "organizationId": {
                    "$if.$data.organizationId.$exists": {
                        "$true": "$data.organizationId",
                        "$else": { "$throw": "createManagedMongoDB requires an organizationId." }
                    }
                },
                "cloudProvider": {
                    "$if.$data.cloudProvider.$exists": {
                        "$true": "$data.cloudProvider",
                        "$else": { "$throw": "createManagedMongoDB requires a cloudProvider." }
                    }
                },
                "regionName": {
                    "$if.$data.regionName.$exists": {
                        "$true": "$data.regionName",
                        "$else": { "$throw": "createManagedMongoDB requires a regionName." }
                    }
                },
                "cidrBlock": {
                    "$if.$data.cidrBlock.$exists": {
                        "$true": "$data.cidrBlock",
                        "$else": { "$throw": "createManagedMongoDB requires a cidrBlock." }
                    }
                },
                "projectName": "Production",
                "clusterName": "cluster-$uuid",
                "username": "cocreate-$uuid(20)",
                "password": "$uuid()",
                "organization": {
                    "create": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-organization",
                            "data": {
                                "organizationName": "$organizationId"
                            }
                        }
                    },
                    "$if.$create.error.length.$gt": {
                        "0": {
                            "$throw": "$create.error"
                        },
                        "$else": {
                            "$organization": "$create.data"
                        }
                    }

                },
                "project": {
                    "create": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-project",
                            "data": {
                                "atlasOrganizationId": "$organization.id",
                                "projectName": "$projectName"
                            }
                        }
                    },
                    "$if.$create.error.length.$gt": {
                        "0": {
                            "$throw": "$create.error"
                        },
                        "$else": {
                            "$project": "$create.data"
                        }
                    }
                },
                "cluster": {
                    "create": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-cluster",
                            "data": {
                                "atlasProjectId": "$project.id",
                                "cluster": {
                                    "name": "$clusterName",
                                    "clusterType": "REPLICASET",
                                    "replicationSpecs": [
                                        {
                                            "regionConfigs": [
                                                {
                                                    "regionName": "$regionName",
                                                    "providerName": "TENANT",
                                                    "backingProviderName": "$cloudProvider",
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
                    "$if.$create.error.length.$gt": {
                        "0": {
                            "$throw": "$create.error"
                        },
                        "$else": {
                            "$cluster": "$create.data"
                        }
                    }
                },
                "access": {
                    "create": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "add-project-ip-access-list-entry",
                            "data": {
                                "atlasProjectId": "$project.id",
                                "cidrBlock": "$cidrBlock",
                                "comment": "CoCreate tenant database access"
                            }
                        }
                    },
                    "$if.$create.error.length.$gt": {
                        "0": {
                            "$throw": "$create.error"
                        },
                        "$else": {
                            "$access": "$create.data"
                        }
                    }
                },
                "databaseUser": {
                    "create": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-database-user",
                            "data": {
                                "atlasProjectId": "$project.id",
                                "clusterName": "$clusterName",
                                "username": "$username",
                                "password": "$password"
                            }
                        }
                    },
                    "$if.$create.error.length.$gt": {
                        "0": {
                            "$throw": "$create.error"
                        },
                        "$else": {
                            "$databaseUser": "$create.data"
                        }
                    }
                },
                "connectionString": {
                    "create": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "get",
                            "endpoint": "get-cluster-connection",
                            "data": {
                                "atlasProjectId": "$project.id",
                                "clusterName": "$clusterName"
                            }
                        }
                    },
                    "$if.$create.error.length.$gt": {
                        "0": {
                            "$throw": "$create.error"
                        },
                        "$else": {
                            "$connectionString": {
                                "$if.$create.data.connectionStrings.standardSrv.$regex": {
                                    "\\S": {
                                        "$create.data.connectionStrings.standardSrv.replace": [
                                            "mongodb+srv://",
                                            {
                                                "$concat": [
                                                    [
                                                        "mongodb+srv://",
                                                        {
                                                            "$encodeURIComponent": "$username"
                                                        },
                                                        ":",
                                                        {
                                                            "$encodeURIComponent": "$password"
                                                        },
                                                        "@"
                                                    ]
                                                ]
                                            }
                                        ]
                                    },
                                    "$else": null
                                }
                            }
                        }
                    }
                },
                "storage": {
                    "name": "mongodb",
                    "provider": "mongodb",
                    "username": "$username",
                    "password": "$password",
                    "connectionString": "$connectionString"
                },
                "saveStorage": {
                    "$crud.send": {
                        "method": "object.update",
                        "database": "$organization_id",
                        "array": "organizations",
                        "object": {
                            "_id": "$organizationId",
                            "storage": "$storage",
                            "atlas": {
                                "organizationId": "$organization.id",
                                "projectId": "$project.id",
                                "clusterId": "$cluster.id",
                                "clusterName": "$clusterName",
                                "username": "$username",
                                "password": "$password",
                                "connectionString": "$connectionString"
                            }
                        }
                    }
                },
                "$data.createManagedMongoDB": {
                    "storage": "$storage",
                    "provisioned": true,
                    "organizationId": "$organization.id",
                    "projectId": "$project.id",
                    "clusterId": "$cluster.id",
                    "clusterName": "$clusterName",
                    "username": "$username",
                    "password": "$password",
                    "connectionString": "$connectionString",
                }
            }
        }
    ]
};
