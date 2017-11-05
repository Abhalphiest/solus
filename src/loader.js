"use strict";

var solus = solus || {};

// ----------------------------------------------------------------------
//
// loader.js handles initialization and startup procedures, asset loading,
// synchronization of module startup, etc.
//
// ----------------------------------------------------------------------

function addOnLoadEvent(f){

		var prevOnLoad = window.onload;
		if( typeof window.onload != 'function'){
			window.onload = f;
		}
		else{
			window.onload = function(){
				f();
				if(prevOnLoad){ // first function in, last function called. important for implementation.
					prevOnLoad();
				}
			}
		}
};


// because of the way addOnLoadEvent is written, this is guaranteed to be the last
// onload function called
function init(){
	solus.loader.load();
}
window.onload = init;

solus.loader = function(){
	var obj = {};

	var loadCount = 0;
	var assetsStarted = false;
	var assetsLoading = 0;	

	obj.load = function(){

		// wait on resource loading, both from JSON and from PIXI
		if(loadCount != 0 || !assetsStarted || assetsLoading != 0)
			window.requestAnimationFrame(this.load);
		else
			solus.main.launch();

	}.bind(obj);

	obj.loadJSON = function(filepath, callback){

		loadCount++; //not going to worry about the thread safety problem of using normal
					// increment/decrement.. therein lies madness and there's no true parallelism
					// going on here so far as I know that isn't managed
		var request = new XMLHttpRequest();
		request.open('GET',filepath);
		request.responseType = 'json';
		request.send();
		request.onload = onResponseReceived;
		request.onerror = function(){console.log("error loading "+ filepath);};
		

		function onResponseReceived(){
			//console.log(callback);
			callback(request.response);
			loadCount--;
		}
	}

	obj.loadAsset = function(resource, next){
		assetsStarted = true;
		//console.log('loading asset');
		assetsLoading++;
		next();
	}
	obj.finalizeAsset = function(){
		//console.log('finalizing asset');
		assetsLoading--;
	};

	return obj;
}();



