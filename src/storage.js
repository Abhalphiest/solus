"use strict";

var solus = solus || {};
// -------------------------------------------------------------
//
// storage.js handles save/load operations on gamestate
//
// -------------------------------------------------------------


solus.storage = (function(){
	var obj = {};
	var storage = undefined; // set on onload

	// anatomy of a save file:
	// stage #
	// player state
	// game state



	obj.saveGame(){

	};

	obj.loadGame(){

	};

	addOnLoadEvent( function(){ storage = window.localStorage();});

	return obj;
}());