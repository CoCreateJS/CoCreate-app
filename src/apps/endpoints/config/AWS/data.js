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
            "endpoint": "/",
            "encoding": "form",
            "description": "Calls AWS EC2 RunInstances once with caller-prepared native parameters. Returns the AWS response for the workflow to interpret.",
            "headers": {
                "Authorization": {
                    "$security.createAwsSigV4Token": [
                        {
                            "method": "POST",
                            "uri": "/",
                            "payload": {
                                "$objectToSearchParams": [
                                    {
                                        "$Object.assign": [
                                            {},
                                            "$payload.data",
                                            {
                                                "Action": "RunInstances",
                                                "Version": "2016-11-15"
                                            }
                                        ]
                                    },
                                    false
                                ]
                            },
                            "region": "$payload.region",
                            "service": "ec2",
                            "isoDate": "$x-amz-date",
                            "headers": {
                                "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                                "host": {
                                    "$concat": [
                                        [
                                            "ec2.",
                                            "$payload.region",
                                            ".amazonaws.com"
                                        ]
                                    ]
                                },
                                "x-amz-date": "$x-amz-date"
                            }
                        },
                        {
                            "accessKeyId": "$config.accessKeyId",
                            "secretAccessKey": "$config.secretAccessKey"
                        }
                    ]
                }
            },
            "data": {
                "$Object.assign": [
                    {},
                    "$payload.data",
                    {
                        "Action": "RunInstances",
                        "Version": "2016-11-15"
                    }
                ]
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e15",
            "api_id": "65f8ca227b39a3c1a8904e02",
            "name": "delete-instance",
            "method": "post",
            "endpoint": "/",
            "encoding": "form",
            "description": "Calls AWS EC2 TerminateInstances once with prepared native parameters. Returns the native response to the workflow.",
            "headers": {
                "Authorization": {
                    "$security.createAwsSigV4Token": [
                        {
                            "method": "POST",
                            "uri": "/",
                            "payload": {
                                "$objectToSearchParams": [
                                    {
                                        "$Object.assign": [
                                            {},
                                            "$payload.data",
                                            {
                                                "Action": "TerminateInstances",
                                                "Version": "2016-11-15"
                                            }
                                        ]
                                    },
                                    false
                                ]
                            },
                            "region": "$payload.region",
                            "service": "ec2",
                            "isoDate": "$x-amz-date",
                            "headers": {
                                "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                                "host": {
                                    "$concat": [
                                        [
                                            "ec2.",
                                            "$payload.region",
                                            ".amazonaws.com"
                                        ]
                                    ]
                                },
                                "x-amz-date": "$x-amz-date"
                            }
                        },
                        {
                            "accessKeyId": "$config.accessKeyId",
                            "secretAccessKey": "$config.secretAccessKey"
                        }
                    ]
                }
            },
            "data": {
                "$Object.assign": [
                    {},
                    "$payload.data",
                    {
                        "Action": "TerminateInstances",
                        "Version": "2016-11-15"
                    }
                ]
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
