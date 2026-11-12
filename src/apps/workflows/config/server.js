/** Common provisioning checks and inventory. Input is the saved cluster plus deployment. */
export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6b0600000000000000000002",
            "name": "createOrganizationServer",
            "enabled": true,
            "description": "Validates a cluster deployment once and delegates to create<CloudName>Instance.",
            "actions": {
                "cluster": {
                    "id": {
                        "$if.$data._id.$type": {
                            "string": {
                                "$if.$data._id.$regex": {
                                    "\\S": "$data._id",
                                    "$else": {
                                        "$throw": "Cluster ID is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Cluster ID is required."
                            }
                        }
                    },
                    "read": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "clusters",
                            "filter": {
                                "query": {
                                    "_id": "$id"
                                },
                                "limit": 1
                            }
                        }
                    },
                    "check1": {
                        "$if.$read.error.$exists": {
                            "$true": {
                                "$if.$read.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read the platform cluster."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$read.object.0",
                    "check2": {
                        "$if.$value._id.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Cluster is not available in platform scope."
                            }
                        }
                    },
                    "tenant": {
                        "$null": [
                            "$value.managedOrganization",
                            "$payload.organization_id"
                        ]
                    },
                    "requestedTenant": {
                        "$null": [
                            "$payload.managedOrganization",
                            "$data.managedOrganization",
                            "$payload.organization_id"
                        ]
                    },
                    "matches": {
                        "$Object.is": [
                            "$tenant",
                            "$requestedTenant"
                        ]
                    },
                    "check3": {
                        "$if.$matches.$eq": {
                            "$true": {},
                            "$else": {
                                "$throw": "The cluster does not belong to the managed organization."
                            }
                        }
                    },
                    "startup": {
                        "$if.$value.startupScript.$type": {
                            "string": {
                                "$if.$value.startupScript.$regex": {
                                    "\\S": "$value.startupScript",
                                    "$else": {
                                        "$throw": "Saved cluster startup script is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Saved cluster startup script is required."
                            }
                        }
                    },
                    "host": {
                        "$if.$value.host.$type": {
                            "string": {
                                "$if.$value.host.$regex": {
                                    "\\S": "$value.host",
                                    "$else": {
                                        "$throw": "Cluster host is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Cluster host is required."
                            }
                        }
                    },
                    "storage": {
                        "$if.$value.storage.$type": {
                            "string": {
                                "$if.$value.storage.$regex": {
                                    "\\S": "$value.storage",
                                    "$else": {
                                        "$throw": "Cluster storage reference is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Cluster storage reference is required."
                            }
                        }
                    }
                },
                "deployment": {
                    "cloud": {
                        "$if.$data.deployment.cloud.$type": {
                            "string": {
                                "$if.$data.deployment.cloud.$regex": {
                                    "\\S": "$data.deployment.cloud",
                                    "$else": {
                                        "$throw": "Deployment cloud is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Deployment cloud is required."
                            }
                        }
                    },
                    "region": {
                        "$if.$data.deployment.region.$type": {
                            "string": {
                                "$if.$data.deployment.region.$regex": {
                                    "\\S": "$data.deployment.region",
                                    "$else": {
                                        "$throw": "Deployment region is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Deployment region is required."
                            }
                        }
                    },
                    "type": {
                        "$if.$data.deployment.type.$type": {
                            "string": {
                                "$if.$data.deployment.type.$regex": {
                                    "\\S": "$data.deployment.type",
                                    "$else": {
                                        "$throw": "Deployment server type is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Deployment server type is required."
                            }
                        }
                    },
                    "allowed": {
                        "ids": { "$null": ["$actions.cluster.value.clouds", []] },
                        "permitted": {
                            "$if.$ids.length.$gt": {
                                "0": { "$ids.includes": "$cloud" },
                                "$else": true
                            }
                        }
                    },
                    "check1": {
                        "$if.$allowed.permitted.$eq": {
                            "$true": {},
                            "$else": {
                                "$throw": "The deployment cloud is not allowed by this cluster."
                            }
                        }
                    },
                    "dns": {
                        "input": {
                            "$null": [
                                "$data.deployment.dns",
                                []
                            ]
                        },
                        "isArray": {
                            "$Array.isArray": [
                                "$input"
                            ]
                        },
                        "value": {
                            "$if.$isArray.$eq": {
                                "$true": "$input",
                                "$else": {
                                    "$if.$input.$type": {
                                        "object": [
                                            "$input"
                                        ],
                                        "$else": {
                                            "$throw": "Deployment DNS must be an object or an array of objects."
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "value": {
                        "$Object.assign": [
                            {},
                            "$data.deployment",
                            {
                                "cloud": "$cloud",
                                "region": "$region",
                                "type": "$type",
                                "dns": "$dns.value"
                            }
                        ]
                    }
                },
                "cloud": {
                    "read": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "apis",
                            "filter": {
                                "query": {
                                    "_id": "$actions.deployment.value.cloud",
                                    "type": "cloud",
                                    "enabled": true
                                },
                                "key": {
                                    "_id": 1,
                                    "name": 1,
                                    "provider": 1
                                },
                                "limit": 1
                            }
                        }
                    },
                    "check1": {
                        "$if.$read.error.$exists": {
                            "$true": {
                                "$if.$read.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read the selected cloud API."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$read.object.0",
                    "check2": {
                        "$if.$value.name.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "The selected cloud API is unavailable."
                            }
                        }
                    },
                    "workflow": {
                        "name": {
                            "$value.name.toLowerCase": []
                        },
                        "first": {
                            "$name.charAt": 0
                        },
                        "upper": {
                            "$first.toUpperCase": []
                        },
                        "rest": {
                            "$name.slice": 1
                        },
                        "value": "workflow.create{{$upper}}{{$rest}}Instance"
                    }
                },
                "server": {
                    "generatedId": "$object_id",
                    "id": {
                        "$null": [
                            "$actions.deployment.value.server_id",
                            "$generatedId"
                        ]
                    },
                    "check1": {
                        "$if.$id.$regex": {
                            "^[a-fA-F0-9]{24}$": {},
                            "$else": {
                                "$throw": "Server ID must be a 24-character object ID."
                            }
                        }
                    },
                    "defaultName": "{{$actions.cluster.value.name}}-{{$id}}",
                    "name": {
                        "$null": [
                            "$actions.deployment.value.name",
                            "$defaultName"
                        ]
                    },
                    "record": {
                        "_id": "$id",
                        "name": "$name",
                        "cluster_id": "$actions.cluster.value._id",
                        "tenant_organization_id": "$actions.cluster.tenant",
                        "storage": "$actions.cluster.value.storage",
                        "host": "$actions.cluster.value.host",
                        "totalWorkers": 0,
                        "master": {
                            "status": "provisioning"
                        },
                        "deployment": {
                            "$Object.assign": [
                                {},
                                "$actions.deployment.value",
                                {
                                    "provider": "$actions.cloud.value.provider"
                                }
                            ]
                        }
                    },
                    "platform": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "servers",
                            "object": "$record"
                        }
                    },
                    "check2": {
                        "$if.$platform.error.$exists": {
                            "$true": {
                                "$if.$platform.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to reserve the platform server record."
                                    }
                                }
                            }
                        }
                    },
                    "tenant": {
                        "$if.$actions.cluster.tenant.$eq": {
                            "$payload.organization_id": null,
                            "$else": {
                                "$crud.send": {
                                    "method": "object.create",
                                    "array": "servers",
                                    "object": "$record",
                                    "organization_id": "$actions.cluster.tenant",
                                    "host": "$actions.cluster.value.host"
                                }
                            }
                        }
                    },
                    "check3": {
                        "$if.$tenant.error.$exists": {
                            "$true": {
                                "$if.$tenant.error.length.$gt": {
                                    "0": {
                                        "failed": {
                                            "$crud.send": {
                                                "method": "object.update",
                                                "array": "servers",
                                                "object": {
                                                    "_id": "$id",
                                                    "master.status": "failed"
                                                }
                                            }
                                        },
                                        "$throw": "Unable to reserve the tenant server record."
                                    }
                                }
                            }
                        }
                    }
                },
                "$payload.server": {
                    "_id": "$actions.server.id"
                },
                "instance": {
                    "$workflows.run": [
                        {
                            "method": "$actions.cloud.workflow.value",
                            "data": {
                                "$Object.assign": [
                                    {},
                                    "$actions.cluster.value",
                                    {
                                        "managedOrganization": "$actions.cluster.tenant",
                                        "deployment": {
                                            "$Object.assign": [
                                                {},
                                                "$actions.deployment.value",
                                                {
                                                    "api": "$actions.cloud.value._id",
                                                    "server_id": "$actions.server.id",
                                                    "name": "$actions.server.name"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "throwOnError": false
                        }
                    ]
                },
                "check1": {
                    "$if.$actions.instance.error.$exists": {
                        "$true": {
                            "$if.$actions.instance.error.length.$gt": {
                                "0": {
                                    "platform": {
                                        "$crud.send": {
                                            "method": "object.update",
                                            "array": "servers",
                                            "object": {
                                                "_id": "$actions.server.id",
                                                "master.status": "failed"
                                            }
                                        }
                                    },
                                    "tenant": {
                                        "$if.$actions.cluster.tenant.$eq": {
                                            "$payload.organization_id": null,
                                            "$else": {
                                                "$crud.send": {
                                                    "method": "object.update",
                                                    "array": "servers",
                                                    "object": {
                                                        "_id": "$actions.server.id",
                                                        "master.status": "failed"
                                                    },
                                                    "organization_id": "$actions.cluster.tenant",
                                                    "host": "$actions.cluster.value.host"
                                                }
                                            }
                                        }
                                    },
                                    "$throw": "$actions.instance.error"
                                }
                            }
                        }
                    }
                },
                "check2": {
                    "$if.$actions.instance.data.id.$exists": {
                        "$true": {},
                        "$else": {
                            "platform": {
                                "$crud.send": {
                                    "method": "object.update",
                                    "array": "servers",
                                    "object": {
                                        "_id": "$actions.server.id",
                                        "master.status": "failed"
                                    }
                                }
                            },
                            "tenant": {
                                "$if.$actions.cluster.tenant.$eq": {
                                    "$payload.organization_id": null,
                                    "$else": {
                                        "$crud.send": {
                                            "method": "object.update",
                                            "array": "servers",
                                            "object": {
                                                "_id": "$actions.server.id",
                                                "master.status": "failed"
                                            },
                                            "organization_id": "$actions.cluster.tenant",
                                            "host": "$actions.cluster.value.host"
                                        }
                                    }
                                }
                            },
                            "$throw": "The provider workflow returned no instance ID."
                        }
                    }
                },
                "persisted": {
                    "patch": {
                        "_id": "$actions.server.id",
                        "status": "starting",
                        "deployment.id": "$actions.instance.data.id",
                        "deployment.privateIpAddress": {
                            "$null": [
                                "$actions.instance.data.privateIpAddress",
                                null
                            ]
                        }
                    },
                    "platform": {
                        "$crud.send": {
                            "method": "object.update",
                            "array": "servers",
                            "object": "$patch"
                        }
                    },
                    "check1": {
                        "$if.$platform.error.$exists": {
                            "$true": {
                                "$if.$platform.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to persist the platform provider result."
                                    }
                                }
                            }
                        }
                    },
                    "tenant": {
                        "$if.$actions.cluster.tenant.$eq": {
                            "$payload.organization_id": null,
                            "$else": {
                                "$crud.send": {
                                    "method": "object.update",
                                    "array": "servers",
                                    "object": "$patch",
                                    "organization_id": "$actions.cluster.tenant",
                                    "host": "$actions.cluster.value.host"
                                }
                            }
                        }
                    },
                    "check2": {
                        "$if.$tenant.error.$exists": {
                            "$true": {
                                "$if.$tenant.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to persist the tenant provider result."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$platform.object.0"
                },
                "$payload.data": {
                    "$Object.assign": [
                        {},
                        "$actions.instance.data",
                        {
                            "server": "$actions.persisted.value"
                        }
                    ]
                }
            }
        },
        {
            "_id": "6b0600000000000000000003",
            "name": "deleteOrganizationServer",
            "enabled": true,
            "description": "Validates stored server ownership and delegates infrastructure termination to delete<CloudName>Instance. Inventory cleanup and DNS removal remain separate.",
            "actions": {
                "cluster": {
                    "id": {
                        "$if.$data._id.$type": {
                            "string": {
                                "$if.$data._id.$regex": {
                                    "\\S": "$data._id",
                                    "$else": {
                                        "$throw": "Cluster ID is required."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "Cluster ID is required."
                            }
                        }
                    },
                    "read": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "clusters",
                            "filter": {
                                "query": {
                                    "_id": "$id"
                                },
                                "limit": 1
                            }
                        }
                    },
                    "check1": {
                        "$if.$read.error.$exists": {
                            "$true": {
                                "$if.$read.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read the platform cluster."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$read.object.0",
                    "check2": {
                        "$if.$value._id.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Cluster is not available in platform scope."
                            }
                        }
                    },
                    "tenant": {
                        "$null": [
                            "$value.managedOrganization",
                            "$payload.organization_id"
                        ]
                    },
                    "requestedTenant": {
                        "$null": [
                            "$payload.managedOrganization",
                            "$data.managedOrganization",
                            "$payload.organization_id"
                        ]
                    },
                    "matches": {
                        "$Object.is": [
                            "$tenant",
                            "$requestedTenant"
                        ]
                    },
                    "check3": {
                        "$if.$matches.$eq": {
                            "$true": {},
                            "$else": {
                                "$throw": "The cluster does not belong to the managed organization."
                            }
                        }
                    }
                },
                "server": {
                    "id": {
                        "$if.$data.deployment.server_id.$type": {
                            "string": {
                                "$if.$data.deployment.server_id.$regex": {
                                    "\\S": "$data.deployment.server_id",
                                    "$else": {
                                        "$throw": "A server ID is required for deletion."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "A server ID is required for deletion."
                            }
                        }
                    },
                    "read": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "servers",
                            "filter": {
                                "query": {
                                    "_id": "$id",
                                    "cluster_id": "$actions.cluster.value._id",
                                    "tenant_organization_id": "$actions.cluster.tenant"
                                },
                                "limit": 1
                            }
                        }
                    },
                    "checkRead": {
                        "$if.$read.error.$exists": {
                            "$true": {
                                "$if.$read.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read server inventory."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$read.object.0",
                    "checkExists": {
                        "$if.$value._id.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "The server does not belong to this cluster and organization."
                            }
                        }
                    },
                    "cloud": {
                        "$if.$value.deployment.cloud.$type": {
                            "string": {
                                "$if.$value.deployment.cloud.$regex": {
                                    "\\S": "$value.deployment.cloud",
                                    "$else": {
                                        "$throw": "The stored server has no cloud API reference."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "The stored server has no cloud API reference."
                            }
                        }
                    },
                    "allowed": {
                        "ids": { "$null": ["$actions.cluster.value.clouds", []] },
                        "permitted": {
                            "$if.$ids.length.$gt": {
                                "0": { "$ids.includes": "$cloud" },
                                "$else": true
                            }
                        }
                    },
                    "checkAllowed": {
                        "$if.$allowed.permitted.$eq": {
                            "$true": {},
                            "$else": {
                                "$throw": "The server cloud is not allowed by this cluster."
                            }
                        }
                    },
                    "deploymentId": {
                        "$if.$value.deployment.id.$type": {
                            "string": {
                                "$if.$value.deployment.id.$regex": {
                                    "\\S": "$value.deployment.id",
                                    "$else": {
                                        "$throw": "The stored server has no infrastructure ID."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "The stored server has no infrastructure ID."
                            }
                        }
                    },
                    "region": {
                        "$if.$value.deployment.region.$type": {
                            "string": {
                                "$if.$value.deployment.region.$regex": {
                                    "\\S": "$value.deployment.region",
                                    "$else": {
                                        "$throw": "The stored server has no infrastructure region."
                                    }
                                }
                            },
                            "$else": {
                                "$throw": "The stored server has no infrastructure region."
                            }
                        }
                    }
                },
                "deployment": {
                    "value": {
                        "$Object.assign": [
                            {},
                            "$actions.server.value.deployment",
                            {
                                "server_id": "$actions.server.value._id"
                            }
                        ]
                    }
                },
                "cloud": {
                    "read": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "apis",
                            "filter": {
                                "query": {
                                    "_id": "$actions.deployment.value.cloud",
                                    "type": "cloud",
                                    "enabled": true
                                },
                                "key": {
                                    "_id": 1,
                                    "name": 1,
                                    "provider": 1
                                },
                                "limit": 1
                            }
                        }
                    },
                    "check1": {
                        "$if.$read.error.$exists": {
                            "$true": {
                                "$if.$read.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read the selected cloud API."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$read.object.0",
                    "check2": {
                        "$if.$value.name.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "The selected cloud API is unavailable."
                            }
                        }
                    },
                    "workflow": {
                        "name": {
                            "$value.name.toLowerCase": []
                        },
                        "first": {
                            "$name.charAt": 0
                        },
                        "upper": {
                            "$first.toUpperCase": []
                        },
                        "rest": {
                            "$name.slice": 1
                        },
                        "value": "workflow.delete{{$upper}}{{$rest}}Instance"
                    }
                },
                "instance": {
                    "$workflows.run": [
                        {
                            "method": "$actions.cloud.workflow.value",
                            "data": {
                                "$Object.assign": [
                                    {},
                                    "$actions.cluster.value",
                                    {
                                        "deployment": {
                                            "$Object.assign": [
                                                {},
                                                "$actions.deployment.value",
                                                {
                                                    "api": "$actions.cloud.value._id"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "throwOnError": false
                        }
                    ]
                },
                "check": {
                    "$if.$actions.instance.error.$exists": {
                        "$true": {
                            "$if.$actions.instance.error.length.$gt": {
                                "0": {
                                    "$throw": "$actions.instance.error"
                                }
                            }
                        }
                    }
                },
                "resultId": {
                    "$Object.is": [
                        "$actions.instance.data.id",
                        "$actions.deployment.value.id"
                    ]
                },
                "checkResult": {
                    "$if.$resultId.$eq": {
                        "$true": {},
                        "$else": {
                            "$throw": "The provider returned no matching infrastructure ID."
                        }
                    }
                },
                "$payload.data": {
                    "$Object.assign": [
                        {},
                        "$actions.instance.data",
                        {
                            "server": "$actions.server.value"
                        }
                    ]
                }
            }
        }
    ]
};
