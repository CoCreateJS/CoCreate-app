/** MongoDB Atlas provisioning; remains disabled until provider setup is complete. */
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
                        "$else": {
                            "$throw": "createManagedMongoDB requires organizationId."
                        }
                    }
                },
                "cloudProvider": {
                    "$if.$data.cloudProvider.$exists": {
                        "$true": "$data.cloudProvider",
                        "$else": {
                            "$throw": "createManagedMongoDB requires cloudProvider."
                        }
                    }
                },
                "regionName": {
                    "$if.$data.regionName.$exists": {
                        "$true": "$data.regionName",
                        "$else": {
                            "$throw": "createManagedMongoDB requires regionName."
                        }
                    }
                },
                "cidrBlock": {
                    "$if.$data.cidrBlock.$exists": {
                        "$true": "$data.cidrBlock",
                        "$else": {
                            "$throw": "createManagedMongoDB requires cidrBlock."
                        }
                    }
                },
                "projectName": "Production",
                "clusterName": {
                    "$concat": [
                        [
                            "cluster-",
                            {
                                "$uuid": []
                            }
                        ]
                    ]
                },
                "username": {
                    "$concat": [
                        [
                            "cocreate-",
                            {
                                "$uuid": []
                            }
                        ]
                    ]
                },
                "password": {
                    "$uuid": []
                },
                "organization": {
                    "result": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-organization",
                            "data": {
                                "organizationName": "$actions.organizationId"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "MongoDB organization provisioning failed."
                                    }
                                }
                            }
                        }
                    },
                    "value": {
                        "$null": [
                            "$result.data.organization",
                            "$result.data"
                        ]
                    }
                },
                "project": {
                    "result": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-project",
                            "data": {
                                "atlasOrganizationId": "$actions.organization.value.id",
                                "projectName": "$actions.projectName"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "MongoDB project provisioning failed."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data"
                },
                "cluster": {
                    "result": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-cluster",
                            "data": {
                                "atlasProjectId": "$actions.project.value.id",
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
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "MongoDB cluster provisioning failed."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data"
                },
                "access": {
                    "result": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "add-project-ip-access-list-entry",
                            "data": {
                                "atlasProjectId": "$actions.project.value.id",
                                "cidrBlock": "$actions.cidrBlock",
                                "comment": "CoCreate tenant database access"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "MongoDB access provisioning failed."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data"
                },
                "databaseUser": {
                    "result": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "post",
                            "endpoint": "create-database-user",
                            "data": {
                                "atlasProjectId": "$actions.project.value.id",
                                "clusterName": "$actions.clusterName",
                                "username": "$actions.username",
                                "password": "$actions.password"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "MongoDB databaseUser provisioning failed."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data"
                },
                "connectionString": {
                    "result": {
                        "$api.send": {
                            "api": "mongodb-atlas-admin",
                            "method": "get",
                            "endpoint": "get-cluster-connection",
                            "data": {
                                "atlasProjectId": "$actions.project.value.id",
                                "clusterName": "$actions.clusterName"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "MongoDB connectionString provisioning failed."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data"
                },
                "checkConnection": {
                    "$if.$actions.connectionString.value.connectionStrings.standardSrv.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "MongoDB has not returned its bootstrap connection string yet."
                        }
                    }
                },
                "encodedUsername": {
                    "$encodeURIComponent": "$actions.username"
                },
                "encodedPassword": {
                    "$encodeURIComponent": "$actions.password"
                },
                "connectionUri": {
                    "$actions.connectionString.value.connectionStrings.standardSrv.replace": [
                        "mongodb+srv://",
                        "mongodb+srv://{{$actions.encodedUsername}}:{{$actions.encodedPassword}}@"
                    ]
                },
                "storage": {
                    "name": "mongodb",
                    "provider": "mongodb",
                    "username": "$actions.username",
                    "password": "$actions.password",
                    "connectionString": "$actions.connectionUri"
                },
                "saveStorage": {
                    "result": {
                        "$crud.send": {
                            "method": "object.update",
                            "array": "organizations",
                            "object": {
                                "_id": "$actions.organizationId",
                                "storage": "$actions.storage",
                                "bootstrapStorage": "$actions.storage",
                                "atlas": {
                                    "organizationId": "$actions.organization.value.id",
                                    "projectId": "$actions.project.value.id",
                                    "clusterId": "$actions.cluster.value.id",
                                    "clusterName": "$actions.clusterName"
                                }
                            },
                            "database": "$organization_id"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to update organizations."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to update organizations."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "$data.createManagedMongoDB": {
                    "storage": "$actions.storage",
                    "provisioned": true,
                    "organizationId": "$actions.organization.value.id",
                    "projectId": "$actions.project.value.id",
                    "clusterId": "$actions.cluster.value.id",
                    "clusterName": "$actions.clusterName"
                }
            }
        }
    ]
};
