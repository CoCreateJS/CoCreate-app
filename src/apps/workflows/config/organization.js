export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6b0000000000000000000002",
            "name": "createOrganization",
            "description": "Creates an organization and its managed platform key.",
            "enabled": true,
            "actions": {
                "organization": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "organizations",
                            "object": {
                                "name": "$data.organization.name",
                                "host": "$data.organization.host",
                                "location": "$data.organization.location",
                                "owner": "$payload.user_id"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create organizations."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create organizations."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing organizations record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "managedKey": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "keys",
                            "object": {
                                "_id": "$object_id",
                                "name": "Managed organization {{$actions.organization.value._id}}",
                                "type": "key",
                                "status": "active",
                                "key": {
                                    "$uuid": []
                                },
                                "admin": false,
                                "default": false,
                                "roles": [
                                    "6b0700000000000000000021"
                                ],
                                "managedOrganization": "$actions.organization.value._id"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create keys."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create keys."
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
                "$data.createOrganization": {
                    "$Object.assign": [
                        {},
                        "$actions.organization.value",
                        {
                            "managedKey": "$actions.managedKey.value.key"
                        }
                    ]
                }
            }
        },
        {
            "_id": "6b0000000000000000000003",
            "name": "seedOrganization",
            "description": "Seeds an organization database with its organization, owner, roles, and keys.",
            "enabled": true,
            "actions": {
                "organizationId": {
                    "$if.$data.organizationId.$exists": {
                        "$true": "$data.organizationId",
                        "$else": {
                            "$throw": "seedOrganization requires an organizationId."
                        }
                    }
                },
                "userId": {
                    "$if.$payload.user_id.$exists": {
                        "$true": "$payload.user_id",
                        "$else": {
                            "$throw": "seedOrganization requires an authenticated user."
                        }
                    }
                },
                "sourceOrganization": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "organizations",
                            "filter": {
                                "query": {
                                    "_id": "$actions.organizationId",
                                    "owner": "$actions.userId"
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
                                        "$throw": "Unable to read organizations."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to read organizations."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing organizations record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "organization": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "organizations",
                            "object": {
                                "$Object.assign": [
                                    {},
                                    "$actions.sourceOrganization.value",
                                    {
                                        "organization_id": "$actions.organizationId"
                                    }
                                ]
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$data.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create organizations."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create organizations."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing organizations record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "adminRole": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "keys",
                            "object": {
                                "_id": "$object_id",
                                "description": "Administrator role granting full organization access.",
                                "admin": true,
                                "name": "admin",
                                "type": "role",
                                "status": "active"
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$data.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create keys."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create keys."
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
                "sourceKey": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "keys",
                            "filter": {
                                "query": {
                                    "type": "user",
                                    "key": "$actions.userId"
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
                "sourceUser": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "$actions.sourceKey.value.array",
                            "filter": {
                                "query": {
                                    "_id": "$actions.userId"
                                },
                                "limit": 1,
                                "key": {
                                    "password": 0
                                }
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read $actions.sourceKey.value.array."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to read $actions.sourceKey.value.array."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing $actions.sourceKey.value.array record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "user": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "$actions.sourceKey.value.array",
                            "object": {
                                "$Object.assign": [
                                    {},
                                    "$actions.sourceUser.value",
                                    {
                                        "organization_id": "$actions.organizationId"
                                    }
                                ]
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$data.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create $actions.sourceKey.value.array."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create $actions.sourceKey.value.array."
                            }
                        }
                    },
                    "checkRecord": {
                        "$if.$result.object.0.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "Missing $actions.sourceKey.value.array record."
                            }
                        }
                    },
                    "value": "$result.object.0"
                },
                "userKey": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "keys",
                            "object": {
                                "_id": "$object_id",
                                "type": "user",
                                "key": "$actions.userId",
                                "name": "$actions.sourceUser.value.name",
                                "array": "$actions.sourceKey.value.array",
                                "email": "$actions.sourceKey.value.email",
                                "username": "$actions.sourceKey.value.username",
                                "password": "$actions.sourceKey.value.password",
                                "roles": [
                                    "$actions.adminRole.value._id"
                                ],
                                "status": "active"
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$data.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create keys."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create keys."
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
                "adminKey": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "keys",
                            "object": {
                                "_id": "$object_id",
                                "description": "Administrative API key with full organization access.",
                                "admin": true,
                                "name": "admin",
                                "key": {
                                    "$uuid": []
                                },
                                "type": "key",
                                "status": "active"
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$data.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create keys."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create keys."
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
                "sourceDefaultKey": {
                    "result": {
                        "$crud.send": {
                            "method": "object.read",
                            "array": "keys",
                            "filter": {
                                "query": {
                                    "type": "key",
                                    "default": true
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
                "defaultKey": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "keys",
                            "object": {
                                "_id": "$object_id",
                                "description": "Default API key for authentication, account access, and permitted content reads.",
                                "methods": "$actions.sourceDefaultKey.value.methods",
                                "default": true,
                                "name": "default",
                                "key": {
                                    "$uuid": []
                                },
                                "type": "key",
                                "status": "active"
                            },
                            "organization_id": "$actions.organizationId",
                            "host": "$data.host"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create keys."
                                    }
                                }
                            }
                        }
                    },
                    "checkSuccess": {
                        "$if.$result.success.$eq": {
                            "$false": {
                                "$throw": "Unable to create keys."
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
                "$data.seedOrganization": {
                    "initialized": true,
                    "organizationId": "$actions.organizationId",
                    "userId": "$actions.userId"
                }
            }
        }
    ]
};
