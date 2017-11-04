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

	obj.currentMenu = undefined;

	obj.mainMenu = {
		element: undefined,
		show: function(){
			this.element.style.display = "block";
			this.element.style.opacity = 1;
		},
		hide: function(){
			this.element.style.opacity = 0;
			window.setTimeout(function(){this.element.style.display = "none";}.bind(this), 200);
		}
	};

	obj.gameMenu = {
		element: undefined,
		show: function(){
			this.element.style.display = "block";
			this.element.style.opacity = 1;
			obj.currentMenu = this;
		},
		hide: function(){
			this.element.style.opacity = 0;
			window.setTimeout(function(){this.element.style.display = "none";}.bind(this), 200);
		},
	};

	obj.pauseScreen = {
		element: undefined,
		show: function(){
			this.element.style.display = "block";
			this.element.style.opacity = 1;
		},
		hide: function(){
			this.element.style.opacity = 0;
			window.setTimeout(function(){this.element.style.display = "none";}.bind(this), 200);
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
	};

	obj.options = {
		element: undefined,
		show: function(parent){
			this.parent = parent;
			this.element.style.display = "block";
			this.element.style.opacity = 1;
			obj.currentMenu = this;
		},
		hide: function(){
			this.element.style.opacity = 0;
			window.setTimeout(function(){this.element.style.display = "none";}.bind(this), 200);
			if(this.parent)
				this.parent.show();

		},
		parent: undefined
	};

	obj.controlsScreen = {
		element: undefined,
		show: function(parent){
			this.parent = parent;
			this.element.style.display = "block";
			this.element.style.opacity = 1;
			obj.currentMenu = this;
		},
		hide: function(){
			this.element.style.opacity = 0;
			window.setTimeout(function(){this.element.style.display = "none";}.bind(this), 200);
			if(this.parent)
				this.parent.show();
		},
		parent: undefined
	};



	addOnLoadEvent(function(){
		this.mainMenu.element = document.querySelector("#mainMenu");
		this.gameMenu.element = document.querySelector("#gameMenu");
		this.pauseScreen.element = document.querySelector("#pauseScreen");
		this.gameOverScreen.element = document.querySelector("#gameOverScreen");
		this.hud.element = document.querySelector("#hud");
		this.textOverlay.element = document.querySelector("#textOverlay");
		this.controlsScreen.element = document.querySelector("#controlsScreen");

		// set up onclick events for menus
		document.querySelector("#newGame").onclick = function(){
			this.mainMenu.hide();
			solus.main.start();
		}.bind(this);
		document.querySelector("#resumeGame").onclick = function(){
			this.gameMenu.hide();
			solus.main.closeMenu();
		}.bind(this);
		document.querySelector("#gameOptions").onclick = function(){
			//this.gameMenu.hide();
			//this.options.show(this.gameMenu);
		}.bind(this);
		document.querySelector("#gameControls").onclick = function(){
			this.gameMenu.hide();
			this.controlsScreen.show(this.gameMenu);
		}.bind(this);
	}.bind(obj));

	return obj;
}());