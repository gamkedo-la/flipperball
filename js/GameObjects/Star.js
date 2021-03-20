class Star extends GameObject {
    constructor(minY, maxY, ...props) {
        super(...props);
        this.minY = minY;
        this.maxY = maxY;
        this.isAnimating = true;
        this.currFrame = Math.floor(this.frames.length * Math.random());
        this.frameTimes[0] += (Math.floor((this.frameTimes[0] / 2) * Math.random()) - Math.floor(this.frameTimes[0]/4));
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