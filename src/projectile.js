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

function Laser(){
	this.length = 0;
	// acceleration when first fired
	this.acceleration = .2;
	this.update = function(){
		this.velocity = vectorAdd()
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
		if(this.acceleration.getLength() < .001);
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