class RotatingGateObject extends GameObject {
    constructor(...props) {
        super(...props);
        DEBUG_LOG("[RotatingGameObject] Constructor");
        this.rotatingSpeed = 0;
        this.remainingRotatingScore = 0;
        this.rotatingCoefficient = 1;
        this.originalFrameTimes = 32;
        this.deltaTime = 0;
        this.currFrame = 0;
        this.isInReverse = false;
        this.isAnimating = true;
        this.isLeft = props[0].isLeft;
    }

    calculateRotatingCoefficient(){
        if(this.remainingRotatingScore == 0){
            this.rotatingCoefficient = 0;
        }else{
            this.rotatingCoefficient = 50 / this.remainingRotatingScore;
        }
        DEBUG_LOG("[RotatingGameObject] calculateRotatingCoefficient: rotatingCoefficient -> " + this.rotatingCoefficient);
    }

    updateCurrentFrameTime(){
        DEBUG_LOG("[RotatingGameObject] updateCurrentFrameTime: BEFORE originalFrameTimes[" + this.currFrame + "] -> " + this.originalFrameTimes);
        DEBUG_LOG("[RotatingGameObject] updateCurrentFrameTime: BEFORE frameTimes[" + this.currFrame + "] -> " + this.frameTimes[this.currFrame]);
                
        this.frameTimes[this.currFrame] = Math.round(this.originalFrameTimes*this.rotatingCoefficient);
    
        DEBUG_LOG("[RotatingGameObject] updateCurrentFrameTime: AFTER frameTimes[" + this.currFrame + "] -> " + this.frameTimes[this.currFrame]);
        DEBUG_LOG("[RotatingGameObject] updateCurrentFrameTime: AFTER originalFrameTimes -> " + this.originalFrameTimes);
    }


    resetRotatingGate(){
        for(var i = 0; i < this.frameTimes.length; i++){
            this.frameTimes[i] = this.originalFrameTimes;
        }
        this.remainingRotatingScore = 0;
        this.rotatingCoefficient = 1;
    }

    updateAnimationTiedToScore(remainingRotatingScore){
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
        DEBUG_LOG("[RotatingGameObject] updateAnimation: deltaTime -> " + deltaTime);
        DEBUG_LOG("[RotatingGameObject] updateAnimation: currTiming -> " + this.currTiming);
        DEBUG_LOG("[RotatingGameObject] updateAnimation: this.frameTimes[this.currFrame] -> " + this.frameTimes[this.currFrame]);
        if (this.currTiming >= (this.frameTimes[this.currFrame] || this.frameTimes[0])) {
            this.currTiming = 0;
            super.updateFrame();
        }
    }

    update(deltaTime){
        this.deltaTime = deltaTime;
    }
}