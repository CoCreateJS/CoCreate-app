/** GitHub operations used by signup repository initialization. */
export default {
    "method": "object.update",
    "array": "endpoints",
    "upsert": true,
    "object": [
        {
            "_id": "6b0400000000000000000011",
            "api_id": "65f8ca227b39a3c1a8904e12",
            "name": "get-repository-file",
            "method": "get",
            "endpoint": {
                "$concat": [
                    [
                        "/repos/",
                        "$owner",
                        "/",
                        "$repositoryName",
                        "/contents/",
                        {
                            "$encodeURIComponent": "$filePath"
                        }
                    ]
                ]
            },
            "actions": {
                "repositoryName": {
                    "$if.$payload.data.name.$type": {
                        "string": {
                            "$if.$payload.data.name.$regex": {
                                "\\S": {
                                    "$payload.data.name.trim": []
                                },
                                "$else": {
                                    "$throw": "A repository name is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A repository name is required."
                        }
                    }
                },
                "branch": {
                    "$if.$payload.data.branch.$type": {
                        "string": {
                            "$if.$payload.data.branch.$regex": {
                                "\\S": {
                                    "$payload.data.branch.trim": []
                                },
                                "$else": {
                                    "$throw": "A branch is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A branch is required."
                        }
                    }
                },
                "filePath": {
                    "$if.$payload.data.path.$type": {
                        "string": {
                            "$if.$payload.data.path.$regex": {
                                "\\S": {
                                    "$payload.data.path.trim": []
                                },
                                "$else": {
                                    "$throw": "A repository file path is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A repository file path is required."
                        }
                    }
                }
            },
            "enabled": true,
            "searchParams": {
                "ref": "$branch"
            }
        },
        {
            "_id": "6b0400000000000000000012",
            "api_id": "65f8ca227b39a3c1a8904e12",
            "name": "update-repository-file",
            "method": "put",
            "endpoint": {
                "$concat": [
                    [
                        "/repos/",
                        "$owner",
                        "/",
                        "$repositoryName",
                        "/contents/",
                        {
                            "$encodeURIComponent": "$filePath"
                        }
                    ]
                ]
            },
            "actions": {
                "repositoryName": {
                    "$if.$payload.data.name.$type": {
                        "string": {
                            "$if.$payload.data.name.$regex": {
                                "\\S": {
                                    "$payload.data.name.trim": []
                                },
                                "$else": {
                                    "$throw": "A repository name is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A repository name is required."
                        }
                    }
                },
                "branch": {
                    "$if.$payload.data.branch.$type": {
                        "string": {
                            "$if.$payload.data.branch.$regex": {
                                "\\S": {
                                    "$payload.data.branch.trim": []
                                },
                                "$else": {
                                    "$throw": "A branch is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A branch is required."
                        }
                    }
                },
                "filePath": {
                    "$if.$payload.data.path.$type": {
                        "string": {
                            "$if.$payload.data.path.$regex": {
                                "\\S": {
                                    "$payload.data.path.trim": []
                                },
                                "$else": {
                                    "$throw": "A repository file path is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A repository file path is required."
                        }
                    }
                },
                "fileSha": {
                    "$if.$payload.data.sha.$type": {
                        "string": {
                            "$if.$payload.data.sha.$regex": {
                                "\\S": {
                                    "$payload.data.sha.trim": []
                                },
                                "$else": {
                                    "$throw": "The existing file SHA is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The existing file SHA is required."
                        }
                    }
                },
                "contentBytes": {
                    "$Buffer.from": [
                        "$payload.data.content",
                        "utf8"
                    ]
                },
                "contentBase64": {
                    "$contentBytes.toString": "base64"
                }
            },
            "enabled": true,
            "data": {
                "message": "$payload.data.message",
                "branch": "$branch",
                "sha": "$fileSha",
                "content": "$contentBase64"
            }
        },
        {
            "_id": "6b0400000000000000000013",
            "api_id": "65f8ca227b39a3c1a8904e12",
            "name": "create-repository-branch",
            "method": "post",
            "endpoint": {
                "$concat": [
                    [
                        "/repos/",
                        "$owner",
                        "/",
                        "$repositoryName",
                        "/git/refs"
                    ]
                ]
            },
            "actions": {
                "repositoryName": {
                    "$if.$payload.data.name.$type": {
                        "string": {
                            "$if.$payload.data.name.$regex": {
                                "\\S": {
                                    "$payload.data.name.trim": []
                                },
                                "$else": {
                                    "$throw": "A repository name is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A repository name is required."
                        }
                    }
                },
                "branch": {
                    "$if.$payload.data.branch.$type": {
                        "string": {
                            "$if.$payload.data.branch.$regex": {
                                "\\S": {
                                    "$payload.data.branch.trim": []
                                },
                                "$else": {
                                    "$throw": "A branch is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A branch is required."
                        }
                    }
                },
                "commitSha": {
                    "$if.$payload.data.sha.$type": {
                        "string": {
                            "$if.$payload.data.sha.$regex": {
                                "\\S": {
                                    "$payload.data.sha.trim": []
                                },
                                "$else": {
                                    "$throw": "A starting commit SHA is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A starting commit SHA is required."
                        }
                    }
                }
            },
            "enabled": true,
            "data": {
                "ref": {
                    "$concat": [
                        [
                            "refs/heads/",
                            "$branch"
                        ]
                    ]
                },
                "sha": "$commitSha"
            }
        },
        {
            "_id": "6b0500000000000000000011",
            "api_id": "65f8ca227b39a3c1a8904e12",
            "name": "create-repository-deploy-key",
            "enabled": true,
            "url": "https://api.github.com",
            "method": "post",
            "endpoint": {
                "$concat": [
                    [
                        "/repos/",
                        "$owner",
                        "/",
                        "$repositoryName",
                        "/keys"
                    ]
                ]
            },
            "actions": {
                "repositoryName": {
                    "$if.$payload.data.name.$type": {
                        "string": {
                            "$if.$payload.data.name.$regex": {
                                "\\S": {
                                    "$payload.data.name.trim": []
                                },
                                "$else": {
                                    "$throw": "A repository name is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "A repository name is required."
                        }
                    }
                },
                "publicKey": {
                    "$if.$payload.data.publicKey.$type": {
                        "string": {
                            "$if.$payload.data.publicKey.$regex": {
                                "^ssh-rsa [A-Za-z0-9+/]+={0,2}$": {
                                    "$payload.data.publicKey.trim": []
                                },
                                "$else": {
                                    "$throw": "An SSH public key is required."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "An SSH public key is required."
                        }
                    }
                }
            },
            "data": {
                "title": {
                    "$concat": [
                        [
                            "CoCreate repository ",
                            "$repositoryName"
                        ]
                    ]
                },
                "key": "$publicKey",
                "read_only": false
            }
        },
        {
            "_id": "6b0500000000000000000012",
            "api_id": "65f8ca227b39a3c1a8904e12",
            "name": "get-github-ssh-host-keys",
            "enabled": true,
            "url": "https://api.github.com",
            "method": "get",
            "endpoint": "/meta"
        }
    ]
};
