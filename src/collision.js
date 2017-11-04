"use strict";

var solus = solus || {};

// -----------------------------------------
//
// collision.js
//
// -----------------------------------------

solus.collision = (function (){
	var obj = {};

	var projectiles = [];
	var objects = [];

	// accessors for the arrays
	obj.addProjectile = function(projectile){
		projectiles.push(projectile);
	}

	obj.removeProjectile = function(projectile){
		var index = projectiles.indexOf(projectile);
		projectiles.splice(index, 1); // splice edits in place
	};

	obj.addObject = function(object){
		objects.push(object);
	};

	obj.removeObject = function(object){
		var index = objects.indexOf(object);
		objects.splice(index,1);
	};

	// main collision logic
	obj.update = function(){

		for(var i = 0; i < objects.length; i++){

			var object = objects[i];

			// check against projectiles
			for(var j = 0; j < projectiles.length; j++){
				var projectile = projectiles[j];

				switch(projectile.type){
					case "bullet":
						if(checkPointCollision(projectile.position, object.sprite.colliders)){
							projectile.onCollision();
							object.onCollision();
						}
					break;

					case "laser":
						if(checkLineCollision(projectile.position, projectile.endPoint,object.sprite.colliders)){
							projectile.onCollision();
							object.onCollision();
						}
					break;

					case "EMP":
						if(checkPointCollision(projectile.position, object.sprite.colliders)){
							projectile.onCollision();
							object.onCollision();
						}
					break;
				}
			}

			//check against objects that haven't already been checked
			for(var k = i+1; k < objects.length; i++){
				var object2 = objects[k];
				if(checkObjectCollision(object.sprite.colliders, object2.sprite.colliders)){
					object.onCollision();
					object2.onCollision();
				}
			}

		}
	};
	

	function checkPointCollision(point, colliders){
		return false;
	}
	

	function checkObjectCollision(colliders1, colliders2){
		// checks bounding circles first, to cull out all obvious non-collisions

		return false;
		// now the separating axis theorem test
	}

	function checkLineCollision(startPoint, endPoint, colliders){
		return false;
	}


	// checks to see if a given line segment intersects another on one axis
	// (ie only x axis or only y axis)
	function intersects(p1, p2, q1, q2){
		var maxStartValue = Math.max(p1,q1);
		var minEndValue = Math.min(p2, q2);
		return maxStartValue < minEndValue;
	}
	

	return obj;
}());



