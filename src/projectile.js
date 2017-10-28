

function Projectile(){
	this.destroy = function(){
		// remove the sprite from the renderer
		this.sprite.destroy();

		// remove us from collision detection
		//solus.collisionSystem.removeProjectile(this);

		
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
	this.acceleration = direction.scale(40);
	this.update = function(){
		this.velocity = vectorAdd(this.acceleration, this.velocity);
		this.acceleration = this.acceleration.scale(.25);
		if(this.acceleration.getLength() < .001);
			this.acceleration.setLength(0);
		this.position = vectorAdd(this.velocity, this.position);
		solus.renderer.updateBullet(this.sprite, this.position);
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