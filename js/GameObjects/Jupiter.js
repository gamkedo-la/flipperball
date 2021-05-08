class Jupiter extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
        this.startX = this.x;
        this.startY = this.y;
        this.speed = props[0].speed;
        this.orbitCenter = {x: props[0].centerX || this.x, y: props[0].centerY || this.y}
        this.orbitRadius = Math.sqrt(((this.center.x - this.orbitCenter.x) * (this.center.x - this.orbitCenter.x)) + ((this.center.y - this.orbitCenter.y) * (this.center.y - this.orbitCenter.y)))
        this.angle = Math.atan2((this.y - this.orbitCenter.y), (this.x - this.orbitCenter.x));
        this.timeSinceScore = 0;
        this.initialScore = this.score;
    }

    update (deltaTime) {
        super.update(deltaTime);
        this.timeSinceScore += deltaTime;
        if (this.timeSinceScore > 200) {
            this.score = this.initialScore;
        }
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

    getScore () {
        let response = this.score;
        if (this.score > 0) {
            this.timeSinceScore = 0;
            this.score = 0;
        }

        return response;
    }
}