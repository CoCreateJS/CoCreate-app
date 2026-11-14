/** Mesh recovery exhaustion policy, editable as a workflow record. */
export default {
    "method": "object.update",
    "array": "workflows",
    "upsert": true,
    "object": [
        {
            "_id": "6b0000000000000000000005",
            "name": "peerUnavailable",
            "enabled": true,
            "description": "Preserve missed Mesh messages and observer evidence, then mark an unreachable running peer failed. Never terminate or delete the server.",
            "actions": {
                "logs": {
                    "$crud.send": {
                        "method": "object.update",
                        "array": "servers",
                        "object": {
                            "_id": "$payload.peerUnavailable.0.serverId",
                            "$addToSet": {
                                "queuedMessages": {
                                    "$each": "$payload.peerUnavailable.0.queuedMessages"
                                },
                                "peerFailures": {
                                    "id": "$payload.peerUnavailable.0.id",
                                    "observerId": "$payload.peerUnavailable.0.observerId",
                                    "observedAt": "$payload.peerUnavailable.0.observedAt",
                                    "reason": "$payload.peerUnavailable.0.reason",
                                    "peerOrganizationId": "$payload.peerUnavailable.0.peerOrganizationId",
                                    "remoteAddress": "$payload.peerUnavailable.0.remoteAddress",
                                    "retries": "$payload.peerUnavailable.0.retries",
                                    "recoveryWaitMs": "$payload.peerUnavailable.0.recoveryWaitMs",
                                    "closeCode": "$payload.peerUnavailable.0.closeCode",
                                    "peerReachable": "$payload.peerUnavailable.0.peerReachable"
                                }
                            }
                        },
                        "upsert": false
                    }
                },
                "logsSuccess": {
                    "$if.$logs.success.$eq": {
                        "$false": {
                            "$throw": "Unable to persist peer failure."
                        }
                    }
                },
                "logsErrors": {
                    "$if.$logs.error.$exists": {
                        "$true": {
                            "$if.$logs.error.length.$gt": {
                                "0": {
                                    "$throw": "Unable to persist peer failure."
                                }
                            }
                        }
                    }
                },
                "checkRecord": {
                    "$if.$logs.object.0.$exists": {
                        "$true": {},
                        "$else": {
                            "$throw": "Peer server record was not found."
                        }
                    }
                },
                "markFailed": {
                    "$if.$payload.peerUnavailable.0.peerReachable.$eq": {
                        "$false": {
                            "status": {
                                "$crud.send": {
                                    "method": "object.update",
                                    "array": "servers",
                                    "filter": {
                                        "query": {
                                            "_id": "$payload.peerUnavailable.0.serverId",
                                            "$or": [
                                                {
                                                    "master.status": "running"
                                                },
                                                {
                                                    "master.status": "failed",
                                                    "master.failure.source": "mesh"
                                                }
                                            ]
                                        }
                                    },
                                    "object": {
                                        "$set": {
                                            "master.status": "failed",
                                            "master.failure": {
                                                "source": "mesh",
                                                "reason": "$payload.peerUnavailable.0.reason",
                                                "observerId": "$payload.peerUnavailable.0.observerId",
                                                "observedAt": "$payload.peerUnavailable.0.observedAt"
                                            }
                                        }
                                    },
                                    "upsert": false
                                }
                            },
                            "statusSuccess": {
                                "$if.$status.success.$eq": {
                                    "$false": {
                                        "$throw": "Unable to persist peer failure."
                                    }
                                }
                            },
                            "statusErrors": {
                                "$if.$status.error.$exists": {
                                    "$true": {
                                        "$if.$status.error.length.$gt": {
                                            "0": {
                                                "$throw": "Unable to persist peer failure."
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
};
