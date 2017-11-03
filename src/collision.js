"use strict";

var solus = solus || {};

// -----------------------------------------
//
// collision.js
//
// -----------------------------------------

solus.collisionSystem = (function (){
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
	}

	obj.addObject = function(object){
		objects.push(object);
	};

	obj.removeObject = function(object){
		var index = objects.indexOf(object);
		objects.splice(index,1);
	};

	// main collision logic
	obj.update = function(){

		objects.forEach(function(object){
			// check for projectile collision
			projectiles.forEach(function(projectile){
				
			});

			var objectsCollidingWith = 0;
			// check for object collision
			objects.forEach(function(obj2){
				if(object === obj2)
					continue; // Collision against oneself is contraindicated by protocol.

				
			});
		});
	};
	

	

	// checks to see if two rectangles are colliding (not necessarily axis aligned)
	// x1,y1 is top corner of first rectangle, w1,h1 is width and height of 1st rectangle
	// second rectangle analogous
	function rectCollision(x1,y1,w1,h1,x2,y2,w2,h2){
		return intersects(x1,w1,x2,w2) && intersects(y1,h1,y2,h2);
	}

	function circleRectCollision(x1,y1,w,h,x2,y2,rad){
		
	}

	// checks to see if a given edge intersects another on one axis
	// (ie only x axis or only y axis)
	function intersects(p1, delta1, p2, delta2){
		var maxStartValue = Math.max(p1,p2);
		var minEndValue = Math.min(p1+delta1, p2+delta2);
		return maxStartValue < minEndValue;
	}
	

	return obj;
}());



