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

	var CANNON_TYPE = Object.freeze({
		FRONT: 0,
		MID: 1,
		BACK: 2,
	});
	var player = function(){
		var obj = {
			position: new Vector(500, 500),
			velocity: new Vector(),
			acceleration: new Vector(),
			angle: 0,
			maxSpeed: 5,
			damageState: 0, // ranged from 0 to 5, no damage to destroyed
			accelerationDropoff: 1,
			activeCannon: 0, // front by default
			laserPower: 100,
			update: function(){

				// -------------------------------
				//
				// LASER-US 
				//
				// --------------------------------

				if(solus.input.isKeyDown(KEYS.ALT)){
					// release the kracken!
					if(this.laserPower > 0){
						this.fireLasers();
					}
				}

				// --------------------------------
				//
				// COLLISION AND THINGS, I GUESS
				//
				// --------------------------------

				var damaged = false;

				// Check to see if we hit another object in the scene

				// Check to see if a bullet hit us ( rude )

				// Change out our sprite to reflect how offended we are by the damage done to us 
				// by this cruel, cruel world
				if(damaged)
					this.takeDamage();


				// --------------------------------
				//
				// MOVEMENT
				//
				// --------------------------------

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

				// turning acceleration is proportional to how fast you're going
				var turnScale = Math.max(this.velocity.getLength()-.5, 0)/35;
				// side to side acceleration
				if(solus.input.isKeyDown(KEYS.A)){
					this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle-Math.PI/2).scale(turnScale));
				}
				else if(solus.input.isKeyDown(KEYS.D)){
					this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle+Math.PI/2).scale(turnScale));
				}

				// accelerate
				this.velocity = vectorAdd(this.velocity, this.acceleration);
				
				// if we're going forward
				if(this.velocity.getLength() != 0 && dotProduct(this.velocity, getUnitVectorFromAngle(this.angle)) >= 0)
					this.angle = this.velocity.getAngle();

				// if we're going backward
				else if(this.velocity.getLength() > 0 && dotProduct(this.velocity, getUnitVectorFromAngle(this.angle)) < 0){
					this.angle = this.velocity.getAngle() + Math.PI;
				}

				// clamp speed
				this.velocity.clampLength(0,this.maxSpeed);
				// eventually stop drifting (once it is no longer noticeable movement) so we can check against 0
				if(this.velocity.getLength() < 0.1)
					this.velocity.setLength(0);

				// move the ship, presumably
				this.position = vectorAdd(this.position, this.velocity);

			},
			switchCannons: function(){
				console.log('switch ze cannons!');
				console.dir(this);
				console.dir(obj);
				console.log(this.activeCannon);
				this.activeCannon++;
				console.log(this.activeCannon);
				this.activeCannon = this.activeCannon % 3; // avoid a branch, keep it in bounds
				console.log(this.activeCannon);
			},
			fireCannons: function(){
				console.log('fire ze cannons!');
				switch(this.activeCannon){
					case CANNON_TYPE.FRONT:

					break;

					case CANNON_TYPE.MID:

					break;

					case CANNON_TYPE.BACK:


					break;
				}
			},
			fireLasers: function(){
				console.log('fire ze lasers! Laser power: ' + this.laserPower);
				this.laserPower--;
			},
			takeDamage: function(damage){

			},
			onCollision: function(object){

			}

		};
		addOnLoadEvent(function(){
				// set up things for shooting at things, because my bloodlust has yet to be slaked.
				solus.input.setKeyDownCallback(KEYS.SPACE, obj.fireCannons);
				solus.input.setKeyDownCallback(KEYS.SHIFT, obj.switchCannons);
			}
		);

		return obj;

	}();



	obj.update = function(){
		player.update();
		solus.renderer.drawPlayerSprite(player.position.x,player.position.y, player.angle);
		window.requestAnimationFrame(obj.update);
	};

	return obj;
}());