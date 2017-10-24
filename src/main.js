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
		maxSpeed: 10,
		accelerationDropoff: 1,
		update: function(){
			if(solus.input.isKeyDown(KEYS.W))
			{
				this.acceleration = vectorAdd(this.acceleration, getNormalVectorFromAngle(this.angle))
			}
			else{
				this.acceleration.setLength(this.acceleration.getLength() - this.accelerationDropoff)
			}
			if(solus.input.isKeyDown(KEYS.A)){
				this.acceleration = vectorAdd(this.acceleration, getNormalVectorFromAngle(this.angle-Math.PI/2));
			}
			if(solus.input.isKeyDown(KEYS.S)){
				var oppForce = getNormalVectorFromAngle(-this.angle).setLength(.25);
				this.acceleration = vectorAdd(this.acceleration, oppForce);
			}
			if(solus.input.isKeyDown(KEYS.D)){
				this.acceleration = vectorAdd(this.acceleration, getNormalVectorFromAngle(this.angle+Math.PI/2));
			}

			this.acceleration.clampLength(0,.1);

			this.velocity = vectorAdd(this.velocity, this.acceleration);
			if(this.velocity.getLength() != 0)
				this.angle = this.velocity.getAngle();
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