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
	var backgroundMusic = {
		element:undefined,
		paused:false
	};
	
	var ambientBackground  = {
		element:undefined,
		paused:false
	};
	var soundEffects  = {
		element:undefined,
		paused:false
	};

	obj.pauseBGMusic = function(){
		backgroundMusic.paused = true;
		backgroundMusic.element.pause();
	};

	obj.resumeBGMusic = function(){
		backgroundMusic.paused = false;
		backgroundMusic.element.play();
	};


	obj.setBGMusicVolume = function(value){
		backgroundMusic.element.volume = value;
	};

	// currently unused
	obj.setNextBGMusic = function(path){

	};

	obj.pauseAmbientSound = function(){
		ambientBackground.paused = true;
		ambientBackground.element.pause();
	};

	obj.resumeAmbientSound = function(){
		ambientBackground.paused = false;
		ambientBackground.element.play();
	};

	obj.setAmbientSoundVolume = function(value){
		ambientBackground.element.volume = value;
	};

	obj.setSoundEffectVolume = function(value){
		soundEffects.element.volume = value;
	};

	obj.registerSoundEffect = function(name, path){
		
	};

	obj.triggerSoundEffect = function(name){
		
	};

	addOnLoadEvent(function(){

		backgroundMusic.element = document.createElement("audio");
		ambientBackground.element = document.createElement("audio");
		soundEffects.element = document.createElement("audio");
		backgroundMusic.element.volume = .5; // default value? until options are set up
		backgroundMusic.element.src = "assets/audio/emptyReflections.mp3";
		backgroundMusic.element.addEventListener('ended', function() {
    		this.currentTime = 0;
    		this.play();
		}, false);

		ambientBackground.element.volume = .5; // default value? until options are set up
		ambientBackground.element.src = "assets/audio/ambient.mp3";
		ambientBackground.element.addEventListener('ended', function() {
    		this.currentTime = 0;
    		this.play();
		}, false);
		ambientBackground.element.play();
	});
	return obj;

}());