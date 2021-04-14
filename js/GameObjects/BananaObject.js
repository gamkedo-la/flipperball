class BananaObject extends GameObject {
    constructor(...props) {
        super(...props);
        this.currFrame = 0;
        this.isInReverse = false;
        this.isAnimating = true;
    }

    update (deltaTime) {
        super.update(deltaTime);
    }
}