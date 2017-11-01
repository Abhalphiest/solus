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

	};
}

// base object constructor, can be anything in the game world that isn't the player
function Object(){
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
}

// base enemy constructor
function Enemy(){
	this.sprite = solus.renderer.createBasicEnemy();
	this.position = new Vector(700, 300);
	this.update = function(){
		solus.renderer.updateObject(this.sprite, this.position, this.angle);
	}
	this.destroy = function(){
		this.sprite.destroy();
	}
}



Enemy.prototype = new Object();
Enemy.prototype.constructor = Enemy;



