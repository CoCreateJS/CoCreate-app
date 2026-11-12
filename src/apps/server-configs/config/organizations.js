/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

/** Managed organization repository provisioning configuration. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": {
        "_id": "65f8cb447b39a3c1a8904e41",
        "type": "organizations",
        "name": "Managed Organization Provisioning",
        "enabled": true,
        "cluster": "*",
        "server": "*",
        "worker": "*",
        "config": {
            "enabled": true,
            "storageWorkflow": "createManagedMongoDB",
            "organizationWorkflow": "createOrganization",
            "onboardingWorkflow": "onboardOrganization",
            "storageProvisioning": {
                "cloudProvider": "AWS",
                "regionName": "US_EAST_1",
                "cidrBlock": ""
            },
            "clusterProvisioning": {
                "scaleIn": { "minClusterSize": 0 }
            },
            "repositoryWorkflow": "createRepository",
            "repositoryProvisioning": {
                "api": "github-organizations",
                "templateOwner": "CoCreateJS",
                "templateRepository": "CoCreate-app-template"
            }
        }
    }
};
