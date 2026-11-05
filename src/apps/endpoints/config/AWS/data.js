/********************************************************************************
 * Copyright (C) 2023-2026 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 ********************************************************************************/

/** Literal AWS endpoint AST records. */
export default {
    "method": "object.update",
    "array": "endpoints",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e13",
            "api_id": "65f8ca227b39a3c1a8904e02",
            "name": "resolve-image",
            "method": "post",
            "url": {
                "$concat": [
                    [
                        "https://ssm.",
                        "$payload.region",
                        ".amazonaws.com"
                    ]
                ]
            },
            "endpoint": "/",
            "headers": {
                "content-type": "application/x-amz-json-1.1",
                "host": {
                    "$concat": [
                        [
                            "ssm.",
                            "$payload.region",
                            ".amazonaws.com"
                        ]
                    ]
                },
                "x-amz-target": "AmazonSSM.GetParameter",
                "x-amz-date": {
                    "$security.transform": [
                        "",
                        [
                            {
                                "op": "timestamp",
                                "format": "iso-basic"
                            }
                        ]
                    ]
                },
                "Authorization": {
                    "$security.createAwsSigV4Token": [
                        {
                            "method": "$payload.method",
                            "uri": "/",
                            "payload": {
                                "$JSON.stringify": "$payload.data"
                            },
                            "region": "$payload.region",
                            "service": "ssm",
                            "isoDate": "$x-amz-date",
                            "headers": {
                                "content-type": "application/x-amz-json-1.1",
                                "host": {
                                    "$concat": [
                                        [
                                            "ssm.",
                                            "$payload.region",
                                            ".amazonaws.com"
                                        ]
                                    ]
                                },
                                "x-amz-date": "$x-amz-date",
                                "x-amz-target": "AmazonSSM.GetParameter"
                            }
                        },
                        {
                            "accessKeyId": "$config.accessKeyId",
                            "secretAccessKey": "$config.secretAccessKey"
                        }
                    ]
                }
            },
            "description": "Resolves the current regional Ubuntu 24.04 LTS amd64 AMI from Canonical's public AWS Systems Manager parameter.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e14",
            "api_id": "65f8ca227b39a3c1a8904e02",
            "name": "create-instance",
            "method": "post",
            "endpoint": "/instances",
            "description": "Provisions EC2 instances with cluster-scoped network security.",
            "actions": {
                "storageId": {
                    "$if.$payload.data.storage.$type": {
                        "string": {
                            "$if.$payload.data.storage.$regex": {
                                "\\S": {
                                    "$payload.data.storage.trim": []
                                },
                                "$else": {
                                    "$throw": "create-instance requires a storage API record ID."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "create-instance requires a storage API record ID."
                        }
                    }
                },
                "storageResponse": {
                    "$crud.send": {
                        "method": "object.read",
                        "array": "apis",
                        "filter": {
                            "query": {
                                "_id": "$storageId",
                                "type": "storage",
                                "enabled": true
                            },
                            "key": {
                                "avatar": 0,
                                "icon": 0,
                                "type": 0,
                                "headers": 0,
                                "url": 0,
                                "description": 0,
                                "enabled": 0,
                                "created": 0,
                                "updated": 0,
                                "deleted": 0,
                                "permissions": 0,
                                "organization_id": 0,
                                "pricing": 0
                            },
                            "limit": 1
                        }
                    }
                },
                "storageConfig": {
                    "$if.$storageResponse.error.length.$gt": {
                        "0": {
                            "$throw": "Unable to read the selected storage API record."
                        },
                        "$else": {
                            "$if.$storageResponse.object.0.$exists": {
                                "$true": "$storageResponse.object.0",
                                "$else": {
                                    "$throw": "The selected enabled storage API record is unavailable."
                                }
                            }
                        }
                    }
                },
                "storageName": {
                    "$if.$storageConfig.name.$type": {
                        "string": {
                            "$if.$storageConfig.name.$regex": {
                                "\\S": {
                                    "$storageConfig.name.trim": []
                                },
                                "$else": {
                                    "$throw": "The storage API record requires a name."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The storage API record requires a name."
                        }
                    }
                },
                "storageProvider": {
                    "$if.$storageConfig.provider.$type": {
                        "string": {
                            "$if.$storageConfig.provider.$regex": {
                                "\\S": {
                                    "$storageConfig.provider.trim": []
                                },
                                "$else": {
                                    "$throw": "The storage API record requires a provider."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "The storage API record requires a provider."
                        }
                    }
                },
                "storageBytes": {
                    "$Buffer.from": [
                        {
                            "$JSON.stringify": "$storageConfig"
                        },
                        "utf8"
                    ]
                },
                "storageBase64": {
                    "$storageBytes.toString": "base64"
                },
                "bootstrapConfig": {
                    "organization_id": "$payload.organization_id",
                    "host": "$payload.data.host",
                    "storage": "$storageConfig"
                },
                "bootstrapConfigBytes": {
                    "$Buffer.from": [
                        {
                            "$JSON.stringify": "$bootstrapConfig"
                        },
                        "utf8"
                    ]
                },
                "bootstrapConfigBase64": {
                    "$bootstrapConfigBytes.toString": "base64"
                },
                "bootstrapScript": {
                    "$astAsync": "$payload.data.startupScript"
                },
                "bootstrapScriptBytes": {
                    "$Buffer.from": [
                        "$bootstrapScript",
                        "utf8"
                    ]
                },
                "bootstrapScriptBase64": {
                    "$bootstrapScriptBytes.toString": "base64"
                },
                "image": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "endpoint": "resolve-image",
                        "region": "$payload.data.region",
                        "data": {
                            "Name": "/aws/service/canonical/ubuntu/server/noble/stable/current/amd64/hvm/ebs-gp3/ami-id"
                        }
                    }
                },
                "defaultVpc": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "endpoint": "/",
                        "region": "$payload.data.region",
                        "encoding": "form",
                        "data": {
                            "Action": "DescribeVpcs",
                            "Version": "2016-11-15",
                            "Filter.1.Name": "is-default",
                            "Filter.1.Value.1": "true"
                        }
                    }
                },
                "defaultVpcId": {
                    "$defaultVpc.data.match": [
                        "<vpcId>([^<]+)</vpcId>"
                    ]
                },
                "vpcId": {
                    "$null": [
                        "$payload.data.vpcId",
                        "$defaultVpcId.1"
                    ]
                },
                "existingSecurityGroup": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "endpoint": "/",
                        "region": "$payload.data.region",
                        "encoding": "form",
                        "data": {
                            "Action": "DescribeSecurityGroups",
                            "Version": "2016-11-15",
                            "Filter.1.Name": "vpc-id",
                            "Filter.1.Value.1": "$vpcId",
                            "Filter.2.Name": "tag:CoCreateClusterId",
                            "Filter.2.Value.1": "$payload.data.cluster_id",
                            "Filter.3.Name": "tag:CoCreateRole",
                            "Filter.3.Value.1": "server",
                            "Filter.4.Name": "tag:CoCreateManaged",
                            "Filter.4.Value.1": "true"
                        }
                    }
                },
                "existingSecurityGroupId": {
                    "$existingSecurityGroup.data.match": [
                        "<groupId>([^<]+)</groupId>"
                    ]
                },
                "createdSecurityGroup": {
                    "$if.$existingSecurityGroupId.$eq": {
                        "$null": {
                            "$api.send": {
                                "api": "$config.name",
                                "method": "post",
                                "endpoint": "/",
                                "region": "$payload.data.region",
                                "encoding": "form",
                                "data": {
                                    "Action": "CreateSecurityGroup",
                                    "Version": "2016-11-15",
                                    "GroupName": "cocreate-cluster-{{$payload.data.cluster_id}}",
                                    "GroupDescription": "CoCreate server cluster {{$payload.data.cluster_id}}",
                                    "VpcId": "$vpcId",
                                    "TagSpecification.1.ResourceType": "security-group",
                                    "TagSpecification.1.Tag.1.Key": "CoCreateClusterId",
                                    "TagSpecification.1.Tag.1.Value": "$payload.data.cluster_id",
                                    "TagSpecification.1.Tag.2.Key": "CoCreateRole",
                                    "TagSpecification.1.Tag.2.Value": "server",
                                    "TagSpecification.1.Tag.3.Key": "CoCreateManaged",
                                    "TagSpecification.1.Tag.3.Value": "true"
                                }
                            }
                        },
                        "$else": null
                    }
                },
                "createdSecurityGroupId": {
                    "$createdSecurityGroup.data.match": [
                        "<groupId>([^<]+)</groupId>"
                    ]
                },
                "securityGroupId": {
                    "$null": [
                        "$existingSecurityGroupId.1",
                        "$createdSecurityGroupId.1"
                    ]
                },
                "securityGroupIngress": {
                    "$if.$existingSecurityGroupId.$eq": {
                        "$null": {
                            "$api.send": {
                                "api": "$config.name",
                                "method": "post",
                                "endpoint": "/",
                                "region": "$payload.data.region",
                                "encoding": "form",
                                "data": {
                                    "Action": "AuthorizeSecurityGroupIngress",
                                    "Version": "2016-11-15",
                                    "GroupId": "$securityGroupId",
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
                                    "IpPermissions.3.Groups.1.GroupId": "$securityGroupId"
                                }
                            }
                        },
                        "$else": null
                    }
                },
                "aws": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "endpoint": "/",
                        "region": "$payload.data.region",
                        "encoding": "form",
                        "data": {
                            "Action": "RunInstances",
                            "Version": "2016-11-15",
                            "ImageId": "$image.data.Parameter.Value",
                            "InstanceType": "$payload.data.vmType",
                            "MinCount": 1,
                            "MaxCount": 1,
                            "SecurityGroupId.1": "$securityGroupId",
                            "TagSpecification.1.ResourceType": "instance",
                            "TagSpecification.1.Tag.1.Key": "Name",
                            "TagSpecification.1.Tag.1.Value": "$payload.data.name",
                            "UserData": "$bootstrapScriptBase64"
                        }
                    }
                },
                "instanceId": {
                    "$aws.data.match": [
                        "<instanceId>([^<]+)</instanceId>"
                    ]
                },
                "imageId": {
                    "$aws.data.match": [
                        "<imageId>([^<]+)</imageId>"
                    ]
                },
                "instanceType": {
                    "$aws.data.match": [
                        "<instanceType>([^<]+)</instanceType>"
                    ]
                },
                "state": {
                    "$aws.data.match": [
                        "<instanceState>[\\s\\S]*?<name>([^<]+)</name>"
                    ]
                },
                "availabilityZone": {
                    "$aws.data.match": [
                        "<availabilityZone>([^<]+)</availabilityZone>"
                    ]
                },
                "privateIpAddress": {
                    "$aws.data.match": [
                        "<privateIpAddress>([^<]+)</privateIpAddress>"
                    ]
                }
            },
            "resolved": true,
            "data": {
                "instanceId": "$actions.instanceId.1",
                "imageId": "$actions.imageId.1",
                "instanceType": "$actions.instanceType.1",
                "state": "$actions.state.1",
                "availabilityZone": "$actions.availabilityZone.1",
                "privateIpAddress": "$actions.privateIpAddress.1"
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e15",
            "api_id": "65f8ca227b39a3c1a8904e02",
            "name": "delete-instance",
            "method": "post",
            "endpoint": "/",
            "description": "Terminates an EC2 instance through the signed HTTP Query API and confirms the matching termination acknowledgement.",
            "actions": {
                "aws": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "endpoint": "/",
                        "region": "$payload.region",
                        "encoding": "form",
                        "data": {
                            "Action": "TerminateInstances",
                            "Version": "2016-11-15",
                            "InstanceId.1": "$payload.data.vmId"
                        }
                    }
                },
                "instanceId": {
                    "$aws.data.match": [
                        "<instanceId>([^<]+)</instanceId>"
                    ]
                },
                "state": {
                    "$aws.data.match": [
                        "<currentState>[\\s\\S]*?<name>([^<]+)</name>"
                    ]
                },
                "checkInstance": {
                    "$if.$instanceId.1.$eq": {
                        "$payload.data.vmId": true,
                        "$else": {
                            "$throw": "AWS termination response did not identify the requested instance."
                        }
                    }
                },
                "checkState": {
                    "$if.$state.1.$eq": {
                        "shutting-down": true,
                        "terminated": true,
                        "$else": {
                            "$throw": "AWS did not acknowledge instance termination."
                        }
                    }
                }
            },
            "resolved": true,
            "data": {
                "instanceId": "$instanceId.1",
                "state": "$state.1"
            },
            "enabled": true
        },
        {
            "_id": "6a61543c0000000000000010",
            "api_id": "65f8ca227b39a3c1a8904e02",
            "name": "create-member-account",
            "method": "post",
            "endpoint": "/accounts",
            "description": "Starts creation of an AWS Organizations member account. Requires a unique root email address. Poll the returned createAccountRequestId with get-member-account-creation-status to retrieve the account ID.",
            "actions": {
                "accountName": {
                    "$if.$payload.data.accountName.$type": {
                        "string": {
                            "$if.$payload.data.accountName.$regex": {
                                "\\S": {
                                    "$payload.data.accountName.trim": []
                                },
                                "$else": {
                                    "$throw": "create-member-account requires an accountName."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "create-member-account requires an accountName."
                        }
                    }
                },
                "rootEmail": {
                    "$if.$payload.data.rootEmail.$type": {
                        "string": {
                            "$if.$payload.data.rootEmail.$regex": {
                                "\\S": {
                                    "$payload.data.rootEmail.trim": []
                                },
                                "$else": {
                                    "$throw": "create-member-account requires a unique rootEmail."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "create-member-account requires a unique rootEmail."
                        }
                    }
                },
                "requestBody": {
                    "AccountName": "$accountName",
                    "Email": "$rootEmail",
                    "RoleName": "OrganizationAccountAccessRole"
                },
                "amzDate": {
                    "$security.transform": [
                        "",
                        [
                            {
                                "op": "timestamp",
                                "format": "iso-basic"
                            }
                        ]
                    ]
                },
                "createAccountResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://organizations.us-east-1.amazonaws.com",
                        "endpoint": "/",
                        "headers": {
                            "content-type": "application/x-amz-json-1.1",
                            "host": "organizations.us-east-1.amazonaws.com",
                            "x-amz-target": "AWSOrganizationsV20161128.CreateAccount",
                            "x-amz-date": "$amzDate",
                            "Authorization": {
                                "$security.createAwsSigV4Token": [
                                    {
                                        "method": "POST",
                                        "uri": "/",
                                        "payload": {
                                            "$JSON.stringify": "$requestBody"
                                        },
                                        "region": "us-east-1",
                                        "service": "organizations",
                                        "isoDate": "$amzDate",
                                        "headers": {
                                            "content-type": "application/x-amz-json-1.1",
                                            "host": "organizations.us-east-1.amazonaws.com",
                                            "x-amz-date": "$amzDate",
                                            "x-amz-target": "AWSOrganizationsV20161128.CreateAccount"
                                        }
                                    },
                                    {
                                        "accessKeyId": "$config.accessKeyId",
                                        "secretAccessKey": "$config.secretAccessKey"
                                    }
                                ]
                            }
                        },
                        "data": "$requestBody"
                    }
                }
            },
            "resolved": true,
            "data": {
                "createAccountRequestId": "$actions.createAccountResponse.data.CreateAccountStatus.Id",
                "state": "$actions.createAccountResponse.data.CreateAccountStatus.State",
                "accountName": "$actions.createAccountResponse.data.CreateAccountStatus.AccountName"
            },
            "enabled": false
        },
        {
            "_id": "6a61543c0000000000000011",
            "api_id": "65f8ca227b39a3c1a8904e02",
            "name": "get-member-account-creation-status",
            "method": "post",
            "endpoint": "/accounts/creation-status",
            "description": "Returns AWS account creation status and, when creation succeeds, the new member account ID.",
            "actions": {
                "createAccountRequestId": {
                    "$if.$payload.data.createAccountRequestId.$type": {
                        "string": {
                            "$if.$payload.data.createAccountRequestId.$regex": {
                                "\\S": {
                                    "$payload.data.createAccountRequestId.trim": []
                                },
                                "$else": {
                                    "$throw": "get-member-account-creation-status requires a createAccountRequestId."
                                }
                            }
                        },
                        "$else": {
                            "$throw": "get-member-account-creation-status requires a createAccountRequestId."
                        }
                    }
                },
                "requestBody": {
                    "CreateAccountRequestId": "$createAccountRequestId"
                },
                "amzDate": {
                    "$security.transform": [
                        "",
                        [
                            {
                                "op": "timestamp",
                                "format": "iso-basic"
                            }
                        ]
                    ]
                },
                "accountCreationStatusResponse": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "post",
                        "url": "https://organizations.us-east-1.amazonaws.com",
                        "endpoint": "/",
                        "headers": {
                            "content-type": "application/x-amz-json-1.1",
                            "host": "organizations.us-east-1.amazonaws.com",
                            "x-amz-target": "AWSOrganizationsV20161128.DescribeCreateAccountStatus",
                            "x-amz-date": "$amzDate",
                            "Authorization": {
                                "$security.createAwsSigV4Token": [
                                    {
                                        "method": "POST",
                                        "uri": "/",
                                        "payload": {
                                            "$JSON.stringify": "$requestBody"
                                        },
                                        "region": "us-east-1",
                                        "service": "organizations",
                                        "isoDate": "$amzDate",
                                        "headers": {
                                            "content-type": "application/x-amz-json-1.1",
                                            "host": "organizations.us-east-1.amazonaws.com",
                                            "x-amz-date": "$amzDate",
                                            "x-amz-target": "AWSOrganizationsV20161128.DescribeCreateAccountStatus"
                                        }
                                    },
                                    {
                                        "accessKeyId": "$config.accessKeyId",
                                        "secretAccessKey": "$config.secretAccessKey"
                                    }
                                ]
                            }
                        },
                        "data": "$requestBody"
                    }
                }
            },
            "resolved": true,
            "data": {
                "createAccountRequestId": "$actions.accountCreationStatusResponse.data.CreateAccountStatus.Id",
                "state": "$actions.accountCreationStatusResponse.data.CreateAccountStatus.State",
                "accountId": "$actions.accountCreationStatusResponse.data.CreateAccountStatus.AccountId",
                "accountName": "$actions.accountCreationStatusResponse.data.CreateAccountStatus.AccountName",
                "failureReason": "$actions.accountCreationStatusResponse.data.CreateAccountStatus.FailureReason"
            },
            "enabled": false
        }
    ]
};
