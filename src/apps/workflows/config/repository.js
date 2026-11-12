export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6b0400000000000000000002",
            "name": "createRepository",
            "enabled": true,
            "description": "Creates a private GitHub repository and saves its SSH deploy connection in the tenant APIs.",
            "actions": {
                "checkOrganization": {
                    "$if.$data.organizationId.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "createRepository requires an organizationId."
                        }
                    }
                },
                "key": {
                    "$security.generateSshKeyPair": []
                },
                "repository": {
                    "result": {
                        "$api.send": {
                            "api": "github-organizations",
                            "endpoint": "create-repository-from-template",
                            "data": {
                                "name": "$data.organizationId",
                                "templateOwner": "CoCreateJS",
                                "templateRepository": "CoCreate-app-template"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to create GitHub repository."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data"
                },
                "checkRepository": {
                    "$if.$actions.repository.value.ssh_url.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "GitHub returned no SSH repository URL."
                        }
                    }
                },
                "access": {
                    "result": {
                        "$api.send": {
                            "api": "github-organizations",
                            "endpoint": "create-repository-deploy-key",
                            "data": {
                                "name": "$data.organizationId",
                                "publicKey": "$actions.key.publicKey"
                            }
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to register GitHub deploy key."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data"
                },
                "checkAccess": {
                    "$if.$actions.access.value.read_only.$eq": {
                        "$false": {},
                        "$else": {
                            "$throw": "GitHub deploy key must allow repository writes."
                        }
                    }
                },
                "hostKeys": {
                    "result": {
                        "$api.send": {
                            "api": "github-organizations",
                            "endpoint": "get-github-ssh-host-keys"
                        }
                    },
                    "checkError": {
                        "$if.$result.error.$exists": {
                            "$true": {
                                "$if.$result.error.length.$gt": {
                                    "0": {
                                        "$throw": "Unable to read GitHub SSH host keys."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$result.data.ssh_keys"
                },
                "checkHostKeys": {
                    "$if.$actions.hostKeys.value.length.$gt": {
                        "0": {},
                        "$else": {
                            "$throw": "GitHub returned no SSH host keys."
                        }
                    }
                },
                "joinedHostKeys": {
                    "$actions.hostKeys.value.join": "\ngithub.com "
                },
                "credential": {
                    "result": {
                        "$crud.send": {
                            "method": "object.create",
                            "array": "apis",
                            "object": {
                                "_id": "$object_id",
                                "name": "github-repository",
                                "type": "repository",
                                "provider": "github",
                                "authentication": "ssh-deploy-key",
                                "repository_url": "$actions.repository.value.ssh_url",
                                "deploy_key_id": "$actions.access.value.id",
                                "publicKey": "$actions.key.publicKey",
                                "privateKey": "$actions.key.privateKey",
                                "knownHosts": "github.com {{$actions.joinedHostKeys}}",
                                "enabled": true,
                                "status": "active"
                            },
                            "organization_id": "$data.organizationId",
                            "host": "$data.host"
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
                "$data.createRepository": {
                    "organizationId": "$data.organizationId",
                    "repository": "$actions.repository.value",
                    "credentialId": "$actions.credential.value._id"
                }
            }
        }
    ]
};
