"use strict";

var solus = solus || {};
// -------------------------------------------------------------
//
// main.js contains the main game loop and initialization logic
//
// -------------------------------------------------------------

solus.main =(function(){

	var obj = {};
	var i = 0; // what is this used for?
	var animationRequestId;

	var encounter;

	var GameState = Object.freeze({
		GAMEPLAY: 0,
		MENU: 1,
		PAUSED: 2,
		GAMEOVER: 3
	});


	obj.gameState = GameState.MENU; // we start on the start menu

	// for start code that requires certain modules to be loaded
	obj.start = function(){
		if(solus.renderer.initialized && solus.ui && solus.main && solus.input) // TODO: add more
		{
			console.log("starting game");
			encounter = new Encounter();
			encounter.enemies.push(new Enemy(new Vector(700,300), Math.PI/2));
			encounter.enemies.push(new Enemy(new Vector(200,100), -Math.PI));
			encounter.enemies.push(new Enemy(new Vector(900, 500), Math.PI/4));
			player.resetLasers();
			this.gameState = GameState.GAMEPLAY;
			this.update();
		}
		else{
			animationRequestId = window.requestAnimationFrame(this.start.bind(this));
		}
	}

	obj.isPaused = function(){return this.gameState === GameState.PAUSED;};
	obj.pause = function(){
		if(this.gameState !== GameState.GAMEPLAY) // only pause gameplay, no need to pause a UI screen
			return;
		this.gameState = GameState.PAUSED; 
		solus.ui.pauseScreen.show();
		if(animationRequestId){
			window.cancelAnimationFrame(animationRequestId); 
			animationRequestId = undefined;
		}
	};
	obj.resume = function(){
		if(this.gameState !== GameState.MENU){
			this.gameState = GameState.GAMEPLAY; 
			solus.ui.pauseScreen.hide();
			if(!animationRequestId){
				animationRequestId = window.requestAnimationFrame(this.update.bind(this));
			}
		}
	};
	obj.closeMenu = function(){
		this.gameState = GameState.PAUSED;
		this.resume();
	}
	window.onblur = obj.pause.bind(obj);
	window.onfocus = obj.resume.bind(obj);

	var CannonType = Object.freeze({
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
			collider:undefined,
			update: function(){

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

				var emit = false;

				// forward/backward acceleration
				if(solus.input.isKeyDown(KEYS.W) || solus.input.isKeyDown(KEYS.UP_ARROW))
				{
					this.acceleration = vectorAdd(this.acceleration, getUnitVectorFromAngle(this.angle))
					emit = true;
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



				// clamp speed
				this.velocity.clampLength(0,this.maxSpeed);
				// eventually stop drifting (once it is no longer noticeable movement) so we can check against 0
				if(this.velocity.getLength() < 0.1)
					this.velocity.setLength(0);

				// accelerate
				this.velocity = vectorAdd(this.velocity, this.acceleration);
				
				// if we're going forward
				if(this.velocity.getLength() != 0 && dotProduct(this.velocity, getUnitVectorFromAngle(this.angle)) >= 0){
					this.angle = this.velocity.getAngle();
				}

				// if we're going backward
				else if(this.velocity.getLength() > 0 && dotProduct(this.velocity, getUnitVectorFromAngle(this.angle)) < 0){
					this.angle = this.velocity.getAngle() + Math.PI;
				}

				// move the ship, presumably
				this.position = vectorAdd(this.position, this.velocity);
				solus.renderer.updatePlayerSprite(player.position.x,player.position.y, player.angle, emit);

				var removeIndices = []; // not even kind of worth it to try to remove things from the array as we iterate over it

				///if(this.velocity.getLength() !== 0){ // timestop

					this.bullets.forEach(function(bullet){
						bullet.update();
						if(!bullet.active){
							removeIndices.push(this.bullets.indexOf(bullet));
						}
					}.bind(this));

					removeIndices.forEach(function(index){
						this.bullets.splice(index, 1);
					}.bind(this));	

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

				//}

			},
			switchCannons: function(){
				if(solus.main.gameState !== GameState.GAMEPLAY)
					return;
				this.activeCannon++;
				this.activeCannon = this.activeCannon % 3; // avoid a branch, keep it in bounds
			},
			fireCannons: function(){
				if(solus.main.gameState !== GameState.GAMEPLAY)
					return;
				switch(this.activeCannon){
					case CannonType.FRONT:
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle).scale(16)), getUnitVectorFromAngle(this.angle)));
					break;

					case CannonType.MID:
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle  + Math.PI/2).scale(16)), getUnitVectorFromAngle(this.angle + Math.PI/2)));
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle  - Math.PI/2).scale(16)), getUnitVectorFromAngle(this.angle - Math.PI/2)));
					break;

					case CannonType.BACK:
						this.bullets.push(new Bullet(vectorAdd(this.position, getUnitVectorFromAngle(this.angle+Math.PI).scale(16)), getUnitVectorFromAngle(this.angle + Math.PI)));
					break;
				}
			},
			fireLasers: function(){
				if(solus.main.gameState !== GameState.GAMEPLAY)
					return;
				this.lasers.forEach(function(laser){
					laser.update(this.position, this.angle, solus.input.isKeyDown(KEYS.ENTER));
				}.bind(this));
				this.laserPower--;
				if(this.laserPower == 0)
					this.resetLasers();
			},
			rechargeLasers: function(){
				if(solus.main.gameState !== GameState.GAMEPLAY)
					return;
				if(this.laserPower < MAX_LASER_POWER)
					this.laserPower++;
			},
			resetLasers: function(){
				if(solus.main.gameState !== GameState.GAMEPLAY)
					return;
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
		if(encounter)// && player.velocity.getLength() !== 0)
			encounter.update();
		solus.renderer.render();
		animationRequestId = window.requestAnimationFrame(obj.update);
	};

	addOnLoadEvent(function(){
		solus.input.setKeyDownCallback(KEYS.ESCAPE, function(){ 
			if(this.gameState === GameState.MENU){
				if(solus.ui.currentMenu === solus.ui.gameMenu){
					solus.ui.gameMenu.hide();
					this.gameState = GameState.PAUSED;
					this.resume(); 
				}
				else if(solus.ui.currentMenu !== solus.ui.mainMenu){
					solus.ui.currentMenu.hide(); // will restore menu under it
				}
			}
			else{ 
				this.pause();
				this.gameState = GameState.MENU;
				solus.ui.gameMenu.show();
			}
		}.bind(obj));	
	}.bind(obj));
	
	

	return obj;
}());