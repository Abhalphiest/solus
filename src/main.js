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

	var encounter;

	obj.start = function(){
		if(solus.renderer.initialized && solus.ui && solus.main && solus.input) // TODO: add more
		{
			//console.dir(solus.renderer);
			console.log("starting game");
			encounter = new Encounter();
			encounter.enemies.push(new Enemy());
			player.resetLasers();
			this.update();
		}
		else{
			animationRequestId = window.requestAnimationFrame(this.start.bind(this));
		}
	}

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
		var MAX_LASER_POWER = 100;
		var obj = {
			position: new Vector(500, 500),
			velocity: new Vector(),
			acceleration: new Vector(),
			angle: 0,
			maxSpeed: 5,
			damageState: 0, // ranged from 0 to 5, no damage to destroyed
			accelerationDropoff: 1,
			activeCannon: 0, // front by default
			laserPower: MAX_LASER_POWER, // time in frames we can have lasers up for
			bullets: [],
			lasers:[],
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
				solus.renderer.updatePlayerSprite(player.position.x,player.position.y, player.angle);

				var removeIndices = []; // not even kind of worth it to try to remove things from the array as we iterate over it

				this.bullets.forEach(function(bullet){
					bullet.update();
					if(!bullet.active){
						removeIndices.push(this.bullets.indexOf(bullet));
					}
				}.bind(this));

				removeIndices.forEach(function(index){
					this.bullets.splice(index, 1);
				}.bind(this));	

			},
			switchCannons: function(){
				this.activeCannon++;
				this.activeCannon = this.activeCannon % 3; // avoid a branch, keep it in bounds
			},
			fireCannons: function(){
				switch(this.activeCannon){
					case CANNON_TYPE.FRONT:
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle).scale(16)), getUnitVectorFromAngle(this.angle)));
					break;

					case CANNON_TYPE.MID:
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle  + Math.PI/2).scale(16)), getUnitVectorFromAngle(this.angle + Math.PI/2)));
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle  - Math.PI/2).scale(16)), getUnitVectorFromAngle(this.angle - Math.PI/2)));
					break;

					case CANNON_TYPE.BACK:
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle+Math.PI).scale(16)), getUnitVectorFromAngle(this.angle + Math.PI)));
					break;
				}
			},
			fireLasers: function(){
				this.lasers.forEach(function(laser){
					laser.update(this.position, this.angle, solus.input.isKeyDown(KEYS.ENTER));
				}.bind(this));
				this.laserPower--;
				if(this.laserPower == 0)
					this.resetLasers();
			},
			rechargeLasers: function(){
				if(this.laserPower < MAX_LASER_POWER)
					this.laserPower++;
			},
			resetLasers: function(){
				this.lasers.forEach(function(laser){
					laser.destroy();
				});
				this.lasers.length = [];

				// left side
				this.lasers[0] = new Laser(Math.PI/2,-Math.PI/(2*MAX_LASER_POWER)); // forward
				this.lasers[1] = new Laser(Math.PI/2,Math.PI/(2*MAX_LASER_POWER)); // backward
				// right side
				this.lasers[2] = new Laser(-Math.PI/2,Math.PI/(2*MAX_LASER_POWER)); // forward
				this.lasers[3] = new Laser(-Math.PI/2,-Math.PI/(2*MAX_LASER_POWER)); // backward

			},
			takeDamage: function(damage){

			},
			onCollision: function(object){

			}

		};
		

		// set up input callbacks and other things that have to wait for everything to be loaded
		addOnLoadEvent(function(){
				// set up things for shooting at things, because my bloodlust has yet to be slaked.

				// these need to be called with bind() because they unfortunately lose context when added to the
				// onload event, it seems?
				solus.input.setKeyDownCallback(KEYS.SPACE, obj.fireCannons.bind(obj));
				solus.input.setKeyDownCallback(KEYS.SHIFT, obj.switchCannons.bind(obj));
				solus.input.setKeyUpCallback(KEYS.ALT, obj.resetLasers.bind(obj));
			}
		);

		return obj;

	}();



	obj.update = function(){
		player.update();
		if(encounter)
			encounter.update();
		solus.renderer.render();
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