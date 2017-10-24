"use strict";

function Vector(x,y){
	if(x !== undefined) this.x = x;
	else this.x = 0;
	if(y !== undefined) this.y = y;
	else this.y = 0;

	this.getLength = function(){
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}

	this.normalized = function(){
		var length = this.getLength();
		if(length !== 0)
			return new Vector(this.x/length, this.y/length);
		else 
			return new Vector();
	}

	this.getAngle(){

	}

	this.scale(scalar){
		return new Vector(this.x*scalar, this.y*scalar);
	}
}

function getNormalVectorFromAngle(angle){
	return new Vector(Math.cos(angle),Math.sin(angle));
}

function vectorAdd(v1, v2){
	return new Vector(v1.x + v2.x, v1.y + v2.y);
}

function vectorSubtract(v1,v2){
	return new Vector(v1.x - v2.x, v1.y - v2.y);
}