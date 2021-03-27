class Plunger extends GameObject {
    constructor(...props) {
        super(...props)

        this.PULL_SPEED = 300;
        this.RELEASE_SPEED = 1200;
        this.objData = props[0];
        this.contractAnimation = props[2];
        this.releaseAnimation = props[3];
        for (const prop of this.objData.properties) {
            const {name, value} = prop;
            if (name === 'stop') {
                this.stop = value;
            }
        }
        this.input = ALIAS.PLUNGER;

        this.reflectedVelocity = 15;
        this.velocityRatio = 0;
        this.positionRatio = 0;
        this.isContracted = false;
        this.isContracting = false;
        this.startY = this.body.center.y;
        this.DELTA_POS = this.stop - this.startY;
    }

    update(deltaTime) {
        const oldY = this.body.center.y;
        let newY = this.body.center.y;
        if (heldButtons.includes(this.input)) {
            newY += this.PULL_SPEED * (deltaTime / 1000);
            if (newY > this.stop) {
                newY = this.stop
            }
            this.velocityRatio = 0;
            this.positionRatio = (newY - (this.objData.y - this.objData.height)) / this.DELTA_POS;
        } else if (newY > this.startY) {
            newY -= this.RELEASE_SPEED * (deltaTime / 1000);
            if (newY < this.objData.y - this.objData.height) {
                newY = this.objData.y - this.objData.height;
                this.positionRatio = 0;
            }
            if (this.velocityRatio === 0) {
                this.velocityRatio = this.positionRatio;
            }
        } else {
            this.velocityRatio = 0;
        }

        this.body.update(0, newY - oldY);

        if (!this.animation) {
            this.animation = this.releaseAnimation;
            this.currFrame = this.animation.frames[this.animation.frames.length - 1]; // current frame index
            this.currTiming = 0; //ms passed per frame
            this.frames = this.animation.frames || [0]; //array of frame indexes to use for this animation
            this.frameTimes = this.animation.frameTimes || [64]; //array of milliseconds to show each frame        
        } else if (heldButtons.includes(this.input)) {
            if (this.animation === this.releaseAnimation) {
                this.animation = this.contractAnimation
                this.currFrame = 0; // current frame index
                this.currTiming = 0; //ms passed per frame
                this.frames = this.animation.frames || [0]; //array of frame indexes to use for this animation
                this.frameTimes = this.animation.frameTimes || [64]; //array of milliseconds to show each frame        
            }
            this.isContracting = true;
            this.isContracted = true;
            this.isAnimating = true;
            this.updateAnimation(deltaTime);
        } else {
            if (this.animation === this.contractAnimation) {
                this.animation = this.releaseAnimation
                this.currFrame = 0; // current frame index
                this.currTiming = 0; //ms passed per frame
                this.frames = this.animation.frames || [0]; //array of frame indexes to use for this animation
                this.frameTimes = this.animation.frameTimes || [64]; //array of milliseconds to show each frame        
            }

            this.isContracting = false;
            this.isContracted = false;
            this.isAnimating = true;
            this.updateAnimation(deltaTime);
        }
    }
}