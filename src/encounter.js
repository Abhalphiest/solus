"use strict";

var solus = solus || {};

// --------------------------------
//
// encounter.js has a bunch of constructors / helper functions for encounters
// enemies, environments, objects, etc.
//
// ---------------------------------


// encounter constructor, takes a filepath for the .json file that has the encounter information
function Encounter(jsonpath){
	this.enemies = [];
	this.environmentObjects = [];
	this.backgroundIndex = 0;
	this.load = function(){

	};
	this.unload = function(){

	};
	this.update = function(){
		this.enemies.forEach(function(enemy){
			enemy.update();
		})
	};
}

// base object constructor, can be anything in the game world that isn't the player
function GameObject(){
	this.position = new Vector();
	this.velocity = new Vector();
	this.acceleration = new Vector();
	this.angle = 0;
	this.sprite = undefined;
	this.update = function(){

	};
	this.damage = function(){

	};
	this.destroy = function(){
	};
	this.onCollision = function(object){
		console.log('game object is colliding');
	};
}

// base enemy constructor
function Enemy(position, angle){

	var maxSpeed = 10;

	this.sprite = solus.renderer.createBasicEnemy();
	if(position)
		this.position = position;
	if(angle)
		this.angle = angle;
	this.update = function(){
		solus.renderer.updateObject(this.sprite, this.position, this.angle);
	}
	this.destroy = function(){
		this.sprite.destroy();
		solus.collision.removeObject(this);
	}
	solus.collision.addObject(this);
}



Enemy.prototype = new GameObject();
Enemy.prototype.constructor = Enemy;


// general AI functions

// moves smoothly in a random direction
function wander(){

}

// maneuvers towards an object
function seek(point){

}

// maneuvers to avoid an oncoming object
function avoid(object){

}

// maneuvers to turn and face given object
function target(object){

}

// checks to see if there are detectable nearby objects
function detect(objects){

}
