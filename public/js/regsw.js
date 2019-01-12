if(!window.Promise){
	window.Promise = Promise;
	console.log("Promises implemented manually");
}

if("serviceWorker" in navigator){
	navigator.serviceWorker
	.register("/sw.js")
	.then(()=>{
		console.log("Service Worker Registered");
	});
}