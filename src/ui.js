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

	


	function Menu(id){
		this.element = document.querySelector(id);
		this.parent = undefined;
		this.show= function(){
			this.parent = obj.currentMenu;
			if(this.parent)
				this.parent.hide();
			this.element.style.display = "block";
			this.element.style.opacity = 1;
			obj.currentMenu = this;
		};
		this.hide= function(){
			this.element.style.opacity = 0;
			window.setTimeout(function(){this.element.style.display = "none";}.bind(this), 200);
			
		};
		this.close = function(){
			this.hide();
			if(this.parent){  // kind of a linked list hierarchy
				this.parent.show();
				this.parent = undefined;
			}
			else{ // if we have no parent, then we're the top menu and we close
				obj.currentMenu = undefined;
				solus.main.closeMenu();
			}
		}
	}


	addOnLoadEvent(function(){
		this.mainMenu = new Menu("#mainMenu");
		this.gameMenu = new Menu("#gameMenu");
		this.optionsMenu = new Menu("#optionsMenu");
		this.pauseScreen.element = document.querySelector("#pauseScreen");
		this.gameOverScreen.element = document.querySelector("#gameOverScreen");
		this.hud.element = document.querySelector("#hud");
		this.textOverlay.element = document.querySelector("#textOverlay");
		this.controlsScreen = new Menu("#controlsScreen");
		this.credits = new Menu("#creditsScreen");

		// set up onclick events for menus
		document.querySelector("#newGame").onclick = function(){
			this.mainMenu.hide();
			solus.main.start();
		}.bind(this);
		document.querySelector("#resumeGame").onclick = function(){
			this.gameMenu.close();
		}.bind(this);
		document.querySelector("#gameOptions").onclick = function(){
			this.optionsMenu.show();
		}.bind(this);
		document.querySelector("#mainOptions").onclick = function(){
			this.optionsMenu.show();
		}.bind(this);
		document.querySelector("#gameControls").onclick = function(){
			this.controlsScreen.show();
		}.bind(this);
		document.querySelector("#mainControls").onclick = function(){
			this.controlsScreen.show();
		}.bind(this);

		document.querySelector("#credits").onclick = function(){
			this.credits.show();
		}.bind(this);

		document.querySelector("#quitGame").onclick = function(){
			//solus.main.clear
		};


		solus.input.setKeyDownCallback(KEYS.ESCAPE, function(){ 
			if(this.currentMenu && this.currentMenu != this.mainMenu){
				this.currentMenu.close();
			}
		}.bind(this));
	}.bind(obj));

	return obj;
}());