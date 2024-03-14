
export class MovementComponent {
	private speed: number 		= 0;
	private direction: number	= 0;
	private speedX: number		= 0;
	private speedY: number		= 0;
	private x: number					= 0;
	private y: number					= 0;
	
	//direction in radians
	constructor(speed: number, direction: number, x: number, y: number) {   
	  this.speed = speed;
	  this.direction = direction; 
	  this.speedX = speed * Math.cos(direction);
	  this.speedY = speed * Math.sin(direction);
	  this.x = x;
	  this.y = y;
	}

	public update(deltaTime: number) {
	  this.x += this.speedX * deltaTime * 100;
	  this.y += this.speedY * deltaTime * 100;
	}

	public setX(x: number) {
			  this.x = x;
	}
	
	public setY(y: number) {
			  this.y = y;
	}

	public setSpeedX(speed: number) {
	  this.speedX = speed;
		this.updateSpeedAndDirection();
	}

	public setSpeedY(speed: number) {
	  this.speedY = speed;
		this.updateSpeedAndDirection();
	}

	public setSpeed(speed: number) {
	  this.speed = speed;
	  this.speedX = speed * Math.cos(this.direction);
	  this.speedY = speed * Math.sin(this.direction);
	}

	public setDirection(direction: number) {
	  this.direction = direction;
		this.speedX = this.speed * Math.cos(direction);
		this.speedY = this.speed * Math.sin(direction);
	}

	public getX() {
	  return this.x;
	}

	public getY() {
	  return this.y;
	}

	public getDirection() {
	  return this.direction;
	}

	public getXdiretcion() {
	  return this.speedX < 0 ? -1 : 1;
	}

	public getYdiretcion() {
	  return this.speedY < 0 ? -1 : 1;
	}

	public getSpeed() {
		return this.speed;
	}

	public getSpeedX() {
		return this.speedX;
	}

	public getSpeedY() {
		return this.speedY;
	}

	public resetMovementComponent() {
		this.speed = 0;
		this.direction = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.x = 0;
		this.y = 0;
	}

	private updateSpeedAndDirection() {
		this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
		this.direction = Math.atan2(this.speedY, this.speedX);
	}
}
