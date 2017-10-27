"use strict";

var solus = solus || {};

// --------------------------------
//
// ui.js contains all the ui logic, including splash screens, text overlays, buttons,
// HUD, etc. Basically all non-diagetic material.
//
// ---------------------------------

// He who fights with IIFE's should look to it that he himself does not become an IIFE. And if you gaze long
// into javascript, javascript also gazes into you. - Friedrich Nietzche, completely accurate quote

solus.ui = (function(){
	var obj = {};

	obj.mainMenu = {
		element: undefined,
	};

	obj.pauseScreen = {
		element: undefined,
		show: function(){
			this.element.style.opacity = 1;
		},
		hide: function(){
			this.element.style.opacity = 0;
		}
	};

	obj.gameOverScreen = {
		element: undefined,
	};

	obj.hud = {
		element: undefined,
	};

	addOnLoadEvent(function(){
		this.pauseScreen.element = document.querySelector("#pauseScreen");
	}.bind(obj));

	return obj;
}());