/** AWS provisioning only. Receives the checked cluster and deployment from createOrganizationServer. */
export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6b0a00000000000000000201",
            "name": "createAwsInstance",
            "enabled": true,
            "description": "AWS-specific image, network, and instance provisioning through direct AWS Query API requests.",
            "actions": {
                "cluster": "$data",
                "deployment": "$actions.cluster.deployment",
                "startup": {
                    "script": "#!/usr/bin/env bash\nset -euo pipefail\numask 077\n# Per-node identity is supplied separately; the saved cluster script is appended unchanged.\nmkdir -p /etc/cocreatews /etc/systemd/system/cocreatews.service.d\ncat << 'NODE_ENV' > /etc/cocreatews/node-environment\nserver_id={{$actions.deployment.server_id}}\ncluster_id={{$actions.cluster._id}}\nNODE_ENV\nchmod 600 /etc/cocreatews/node-environment\ncat << 'NODE_SERVICE' > /etc/systemd/system/cocreatews.service.d/node.conf\n[Service]\nEnvironmentFile=/etc/cocreatews/node-environment\nNODE_SERVICE\n{{$actions.cluster.startupScript}}",
                    "bytes": {
                        "$Buffer.from": [
                            "$script",
                            "utf8"
                        ]
                    },
                    "value": {
                        "$bytes.toString": "base64"
                    }
                },
                "image": {
                    "response": {
                        "$api.send": {
                            "api": "$actions.deployment.api",
                            "method": "post",
                            "endpoint": "resolve-image",
                            "region": "$actions.deployment.region",
                            "data": {
                                "Name": {
                                    "$null": [
                                        "$actions.cluster.aws.imageParameter",
                                        "/aws/service/canonical/ubuntu/server/noble/stable/current/amd64/hvm/ebs-gp3/ami-id"
                                    ]
                                }
                            }
                        }
                    },
                    "check1": {
                        "$if.$response.error.$exists": {
                            "$true": {
                                "$if.$response.error.length.$gt": {
                                    "0": {
                                        "$throw": "AWS image resolution failed."
                                    }
                                }
                            }
                        }
                    },
                    "value": "$response.data.Parameter.Value",
                    "check2": {
                        "$if.$value.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "AWS image resolution returned no AMI ID."
                            }
                        }
                    }
                },
                "vpc": {
                    "response": {
                        "$if.$actions.cluster.aws.vpcId.$exists": {
                            "$true": null,
                            "$else": {
                                "$api.send": {
                                    "api": "$actions.deployment.api",
                                    "endpoint": "/",
                                    "method": "post",
                                    "region": "$actions.deployment.region",
                                    "data": {
                                        "Action": "DescribeVpcs",
                                        "Version": "2016-11-15",
                                        "Filter.1.Name": "is-default",
                                        "Filter.1.Value.1": "true"
                                    },
                                    "encoding": "form"
                                }
                            }
                        }
                    },
                    "check1": {
                        "$if.$response.error.$exists": {
                            "$true": {
                                "$if.$response.error.length.$gt": {
                                    "0": {
                                        "$throw": "AWS DescribeVpcs failed."
                                    }
                                }
                            }
                        }
                    },
                    "matches": {
                        "$if.$actions.cluster.aws.vpcId.$exists": {
                            "$true": null,
                            "$else": {
                                "$response.data.match": [
                                    "<vpcId>([^<]+)</vpcId>"
                                ]
                            }
                        }
                    },
                    "value": {
                        "$null": [
                            "$actions.cluster.aws.vpcId",
                            "$matches.1"
                        ]
                    },
                    "check2": {
                        "$if.$value.$type": {
                            "string": {},
                            "$else": {
                                "$throw": "No VPC is available for this deployment."
                            }
                        }
                    }
                },
                "securityGroup": {
                    "response": {
                        "$api.send": {
                            "api": "$actions.deployment.api",
                            "endpoint": "/",
                            "method": "post",
                            "region": "$actions.deployment.region",
                            "data": {
                                "Action": "DescribeSecurityGroups",
                                "Version": "2016-11-15",
                                "Filter.1.Name": "vpc-id",
                                "Filter.1.Value.1": "$actions.vpc.value",
                                "Filter.2.Name": "tag:CoCreateClusterId",
                                "Filter.2.Value.1": "$actions.cluster._id",
                                "Filter.3.Name": "tag:CoCreateRole",
                                "Filter.3.Value.1": "server",
                                "Filter.4.Name": "tag:CoCreateManaged",
                                "Filter.4.Value.1": "true"
                            },
                            "encoding": "form"
                        }
                    },
                    "check1": {
                        "$if.$response.error.$exists": {
                            "$true": {
                                "$if.$response.error.length.$gt": {
                                    "0": {
                                        "$throw": "AWS DescribeSecurityGroups failed."
                                    }
                                }
                            }
                        }
                    },
                    "existing": {
                        "$response.data.match": [
                            "<groupId>([^<]+)</groupId>"
                        ]
                    },
                    "created": {
                        "$if.$existing.$eq": {
                            "$null": {
                                "$api.send": {
                                    "api": "$actions.deployment.api",
                                    "endpoint": "/",
                                    "method": "post",
                                    "region": "$actions.deployment.region",
                                    "data": {
                                        "Action": "CreateSecurityGroup",
                                        "Version": "2016-11-15",
                                        "GroupName": "cocreate-cluster-{{$actions.cluster._id}}",
                                        "GroupDescription": "CoCreate server cluster {{$actions.cluster._id}}",
                                        "VpcId": "$actions.vpc.value",
                                        "TagSpecification.1.ResourceType": "security-group",
                                        "TagSpecification.1.Tag.1.Key": "CoCreateClusterId",
                                        "TagSpecification.1.Tag.1.Value": "$actions.cluster._id",
                                        "TagSpecification.1.Tag.2.Key": "CoCreateRole",
                                        "TagSpecification.1.Tag.2.Value": "server",
                                        "TagSpecification.1.Tag.3.Key": "CoCreateManaged",
                                        "TagSpecification.1.Tag.3.Value": "true"
                                    },
                                    "encoding": "form"
                                }
                            },
                            "$else": null
                        }
                    },
                    "check2": {
                        "$if.$created.error.$exists": {
                            "$true": {
                                "$if.$created.error.length.$gt": {
                                    "0": {
                                        "$throw": "AWS CreateSecurityGroup failed."
                                    }
                                }
                            }
                        }
                    },
                    "createdId": {
                        "$if.$existing.$eq": {
                            "$null": {
                                "$created.data.match": [
                                    "<groupId>([^<]+)</groupId>"
                                ]
                            },
                            "$else": null
                        }
                    },
                    "value": {
                        "$null": [
                            "$existing.1",
                            "$createdId.1"
                        ]
                    },
                    "check3": {
                        "$if.$value.$type": {
                            "string": {},
                            "$else": {
                                "$throw": "AWS returned no security group ID."
                            }
                        }
                    },
                    "ingress": {
                        "$if.$existing.$eq": {
                            "$null": {
                                "$api.send": {
                                    "api": "$actions.deployment.api",
                                    "endpoint": "/",
                                    "method": "post",
                                    "region": "$actions.deployment.region",
                                    "data": {
                                        "Action": "AuthorizeSecurityGroupIngress",
                                        "Version": "2016-11-15",
                                        "GroupId": "$value",
                                        "IpPermissions.1.IpProtocol": "tcp",
                                        "IpPermissions.1.FromPort": 80,
                                        "IpPermissions.1.ToPort": 80,
                                        "IpPermissions.1.IpRanges.1.CidrIp": "0.0.0.0/0",
                                        "IpPermissions.2.IpProtocol": "tcp",
                                        "IpPermissions.2.FromPort": 443,
                                        "IpPermissions.2.ToPort": 443,
                                        "IpPermissions.2.IpRanges.1.CidrIp": "0.0.0.0/0",
                                        "IpPermissions.3.IpProtocol": "tcp",
                                        "IpPermissions.3.FromPort": 8090,
                                        "IpPermissions.3.ToPort": 8090,
                                        "IpPermissions.3.Groups.1.GroupId": "$value"
                                    },
                                    "encoding": "form"
                                }
                            },
                            "$else": null
                        }
                    },
                    "check4": {
                        "$if.$ingress.error.$exists": {
                            "$true": {
                                "$if.$ingress.error.length.$gt": {
                                    "0": {
                                        "$throw": "AWS AuthorizeSecurityGroupIngress failed."
                                    }
                                }
                            }
                        }
                    }
                },
                "instance": {
                    "parameters": {
                        "$Object.assign": [
                            {},
                            "$actions.cluster.aws.parameters",
                            {
                                "ImageId": "$actions.image.value",
                                "InstanceType": "$actions.deployment.type",
                                "MinCount": 1,
                                "MaxCount": 1,
                                "SecurityGroupId.1": "$actions.securityGroup.value",
                                "UserData": "$actions.startup.value",
                                "ClientToken": "$actions.deployment.server_id",
                                "TagSpecification.1.ResourceType": "instance",
                                "TagSpecification.1.Tag.1.Key": "Name",
                                "TagSpecification.1.Tag.1.Value": {
                                    "$null": [
                                        "$actions.deployment.name",
                                        "$actions.cluster.name"
                                    ]
                                },
                                "TagSpecification.1.Tag.2.Key": "CoCreateClusterId",
                                "TagSpecification.1.Tag.2.Value": "$actions.cluster._id",
                                "TagSpecification.1.Tag.3.Key": "CoCreateServerId",
                                "TagSpecification.1.Tag.3.Value": "$actions.deployment.server_id"
                            }
                        ]
                    },
                    "response": {
                        "$api.send": {
                            "api": "$actions.deployment.api",
                            "endpoint": "create-instance",
                            "method": "post",
                            "region": "$actions.deployment.region",
                            "data": "$parameters"
                        }
                    },
                    "check1": {
                        "$if.$response.error.$exists": {
                            "$true": {
                                "$if.$response.error.length.$gt": {
                                    "0": {
                                        "$throw": "AWS RunInstances failed."
                                    }
                                }
                            }
                        }
                    },
                    "id": {
                        "$response.data.match": [
                            "<instanceId>([^<]+)</instanceId>"
                        ]
                    },
                    "image": {
                        "$response.data.match": [
                            "<imageId>([^<]+)</imageId>"
                        ]
                    },
                    "type": {
                        "$response.data.match": [
                            "<instanceType>([^<]+)</instanceType>"
                        ]
                    },
                    "state": {
                        "$response.data.match": [
                            "<instanceState>[\\s\\S]*?<name>([^<]+)</name>"
                        ]
                    },
                    "zone": {
                        "$response.data.match": [
                            "<availabilityZone>([^<]+)</availabilityZone>"
                        ]
                    },
                    "privateIp": {
                        "$response.data.match": [
                            "<privateIpAddress>([^<]+)</privateIpAddress>"
                        ]
                    },
                    "check2": {
                        "$if.$id.1.$exists": {
                            "$true": {},
                            "$else": {
                                "$throw": "AWS RunInstances returned no instance ID."
                            }
                        }
                    }
                },
                "$payload.data": {
                    "id": {
                        "$null": [
                            "$actions.instance.id.1",
                            null
                        ]
                    },
                    "imageId": {
                        "$null": [
                            "$actions.instance.image.1",
                            null
                        ]
                    },
                    "type": {
                        "$null": [
                            "$actions.instance.type.1",
                            null
                        ]
                    },
                    "state": {
                        "$null": [
                            "$actions.instance.state.1",
                            null
                        ]
                    },
                    "availabilityZone": {
                        "$null": [
                            "$actions.instance.zone.1",
                            null
                        ]
                    },
                    "privateIpAddress": {
                        "$null": [
                            "$actions.instance.privateIp.1",
                            null
                        ]
                    }
                }
            }
        },
        {
            "_id": "6b0a00000000000000000202",
            "name": "deleteAwsInstance",
            "enabled": true,
            "description": "Maps the checked deployment to a single AWS termination request and validates its acknowledgement.",
            "actions": {
                "deployment": "$data.deployment",
                "response": {
                    "$api.send": {
                        "api": "$actions.deployment.api",
                        "endpoint": "delete-instance",
                        "method": "post",
                        "region": "$actions.deployment.region",
                        "data": {
                            "InstanceId.1": "$actions.deployment.id"
                        }
                    }
                },
                "check": {
                    "$if.$actions.response.error.$exists": {
                        "$true": {
                            "$if.$actions.response.error.length.$gt": {
                                "0": {
                                    "$throw": "AWS TerminateInstances failed."
                                }
                            }
                        }
                    }
                },
                "result": {
                    "id": {
                        "$actions.response.data.match": [
                            "<instanceId>([^<]+)</instanceId>"
                        ]
                    },
                    "state": {
                        "$actions.response.data.match": [
                            "<currentState>[\\s\\S]*?<name>([^<]+)</name>"
                        ]
                    }
                },
                "matches": {
                    "$Object.is": [
                        "$actions.result.id.1",
                        "$actions.deployment.id"
                    ]
                },
                "checkId": {
                    "$if.$matches.$eq": {
                        "$true": {},
                        "$else": {
                            "$throw": "AWS returned no matching infrastructure ID."
                        }
                    }
                },
                "checkState": {
                    "$if.$actions.result.state.1.$eq": {
                        "shutting-down": {},
                        "terminated": {},
                        "$else": {
                            "$throw": "AWS did not acknowledge instance termination."
                        }
                    }
                },
                "$payload.data": {
                    "id": "$actions.result.id.1",
                    "state": "$actions.result.state.1"
                }
            }
        }
    ]
};
