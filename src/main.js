"use strict";

var solus = solus || {};
// -------------------------------------------------------------
//
// main.js contains the main game loop and initialization logic
//
// -------------------------------------------------------------

solus.main =(function(){

	var mainobj = {};
	var i = 0; // what is this used for?
	var animationRequestId;
	var encounter;

	var GameState = Object.freeze({
		GAMEPLAY: 0,
		MENU: 1,
		PAUSED: 2,
		GAMEOVER: 3,
		LOADING: 4
	});


	mainobj.gameState = GameState.LOADING; // we start loading first

	// all our resources are loaded when this is called

	mainobj.launch = function(){

		// prep things

		if(mainobj.gameState === GameState.LOADING){
			mainobj.gameState = GameState.MENU;
			solus.ui.mainMenu.show();
		}

		// prep stuff while we wait
 		this.encounters.startEncounter();

 		player.sprite = solus.renderer.getPlayerSprite();
 		solus.collision.addObject(player);

	}

	mainobj.start = function(){
		this.gameState = GameState.GAMEPLAY;
		solus.sound.toggleBGMusic();
		animationRequestId = window.requestAnimationFrame(this.update.bind(this));
	}

	mainobj.isPaused = function(){return this.gameState === GameState.PAUSED;};
	mainobj.pause = function(){
		if(this.gameState !== GameState.GAMEPLAY) // only pause gameplay, no need to pause a UI screen
			return;
		this.gameState = GameState.PAUSED; 
		solus.ui.pauseScreen.show();
		if(animationRequestId){
			window.cancelAnimationFrame(animationRequestId); 
			animationRequestId = undefined;
		}
	};
	mainobj.resume = function(){
		if(this.gameState !== GameState.MENU){
			this.gameState = GameState.GAMEPLAY; 
			solus.ui.pauseScreen.hide();
			if(!animationRequestId){
				animationRequestId = window.requestAnimationFrame(this.update.bind(this));
			}
		}
	};
	mainobj.openMenu = function(){
		this.pause();
		this.gameState = GameState.MENU;
	}
	mainobj.closeMenu = function(){
		this.gameState = GameState.PAUSED;
		this.resume();
	}
	window.onblur = mainobj.pause.bind(mainobj);
	window.onfocus = mainobj.resume.bind(mainobj);

	

	mainobj.update = function(){
		player.update();
		this.encounters.update(player.position.x, player);
		solus.collision.update();
		solus.renderer.render();
		animationRequestId = window.requestAnimationFrame(this.update.bind(this));
	};

	// ENCOUNTER MANAGEMENT

	mainobj.encounters = function(){
		var obj = {};
		var encounters = []; // actual encounters, but must have .load called on them to run.
		var tutorial = undefined;
		var currentEncounter = undefined;
		var currentProgress = 0;

		obj.endEncounter= function(){

		};

		obj.startEncounter = function(){
			tutorial.load();
			currentEncounter = tutorial;
		};

		var bgIndex = 1;
		obj.update = function(progress, player){
			//console.log(progress);
			if(progress > currentProgress);
				currentProgress = progress;

			if(bgIndex == 1 && currentProgress > 1000){
				bgIndex++;
				solus.renderer.changeBackground(bgIndex);
			}
			if(currentEncounter)
				currentEncounter.update(player);
		};

		// load encounters from json file
		addOnLoadEvent(function(){
			solus.loader.loadJSON("assets/encounters.json", function(data){
				tutorial = new Encounter(data.objects.tutorial);
				data.objects.encounters.forEach(function(encounterData){
					encounters.push(new Encounter(encounterData));
				});
			});	
		});

		return obj;
	}();

	// PLAYER LOGIC

	var CannonType = Object.freeze({
		FRONT: 0,
		MID: 1,
		BACK: 2,
	});
	var player = function(){
		var MAX_LASER_POWER = 100;
		var maxSpeed = 5;
		var obj = {
			position: new Vector(0, 500),
			velocity: new Vector(),
			acceleration: new Vector(),
			angle: 0,
			damageState: 0, // ranged from 0 to 5, no damage to destroyed
			accelerationDropoff: 1,
			activeCannon: 0, // front by default
			laserPower: MAX_LASER_POWER, // time in frames we can have lasers up for
			bullets: [],
			lasers:[],
			sprite: undefined,
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


				// accelerate
				this.velocity = vectorAdd(this.velocity, this.acceleration);

				// clamp speed
				this.velocity.clampLength(0,maxSpeed);
				// eventually stop drifting (once it is no longer noticeable movement) so we can check against 0
				if(this.velocity.getLength() < 0.1)
					this.velocity.setLength(0);
				
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
				solus.renderer.updatePlayerSprite(this.position.x,this.position.y, this.angle, emit);

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

				if(this.lasers.length === 0){
					// left side
					this.lasers[0] = new Laser(Math.PI/2,-Math.PI/(2*MAX_LASER_POWER)); // forward
					this.lasers[1] = new Laser(Math.PI/2,Math.PI/(2*MAX_LASER_POWER)); // backward
					// right side
					this.lasers[2] = new Laser(-Math.PI/2,Math.PI/(2*MAX_LASER_POWER)); // forward
					this.lasers[3] = new Laser(-Math.PI/2,-Math.PI/(2*MAX_LASER_POWER)); // backward
				}

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



	

	return mainobj;
}());