/** Signup-only GitHub repository initialization. No local checkout or upload. */
export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6b0400000000000000000002",
            "name": "create-organization-repository",
            "enabled": true,
            "description": "Creates the signup repository, commits tenant upload configuration, creates dev/test from the same commit, and stores the repository reference.",
            "actions": {
                "credentialId": {
                    "$if.$payload.create-organization-repository.0.credentialId.$type": {
                        "string": {
                            "$if.$payload.create-organization-repository.0.credentialId.$regex": {
                                "^[a-fA-F0-9]{24}$": {
                                    "$payload.create-organization-repository.0.credentialId.trim": []
                                },
                                "$else": {
                                    "$throw": "Repository credential ID is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "Repository credential ID is required."
                        }
                    }
                },
                "publicKey": {
                    "$if.$payload.create-organization-repository.0.publicKey.$type": {
                        "string": {
                            "$if.$payload.create-organization-repository.0.publicKey.$regex": {
                                "^ssh-rsa [A-Za-z0-9+/]+={0,2}$": {
                                    "$payload.create-organization-repository.0.publicKey.trim": []
                                },
                                "$else": {
                                    "$throw": "Repository public key is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "Repository public key is required."
                        }
                    }
                },
                "organizationId": {
                    "$if.$payload.create-organization-repository.0.organizationId.$type": {
                        "string": {
                            "$if.$payload.create-organization-repository.0.organizationId.$regex": {
                                "\\S": {
                                    "$payload.create-organization-repository.0.organizationId.trim": []
                                },
                                "$else": {
                                    "$throw": "Repository initialization requires an organization ID."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "Repository initialization requires an organization ID."
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
                                "_id": 1,
                                "name": 1,
                                "host": 1
                            },
                            "limit": 1
                        }
                    }
                },
                "organizationLookupResult": {
                    "$if.$actions.organizationLookup.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to read the platform organization."
                        },
                        "$else": {
                            "$if.$actions.organizationLookup.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to read the platform organization."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "organization": {
                    "$if.$actions.organizationLookup.object.0.$exists": {
                        "$true": "$actions.organizationLookup.object.0",
                        "$else": {
                            "$throw": "The platform organization is unavailable."
                        }
                    }
                },
                "hostname": {
                    "$if.$actions.organization.host.0.name.$type": {
                        "string": {
                            "$if.$actions.organization.host.0.name.$regex": {
                                "\\S": {
                                    "$actions.organization.host.0.name.trim": []
                                },
                                "$else": {
                                    "$throw": "The organization requires a primary hostname."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The organization requires a primary hostname."
                        }
                    }
                },
                "apiName": {
                    "$if.$payload.create-organization-repository.0.api.$type": {
                        "string": {
                            "$if.$payload.create-organization-repository.0.api.$type": {
                                "string": {
                                    "$if.$payload.create-organization-repository.0.api.$regex": {
                                        "\\S": {
                                            "$payload.create-organization-repository.0.api.trim": []
                                        },
                                        "$else": {
                                            "$throw": "A configured repository value is empty."
                                        }
                                    }
                                },
                                "$else": {
                                    "$throw": "A configured repository value is empty."
                                }
                            }
                        },
                        "$else": "github-organizations"
                    }
                },
                "apiLookup": {
                    "$crud.send": {
                        "method": "object.read",
                        "array": "apis",
                        "filter": {
                            "query": {
                                "name": "$actions.apiName",
                                "enabled": true
                            },
                            "key": {
                                "_id": 1,
                                "owner": 1
                            },
                            "limit": 1
                        }
                    }
                },
                "apiLookupResult": {
                    "$if.$actions.apiLookup.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to read the GitHub API configuration."
                        },
                        "$else": {
                            "$if.$actions.apiLookup.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to read the GitHub API configuration."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "api": {
                    "$if.$actions.apiLookup.object.0.$exists": {
                        "$true": "$actions.apiLookup.object.0",
                        "$else": {
                            "$throw": "The enabled managed GitHub API is unavailable."
                        }
                    }
                },
                "owner": {
                    "$if.$actions.api.owner.$type": {
                        "string": {
                            "$if.$actions.api.owner.$regex": {
                                "\\S": {
                                    "$actions.api.owner.trim": []
                                },
                                "$else": {
                                    "$throw": "The managed GitHub API requires its repository owner."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The managed GitHub API requires its repository owner."
                        }
                    }
                },
                "repositoryName": "$actions.organizationId",
                "templateOwner": {
                    "$if.$payload.create-organization-repository.0.templateOwner.$type": {
                        "string": {
                            "$if.$payload.create-organization-repository.0.templateOwner.$type": {
                                "string": {
                                    "$if.$payload.create-organization-repository.0.templateOwner.$regex": {
                                        "\\S": {
                                            "$payload.create-organization-repository.0.templateOwner.trim": []
                                        },
                                        "$else": {
                                            "$throw": "A configured repository value is empty."
                                        }
                                    }
                                },
                                "$else": {
                                    "$throw": "A configured repository value is empty."
                                }
                            }
                        },
                        "$else": "CoCreateJS"
                    }
                },
                "templateRepository": {
                    "$if.$payload.create-organization-repository.0.templateRepository.$type": {
                        "string": {
                            "$if.$payload.create-organization-repository.0.templateRepository.$type": {
                                "string": {
                                    "$if.$payload.create-organization-repository.0.templateRepository.$regex": {
                                        "\\S": {
                                            "$payload.create-organization-repository.0.templateRepository.trim": []
                                        },
                                        "$else": {
                                            "$throw": "A configured repository value is empty."
                                        }
                                    }
                                },
                                "$else": {
                                    "$throw": "A configured repository value is empty."
                                }
                            }
                        },
                        "$else": "CoCreate-app-template"
                    }
                },
                "repository": {
                    "$api.send": {
                        "api": "$actions.apiName",
                        "endpoint": "create-repository-from-template",
                        "data": {
                            "name": "$actions.repositoryName",
                            "templateOwner": "$actions.templateOwner",
                            "templateRepository": "$actions.templateRepository"
                        }
                    }
                },
                "repositoryResult": {
                    "$if.$actions.repository.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to create the organization repository."
                        },
                        "$else": {
                            "$if.$actions.repository.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to create the organization repository."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "branch": {
                    "$if.$actions.repository.data.default_branch.$eq": {
                        "main": "main",
                        "$else": {
                            "$throw": "The signup template must use main as its default branch."
                        }
                    }
                },
                "cloneUrl": {
                    "$if.$actions.repository.data.clone_url.$type": {
                        "string": {
                            "$if.$actions.repository.data.clone_url.$regex": {
                                "\\S": {
                                    "$actions.repository.data.clone_url.trim": []
                                },
                                "$else": {
                                    "$throw": "GitHub did not return the repository clone URL."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "GitHub did not return the repository clone URL."
                        }
                    }
                },
                "initialConfig": {
                    "organization_id": "$actions.organizationId",
                    "apikey": "",
                    "host": {
                        "$branch": {
                            "main": {
                                "$concat": [
                                    [
                                        "wss://",
                                        "$actions.hostname"
                                    ]
                                ]
                            },
                            "dev": {
                                "$concat": [
                                    [
                                        "wss://dev.",
                                        "$actions.hostname"
                                    ]
                                ]
                            },
                            "test": {
                                "$concat": [
                                    [
                                        "wss://test.",
                                        "$actions.hostname"
                                    ]
                                ]
                            }
                        }
                    },
                    "directories": [
                        {
                            "entry": "./src",
                            "array": "files",
                            "languages": [
                                "en",
                                "es",
                                "fr",
                                "pt",
                                "nl",
                                "ht",
                                "gn"
                            ],
                            "exclude": [
                                "/admin/",
                                "/apps/",
                                "/config/"
                            ],
                            "object": {
                                "name": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "name",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "src": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "source",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "host": [
                                    "*"
                                ],
                                "directory": "/",
                                "path": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "path",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "pathname": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "pathname",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "content-type": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "content-type",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "headers": {
                                    "cache-control": "public, max-age=31536000"
                                }
                            }
                        },
                        {
                            "entry": "./src",
                            "array": "files",
                            "languages": [
                                "en",
                                "es",
                                "fr",
                                "pt",
                                "nl",
                                "ht",
                                "gn"
                            ],
                            "include": [
                                "/admin/",
                                "/apps/"
                            ],
                            "object": {
                                "name": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "name",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "src": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "source",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "host": [
                                    "*"
                                ],
                                "directory": "/",
                                "path": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "path",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "pathname": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "pathname",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "content-type": {
                                    "$concat": [
                                        [
                                            "{",
                                            "{",
                                            "content-type",
                                            "}",
                                            "}"
                                        ]
                                    ]
                                },
                                "headers": {
                                    "cache-control": "private, max-age=31536000"
                                }
                            }
                        },
                        {
                            "entry": "./src",
                            "include": [
                                "/config/"
                            ],
                            "$data": ""
                        }
                    ]
                },
                "configSource": {
                    "$concat": [
                        [
                            "export default ",
                            {
                                "$JSON.stringify": [
                                    "$actions.initialConfig",
                                    null,
                                    4
                                ]
                            },
                            ";\n"
                        ]
                    ]
                },
                "existingConfig": {
                    "$api.send": {
                        "api": "$actions.apiName",
                        "endpoint": "get-repository-file",
                        "data": {
                            "name": "$actions.repositoryName",
                            "branch": "$actions.branch",
                            "path": "CoCreate.config.js"
                        }
                    }
                },
                "existingConfigResult": {
                    "$if.$actions.existingConfig.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to read the copied repository config."
                        },
                        "$else": {
                            "$if.$actions.existingConfig.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to read the copied repository config."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "configSha": {
                    "$if.$actions.existingConfig.data.sha.$type": {
                        "string": {
                            "$if.$actions.existingConfig.data.sha.$regex": {
                                "\\S": {
                                    "$actions.existingConfig.data.sha.trim": []
                                },
                                "$else": {
                                    "$throw": "GitHub did not return the existing config SHA."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "GitHub did not return the existing config SHA."
                        }
                    }
                },
                "configCommit": {
                    "$api.send": {
                        "api": "$actions.apiName",
                        "endpoint": "update-repository-file",
                        "data": {
                            "name": "$actions.repositoryName",
                            "branch": "$actions.branch",
                            "path": "CoCreate.config.js",
                            "sha": "$actions.configSha",
                            "content": "$actions.configSource",
                            "message": "Configure organization environments"
                        }
                    }
                },
                "configCommitResult": {
                    "$if.$actions.configCommit.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to commit the organization config."
                        },
                        "$else": {
                            "$if.$actions.configCommit.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to commit the organization config."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "commitSha": {
                    "$if.$actions.configCommit.data.commit.sha.$type": {
                        "string": {
                            "$if.$actions.configCommit.data.commit.sha.$regex": {
                                "\\S": {
                                    "$actions.configCommit.data.commit.sha.trim": []
                                },
                                "$else": {
                                    "$throw": "GitHub did not return the config commit SHA."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "GitHub did not return the config commit SHA."
                        }
                    }
                },
                "devBranch": {
                    "$api.send": {
                        "api": "$actions.apiName",
                        "endpoint": "create-repository-branch",
                        "data": {
                            "name": "$actions.repositoryName",
                            "branch": "dev",
                            "sha": "$actions.commitSha"
                        }
                    }
                },
                "devBranchResult": {
                    "$if.$actions.devBranch.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to create the dev branch."
                        },
                        "$else": {
                            "$if.$actions.devBranch.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to create the dev branch."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "testBranch": {
                    "$api.send": {
                        "api": "$actions.apiName",
                        "endpoint": "create-repository-branch",
                        "data": {
                            "name": "$actions.repositoryName",
                            "branch": "test",
                            "sha": "$actions.commitSha"
                        }
                    }
                },
                "testBranchResult": {
                    "$if.$actions.testBranch.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to create the test branch."
                        },
                        "$else": {
                            "$if.$actions.testBranch.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to create the test branch."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "hostKeys": {
                    "$api.send": {
                        "api": "$actions.apiName",
                        "endpoint": "get-github-ssh-host-keys",
                        "data": {}
                    }
                },
                "hostKeysResult": {
                    "$if.$actions.hostKeys.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to read GitHub SSH host keys."
                        },
                        "$else": {
                            "$if.$actions.hostKeys.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to read GitHub SSH host keys."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "$data.create-organization-repository.0.hostKeys": "$actions.hostKeys.data.ssh_keys",
                "deployKey": {
                    "$api.send": {
                        "api": "$actions.apiName",
                        "endpoint": "create-repository-deploy-key",
                        "data": {
                            "name": "$actions.repositoryName",
                            "publicKey": "$actions.publicKey"
                        }
                    }
                },
                "deployKeyResult": {
                    "$if.$actions.deployKey.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to register repository deploy key."
                        },
                        "$else": {
                            "$if.$actions.deployKey.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to register repository deploy key."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "deployKeyId": {
                    "$if.$actions.deployKey.data.id.$type": {
                        "number": {
                            "$if.$actions.deployKey.data.id.$gt": {
                                "0": "$actions.deployKey.data.id",
                                "$else": {
                                    "$throw": "GitHub deploy key ID is missing."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "GitHub deploy key ID is missing."
                        }
                    }
                },
                "deployKeyWriteAccess": {
                    "$if.$actions.deployKey.data.read_only.$eq": {
                        "$false": true,
                        "$else": {
                            "$throw": "GitHub deploy key does not have write access."
                        }
                    }
                },
                "git": {
                    "provider": "github",
                    "owner": "$actions.owner",
                    "repository": "$actions.repositoryName",
                    "clone_url": {
                        "$concat": [
                            [
                                "git@github.com:",
                                "$actions.owner",
                                "/",
                                "$actions.repositoryName",
                                ".git"
                            ]
                        ]
                    },
                    "url": "$actions.repository.data.html_url",
                    "default_branch": "main",
                    "checkout_branch": "main",
                    "initialization": {
                        "status": "ready",
                        "commit": "$actions.commitSha"
                    },
                    "https_clone_url": "$actions.cloneUrl",
                    "api": "$actions.credentialId",
                    "deploy_key_id": "$actions.deployKeyId"
                },
                "persistRepository": {
                    "$crud.send": {
                        "method": "object.update",
                        "database": "$organization_id",
                        "array": "organizations",
                        "object": {
                            "_id": "$actions.organizationId",
                            "git": "$actions.git"
                        }
                    }
                },
                "persistRepositoryResult": {
                    "$if.$actions.persistRepository.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to persist repository metadata."
                        },
                        "$else": {
                            "$if.$actions.persistRepository.success.$eq": {
                                "$false": {
                                    "$throw": "Unable to persist repository metadata."
                                },
                                "$else": null
                            }
                        }
                    }
                },
                "persistedOrganization": {
                    "$if.$actions.persistRepository.object.0.$exists": {
                        "$true": "$actions.persistRepository.object.0",
                        "$else": {
                            "$throw": "The repository metadata was not persisted."
                        }
                    }
                },
                "$data.create-organization-repository.0.git": "$actions.git",
                "$data.create-organization-repository.0.initialized": true,
                "$data.create-organization-repository.0.organizationId": "$actions.organizationId"
            }
        }
    ]
};
