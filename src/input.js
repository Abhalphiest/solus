"use strict";

var solus = solus || {};

// --------------------------------
//
// input.js contains the logic for user input via mouse/keyboard
//
// ---------------------------------

var KEYS = Object.freeze({
	SHIFT: 16,
	ALT: 18,
	SPACE: 32,
	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,
	A: 65,
	D: 68,
	S: 83,
	W: 87
});

solus.input = (function(){
	var obj = {};

	var keydown = [];
	var keydowncallbacks = [];
	var keyupcallbacks = [];

	// keyboard event listeners
	window.addEventListener("keydown",function(e){
		if(keydown[e.keyCode] === false){
			if(keydowncallbacks[e.keyCode] !== undefined)
				keydowncallbacks[e.keyCode]();
		}
		if(e.keyCode === KEYS.ALT)
			e.preventDefault();
		keydown[e.keyCode] = true;
	});
	
	window.addEventListener("keyup",function(e){
		if(keydown[e.keyCode] === true){
			if(keyupcallbacks[e.keyCode] !== undefined)
				keyupcallbacks[e.keyCode]();
		}
		keydown[e.keyCode] = false;
	});

	obj.isKeyDown = function(key){
		if(keydown[key] === undefined) // the key has never been pressed
			return false;
		return keydown[key];
	};

	obj.setKeyDownCallback = function(key, f){
		if(keydowncallbacks[key] != undefined){ // allow for multiple callbacks on the same key
			var callback = keydowncallbacks[key];
			keydowncallbacks[key] = function(){
				callback();
				f();
			}
		}
		else
			keydowncallbacks[key] = f;
	}

	obj.setKeyUpCallback = function(key, f){
		if(keyupcallbacks[key] != undefined){ // allow for multiple callbacks on the same key
			var callback = keyupcallbacks[key];
			keyupcallbacks[key] = function(){
				callback();
				f();
			}
		}
		else
			keyupcallbacks[key] = f;
	};

	return obj;
}());