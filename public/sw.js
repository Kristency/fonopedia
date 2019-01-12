const CACHE_STATIC_NAME = "static-v2";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const STATIC_FILES = [
	"/",
	"/views/index.ejs",
	"/js/regsw.js",
	"/js/promise.js",
	"/js/fetch.js",
	"https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
	"/stylesheets/app.css",
	"https://fonts.googleapis.com/icon?family=Material+Icons",
	"https://fonts.googleapis.com/css?family=Roboto:400,700",
	"/js/material.min.js"
];

function isInArray(string, array){
	let cachePath;
	if(string.indexOf(self.origin) === 0){
		cachePath = string.substring(self.origin.length);
	}else{
		cachePath = string;
	}
	return array.indexOf(cachePath) > -1;
}

self.addEventListener("install", (event)=>{
	console.log("[Service Worker] Installing Service Worker");
	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
		.then((cache)=>{
			console.log("[Service Worker] Precaching App Shell");
			cache.addAll(STATIC_FILES);
		})
	);
});

self.addEventListener("activate", (event)=>{
	console.log("[Service Worker] Activating Service Worker");
	event.waitUntil(
		caches.keys()
		.then((keyList)=>{
			return Promise.all(keyList.map((key)=>{
				if(key!==CACHE_STATIC_NAME && key!==CACHE_DYNAMIC_NAME){
					console.log("[Service Worker] Removing old cache", key);
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('fetch', (event) => {
	if(isInArray(event.request.url, STATIC_FILES)){
		event.respondWith(
			caches.match(event.request)
		);
	} else {
		event.respondWith(
		  caches.match(event.request)
			.then((response) => {
			  if (response) {
				return response;
			  } else {
					return fetch(event.request)
						.then((res) => {
							return caches.open(CACHE_DYNAMIC_NAME)
								.then(function (cache) {
									cache.put(event.request.url, res.clone());
									return res;
								})
						})
						.catch((err) => {
							return caches.open(CACHE_STATIC_NAME)
								.then(function (cache) {
									if (event.request.headers.get('accept').includes('text/html')) {
										return cache.match('/views/offline.html');
									}
								});
						});
			  }
			})
		);
	}
});