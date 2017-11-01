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
	this.colliders = [];
	this.sprite = undefined;
	this.update = function(){

	};
	this.damage = function(){

	};
	this.destroy = function(){

	};
	this.onCollision = function(object){

	};
}

// base enemy constructor
function Enemy(position, angle){
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
	}
}



Enemy.prototype = new GameObject();
Enemy.prototype.constructor = Enemy;



