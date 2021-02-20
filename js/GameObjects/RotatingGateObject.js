class RotatingGateObject extends GameObject {
    constructor(...props) {
        super(...props);
        this.rotatingSpeed = 0;
        this.rotatingCoefficient = 1;
        this.originalFrameTimes = this.frameTimes.slice();
    }

    calculateRotatingCoefficient(){
        this.rotatingCoefficient = 100 / this.rotatingSpeed;
        if(DEBUG){
            console.log("[RotatingGameObject] calculateRotatingCoefficient: rotatingCoefficient -> " + this.rotatingCoefficient);
        }
    }

    updateFrameTimes(){
        if(DEBUG){
            console.log("[RotatingGameObject] updateFrameTimes: BEFORE frameTimes[0] -> " + this.frameTimes[0]);
        }
        for(var i = 0; i < this.frameTimes.length; i++){
            this.frameTimes[i] = Math.round(this.originalFrameTimes[i]*this.rotatingCoefficient);
        }
        if(DEBUG){
            console.log("[RotatingGameObject] updateFrameTimes: AFTER frameTimes[0] -> " + this.frameTimes[0]);
        }
    }

    animate(frame, ballSpeed){
        this.rotatingSpeed = Math.round(ballSpeed);
        this.frameTimes = this.originalFrameTimes.slice();
        this.calculateRotatingCoefficient();
        if(DEBUG){
            console.log("[RotatingGameObject] animate: rotatingSpeed -> " + this.rotatingSpeed);
        }
        super.animate(frame);
    }

    updateAnimation(deltaTime) {
        if (!this.hasAnimation || !this.isAnimating || this.rotatingSpeed == 0) return;
        //Update the frameTime values depending on the ballSpeed and reduce the ballSpeed
        this.updateFrameTimes();

        this.currTiming += deltaTime;

        if (this.currTiming >= this.frameTimes[this.currFrame]) {
            this.currTiming = 0;
            super.updateFrame();
        }

        this.rotatingSpeed --;
        this.calculateRotatingCoefficient();
    }
}