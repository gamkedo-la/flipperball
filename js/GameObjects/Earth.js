class Earth extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
        this.startX = this.x;
        this.startY = this.y;
        this.speed = props[0].speed;
        this.orbitCenter = {x: props[0].centerX || this.x, y: props[0].centerY || this.y}
        this.orbitRadius = Math.sqrt(((this.center.x - this.orbitCenter.x) * (this.center.x - this.orbitCenter.x)) + ((this.center.y - this.orbitCenter.y) * (this.center.y - this.orbitCenter.y)))
        this.angle = Math.atan2((this.center.y - this.orbitCenter.y), (this.center.x - this.orbitCenter.x));
    }

    update (deltaTime) {
        super.update(deltaTime);
        if (this.isFinished) {
            this.active = false
        }

        this.angle += (this.speed * Math.PI * deltaTime / 1000);
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        }

        const cosAngle = Math.cos(this.angle);
        const sinAngle = Math.sin(this.angle);
        const deltaX = this.orbitCenter.x + this.orbitRadius * cosAngle - this.center.x;
        const deltaY = this.orbitCenter.y + this.orbitRadius * sinAngle - this.center.y;
        this.body.update(deltaX, deltaY);
        this.x += deltaX;
        this.y += deltaY;
    }
}