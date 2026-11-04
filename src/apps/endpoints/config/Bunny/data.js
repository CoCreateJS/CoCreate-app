/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

/** Bunny DNS record endpoint AST records. */
export default {
	method: "object.update",
	array: "endpoints",
	upsert: true,
	object: [
		{
			_id: "6b0300000000000000000001",
			api_id: "b1056eecfdf173eba3fc12b9",
			name: "create-dns-record",
			method: "post",
			endpoint: {
				$concat: [["/dnszone/", "$payload.data.zoneId", "/records"]]
			},
			description:
				"Creates a DNS record in an existing Bunny DNS zone. Pass Bunny's record fields in data.record.",
			data: "$payload.data.record",
			enabled: false
		},
		{
			_id: "6b0300000000000000000002",
			api_id: "b1056eecfdf173eba3fc12b9",
			name: "delete-dns-record",
			method: "delete",
			endpoint: {
				$concat: [
					[
						"/dnszone/",
						"$payload.data.zoneId",
						"/records/",
						"$payload.data.recordId"
					]
				]
			},
			description:
				"Deletes a DNS record from an existing Bunny DNS zone using its zone and record IDs.",
			enabled: false
		}
	]
};
