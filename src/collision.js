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
			var collider = rotatePolygon(object.sprite.collider, object.angle);
			collider.forEach(function(vertex){
				vertex.x += object.position.x;
				vertex.y += object.position.y;
			});

			solus.renderer.renderPolygon(collider);
			
			// check against projectiles
			for(var j = 0; j < projectiles.length; j++){
				var projectile = projectiles[j];

				switch(projectile.type){
					case "bullet":
						if(checkPointCollision(projectile.position, collider)){
							//projectile.onCollision();
							//object.onCollision();
							console.log("collision detected");
						}
					break;

					// case "laser":
					// 	if(checkLineCollision(projectile.position, projectile.endPoint,object.sprite.colliders)){
					// 		projectile.onCollision();
					// 		object.onCollision();
					// 	}
					// break;

					// case "EMP":
					// 	if(checkPointCollision(projectile.position, object.sprite.colliders)){
					// 		projectile.onCollision();
					// 		object.onCollision();
					// 	}
					// break;
				}
			}

			//check against objects that haven't already been checked
			// for(var k = i+1; k < objects.length; i++){
			// 	var object2 = objects[k];
			// 	if(checkObjectCollision(object.sprite.colliders, object2.sprite.colliders)){
			// 		object.onCollision();
			// 		object2.onCollision();
			// 	}
			// }

		}
	};

	function getMinimumXY(polygon){
		var minX = polygon[0].x;
		var minY = polygon[0].y

		for(var i = 1; i < polygon.length; i++){
			if(polygon[i].x < minX)
				minX = polygon[i].x;
			if(polygon[i].y < minY)
				minY = polygon[i].y;
		}
		return {x:minX, y:minY};
	}

	function checkPointCollision(point, collider){

		// create a line from outside the collider to the point
		var minpoint = getMinimumXY(collider);
		minpoint.x-= 20;
		minpoint.y-=35; // must be outside of the polygon

		// start point of line is minpoint, end point is point

		// see how many edges this vector intersects
		// if even, the point is outside
		// if odd, the point is inside
		//solus.renderer.drawLine(minpoint,point);
		var intersectsCount = 0;

		for(var i = 0; i < collider.length; i++){
			var nextpoint = i + 1 < collider.length? collider[i+1] : collider[0];
			if(intersects(minpoint,point,collider[i], nextpoint))
				intersectsCount++;
		}

		//console.log(intersectsCount);

		return intersectsCount % 2 != 0;
	}
	

	function checkObjectCollision(collider1, collider2){
		// checks bounding circles first, to cull out all obvious non-collisions

		return false;
		// now the separating axis theorem test
	}

	function checkLineCollision(startPoint, endPoint, collider){
		return false;
	}


	function turn(p1, p2, p3) {
	  var a = p1.x; 
	  var b = p1.y; 
	  var c = p2.x; 
	  var d = p2.y;
	  var e = p3.x; 
	  var f = p3.y;
	  var A = (f - b) * (c - a);
	  var B = (d - b) * (e - a);
	  return (A > B) ? 1 : (A  < B) ? -1 : 0;
	}

	function intersects(p1, p2, p3, p4) {
	  return (turn(p1, p3, p4) != turn(p2, p3, p4)) && (turn(p1, p2, p3) != turn(p1, p2, p4));
	}
	

	return obj;
}());

function getPolygonEdges(polygon){

}

function rotatePolygon(polygon, angle){
	var rotatedPolygon = [];
	for(var i = 0; i < polygon.length; i++){
		var vec = new Vector(polygon[i].x,polygon[i].y);
		vec = vec.rotate(angle);
		rotatedPolygon.push({x:vec.x, y: vec.y});
	}

	return rotatedPolygon;
}



