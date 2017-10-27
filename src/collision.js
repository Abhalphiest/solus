var solus = solus || {};

// -----------------------------------------
//
// collision.js reads in pentagonal (usually) colliders and uses them with the SAT (separating axis theorem) algorithm
// to detect collisions between objects, and raycasting to detect collisions between objects and projectiles
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
				if(raycast(projectile, object)){
					object.takeDamage(projectile.damage);
					projectile.destroy();
				}
			});

			var objectsCollidingWith = 0;
			// check for object collision
			objects.forEach(function(obj2){
				if(object === obj2)
					continue; // Collision against oneself is contraindicated by protocol.

				if(SAT(object, obj2)){
					objectsCollidingWith++;
					object.onCollision(obj2);
					obj2.onCollision(object);
				}
			});
		});
	};
	
	function raycast(projectile, object){

 		// pseudocode

 		//  count = 0
 		// foreach side in polygon:
 		//   if ray_intersects_segment(P,side) then
 		//     count = count + 1
 		// if is_odd(count) then
 		//   return inside
 		// else
 		//   return outside

 		return false;
	
	}


	function SAT(obj1, obj2){

		// pseudocode

		return false;

	}

	return obj;
}());



