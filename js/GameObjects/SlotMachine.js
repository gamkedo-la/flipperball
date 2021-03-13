class SlotMachine extends GameObject {
    constructor(...props) {
        super(...props);
        this.isAnimating = false;
    }

    spin() {
        this.isAnimating = true;
    }

    updateAnimation(deltaTime) {
        if (!this.hasAnimation || !this.isAnimating) return;

        this.currTiming += deltaTime*4.3;

        if (this.currTiming >= this.frameTimes[this.currFrame]) {
            this.currTiming = 0;
            this.updateFrame();
        }
    }

}