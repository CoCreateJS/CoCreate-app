/** Signup orchestration. Provider settings are read from platform servers_config. */
export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6b0000000000000000000004",
            "name": "onboardOrganization",
            "enabled": true,
            "description": "Connects organization, storage, tenant seeding, repository and cluster creation using platform provisioning settings.",
            "actions": {
                "input": {
                    "$null": [
                        "$payload.onboardOrganization.0",
                        "$payload.onboardOrganization",
                        "$payload.data"
                    ]
                },
                "checkUser": {
                    "$if.$payload.user_id.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "Sign in before onboarding an organization."
                        }
                    }
                },
                "settings": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "servers_config",
                            "filter": {
                                "query": {
                                    "type": "organizations",
                                    "enabled": true
                                },
                                "limit": 1
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read servers_config."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to read servers_config."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing servers_config record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "userKey": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "keys",
                            "filter": {
                                "query": {
                                    "type": "user",
                                    "key": "$payload.user_id"
                                },
                                "limit": 1
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read keys."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to read keys."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing keys record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "user": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "$actions.userKey.value.array",
                            "filter": {
                                "query": {
                                    "_id": "$payload.user_id"
                                },
                                "limit": 1
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read $actions.userKey.value.array."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to read $actions.userKey.value.array."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing $actions.userKey.value.array record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "location": {
                    "$null": [
                        "$clientInfo",
                        "$actions.user.value.location"
                    ]
                },
                "latitude": {
                    "$Number.isFinite": [
                        "$actions.location.latitude"
                    ]
                },
                "longitude": {
                    "$Number.isFinite": [
                        "$actions.location.longitude"
                    ]
                },
                "checkLatitude": {
                    "$if.$actions.latitude.$eq": {
                        "$true": {},
                        "$else": {
                            "$throw": "Onboarding requires a client or user location with latitude and longitude."
                        }
                    }
                },
                "checkLongitude": {
                    "$if.$actions.longitude.$eq": {
                        "$true": {},
                        "$else": {
                            "$throw": "Onboarding requires a client or user location with latitude and longitude."
                        }
                    }
                },
                "absoluteLatitude": {
                    "$Math.abs": "$actions.location.latitude"
                },
                "absoluteLongitude": {
                    "$Math.abs": "$actions.location.longitude"
                },
                "checkLatitudeRange": {
                    "$if.$actions.absoluteLatitude.$lte": {
                        "90": {},
                        "$else": {
                            "$throw": "Latitude must be between -90 and 90."
                        }
                    }
                },
                "checkLongitudeRange": {
                    "$if.$actions.absoluteLongitude.$lte": {
                        "180": {},
                        "$else": {
                            "$throw": "Longitude must be between -180 and 180."
                        }
                    }
                },
                "checkName": {
                    "$if.$actions.input.organization.name.$regex": {
                        "\\S": {},
                        "$else": {
                            "$throw": "An organization name is required."
                        }
                    }
                },
                "host": "$actions.input.organization.host.0.name",
                "checkHost": {
                    "$if.$actions.host.$regex": {
                        "^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\\.cocreatejs\\.com$": {},
                        "$else": {
                            "$throw": "A valid cocreatejs.com workspace hostname is required."
                        }
                    }
                },
                "existingHost": {
                    "$crud.send": {
                        "method": "object.read",
                        "array": "organizations",
                        "filter": {
                            "query": {
                                "host.name": "$actions.host"
                            },
                            "limit": 1
                        }
                    }
                },
                "checkHostRead": {
                    "$if.$actions.existingHost.error.$exists": {
                        "$true": {
                            "$if.$actions.existingHost.error.length.$gt": {
                                "0": {
                                    "$throw": "Unable to check workspace hostname."
                                }
                            }
                        }
                    }
                },
                "checkHostAvailable": {
                    "$if.$actions.existingHost.object.0._id.$exists": {
                        "$true": {
                            "$throw": "That workspace hostname is already in use."
                        }
                    }
                },
                "checkStorageCloud": {
                    "$if.$actions.settings.value.config.storageProvisioning.cloudProvider.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "Configure organizations.storageProvisioning.cloudProvider before onboarding."
                        }
                    }
                },
                "checkStorageRegion": {
                    "$if.$actions.settings.value.config.storageProvisioning.regionName.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "Configure organizations.storageProvisioning.regionName before onboarding."
                        }
                    }
                },
                "checkStorageNetwork": {
                    "$if.$actions.settings.value.config.storageProvisioning.cidrBlock.$regex": {
                        "\\S": {},
                        "$else": {
                            "$throw": "Configure organizations.storageProvisioning.cidrBlock before onboarding."
                        }
                    }
                },
                "storageDefinition": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "workflows",
                            "filter": {
                                "query": {
                                    "name": "createManagedMongoDB"
                                },
                                "limit": 1
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read workflows."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to read workflows."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing workflows record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "checkStorageEnabled": {
                    "$if.$actions.storageDefinition.value.enabled.$eq": {
                        "$true": {},
                        "$else": {
                            "$throw": "Storage provisioning is disabled. Configure and enable createManagedMongoDB before onboarding."
                        }
                    }
                },
                "organization": {
                    "$workflows.run": {
                        "method": "workflow.createOrganization",
                        "user_id": "$payload.user_id",
                        "createOrganization": {
                            "organization": {
                                "name": "$actions.input.organization.name",
                                "host": [
                                    {
                                        "name": "$actions.host"
                                    }
                                ],
                                "location": {
                                    "latitude": "$actions.location.latitude",
                                    "longitude": "$actions.location.longitude"
                                }
                            }
                        }
                    }
                },
                "organizationId": "$actions.organization.createOrganization._id",
                "storage": {
                    "$workflows.run": {
                        "method": "workflow.createManagedMongoDB",
                        "user_id": "$payload.user_id",
                        "createManagedMongoDB": {
                            "$Object.assign": [
                                {},
                                "$actions.settings.value.config.storageProvisioning",
                                {
                                    "organizationId": "$actions.organizationId"
                                }
                            ]
                        }
                    }
                },
                "checkStorage": {
                    "$if.$actions.storage.createManagedMongoDB.storage.connectionString.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "Storage provisioning returned no bootstrap connection string."
                        }
                    }
                },
                "bootstrap": {
                    "result": {
                        "$crud.send": {
                            "method": "object.update",
                            "array": "organizations",
                            "object": {
                                "_id": "$actions.organizationId",
                                "bootstrapStorage": "$actions.storage.createManagedMongoDB.storage"
                            }
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
                "seed": {
                    "$workflows.run": {
                        "method": "workflow.seedOrganization",
                        "user_id": "$payload.user_id",
                        "seedOrganization": {
                            "organizationId": "$actions.organizationId",
                            "host": "$actions.host"
                        }
                    }
                },
                "storageApi": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "apis",
                            "object": {
                                "$Object.assign": [
                                    {},
                                    "$actions.storage.createManagedMongoDB.storage",
                                    {
                                        "_id": "$object_id",
                                        "type": "storage",
                                        "enabled": true
                                    }
                                ]
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$actions.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create apis."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create apis."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing apis record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "repository": {
                    "$workflows.run": {
                        "method": "workflow.createRepository",
                        "user_id": "$payload.user_id",
                        "createRepository": {
                            "organizationId": "$actions.organizationId",
                            "host": "$actions.host"
                        }
                    }
                },
                "cluster": {
                    "$workflows.run": {
                        "method": "workflow.createClusterConfig",
                        "user_id": "$payload.user_id",
                        "createClusterConfig": {
                            "name": "$actions.input.organization.name",
                            "managedOrganization": "$actions.organizationId",
                            "host": "$actions.host",
                            "bootstrapStorage": "$actions.storage.createManagedMongoDB.storage",
                            "manager": {
                                "organization_id": "$payload.organization_id",
                                "host": "$payload.host",
                                "apiKey": "$actions.organization.createOrganization.managedKey"
                            }
                        }
                    }
                },
                "clusterConfig": {
                    "$Object.assign": [
                        {},
                        "$actions.cluster.data",
                        {
                            "_id": "$object_id",
                            "storage": "$actions.storageApi.value._id",
                            "repositories": [
                                {
                                    "url": "$actions.repository.createRepository.repository.ssh_url",
                                    "api": "$actions.repository.createRepository.credentialId",
                                    "branch": "main",
                                    "enabled": true,
                                    "initialUpload": {
                                        "enabled": true,
                                        "completed": false
                                    }
                                }
                            ],
                            "scaleIn": {
                                "$Object.assign": [
                                    {},
                                    "$actions.cluster.data.scaleIn",
                                    "$actions.settings.value.config.clusterProvisioning.scaleIn"
                                ]
                            }
                        }
                    ]
                },
                "platformCluster": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "clusters",
                            "object": "$actions.clusterConfig"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create clusters."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create clusters."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing clusters record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "tenantCluster": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "clusters",
                            "object": "$actions.clusterConfig",
                            "organization_id": "$actions.organizationId",
                            "host": "$actions.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create clusters."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create clusters."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing clusters record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "platformLink": {
                    "result": {
                        "$crud.send": {
                            "method": "object.update",
                            "array": "organizations",
                            "object": {
                                "_id": "$actions.organizationId",
                                "cluster_id": "$actions.clusterConfig._id"
                            }
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
                "tenantLink": {
                    "result": {
                        "$crud.send": {
                            "method": "object.update",
                            "array": "organizations",
                            "object": {
                                "_id": "$actions.organizationId",
                                "cluster_id": "$actions.clusterConfig._id"
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$actions.host"
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
                "$data.onboardOrganization": {
                    "organizationId": "$actions.organizationId",
                    "clusterId": "$actions.clusterConfig._id",
                    "host": "$actions.host",
                    "status": "configured",
                    "redirect": "https://{{$actions.host}}/auth/"
                }
            }
        }
    ]
};
