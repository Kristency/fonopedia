const CACHE_STATIC_NAME = "static-v2";
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