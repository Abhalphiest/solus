"use strict";

var solus = solus || {};
// -------------------------------------------------------------
//
// main.js contains the main game loop and initialization logic
//
// -------------------------------------------------------------

solus.main =(function(){

	var obj = {};
	var i = 0;
	var paused = false;
	var animationRequestId;

	obj.isPaused = function(){return paused;};
	obj.pause = function(){
		paused = true; 
		solus.ui.pauseScreen.show();
		if(animationRequestId){
			window.cancelAnimationFrame(animationRequestId); 
			animationRequestId = undefined;
		}
	};
	obj.resume = function(){
		if(!solus.ui.gameMenu.visible){
			paused = false; 
			solus.ui.pauseScreen.hide();
			if(!animationRequestId){
				animationRequestId = window.requestAnimationFrame(this.update.bind(this));
			}
		}
	};
	window.onblur = obj.pause.bind(obj);
	window.onfocus = obj.resume.bind(obj);

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
			laserPower: 100, // time in frames we can have lasers up for
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
				else{
					this.rechargeLasers();
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
				if(solus.input.isKeyDown(KEYS.W) || solus.input.isKeyDown(KEYS.UP_ARROW))
				{
					this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle))
				}
				else if(solus.input.isKeyDown(KEYS.S)|| solus.input.isKeyDown(KEYS.DOWN_ARROW)){
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
				if(solus.input.isKeyDown(KEYS.A)|| solus.input.isKeyDown(KEYS.LEFT_ARROW)){
					this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle-Math.PI/2).scale(turnScale));
				}
				else if(solus.input.isKeyDown(KEYS.D)|| solus.input.isKeyDown(KEYS.RIGHT_ARROW)){
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
				this.activeCannon++;
				this.activeCannon = this.activeCannon % 3; // avoid a branch, keep it in bounds
			},
			fireCannons: function(){
				console.log('fire ze cannons!');
				switch(this.activeCannon){
					case CANNON_TYPE.FRONT:
						console.log('shooting front cannons');
					break;

					case CANNON_TYPE.MID:
						console.log('shooting mid cannons');
					break;

					case CANNON_TYPE.BACK:
						console.log('shooting back cannons');
					break;
				}
			},
			fireLasers: function(){
				console.log('fire ze lasers! Laser power: ' + this.laserPower);
				this.laserPower--;
			},
			rechargeLasers: function(){
				if(this.laserPower < 100)
					this.laserPower++;
			},
			takeDamage: function(damage){

			},
			onCollision: function(object){

			}

		};
		addOnLoadEvent(function(){
				// set up things for shooting at things, because my bloodlust has yet to be slaked.

				// these need to be called with bind() because they unfortunately lose context when added to the
				// onload event, it seems?
				solus.input.setKeyDownCallback(KEYS.SPACE, obj.fireCannons.bind(obj));
				solus.input.setKeyDownCallback(KEYS.SHIFT, obj.switchCannons.bind(obj));
			}
		);

		return obj;

	}();



	obj.update = function(){
		player.update();
		solus.renderer.drawPlayerSprite(player.position.x,player.position.y, player.angle);
		animationRequestId = window.requestAnimationFrame(obj.update);
	};

	addOnLoadEvent(function(){
		solus.input.setKeyDownCallback(KEYS.ESCAPE, function(){ 
			if(this.isPaused()){
				solus.ui.gameMenu.hide();
				this.resume(); 
			}
			else{ 
				solus.ui.gameMenu.show();
				this.pause();
			}
		}.bind(obj));	
	}.bind(obj));
	
	

	return obj;
}());