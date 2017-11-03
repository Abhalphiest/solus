"use strict";

// ----------------------------------------------------------------------
//
// assetLoader.js
//
// ----------------------------------------------------------------------


function loadJSON(filepath, callback){

	var request = new XMLHttpRequest();
	request.open('GET',filepath);
	request.responseType = 'json';
	request.send();
	request.onload = sendData;
	request.onerror = function(){console.log("error loading "+ filepath);};
	

	function sendData(){
		callback(request.response);
	}


}