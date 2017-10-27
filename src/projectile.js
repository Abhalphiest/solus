

function Projectile(){
	this.destroy = function(){
		// remove the sprite from the renderer


		// remove us from collision detection
		solus.collisionSystem.removeProjectile(this);

		// wow this feels like a bad idea, let's roll with it
		this = undefined;
	};
	this.update = function(){
		// no-op by default
	}
	this.boundingRect = {top: 0, left: 0, width: 0, height: 0};
	this.acceleration = new Vector();
	this.velocity = new Vector(); // will be a 0 vector
	this.damage = 1;

	solus.collisionSystem.addProjectile(this);
}

function Laser(){
	this.length = 0;
	// acceleration when first fired
	this.acceleration = .2;
	this.update = function(){
		this.velocity = vectorAdd()
	}
}

function Bullet(){

}

function EMP(){

}

Laser.prototype = new Projectile();
Laser.prototype.constructor = Laser;
Bullet.prototype = new Projectile();
Bullet.prototype.constructor = Bullet;
EMP.prototype = new Projectile();
EMP.prototype.constructor = EMP;