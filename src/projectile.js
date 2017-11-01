"use strict";

function Projectile(){
	this.destroy = function(){
		// remove the sprite from the renderer
		this.sprite.destroy();

		// remove us from collision detection
		//solus.collisionSystem.removeProjectile(this);

		this.active = false;
		
	};
	this.update = function(){
		// no-op by default
	}
	this.boundingRect = {top: 0, left: 0, width: 0, height: 0};
	this.acceleration = new Vector();
	this.velocity = new Vector(); // will be a 0 vector
	this.position = new Vector();
	this.damage = 1;
	this.sprite = undefined;
	this.active = true;

	//solus.collisionSystem.addProjectile(this);
}

function Laser(angle, sweepIncrement){
	this.length = 0;
	if(angle){
		this.angle = angle;
	}
	else
		this.angle = 0; // angle from horizontal from the ship in radians
	this.acceleration = .2;
	this.endPoint = new Vector(); // position is the "origin" of the laser, end point is the "tip" of it, so to speak
	if(sweepIncrement){
		this.sweepIncrement = sweepIncrement;
	}
	else
		this.sweepIncrement = 0;
	this.sprite = solus.renderer.createLaser();
	this.update = function(position, sweep){
		if(position) // follow the ship
			this.position = position;
		this.velocity = vectorAdd(this.velocity, this.acceleration); // acceleration when first fired
		this.acceleration = this.acceleration.scale(.05);
		this.length = this.velocity.getLength();
		if(this.acceleration.getLength() < .001 && this.acceleration.getLength() != 0)
			this.acceleration.setLength(0);

		// calculate new end point
		if(sweep){
			this.angle += this.sweepIncrement; // if sweepIncrement wasn't passed in in the constructor, this does nothing
		}

		this.endPoint = vectorAdd(this.position, getUnitVectorFromAngle(this.angle).setLength(this.length));

		this.updateLaser(this.sprite,this.position, this.endPoint);

	}
}

function Bullet(position, direction){
	this.sprite = solus.renderer.createBullet();
	solus.renderer.updateBullet(this.sprite, position);
	this.position = position;
	this.acceleration = direction.scale(30);
	this.update = function(){
		if(! this.active)
			return;
		this.velocity = vectorAdd(this.acceleration, this.velocity);
		this.acceleration = this.acceleration.scale(.05);
		if(this.acceleration.getLength() < .001 this.acceleration.getLength() != 0)
			this.acceleration.setLength(0);
		this.position = vectorAdd(this.velocity, this.position);
		solus.renderer.updateBullet(this.sprite, this.position);
		if(this.acceleration.getLength() === 0)
			this.velocity = this.velocity.scale(.98);

		if(this.velocity.getLength() < .01)
		 	this.destroy();
	};
}

function EMP(){

}

Laser.prototype = new Projectile();
Laser.prototype.constructor = Laser;
Bullet.prototype = new Projectile();
Bullet.prototype.constructor = Bullet;
EMP.prototype = new Projectile();
EMP.prototype.constructor = EMP;