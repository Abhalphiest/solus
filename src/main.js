"use strict"

var solus = solus || {};
// -------------------------------------------------------------
//
// main.js contains the main game loop and initialization logic
//
// -------------------------------------------------------------

solus.main =(function(){

	var obj = {};
	var i = 0;

	var player = {
		position: new Vector(500, 500),
		velocity: new Vector(),
		acceleration: new Vector(),
		angle: 0,
		maxSpeed: 5,
		accelerationDropoff: 1,
		update: function(){

			// forward/backward acceleration
			if(solus.input.isKeyDown(KEYS.W))
			{
				this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle))
			}
			else if(solus.input.isKeyDown(KEYS.S)){
				this.acceleration = getUnitVectorFromAngle(this.angle).negation();
			}
			else{
				this.acceleration = new Vector();
				this.velocity = this.velocity.scale(.97);
			}
			this.acceleration.clampLength(0,.1);


			var turnScale = Math.max(this.velocity.getLength()-.5, 0)/35;
			// side to side acceleration
			if(solus.input.isKeyDown(KEYS.A)){
				this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle-Math.PI/2).scale(turnScale));
			}
			else if(solus.input.isKeyDown(KEYS.D)){
				this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle+Math.PI/2).scale(turnScale));
			}

			

			this.velocity = vectorAdd(this.velocity, this.acceleration);
			//console.log(dotProduct(this.velocity, getUnitVectorFromAngle(this.angle)));
			if(this.velocity.getLength() != 0 && dotProduct(this.velocity, getUnitVectorFromAngle(this.angle)) >= 0)
				this.angle = this.velocity.getAngle();
			else if(this.velocity.getLength() > 0 && dotProduct(this.velocity, getUnitVectorFromAngle(this.angle)) < 0){
				this.angle = this.velocity.getAngle() + Math.PI;
			}			
			this.velocity.clampLength(0,this.maxSpeed);
			if(this.velocity.getLength() < 0.1)
				this.velocity.setLength(0);
			this.position = vectorAdd(this.position, this.velocity);

		}

	};

	obj.update = function(){
		player.update();
		solus.renderer.drawPlayerSprite(player.position.x,player.position.y, player.angle);
		window.requestAnimationFrame(obj.update);
	};

	return obj;
}());