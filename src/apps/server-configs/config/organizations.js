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
            "localFsRoot": "/home/ubuntu/Dev/CoCreate-server/organizations",
            "api": "github-organizations",
            "getEndpoint": "get-organization-repository",
            "createEndpoint": "create-organization-repository",
            "owner": "CoCreate-organizations",
            "templateUrl": "https://github.com/CoCreateJS/CoCreate-app-template.git",
            "gitBinary": "git"
        }
    }
};
