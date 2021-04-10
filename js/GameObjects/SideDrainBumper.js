class SideDrainBumper extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
    }

    update (deltaTime, bonusActivated) {
        if (bonusActivated) {
            this.active = true
        }
        super.update(deltaTime);
        if (this.isFinished) {
            this.active = false
        } 
    }

    draw () {
        if (this.active) {
            super.draw();
        }
    }
}