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

			//solus.renderer.renderPolygon(collider);
			
			// check against projectiles
			for(var j = 0; j < projectiles.length; j++){
				var projectile = projectiles[j];

				switch(projectile.type){
					case "bullet":
						if(checkPointCollision(projectile.position, collider)){
							projectile.onCollision();
							object.onCollision();
							console.log("collision detected");
						}
					break;

					 case "laser":
					 	if(checkLineCollision(projectile.position, projectile.endPoint,collider)){
					// 		projectile.onCollision();
					 		object.onCollision();
							console.log("collision detected");
					 	}
					 break;

					// case "EMP":
					// 	if(checkPointCollision(projectile.position, object.sprite.colliders)){
					// 		projectile.onCollision();
					// 		object.onCollision();
					// 	}
					// break;
				}
			}

			//check against objects that haven't already been checked
			for(var k = i+1; k < objects.length; k++){
				var object2 = objects[k];
				var collider2 = rotatePolygon(object2.sprite.collider, object2.angle);
				collider2.forEach(function(vertex){
					vertex.x += object2.position.x;
					vertex.y += object2.position.y;
				});
				if(checkObjectCollision(collider, collider2)){
					console.log('collision');
					//object.onCollision();
					//object2.onCollision();
				}
			}

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

		var c1normals = getPolygonNormals(collider1);
		var c2normals = getPolygonNormals(collider2);

		// now the separating axis theorem test
		var colliding = true;


		// for each of the first set of normals
		c1normals.forEach(function(axis){
			// project each vertex on to the axis
			var maxProjection1 = -Infinity;
			var minProjection1 = Infinity;
			var maxProjection2 = -Infinity;
			var minProjection2 = Infinity;
			var projectedMag;
			collider1.forEach(function(vertex){
				projectedMag = dotProduct(vertex,axis);
				if(projectedMag < minProjection1)
					minProjection1 = projectedMag;
				if(projectedMag > maxProjection1)
					maxProjection1 = projectedMag;
			});
			collider2.forEach(function(vertex){
				projectedMag = dotProduct(vertex,axis);
				if(projectedMag < minProjection2)
					minProjection2 = projectedMag;
				if(projectedMag > maxProjection2)
					maxProjection2 = projectedMag;
			});
			if(maxProjection1 < minProjection2 || maxProjection2 < minProjection1)
				colliding =  false; // there is a gap between the polygons, no collision

		});

		c2normals.forEach(function(axis){
			// project each vertex on to the axis
			var maxProjection1 = -Infinity;
			var minProjection1 = Infinity;
			var maxProjection2 = -Infinity;
			var minProjection2 = Infinity;
			var projectedMag;
			collider1.forEach(function(vertex){
				projectedMag = dotProduct(vertex,axis);
				if(projectedMag < minProjection1)
					minProjection1 = projectedMag;
				if(projectedMag > maxProjection1)
					maxProjection1 = projectedMag;
			});
			collider2.forEach(function(vertex){
				projectedMag = dotProduct(vertex,axis);
				if(projectedMag < minProjection2)
					minProjection2 = projectedMag;
				if(projectedMag > maxProjection2)
					maxProjection2 = projectedMag;
			});

			if(maxProjection1 < minProjection2 || maxProjection2 < minProjection1)
				colliding =  false; // there is a gap between the polygons, no collision

		});
		return colliding; // they are colliding if we got through all the axes


		
	}

	function checkLineCollision(startPoint, endPoint, collider){
		for(var i = 0; i < collider.length; i++){
			var nextpoint = i + 1 < collider.length? collider[i+1] : collider[0];
			if(intersects(startPoint,endPoint,collider[i], nextpoint))
				return true;
		}

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

	function intersects(q1, q2, q3, q4) {
		var p1, p2, p3, p4;
		if(q2.x < q1.x){
			p1 = q2;
			p2 = q1;
		}
		else{
			p1 = q1;
			p2 = q2;
		}

		if(q4.x < q3.x){
			p3 = q4;
			p4 = q3;
		}
		else{
			p3 = q3;
			p4 = q4;
		}
	  	return (turn(p1, p3, p4) != turn(p2, p3, p4)) && (turn(p1, p2, p3) != turn(p1, p2, p4));
	}
	

	return obj;
}());

function rotatePolygon(polygon, angle){
	var rotatedPolygon = [];
	for(var i = 0; i < polygon.length; i++){
		var vec = new Vector(polygon[i].x,polygon[i].y);
		vec = vec.rotate(angle);
		rotatedPolygon.push({x:vec.x, y: vec.y});
	}

	return rotatedPolygon;
}


// could do something much simpler for rectangles,
// but making this as abstract as possible to allow for
// generic polygon colliders in the future
function getPolygonNormals(polygon){
	var normals = [];
	for(var i = 0; i < polygon.length-1; i++){
		var edge = vectorSubtract(polygon[i+1], polygon[i]);
		normals.push(getOrthoNormalVector(edge));	
	}
	normals.push(getOrthoNormalVector(vectorSubtract(polygon[0], polygon[polygon.length-1])));
	return normals;
	
}



