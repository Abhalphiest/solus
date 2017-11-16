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
	var soundEffectsEnabled = true;

	obj.toggleBGMusic = function(){
		if(backgroundMusic.paused)
			backgroundMusic.play();
		else
			backgroundMusic.pause();
	};

	obj.setBGMusicVolume = function(value){
		backgroundMusic.volume = value;
	};

	// currently unused
	obj.setNextBGMusic = function(path){

	};

	obj.toggleAmbientSound = function(){
		if(ambientBackground.paused)
			ambientBackground.play();
		else
			ambientBackground.pause();
	};

	obj.setAmbientSoundVolume = function(value){
		ambientBackground.volume = value;
	};

	obj.toggleSoundEffects = function(){
		soundEffectsEnabled = !soundEffectsEnabled;
	};

	obj.setSoundEffectVolume = function(value){
		soundEffects.volume = value;
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

		ambientBackground.volume = .5; // default value? until options are set up
		ambientBackground.src = "assets/audio/ambient.mp3";
		ambientBackground.addEventListener('ended', function() {
    		this.currentTime = 0;
    		this.play();
		}, false);
		ambientBackground.play();
	});
	return obj;

}());