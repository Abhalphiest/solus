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
				var collider1 = object.sprite.colliders[0];
				var collider2 = projectile.sprite.colliders[0];
				var x1 = collider1.x + object.position.x;
				var y1 = collider1.y + object.position.y;
				var x2 = collider2.x + projectile.position.x;
				var y2 = collider2.y + projectile.position.y;
				if(rectCollision(x1,y1,collider1.width,collider1.height, object.angle, x2,y2,collider2.width,collider2.height, projectile.angle)){
					object.onCollision();
					projectile.destroy();
				}
			});

		});
	};
	

	function Rectangle(x,y,width,height,angle){
		
	};
	

	// checks to see if two rectangles are colliding (not necessarily axis aligned)
	// x1,y1 is top corner of first rectangle, w1,h1 is width and height of 1st rectangle
	// second rectangle analogous
	function rectCollision(x1,y1,w1, a1, h1,x2,y2,w2,h2, a2){
		

		return intersects(x1,w1,x2,w2) && intersects(y1,h1,y2,h2);
	}


	// checks to see if a given edge intersects another on one axis
	// (ie only x axis or only y axis)
	function intersects(p1, p2, q1, q2){
		var maxStartValue = Math.max(p1,q1);
		var minEndValue = Math.min(p2, q2);
		return maxStartValue < minEndValue;
	}
	

	return obj;
}());



