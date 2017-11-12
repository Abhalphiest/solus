"use strict";

var solus = solus || {};

// --------------------------------
//
// encounter.js has a bunch of constructors / helper functions for encounters
// enemies, environments, objects, etc.
//
// ---------------------------------


// encounter constructor, takes a JSON object that has the encounter information
function Encounter(encounterObj){
	var obj = encounterObj;
	this.enemies = [];
	this.environmentObjects = [];
	this.backgroundIndex = 0;
	this.load = function(){
		obj.enemies.forEach(function(enemy){
			switch(enemy.type){
				case "light":
					this.enemies.push(new lightEnemy(enemy.position,enemy.angle));
				break;
				case "mid":
					this.enemies.push(new midEnemy(enemy.position,enemy.angle));
				break;
				case "heavy":
					this.enemies.push(new heavyEnemy(enemy.position,enemy.angle));
				break;
			}
		}.bind(this));
		obj.objects.forEach(function(object){
			switch(object.type){
				case "asteroid":
					this.environmentObjects.push(new DestructibleObject(object.position,object.angle));
				break;
				case "debris":

				break;
			}
		}.bind(this));
	};
	this.unload = function(){
		this.enemies.forEach(function(enemy){
			enemy.destroy();
		});
		this.environmentObjects.forEach(function(object){
			object.destroy();
		});

	};
	this.update = function(player){
		this.enemies.forEach(function(enemy){
			if(enemy.active)
				enemy.update(player);
			
		})
		this.environmentObjects.forEach(function(object){
			object.update;
		});

	};
}

// base object constructor, can be anything in the game world that isn't the player
function GameObject(){
	this.active = true;
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
	this.onCollision = function(){

	};
	solus.collision.addObject(this);
	
}

function DestructibleObject(position, angle){


}

function IndestructibleObject(position, angle){

}

// base enemy constructor
function Enemy(position, angle){
	GameObject.call(this);
	this.state = "passive";

	if(position)
		this.position = position;
	if(angle)
		this.angle = angle;
	this.ai = function(player,state){
		
	};

	this.update = function(player){
		
		this.ai(player);
		this.acceleration.clampLength(0,.1);
		this.velocity = vectorAdd(this.acceleration, this.velocity);
		this.velocity.clampLength(0, this.maxSpeed);

		this.position = vectorAdd(this.velocity, this.position);
		if(this.velocity.getLength() !== 0)
			this.angle = this.velocity.getAngle();
		solus.renderer.updateObject(this.sprite, this.position, this.angle);
	}
	this.destroy = function(){
		this.sprite.destroy();
		solus.collision.removeObject(this);
		this.active = false;
	}
	this.onCollision = function(object){
		console.log('game object is colliding');
		//this.destroy();
	};
}


function lightEnemy(position, angle){
	Enemy.call(this,position,angle);
	this.sprite = solus.renderer.createLightEnemy();
	this.maxSpeed = 7;
	this.visibilityAngle = 0;

	this.ai = function(player){
		this.acceleration.x = 0;
		this.acceleration.y = 0;
		
		switch(this.state){
			case "passive":
				if(detect.call(this, player))
					this.state = "pursuing";
			break;
			case "pursuing":
				var pursueForce = pursue.call(this, player.position);
				this.acceleration = vectorAdd(this.acceleration, pursueForce);
			break;
			case "pinning":

			break;
			case "searching":

			break;
		}
		
	};

}

function midEnemy(position,angle){
	Enemy.call(this,position,angle);
	this.sprite = solus.renderer.createMidEnemy();
	this.maxSpeed = 3;

}

function heavyEnemy(position,angle){
	Enemy.call(this,position,angle);
	this.sprite = solus.renderer.createHeavyEnemy();
	this.maxSpeed = 1;
}


Enemy.prototype.constructor = Enemy;


// general AI functions

// canvasses a given area trying to make visual contact with the player.
function search(cluePoint){


}

// maneuvers towards an object, but does not collide with it
function pursue(point){
	var toVec = vectorSubtract(point, this.position);
	var force = vectorSubtract(toVec, this.velocity);
	return force;
}

// maneuvers to avoid an oncoming object
function avoid(object){

}

// maneuvers to turn and face given object, where "face" might be slightly misleading (might be pointing a weapon at them depending on type of ship)
function target(object){

}

// checks to see if the parameter object is detectable
// (ie visible and nearby, or something similar)
function detect(object){

	// is it in front of us?
	var front = getUnitVectorFromAngle(this.angle);
	var right = getUnitVectorFromAngle(this.angle-Math.PI/2);
	var toVec = vectorSubtract(object.position, this.position).normalized(); 	// normalizing so the dot product is just cos(theta)
	 																		  	// where theta is the angle from our forward vector
	var frontDot = dotProduct(front,toVec);
	var sideDot  = dotProduct(right,toVec);

	// if in front of us
	if(frontDot > 0){
		// if within visibility
		var angle = Math.acos(sideDot);
		if(angle >= this.visibilityAngle && angle <= Math.PI - this.visibilityAngle){
			return true;
		}

		return false;
	}

}

// resets detection and returns to formation
function abandon(){

}

