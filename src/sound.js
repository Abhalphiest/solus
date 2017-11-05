"use strict";

var solus = solus || {};

// ------------------------------
//
// sound.js contains, surprisingly enough, all the sound logic
//
// ----------------------------

// requirements: background music, sound effects

solus.sound = (function(){

	var obj = {};
	var backgroundMusic = undefined;
	var ambientBackground = undefined;
	var soundEffects = undefined;

	obj.toggleBGMusic = function(){

	};

	obj.setBGMusicVolume = function(){

	};

	obj.setNextBGMusic = function(path){

	};

	obj.toggleAmbientSound = function(){

	};

	obj.setAmbientSoundVolume = function(){

	};

	obj.toggleSoundEffects = function(){

	};

	obj.setSoundEffectVolume = function(){

	};

	obj.registerSoundEffect = function(name, path){

	};

	obj.triggerSoundEffect = function(name){

	};

	addOnLoadEvent(function(){

		backgroundMusic = document.createElement("audio");
		ambientBackground = document.createElement("audio");
		soundEffects = document.createElement("audio");
		backgroundMusic.volume = .5; // default value? until options are set up
		backgroundMusic.src = "assets/audio/emptyReflections.mp3";
		backgroundMusic.addEventListener('ended', function() {
    		this.currentTime = 0;
    		this.play();
		}, false);
		backgroundMusic.play();

	});
	return obj;

}());