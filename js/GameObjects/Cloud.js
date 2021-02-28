class Cloud extends GameObject {
    constructor(minX, maxX, ...props) {
        super(...props);
        this.minX = minX;
        this.maxX = maxX;
    }

    update (deltaTime) {
        super.update(deltaTime);
        this.x += this.velocity.x * deltaTime / 1000;
        if (this.x > this.maxX) {
            this.x = this.minX - this.width;
        }
    }
}