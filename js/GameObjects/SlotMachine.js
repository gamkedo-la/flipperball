const SLOT_ANIMATION_SCALE = 7.0;
const SLOT_SPIN_DURATION = 1000;
const SLOTS = Object.freeze({"cherry":0, "seven":17, "theme":36, "hometeam":46});


class SlotMachine extends GameObject {
    constructor(...props) {
        super(...props);
        this.isAnimating = false;
        this.totalAnimationDuration = 0.0;
        this.choice = SLOTS.cherry;
    }

    spin() {
        var rand = Math.floor(Math.random() * Object.keys(SLOTS).length);
        this.choice = SLOTS[Object.keys(SLOTS)[rand]];
        this.isAnimating = true;
    }

    updateAnimation(deltaTime) {
        if (!this.hasAnimation || !this.isAnimating) return;

        this.currTiming += deltaTime*SLOT_ANIMATION_SCALE;
        this.totalAnimationDuration += deltaTime;

        if (this.totalAnimationDuration > SLOT_SPIN_DURATION) {
            if (this.currFrame == this.choice) {
                this.isAnimating = false;
                this.totalAnimationDuration = 0.0;
                return;
            }
        }

        if (this.currTiming >= (this.frameTimes[this.currFrame] || this.frameTimes[0])) {
            this.currTiming = 0;
            this.updateFrame();
        }
    }

    draw() {
        const thisFrameRect = this.getCurrentFrameRect();
        canvasContext.drawImage(this.animationSpritesheet,
            thisFrameRect.x, thisFrameRect.y, thisFrameRect.width, thisFrameRect.height,
            this.x, this.y, thisFrameRect.width * this.scale, thisFrameRect.height * this.scale);
    }

}