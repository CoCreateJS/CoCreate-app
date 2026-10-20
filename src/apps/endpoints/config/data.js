/********************************************************************************
 * Copyright (C) 2023-2026 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/

/**
 * Seeding Payload: endpoints collection
 * 
 * Maps AST action pipelines for multi-cloud API endpoint macros used by Autoscaler
 * (AWS, GCP, Azure, DigitalOcean, OCI, Hetzner, Vultr, and Equinix).
 */

const requiredText = (path, message) => ({
    [`$if.${path}.$type`]: {
        string: {
            [`$if.${path}.$regex`]: {
                "\\S": { [`${path}.trim`]: [] },
                $else: { $throw: message }
            }
        },
        $else: { $throw: message }
    }
});

// Each create-instance endpoint resolves the caller's storage ID immediately
// before provisioning. The incoming ID remains intact; only startup user data
// receives the current storage connection record.
const storageActions = {
    storageId: requiredText('$payload.data.storage', 'create-instance requires a storage API record ID.'),
    storageResponse: {
        "$crud.send": {
            method: 'object.read',
            array: 'apis',
            filter: {
                query: { _id: '$storageId', type: 'storage', enabled: true },
                key: {
                    avatar: 0,
                    icon: 0,
                    type: 0,
                    headers: 0,
                    url: 0,
                    description: 0,
                    enabled: 0,
                    created: 0,
                    modified: 0,
                    updated: 0,
                    deleted: 0,
                    permissions: 0,
                    organization_id: 0,
                    pricing: 0
                },
                limit: 1
            }
        }
    },
    storageConfig: {
        "$if.$storageResponse.error.length.$gt": {
            "0": { $throw: 'Unable to read the selected storage API record.' },
            $else: {
                "$if.$storageResponse.object.0.$exists": {
                    $true: '$storageResponse.object.0',
                    $else: { $throw: 'The selected enabled storage API record is unavailable.' }
                }
            }
        }
    },
    storageName: requiredText('$storageConfig.name', 'The storage API record requires a name.'),
    storageProvider: requiredText('$storageConfig.provider', 'The storage API record requires a provider.'),
    storageBytes: { "$Buffer.from": [{ "$JSON.stringify": '$storageConfig' }, 'utf8'] },
    storageBase64: { "$storageBytes.toString": 'base64' },
    bootstrapScript: { "$astAsync": '$payload.data.startupScript' },
    bootstrapScriptBytes: { "$Buffer.from": ['$bootstrapScript', 'utf8'] },
    bootstrapScriptBase64: { "$bootstrapScriptBytes.toString": 'base64' }
};

export default {
    "method": "object.update",
    "array": "endpoints",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e13",
            "api_id": "65f8ca227b39a3c1a8904e02", // AWS API Provider Ref
            "name": "resolve-image",
            "method": "post",
            "url": {
                "$concat": [[
                    "https://ssm.",
                    "$payload.region",
                    ".amazonaws.com"
                ]]
            },
            "endpoint": "/",
            "headers": {
                "content-type": "application/x-amz-json-1.1",
                "host": {
                    "$concat": [[
                        "ssm.",
                        "$payload.region",
                        ".amazonaws.com"
                    ]]
                },
                "x-amz-target": "AmazonSSM.GetParameter",
                "x-amz-date": {
                    "$security.transform": [
                        "",
                        [{ "op": "timestamp", "format": "iso-basic" }]
                    ]
                },
                "Authorization": {
                    "$security.createAwsSigV4Token": [
                        {
                            "method": "$payload.method",
                            "uri": "/",
                            "payload": { "$JSON.stringify": "$payload.data" },
                            "region": "$payload.region",
                            "service": "ssm",
                            "isoDate": "$x-amz-date",
                            "headers": {
                                "content-type": "application/x-amz-json-1.1",
                                "host": {
                                    "$concat": [[
                                        "ssm.",
                                        "$payload.region",
                                        ".amazonaws.com"
                                    ]]
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
            "api_id": "65f8ca227b39a3c1a8904e02", // AWS API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": "/instances",
            "description": "Provisions EC2 instances with cluster-scoped network security.",
            "actions": {
                ...storageActions,
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
                    "$defaultVpc.data.match": ["<vpcId>([^<]+)</vpcId>"]
                },
                "vpcId": {
                    "$null": ["$payload.data.vpcId", "$defaultVpcId.1"]
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
                    "$existingSecurityGroup.data.match": ["<groupId>([^<]+)</groupId>"]
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
                    "$createdSecurityGroup.data.match": ["<groupId>([^<]+)</groupId>"]
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
                    "$aws.data.match": ["<instanceId>([^<]+)</instanceId>"]
                },
                "imageId": {
                    "$aws.data.match": ["<imageId>([^<]+)</imageId>"]
                },
                "instanceType": {
                    "$aws.data.match": ["<instanceType>([^<]+)</instanceType>"]
                },
                "state": {
                    "$aws.data.match": ["<instanceState>[\\s\\S]*?<name>([^<]+)</name>"]
                },
                "availabilityZone": {
                    "$aws.data.match": ["<availabilityZone>([^<]+)</availabilityZone>"]
                },
                "privateIpAddress": {
                    "$aws.data.match": ["<privateIpAddress>([^<]+)</privateIpAddress>"]
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
            "api_id": "65f8ca227b39a3c1a8904e02", // AWS API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": { "$concat": ["/instances/", "$payload.data.vmId"] },
            "description": "Terminates targeted AWS EC2 virtual machine instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e16",
            "api_id": "65f8ca227b39a3c1a8904e03", // GCP API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/compute/v1/projects/",
                    { "$null": ["$payload.data.project", "$config.projectId"] },
                    "/zones/",
                    { "$null": ["$payload.data.zone", "$payload.data.region"] },
                    "/instances"
                ]
            },
            "description": "Launches a Google Compute Engine VM instance in the specified GCP zone.",
            "actions": { ...storageActions },
            "data": {
                "name": "$payload.data.vmId",
                "machineType": { "$concat": ["zones/", { "$null": ["$payload.data.zone", "$payload.data.region"] }, "/machineTypes/", "$payload.data.vmType"] },
                "tags": {
                    "items": ["http-server", "https-server"]
                },
                "disks": [
                    {
                        "boot": true,
                        "autoDelete": true,
                        "initializeParams": {
                            "sourceImage": "projects/ubuntu-os-cloud/global/images/family/ubuntu-2404-lts"
                        }
                    }
                ],
                "networkInterfaces": [
                    { "network": "global/networks/default" }
                ],
                "metadata": {
                    "items": [
                        {
                            "key": "startup-script",
                            "value": "$bootstrapScript"
                        }
                    ]
                }
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e17",
            "api_id": "65f8ca227b39a3c1a8904e03", // GCP API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": {
                "$concat": [
                    "/compute/v1/projects/",
                    { "$null": ["$payload.data.project", "$config.projectId"] },
                    "/zones/",
                    { "$null": ["$payload.data.zone", "$payload.data.region"] },
                    "/instances/",
                    "$payload.data.vmId"
                ]
            },
            "description": "Deletes specified Google Compute Engine VM instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e18",
            "api_id": "65f8ca227b39a3c1a8904e04", // Azure API Provider Ref
            "name": "create-instance",
            "method": "put",
            "endpoint": {
                "$concat": [
                    "/subscriptions/",
                    { "$null": ["$payload.data.subscriptionId", "$config.subscriptionId"] },
                    "/resourceGroups/",
                    { "$null": ["$payload.data.resourceGroup", "$config.resourceGroup", "default-rg"] },
                    "/providers/Microsoft.Compute/virtualMachines/",
                    "$payload.data.vmId",
                    "?api-version=2023-09-01"
                ]
            },
            "description": "Creates or updates an Azure Virtual Machine resource within a resource group.",
            "actions": {
                ...storageActions,
                "existingNsg": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "get",
                        "endpoint": "/networkSecurityGroups",
                        "searchParams": {
                            "location": "$payload.data.region",
                            "resourceGroup": { "$null": ["$payload.data.resourceGroup", "$config.resourceGroup", "default-rg"] },
                            "name": "cocreate-nsg"
                        }
                    }
                },
                "createdNsg": {
                    "$if.$existingNsg.data.$eq": {
                        "$null": {
                            "$api.send": {
                                "api": "$config.name",
                                "method": "post",
                                "endpoint": "/networkSecurityGroups",
                                "data": {
                                    "location": "$payload.data.region",
                                    "resourceGroup": { "$null": ["$payload.data.resourceGroup", "$config.resourceGroup", "default-rg"] },
                                    "name": "cocreate-nsg",
                                    "securityRules": [
                                        { "name": "allow-http", "protocol": "Tcp", "access": "Allow", "direction": "Inbound", "sourceAddressPrefix": "*", "sourcePortRange": "*", "destinationAddressPrefix": "*", "destinationPortRange": "80", "priority": 100 },
                                        { "name": "allow-https", "protocol": "Tcp", "access": "Allow", "direction": "Inbound", "sourceAddressPrefix": "*", "sourcePortRange": "*", "destinationAddressPrefix": "*", "destinationPortRange": "443", "priority": 110 }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            "data": {
                "location": "$payload.data.region",
                "properties": {
                    "hardwareProfile": {
                        "vmSize": "$payload.data.vmType"
                    },
                    "networkProfile": {
                        "networkInterfaces": [
                            {
                                "id": "$payload.data.networkInterfaceId",
                                "properties": {
                                    "networkSecurityGroup": {
                                        "id": { "$null": ["$payload.data.securityGroupId", "$actions.existingNsg.data.id", "$actions.createdNsg.data.id"] }
                                    }
                                }
                            }
                        ]
                    },
                    "storageProfile": {
                        "imageReference": {
                            "publisher": "Canonical",
                            "offer": "ubuntu-24_04-lts",
                            "sku": "server",
                            "version": "latest"
                        }
                    },
                    "osProfile": {
                        "computerName": "$payload.data.vmId",
                        "customData": "$bootstrapScriptBase64"
                    }
                }
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e19",
            "api_id": "65f8ca227b39a3c1a8904e04", // Azure API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": {
                "$concat": [
                    "/subscriptions/",
                    { "$null": ["$payload.data.subscriptionId", "$config.subscriptionId"] },
                    "/resourceGroups/",
                    { "$null": ["$payload.data.resourceGroup", "$config.resourceGroup", "default-rg"] },
                    "/providers/Microsoft.Compute/virtualMachines/",
                    "$payload.data.vmId",
                    "?api-version=2023-09-01"
                ]
            },
            "description": "Deallocates and deletes an Azure Virtual Machine.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e1a",
            "api_id": "65f8ca227b39a3c1a8904e05", // DigitalOcean API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": "/v2/droplets",
            "description": "Spins up a new DigitalOcean Droplet compute instance.",
            "actions": { ...storageActions },
            "data": {
                "name": { "$null": ["$payload.data.vmId", "$payload.data.name"] },
                "region": "$payload.data.region",
                "size": "$payload.data.vmType",
                "image": "ubuntu-24-04-x64",
                "user_data": "$bootstrapScript"
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1b",
            "api_id": "65f8ca227b39a3c1a8904e05", // DigitalOcean API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": { "$concat": ["/v2/droplets/", "$payload.data.vmId"] },
            "description": "Destroys a DigitalOcean Droplet instance by ID.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e1c",
            "api_id": "65f8ca227b39a3c1a8904e06", // OCI API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": "/20160918/instances",
            "description": "Launches a new compute instance on Oracle Cloud Infrastructure (OCI).",
            "actions": {
                ...storageActions,
                "existingOciNsg": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "get",
                        "endpoint": "/20160918/networkSecurityGroups",
                        "searchParams": {
                            "compartmentId": { "$null": ["$payload.data.compartmentId", "$config.compartmentId"] },
                            "displayName": "cocreate-nsg"
                        }
                    }
                },
                "createdOciNsg": {
                    "$if.$existingOciNsg.data.$eq": {
                        "$null": {
                            "$api.send": {
                                "api": "$config.name",
                                "method": "post",
                                "endpoint": "/20160918/networkSecurityGroups",
                                "data": {
                                    "compartmentId": { "$null": ["$payload.data.compartmentId", "$config.compartmentId"] },
                                    "displayName": "cocreate-nsg",
                                    "rules": [
                                        { "direction": "INGRESS", "protocol": "6", "tcpOptions": { "destinationPortRange": { "min": 80, "max": 80 } }, "source": "0.0.0.0/0" },
                                        { "direction": "INGRESS", "protocol": "6", "tcpOptions": { "destinationPortRange": { "min": 443, "max": 443 } }, "source": "0.0.0.0/0" }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            "data": {
                "compartmentId": { "$null": ["$payload.data.compartmentId", "$config.compartmentId"] },
                "availabilityDomain": { "$null": ["$payload.data.availabilityDomain", "$config.availabilityDomain"] },
                "shape": "$payload.data.vmType",
                "displayName": "$payload.data.vmId",
                "createVnicDetails": {
                    "nsgIds": [
                        { "$null": ["$payload.data.securityGroupId", "$actions.existingOciNsg.data.id", "$actions.createdOciNsg.data.id"] }
                    ]
                },
                "metadata": {
                    "user_data": "$bootstrapScriptBase64"
                }
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1d",
            "api_id": "65f8ca227b39a3c1a8904e06", // OCI API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": { "$concat": ["/20160918/instances/", "$payload.data.vmId"] },
            "description": "Terminates an Oracle Cloud Infrastructure instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e1e",
            "api_id": "65f8ca227b39a3c1a8904e07", // Hetzner API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": "/v1/servers",
            "description": "Creates a new Hetzner Cloud server instance.",
            "actions": { ...storageActions },
            "data": {
                "name": "$payload.data.vmId",
                "server_type": "$payload.data.vmType",
                "location": "$payload.data.region",
                "image": "ubuntu-24.04",
                "user_data": "$bootstrapScript"
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1f",
            "api_id": "65f8ca227b39a3c1a8904e07", // Hetzner API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": { "$concat": ["/v1/servers/", "$payload.data.vmId"] },
            "description": "Deletes a Hetzner Cloud server instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e20",
            "api_id": "65f8ca227b39a3c1a8904e08", // Vultr API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": "/v2/instances",
            "description": "Deploys a new Vultr cloud compute instance.",
            "actions": { ...storageActions },
            "data": {
                "region": "$payload.data.region",
                "plan": "$payload.data.vmType",
                "label": "$payload.data.vmId",
                "os_id": 215, // 215 = Ubuntu 24.04 LTS x64
                "user_data": "$bootstrapScriptBase64"
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e21",
            "api_id": "65f8ca227b39a3c1a8904e08", // Vultr API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": { "$concat": ["/v2/instances/", "$payload.data.vmId"] },
            "description": "Halts and destroys a Vultr cloud compute instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e2e",
            "api_id": "65f8ca227b39a3c1a8904e09", // Equinix API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/metal/v1/projects/",
                    { "$null": ["$payload.data.projectId", "$config.projectId"] },
                    "/devices"
                ]
            },
            "description": "Provisions bare metal compute hardware on Equinix Metal.",
            "actions": { ...storageActions },
            "data": {
                "hostname": "$payload.data.vmId",
                "plan": "$payload.data.vmType",
                "metro": "$payload.data.region",
                "operating_system": "ubuntu_24_04",
                "userdata": "$bootstrapScript"
            },
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e2f",
            "api_id": "65f8ca227b39a3c1a8904e09", // Equinix API Provider Ref
            "name": "delete-instance",
            "method": "delete",
            "endpoint": { "$concat": ["/metal/v1/devices/", "$payload.data.vmId"] },
            "description": "Deprovisions and deletes an Equinix Metal device.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e30",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "verify-token",
            "method": "get",
            "endpoint": "/user/tokens/verify",
            "description": "Verifies the configured Cloudflare API token.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e31",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "list-monitors",
            "method": "get",
            "endpoint": {
                "$concat": [
                    "/accounts/",
                    "$config.accountId",
                    "/load_balancers/monitors"
                ]
            },
            "description": "Lists Cloudflare load balancer health monitors.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e32",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "create-monitor",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/accounts/",
                    "$config.accountId",
                    "/load_balancers/monitors"
                ]
            },
            "description": "Creates a Cloudflare load balancer health monitor.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e33",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "delete-monitor",
            "method": "delete",
            "endpoint": {
                "$concat": [
                    "/accounts/",
                    "$config.accountId",
                    "/load_balancers/monitors/",
                    "$payload.monitorId"
                ]
            },
            "description": "Deletes a Cloudflare load balancer health monitor.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e34",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "list-pools",
            "method": "get",
            "endpoint": {
                "$concat": [
                    "/accounts/",
                    "$config.accountId",
                    "/load_balancers/pools"
                ]
            },
            "description": "Lists Cloudflare load balancer origin pools.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e35",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "create-pool",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/accounts/",
                    "$config.accountId",
                    "/load_balancers/pools"
                ]
            },
            "data": {
                "name": "$payload.data._id",
                "description": {
                    "$null": [
                        "$payload.data.name",
                        "$payload.data._id"
                    ]
                },
                "enabled": true,
                "latitude": "$payload.data.location.latitude",
                "longitude": "$payload.data.location.longitude",
                "minimum_origins": 1,
                "origins": [
                    {
                        "name": {
                            "$null": [
                                "$payload.data.name",
                                "$payload.data._id"
                            ]
                        },
                        "address": "$payload.data.ip",
                        "enabled": true
                    }
                ]
            },
            "description": "Creates a geographically located Cloudflare origin pool by mapping a CoCreate server object.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e36",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "update-pool",
            "method": "patch",
            "endpoint": {
                "$concat": [
                    "/accounts/",
                    "$config.accountId",
                    "/load_balancers/pools/",
                    "$payload.poolId"
                ]
            },
            "description": "Updates a Cloudflare origin pool and its server origins.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e37",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "delete-pool",
            "method": "delete",
            "endpoint": {
                "$concat": [
                    "/accounts/",
                    "$config.accountId",
                    "/load_balancers/pools/",
                    "$payload.poolId"
                ]
            },
            "description": "Deletes a Cloudflare load balancer origin pool.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e38",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "list-load-balancers",
            "method": "get",
            "endpoint": {
                "$concat": [
                    "/zones/",
                    "$config.zoneId",
                    "/load_balancers"
                ]
            },
            "description": "Lists Cloudflare load balancers for the configured zone.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e39",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "create-load-balancer",
            "method": "post",
            "endpoint": {
                "$concat": [
                    "/zones/",
                    "$config.zoneId",
                    "/load_balancers"
                ]
            },
            "description": "Creates a proxied Cloudflare load balancer hostname.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e3a",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "update-load-balancer",
            "method": "patch",
            "endpoint": {
                "$concat": [
                    "/zones/",
                    "$config.zoneId",
                    "/load_balancers/",
                    "$payload.loadBalancerId"
                ]
            },
            "description": "Updates a Cloudflare load balancer configuration.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e3b",
            "api_id": "65f8ca227b39a3c1a8904e11", // Cloudflare API Provider Ref
            "name": "delete-load-balancer",
            "method": "delete",
            "endpoint": {
                "$concat": [
                    "/zones/",
                    "$config.zoneId",
                    "/load_balancers/",
                    "$payload.loadBalancerId"
                ]
            },
            "description": "Deletes a Cloudflare load balancer.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e3c",
            "api_id": "65f8ca227b39a3c1a8904e12", // GitHub Organizations API Provider Ref
            "name": "get-organization-repository",
            "method": "get",
            "endpoint": {
                "$concat": [[
                    "/repos/",
                    "$owner",
                    "/",
                    "$data.data.name"
                ]]
            },
            "description": "Gets a managed private repository by organization repository name.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e3d",
            "api_id": "65f8ca227b39a3c1a8904e12", // GitHub Organizations API Provider Ref
            "name": "create-organization-repository",
            "method": "post",
            "endpoint": {
                "$concat": [[
                    "/orgs/",
                    "$owner",
                    "/repos"
                ]]
            },
            "data": {
                "name": "$data.data.name",
                "description": "$data.data.description",
                "private": true,
                "has_issues": false,
                "has_projects": false,
                "has_wiki": false,
                "auto_init": false
            },
            "description": "Creates an empty private repository for a managed CoCreate organization.",
            "enabled": true
        }
    ]
};
