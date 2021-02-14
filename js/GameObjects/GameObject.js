class GameObject {
    /**
    * @param {Object} objData
    * @param {Object} [bodyData]
    * @param {Object} [animationData]
    */
    constructor(objData, bodyData = {}, animationData = {}) {
        this.type = objData.type;
        this.name = objData.name;

        this.width = objData.width;
        this.height = objData.height;
        this.scale = 1;

        this.x = objData.x;
        this.oldX = objData.x;
        this.xAdjustment = 0;
        this.y = objData.y - objData.height;
        this.oldY = objData.y - objData.height;
        this.yAdjustment = 0;
        
        this.velocity = {x: 0, y: 0};
        this.oldVelocity = {x: 0, y: 0};
        this.vxAdjustment = 0;
        this.vyAdjustment = 0;

        this.reflectance = objData.reflectance || 1;
        this.score = objData.properties ? objData.properties[0].value : 0;

        this.sprite = objData.sprite || images[objData.name];
        this.animationSpritesheet = animationData.animationSpritesheet;

        this.isAnimating = animationData.isAnimating || false;
        this.frameWidth = animationData.frameWidth || 0;
        this.frameHeight = animationData.frameHeight || 0;
        this.currFrame = 0; // current frame index
        this.currTiming = 0; //ms passed per frame
        this.frames = animationData.frames || [0]; //array of frame indexes to use for this animation
        this.frameTimes = animationData.frameTimes || [64]; //array of milliseconds to show each frame
        this.reverses = animationData.reverses || false; //boolean indicates if animation reverses (true)
        this.loops = animationData.loops || false; //boolean indicates if animation loops (true) 
        this.hasMotionTrail = false; // draw this object with a motion trail
        this.trailPositions = []; // array of previous object positions to be used to maintain the trail
        this.motionTrailLength = 20; // default trail length of 20

        if (bodyData) {
          this.body = new CollisionBody(bodyData);
          this.center = this.body.center;
        }

        if (this.hasAnimation) {
            this.initializeAnimationProps();
        }
    }

    /** @type {Boolean} */
    get hasAnimation() {
        return this.frames.length > 0 && this.animationSpritesheet !== undefined;
    }

    /** @type {Number} */
    get timeRemainingOnFrame() {
        return this.frameTimes[this.currFrame] - this.currTiming;
    }

    /** @type {Number} */
    get framesPerRow() {
        return Math.round(this.animationSpritesheet.width / this.frameWidth);
    }

    /**
    * @interface
    */
    initializeAnimationProps() {
        if (this.frameTimes.length === this.frames.length) {
            return;
        }

        const newFrameTimes = this.frames.map((frame, idx) => frameTimes[0] || 64);
        this.frameTimes = newFrameTimes;
    }

    /**
    * @param {Number} deltaTime
    * @interface
    */
    update(deltaTime) {
        this.oldVelocity.x = this.velocity.x;
        this.oldVelocity.y = this.velocity.y;

        const deltaX = this.velocity.x * deltaTime / 1000;
        const deltaY = this.velocity.y * deltaTime / 1000;

        const newX = this.x + deltaX;
        const newY = this.y + deltaY;
        
        this.setPosition(newX, newY);

        this.updateAnimation(deltaTime);
    }

    /**
    * @param {Number} deltaTime
    * @interface
    */
    updateAnimation(deltaTime) {
        if (!this.hasAnimation || !this.isAnimating) return;

        this.currTiming += deltaTime;

        if (this.currTiming >= this.frameTimes[this.currFrame]) {
            this.currTiming = 0;
            this.updateFrame();
        }
    }

    /**
    * @param {Number} x
    * @param {Number} y
    * @interface
    */
    setPosition(x, y) {
        this.oldX = this.x;
        this.oldY = this.y;
        this.x = x;
        this.y = y;
        this.body.update(this.x - this.oldX, this.y - this.oldY);
    }

    /** @interface */
    draw() {
        if (this.hasMotionTrail) {
            this.trailPositions.push({ x: this.x, y: this.y });
            if (this.trailPositions.length > this.motionTrailLength) {
                this.trailPositions.shift();
            }
            
            for (var i = 0; i < this.trailPositions.length; i++){
                canvasContext.drawImage(this.sprite, this.trailPositions[i].x, this.trailPositions[i].y, this.width, this.height);
            }
        }
        if (this.isAnimating) {
            const thisFrameRect = this.getCurrentFrameRect();
            canvasContext.drawImage(this.animationSpritesheet, 
                                    thisFrameRect.x, thisFrameRect.y, thisFrameRect.width, thisFrameRect.height,
                                    this.x, this.y, thisFrameRect.width * this.scale, thisFrameRect.height * this.scale);

        } else {
            canvasContext.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }

        if (this.body) {
          this.body.draw();
        }
    }

    /** @interface */
    animate(frame) {
        this.currFrame = Number.isInteger(frame) ? frame : this.currFrame;
        this.isInReverse = false;
        this.isAnimating = true;
    }

    /** @interface */
    resolveCollisions() {}

    /** @interface */
    respondsTo() {}

    /** @interface */
    respondToCircularCollision() {}

    /** @interface */
    respondToPolygonCollision() {}

    /** @interface */
    willCollideWith() {}

    /** @interface */
    didCollideWith() {}

    /**
     * gets the next frame while handling the parameters
     */
    updateFrame() {
        let newFrameIndex;
        if(this.isInReverse) {
            newFrameIndex = this.currFrame - 1;
            if(newFrameIndex < 0) {
                if (this.loops) {
                    this.isInReverse = false;
                    newFrameIndex = this.currFrame + 1;
                } else {
                    this.isAnimating = false;
                    newFrameIndex = 0;
                }                
            } 
        } else {
            newFrameIndex = this.currFrame + 1;
            if(newFrameIndex >= this.frames.length) {
                if(this.reverses) {
                    newFrameIndex = this.currFrame - 1;
                    this.isInReverse = true;
                } else if(this.loops) {
                    newFrameIndex = 0;
                } else {
                    this.isAnimating = false;
                    newFrameIndex = 0;
                }
            }
        }

        this.currFrame = newFrameIndex;
    }

    /**
     * 
     */
    getCurrentFrameRect() {
        const nowFrameIndex = this.frames[this.currFrame];
        const xClipPos = this.frameWidth * (nowFrameIndex % this.framesPerRow);
        const yClipPos = this.frameHeight * (Math.floor(nowFrameIndex / this.framesPerRow));
        return {x:xClipPos, y:yClipPos, width:this.frameWidth, height:this.frameHeight};
    }
}