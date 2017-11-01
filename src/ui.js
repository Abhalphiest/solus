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

	obj.gameMenu = {
		element: undefined,
		show: function(){
			this.element.style.opacity = 1;
			this.visible = true;
		},
		hide: function(){
			this.element.style.opacity = 0;
			this.visible = false;
		},
		visible: false,
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

	obj.textOverlay = {
		element: undefined,
	}

	obj.controlsScreen = {
		element: undefined,
		show: function(){
			this.element.style.opacity = 1;
		},
		hide: function(){
			this.element.style.opacity = 0;
		}
	}

	addOnLoadEvent(function(){
		this.mainMenu.element = document.querySelector("#mainMenu");
		this.gameMenu.element = document.querySelector("#gameMenu");
		this.pauseScreen.element = document.querySelector("#pauseScreen");
		this.gameOverScreen.element = document.querySelector("#gameOverScreen");
		this.hud.element = document.querySelector("#hud");
		this.textOverlay.element = document.querySelector("#textOverlay");
		this.controlsScreen.element = document.querySelector("#controlsScreen");
	}.bind(obj));

	return obj;
}());