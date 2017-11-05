var solus = solus || {};

"use strict";

function Projectile(){
	this.destroy = function(){
		// remove the sprite from the renderer
		this.sprite.destroy();

		// remove us from collision detection
		solus.collision.removeProjectile(this);

		this.active = false;
		
	};
	this.update = function(){
		// no-op by default
	};
	this.onCollision = function(){

	};
	this.boundingRect = {top: 0, left: 0, width: 0, height: 0};
	this.acceleration = new Vector();
	this.velocity = new Vector(); // will be a 0 vector
	this.position = new Vector();
	this.damage = 1;
	this.sprite = undefined;
	this.active = true;
	solus.collision.addProjectile(this);


}

function Laser(angle, sweepIncrement){
	Projectile.call(this);
	this.type = "laser";
	this.length = 0;
	this.angle = angle; // angle from horizontal from the ship in radians
	this.acceleration = 30;
	this.velocity = 0;
	this.endPoint = new Vector(); // position is the "origin" of the laser, end point is the "tip" of it, so to speak
	if(sweepIncrement){
		this.sweepIncrement = sweepIncrement;
	}
	else
		this.sweepIncrement = 0;
	this.sprite = solus.renderer.createLaser();
	this.update = function(position, angle, sweep){
		this.position = position;
		this.velocity += this.acceleration; // acceleration when first fired
		this.acceleration *= .98;
		this.length = this.velocity;

		// calculate new end point
		if(sweep){
			this.angle += this.sweepIncrement; // if sweepIncrement wasn't passed in in the constructor, this does nothing
		}

		this.endPoint = vectorAdd(this.position, getUnitVectorFromAngle(this.angle+angle).setLength(this.length));

		solus.renderer.updateLaser(this.sprite,this.position, this.endPoint);

	};
}

function Bullet(position, direction){
	Projectile.call(this);
	this.type = "bullet";
	this.sprite = solus.renderer.createBullet();
	solus.renderer.updateBullet(this.sprite, position);
	this.position = position;
	this.acceleration = direction.scale(30);
	this.update = function(){
		if(! this.active)
			return;
		this.velocity = vectorAdd(this.acceleration, this.velocity);
		this.acceleration = this.acceleration.scale(.05);
		if(this.acceleration.getLength() < .001 && this.acceleration.getLength() != 0)
			this.acceleration.setLength(0);
		this.position = vectorAdd(this.velocity, this.position);
		solus.renderer.updateBullet(this.sprite, this.position);
		if(this.acceleration.getLength() === 0)
			this.velocity = this.velocity.scale(.98);

		if(this.velocity.getLength() < .01)
		 	this.destroy();
	};
	this.onCollision = function(){
		this.destroy();
	}
}

function EMP(){
	Projectile.call(this);
	this.type = "EMP";
}


Laser.prototype.constructor = Laser;
Bullet.prototype.constructor = Bullet;
EMP.prototype.constructor = EMP;