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

	var player = {
		position: new Vector(),
		velocity: new Vector(),
		acceleration: new Vector(),
		update: function(){
			
		}
	};

	obj.update = function(){
		solus.renderer.drawPlayerSprite(200,200,i);
		i += .01;
		window.requestAnimationFrame(obj.update);
	};

	return obj;
}());