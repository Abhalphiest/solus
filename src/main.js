"use strict"

var solus = solus || {};
// -------------------------------------------------------------
//
// main.js contains the main game loop and initialization logic
//
// -------------------------------------------------------------

solus.main =(function(){

	var obj = {};
	var i = 0;

	obj.update = function(){
		solus.renderer.drawPlayerSprite(200,200,i);
		i += .01;
		window.requestAnimationFrame(obj.update);
	};

	return obj;
}());