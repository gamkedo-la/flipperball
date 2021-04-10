class Bubble extends GameObject {
    constructor(minY, maxY, ...props) {
        super(...props);
        this.minY = minY;
        this.maxY = maxY;
        this.velocity.y += Math.random() * this.velocity.y / 2;
    }

    update (deltaTime) {
        super.update(deltaTime);
        this.y += this.velocity.y * deltaTime / 1000;
        if (this.y > this.maxY) {
            this.y = this.minY - this.height;
        }
    }
}