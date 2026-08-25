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
 * Maps structural configurations for outbound integrations targeted at the
 * Stripe, Twilio, Postmark, and OpenAI providers as well as multi-cloud providers
 * (AWS, GCP, Azure, DigitalOcean, OCI, Hetzner, Vultr, Equinix) used by Autoscaler.
 */
export const seedEndpointsPayload = {
    "method": "object.update",
    "array": "endpoints",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e10",
            "api_id": "65f8ca227b39a3c1a8904dfe", // Stripe API Provider Ref
            "endpoint": "POST /customers",
            "path": "/customers",
            "description": "Registers a customer account inside Stripe's CRM and billing ecosystem.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e11",
            "api_id": "65f8ca227b39a3c1a8904dff", // Twilio API Provider Ref
            "endpoint": "POST /Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Messages.json",
            "path": "/Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Messages.json",
            "description": "Dispatches real-time transactional SMS notifications via the Twilio communications grid.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e12",
            "api_id": "65f8ca227b39a3c1a8904e00", // Postmark API Provider Ref
            "endpoint": "POST /email",
            "path": "/email",
            "description": "Transmits high-delivery transactional user receipts and onboarding loops via Postmark SMTP.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e13",
            "api_id": "65f8ca227b39a3c1a8904e01", // OpenAI API Provider Ref
            "endpoint": "POST /chat/completions",
            "path": "/chat/completions",
            "description": "Queries OpenAI conversational AI algorithms to perform content generation or AST evaluations.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e14",
            "api_id": "65f8ca227b39a3c1a8904e02", // AWS API Provider Ref
            "endpoint": "POST /instances",
            "path": "/instances",
            "description": "Provisions EC2 virtual machine instances within target AWS availability zones.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e15",
            "api_id": "65f8ca227b39a3c1a8904e02", // AWS API Provider Ref
            "endpoint": "DELETE /instances/$data.instanceId",
            "path": "/instances/$data.instanceId",
            "description": "Terminates targeted AWS EC2 virtual machine instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e16",
            "api_id": "65f8ca227b39a3c1a8904e03", // GCP API Provider Ref
            "endpoint": "POST /compute/v1/projects/$data.project/zones/$data.zone/instances",
            "path": "/compute/v1/projects/$data.project/zones/$data.zone/instances",
            "description": "Launches a Google Compute Engine VM instance in the specified GCP zone.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e17",
            "api_id": "65f8ca227b39a3c1a8904e03", // GCP API Provider Ref
            "endpoint": "DELETE /compute/v1/projects/$data.project/zones/$data.zone/instances/$data.instanceId",
            "path": "/compute/v1/projects/$data.project/zones/$data.zone/instances/$data.instanceId",
            "description": "Deletes a Google Compute Engine VM instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e18",
            "api_id": "65f8ca227b39a3c1a8904e04", // Azure API Provider Ref
            "endpoint": "PUT /subscriptions/$data.subscriptionId/resourceGroups/$data.resourceGroup/providers/Microsoft.Compute/virtualMachines/$data.instanceId",
            "path": "/subscriptions/$data.subscriptionId/resourceGroups/$data.resourceGroup/providers/Microsoft.Compute/virtualMachines/$data.instanceId",
            "description": "Provisions or updates a Virtual Machine in Microsoft Azure.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e19",
            "api_id": "65f8ca227b39a3c1a8904e04", // Azure API Provider Ref
            "endpoint": "DELETE /subscriptions/$data.subscriptionId/resourceGroups/$data.resourceGroup/providers/Microsoft.Compute/virtualMachines/$data.instanceId",
            "path": "/subscriptions/$data.subscriptionId/resourceGroups/$data.resourceGroup/providers/Microsoft.Compute/virtualMachines/$data.instanceId",
            "description": "Deallocates and deletes an Azure Virtual Machine.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e1a",
            "api_id": "65f8ca227b39a3c1a8904e05", // DigitalOcean API Provider Ref
            "endpoint": "POST /v2/droplets",
            "path": "/v2/droplets",
            "description": "Provisions a new Droplet instance on DigitalOcean.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1b",
            "api_id": "65f8ca227b39a3c1a8904e05", // DigitalOcean API Provider Ref
            "endpoint": "DELETE /v2/droplets/$data.instanceId",
            "path": "/v2/droplets/$data.instanceId",
            "description": "Deletes an existing DigitalOcean Droplet by ID.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e1c",
            "api_id": "65f8ca227b39a3c1a8904e06", // OCI API Provider Ref
            "endpoint": "POST /20160918/instances",
            "path": "/20160918/instances",
            "description": "Creates a compute instance in the specified compartment on Oracle Cloud.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1d",
            "api_id": "65f8ca227b39a3c1a8904e06", // OCI API Provider Ref
            "endpoint": "DELETE /20160918/instances/$data.instanceId",
            "path": "/20160918/instances/$data.instanceId",
            "description": "Terminates an Oracle Cloud compute instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e1e",
            "api_id": "65f8ca227b39a3c1a8904e07", // Hetzner API Provider Ref
            "endpoint": "POST /v1/servers",
            "path": "/v1/servers",
            "description": "Provisions a cloud server in a Hetzner Cloud datacenter location.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1f",
            "api_id": "65f8ca227b39a3c1a8904e07", // Hetzner API Provider Ref
            "endpoint": "DELETE /v1/servers/$data.instanceId",
            "path": "/v1/servers/$data.instanceId",
            "description": "Deletes a Hetzner Cloud server by ID.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e20",
            "api_id": "65f8ca227b39a3c1a8904e08", // Vultr API Provider Ref
            "endpoint": "POST /v2/instances",
            "path": "/v2/instances",
            "description": "Deploys a new virtual compute instance on Vultr infrastructure.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e21",
            "api_id": "65f8ca227b39a3c1a8904e08", // Vultr API Provider Ref
            "endpoint": "DELETE /v2/instances/$data.instanceId",
            "path": "/v2/instances/$data.instanceId",
            "description": "Destroys a Vultr virtual compute instance.",
            "enabled": true
        },

        {
            "_id": "65f8cb447b39a3c1a8904e22",
            "api_id": "65f8ca227b39a3c1a8904e09", // Equinix API Provider Ref
            "endpoint": "POST /metal/v1/projects/$data.projectId/devices",
            "path": "/metal/v1/projects/$data.projectId/devices",
            "description": "Provisions a bare metal server device in an Equinix Metal project.",
            "enabled": true
        },
        {
            "_id": "65f8cb447b39a3c1a8904e23",
            "api_id": "65f8ca227b39a3c1a8904e09", // Equinix API Provider Ref
            "endpoint": "DELETE /metal/v1/devices/$data.instanceId",
            "path": "/metal/v1/devices/$data.instanceId",
            "description": "Deletes a bare metal server device in Equinix Metal.",
            "enabled": true
        }
    ]
};

export default seedEndpointsPayload;