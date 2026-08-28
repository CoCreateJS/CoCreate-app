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

export const seedEndpointsPayload = {
    "method": "object.update",
    "array": "endpoints",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e14",
            "api_id": "65f8ca227b39a3c1a8904e02", // AWS API Provider Ref
            "name": "create-instance",
            "method": "post",
            "endpoint": "/instances",
            "description": "Provisions EC2 virtual machine instances within target AWS availability zones.",
            "actions": {
                "existingSg": {
                    "$api.send": {
                        "api": "$config.name",
                        "method": "get",
                        "endpoint": "/security-groups",
                        "searchParams": {
                            "region": "$payload.data.region",
                            "groupName": "cocreate-sg"
                        }
                    }
                },
                "createdSg": {
                    "$if.$existingSg.data.$eq": {
                        "$null": {
                            "$api.send": {
                                "api": "$config.name",
                                "method": "post",
                                "endpoint": "/security-groups",
                                "data": {
                                    "region": "$payload.data.region",
                                    "groupName": "cocreate-sg",
                                    "description": "CoCreate WebService HTTP/HTTPS Inbound Rules",
                                    "rules": [
                                        { "ipProtocol": "tcp", "fromPort": 80, "toPort": 80, "cidrIp": "0.0.0.0/0" },
                                        { "ipProtocol": "tcp", "fromPort": 443, "toPort": 443, "cidrIp": "0.0.0.0/0" }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            "data": {
                "ImageId": "ami-0c55b159cbfafe1f0",
                "InstanceType": "$payload.data.vmType",
                "MinCount": 1,
                "MaxCount": 1,
                "KeyName": "$payload.data.sshKeyName",
                "UserData": { "$base64": "$payload.data.startupScript" },
                "SecurityGroupIds": [
                    { "$null": ["$payload.data.securityGroupId", "$actions.existingSg.data.id", "$actions.createdSg.data.id"] }
                ]
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
                    { "$null": ["$payload.data.project", "$config.project"] },
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
                                    "value": "$payload.data.startupScript"
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
                    { "$null": ["$payload.data.project", "$config.project"] },
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
                        "customData": { "$base64": "$payload.data.startupScript" }
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
                        "user_data": "$payload.data.startupScript"
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
                    "user_data": { "$base64": "$payload.data.startupScript" }
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
                        "user_data": "$payload.data.startupScript"
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
                        "user_data": { "$base64": "$payload.data.startupScript" }
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
                        "userdata": "$payload.data.startupScript"
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
