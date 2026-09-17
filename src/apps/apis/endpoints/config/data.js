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
            "description": "Provisions EC2 virtual machine instances within target AWS availability zones.",
            "actions": {
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
                            "UserData": { "$btoa": { "$astAsync": "$payload.data.startupScript" } }
                        }
                    }
                }
            },
            "resolved": true,
            "data": "$actions.aws.data",
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
                            "value": { "$astAsync": "$payload.data.startupScript" }
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
                        "customData": { "$base64": { "$astAsync": "$payload.data.startupScript" } }
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
            "data": {
                "name": { "$null": ["$payload.data.vmId", "$payload.data.name"] },
                "region": "$payload.data.region",
                "size": "$payload.data.vmType",
                "image": "ubuntu-24-04-x64",
                "user_data": { "$astAsync": "$payload.data.startupScript" }
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
                    "user_data": { "$base64": { "$astAsync": "$payload.data.startupScript" } }
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
            "data": {
                "name": "$payload.data.vmId",
                "server_type": "$payload.data.vmType",
                "location": "$payload.data.region",
                "image": "ubuntu-24.04",
                "user_data": { "$astAsync": "$payload.data.startupScript" }
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
            "data": {
                "region": "$payload.data.region",
                "plan": "$payload.data.vmType",
                "label": "$payload.data.vmId",
                "os_id": 215, // 215 = Ubuntu 24.04 LTS x64
                "user_data": { "$base64": { "$astAsync": "$payload.data.startupScript" } }
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
            "data": {
                "hostname": "$payload.data.vmId",
                "plan": "$payload.data.vmType",
                "metro": "$payload.data.region",
                "operating_system": "ubuntu_24_04",
                "userdata": { "$astAsync": "$payload.data.startupScript" }
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
        }
    ]
};
