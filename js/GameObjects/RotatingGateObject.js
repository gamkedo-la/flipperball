class RotatingGateObject extends GameObject {
    constructor(...props) {
        super(...props);
        this.rotatingSpeed = 0;
        this.remainingRotatingScore = 0;
        this.rotatingCoefficient = 1;
        this.originalFrameTimes = this.frameTimes.slice();
        this.deltaTime = 0;
        this.currFrame = 0;
        this.isInReverse = false;
        this.isAnimating = true;
    }

    calculateRotatingCoefficient(){
        if(this.remainingRotatingScore == 0){
            this.rotatingCoefficient = 0;
        }else{
            this.rotatingCoefficient = 100 / this.remainingRotatingScore;
        }
        if(DEBUG){
            console.log("[RotatingGameObject] calculateRotatingCoefficient: rotatingCoefficient -> " + this.rotatingCoefficient);
        }
    }

    updateCurrentFrameTime(){
        if(DEBUG){
            console.log("[RotatingGameObject] updateCurrentFrameTime: BEFORE frameTimes[" + this.currFrame + "] -> " + this.frameTimes[this.currFrame]);
        }
        
        this.frameTimes[this.currFrame] = Math.round(this.originalFrameTimes[this.currFrame]*this.rotatingCoefficient);
        
        if(DEBUG){
            console.log("[RotatingGameObject] updateCurrentFrameTime: AFTER frameTimes[" + this.currFrame + "] -> " + this.frameTimes[this.currFrame]);
        }
    }


    resetRotatingGate(){
        this.frameTimes = this.originalFrameTimes.slice();
        this.remainingRotatingScore = 0;
        this.rotatingCoefficient = 1;
    }

    updateAnimationTiedToScore(remainingRotatingScore){
        //this.updateFrameTimes();
        this.remainingRotatingScore = remainingRotatingScore;
        this.calculateRotatingCoefficient();
        this.updateCurrentFrameTime();
        this.updateAnimation(this.deltaTime);
    }

    updateAnimation(deltaTime) {
        if (!this.hasAnimation || !this.isAnimating || this.remainingRotatingScore == 0){
            return;
        }
        //Update the frameTime values depending on the ballSpeed and reduce the ballSpeed

        this.currTiming += deltaTime;
        if(DEBUG){
            console.log("[RotatingGameObject] updateAnimation: deltaTime -> " + deltaTime);
            console.log("[RotatingGameObject] updateAnimation: currTiming -> " + this.currTiming);
            console.log("[RotatingGameObject] updateAnimation: this.frameTimes[this.currFrame] -> " + this.frameTimes[this.currFrame]);
        }
        if (this.currTiming >= this.frameTimes[this.currFrame]) {
            this.currTiming = 0;
            super.updateFrame();
        }
    }

    update(deltaTime){
        this.deltaTime = deltaTime;
    }
}