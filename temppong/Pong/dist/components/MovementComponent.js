export class MovementComponent {
    speed = 0;
    direction = 0;
    speedX = 0;
    speedY = 0;
    x = 0;
    y = 0;
    constructor(speed, direction, x, y) {
        this.speed = speed;
        this.direction = direction;
        this.speedX = speed * Math.cos(direction);
        this.speedY = speed * Math.sin(direction);
        this.x = x;
        this.y = y;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    setSpeedX(speed) {
        this.speedX = speed;
        this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        this.direction = Math.atan2(this.speedY, this.speedX);
    }
    setSpeedY(speed) {
        this.speedY = speed;
        this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        this.direction = Math.atan2(this.speedY, this.speedX);
    }
    setSpeed(speed) {
        this.speed = speed;
        this.speedX = speed * Math.cos(this.direction);
        this.speedY = speed * Math.sin(this.direction);
    }
    setDirection(direction) {
        this.direction = direction;
    }
    getDirection() {
        return this.direction;
    }
    getXdiretcion() {
        return this.speedX < 0 ? -1 : 1;
    }
    getYdiretcion() {
        return this.speedY < 0 ? -1 : 1;
    }
    getSpeed() {
        return this.speed;
    }
    getSpeedX() {
        return this.speedX;
    }
    getSpeedY() {
        return this.speedY;
    }
    resetMovementComponent() {
        this.speed = 0;
        this.direction = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.x = 0;
        this.y = 0;
    }
}
