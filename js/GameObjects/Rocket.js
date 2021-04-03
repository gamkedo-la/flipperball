class Rocket extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
        this.acceleration = 0;
        this.speed = 0;
        this.xSpawn = this.x;
        this.ySpawn = this.y;
    }

    update (deltaTime, bonusActivated) {
        super.update(deltaTime);
        if (bonusActivated) {
            this.acceleration = 1;
            this.isAnimating = true;
            this.x = this.xSpawn + 19;
        }

        this.speed += this.acceleration;
        if (this.speed > 0) {
            this.y -= this.speed * deltaTime / 1000;
        }
        
        if (this.y < -this.height) {
            this.acceleration = 0;
            this.speed = 0;
            this.y = this.ySpawn;
            this.isAnimating = false;
            this.x = this.xSpawn;
        }
    }
}