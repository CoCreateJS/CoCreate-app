/********************************************************************************
 * Copyright (C) 2023 CoCreate and Contributors.
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
 * Commercial Licensing Information:
 * For commercial use of this software without the copyleft provisions of the AGPLv3,
 * you must obtain a commercial license from CoCreate LLC.
 * For details, visit <https://cocreate.app/licenses/> or contact us at sales@cocreate.app.
 */

const cacheName = "CoCreate-v1.0.0";
const updatedOn = new Date()
const stateDatabaseName = "system";
const stateStoreName = "state";

let organization_id = "";
let storage = true;

const queryString = self.location.search;
const queryParams = new URLSearchParams(queryString);
let cacheType = queryParams.get("cache");

function openStateDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(stateDatabaseName);
		request.onsuccess = () => {
			const database = request.result;
			if (database.objectStoreNames.contains(stateStoreName)) {
				resolve(database);
				return;
			}

			const version = database.version + 1;
			database.close();
			const upgradeRequest = indexedDB.open(stateDatabaseName, version);
			upgradeRequest.onupgradeneeded = () => {
				const upgradedDatabase = upgradeRequest.result;
				if (!upgradedDatabase.objectStoreNames.contains(stateStoreName)) {
					upgradedDatabase.createObjectStore(stateStoreName, { keyPath: "_id" });
				}
			};
			upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);
			upgradeRequest.onerror = () => reject(upgradeRequest.error);
		};
		request.onerror = () => reject(request.error);
	});
}

async function setActiveState(state, theme) {
	const database = await openStateDatabase();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction(stateStoreName, "readwrite");
		transaction.objectStore(stateStoreName).put({
			_id: "activeState",
			state,
			theme,
			updatedAt: Date.now()
		});
		transaction.oncomplete = () => {
			database.close();
			resolve();
		};
		transaction.onerror = () => {
			database.close();
			reject(transaction.error);
		};
	});
}

async function getActiveState() {
	const database = await openStateDatabase();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction(stateStoreName, "readonly");
		const request = transaction.objectStore(stateStoreName).get("activeState");
		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);
		transaction.oncomplete = () => database.close();
	});
}

async function applyActiveState(request) {
	if (request.mode !== "navigate" || new URL(request.url).origin !== self.location.origin) {
		return { request, hasState: false };
	}

	const activeState = await getActiveState();
	const state = activeState?.state;
	if (!state || state === "{}") return { request, hasState: false };

	const headers = new Headers(request.headers);
	headers.set("X-State", state);
	if (activeState.theme) {
		headers.set("X-Prefers-Color-Scheme", activeState.theme);
	}
	return {
		request: new Request(request, { headers }),
		hasState: true
	};
}

self.addEventListener("install", (e) => {
	console.log("Service Worker Installing");
	self.skipWaiting();
});

// self.addEventListener("activate", async (e) => {
//     e.waitUntil(clients.claim());
// });

self.addEventListener("activate", (event) => {
	event.waitUntil(
		clients.claim().then(() => {
			return clients.matchAll({ type: "window" }).then((clients) => {
				clients.forEach((client) => client.navigate(client.url));
			});
		})
	);
});

self.addEventListener("fetch", async (e) => {
	try {
		if (
			!(e.request.url.indexOf("http") === 0) ||
			e.request.method === "POST"
		)
			return;

		e.respondWith(
			caches
				.match(e.request)
				.then(async (cacheResponse) => {
					const stateRequest = await applyActiveState(e.request);
					if (stateRequest.hasState) cacheResponse = null;
					let fetchedOn;
					if (cacheResponse && cacheType !== "false") {
						fetchedOn = cacheResponse.headers.get("fetched-on");
						if (fetchedOn) fetchedOn = new Date(fetchedOn);
					}

					if (
						!navigator.onLine ||
						(!!cacheResponse &&
							cacheType !== "false" &&
							(!fetchedOn || fetchedOn > updatedOn))
					) {
						const organization =
							cacheResponse.headers.get("organization");
						// console.log('servering cache fetchOn greater', fetchedOn > updatedOn, organization)
						const lastModified =
							cacheResponse.headers.get("last-modified");
						sendCacheUpdate(
							e.request.url,
							organization,
							lastModified
						);
						return cacheResponse;
					} else {
						// console.log('fetching fetchOn less', fetchedOn > updatedOn)

						const networkResponse = await fetch(stateRequest.request);

						if (!organization_id)
							organization_id =
								networkResponse.headers.get("organization");

						let storageHeader =
							networkResponse.headers.get("storage");
						if (storageHeader) storage = storageHeader;

						if (
							!stateRequest.hasState &&
							cacheType &&
							cacheType !== "false" &&
							networkResponse.status === 200
						) {
							// console.log('caching')

							caches
								.open(cacheName)
								.then((cache) => {
									if (networkResponse.status !== 206) {
										const networkModified =
											networkResponse.headers.get(
												"last-modified"
											);
										// if (!networkModified) {
										//     networkResponse.headers.set('Last-Modified', new Date().toISOString());
										// }
										cache.put(e.request, networkResponse);
										if (
											cacheType === "reload" ||
											cacheType === "prompt"
										) {
											const cacheModified =
												cacheResponse.headers.get(
													"last-modified"
												);
											if (
												networkModified !==
												cacheModified
											) {
												self.clients
													.matchAll()
													.then((clients) => {
														clients.forEach(
															(client) => {
																client.postMessage(
																	{
																		action: "cacheType",
																		cacheType
																	}
																); // Send a custom message
																// console.log(`file ${cacheType} has been triggered`)
															}
														);
													});
											}
										}
									}
								})
								.catch(() => {});
						}

						if (
							!cacheResponse ||
							cacheType === "false" ||
							cacheType === "offline"
						) {
							return networkResponse.clone();
						}
					}

					if (
						!!cacheResponse &&
						cacheType !== "false" &&
						cacheType !== "offline"
					) {
						return cacheResponse;
					}
				})
				.catch(function () {
					return caches.match("./offline.html");
				})
		);
	} catch (error) {
		console.error("An error occurred:", error.message);
	}
});

self.addEventListener("message", function (event) {
	if (event.data.action === "setActiveState") {
		event.waitUntil(setActiveState(
			event.data.state || "{}",
			event.data.theme
		));
	} else if (event.data.action === "getOrganization")
		event.source.postMessage({
			action: "getOrganization",
			organization_id
		});
	else if (event.data.action === "checkCache") {
		event.source.postMessage({
			action: "checkCache",
			returnedFromCache: { ...returnedFromCache }
		});
		returnedFromCache = {};
	}
});

self.addEventListener("push", (event) => {
	const pushData = event.data.json(); // Assuming the push payload is JSON data

	// Process the push notification data as needed
	const { socketUrl, _id } = pushData;

	// Establish a WebSocket connection
	const socket = new WebSocket(socketUrl);

	// Handle WebSocket events
	socket.addEventListener("open", () => {
		// The WebSocket connection is open, send the message to the server
		socket.send(
			JSON.stringify({
				method: "object.read",
				array: "files",
				object: { _id },
				 uuid: ""
			})
		);
	});

	socket.addEventListener("message", (event) => {
		// Handle messages received from the server over the WebSocket
		const serverData = JSON.parse(event.data);
		if (serverData.uuid ===  uuid) {
			// TODO: add file to cache and close socket
		}
	});

	socket.addEventListener("close", () => {
		// Handle the WebSocket connection being closed
		console.log("WebSocket connection closed.");
	});

	socket.addEventListener("error", (error) => {
		// Handle WebSocket errors
		console.error("WebSocket error:", error);
	});

	// Ensure that the service worker stays active until the WebSocket connection is closed
	event.waitUntil(
		new Promise((resolve) => {
			socket.addEventListener("close", () => {
				resolve();
			});
		})
	);
});

let returnedFromCache = {};
let fetchTimeout = null;
const sendCacheUpdate = (url, organization, lastModified) => {
	returnedFromCache[url] = { organization, lastModified };

	if (fetchTimeout) {
		clearTimeout(fetchTimeout);
	}
	const self = this;
	fetchTimeout = setTimeout(() => {
		self.clients.matchAll().then((clients) => {
			if (clients.length > 0) {
				clients[0].postMessage({
					action: "checkCache",
					returnedFromCache: { ...returnedFromCache }
				});
				returnedFromCache = {};
			}
		});

		fetchTimeout = null;
	}, 500);
};

// self.addEventListener('backgroundfetchsuccess', (event) => {
//     const bgFetch = event.registration;

//     event.waitUntil(async function() {
//       // Create/open a cache.
//       const cache = await caches.open(cacheName);
//       // Get all the records.
//       const records = await bgFetch.matchAll();
//       // Copy each request/response across.
//       const promises = records.map(async (record) => {
//         const response = await record.responseReady;
//         console.log('putting ')
//         await cache.put(record.request, response);
//       });

//       // Wait for the copying to complete
//       await Promise.all(promises);

//       // Update the progress notification.
//     //   event.updateUI({ title: 'Episode 5 ready to listen!' });
//     }());
//   });
