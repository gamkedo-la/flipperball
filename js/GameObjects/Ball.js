const squaredDistance = function (x1, y1, x2, y2) {
    return (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
}
class Ball extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4; //Average of half width and half height
        this.triggersCollided = {};
        this.hasMotionTrail = true;
    }

    update(deltaTime) {
        this.oldX = this.x;
        this.oldY = this.y;
        this.xAdjustment = 0;
        this.yAdjustment = 0;
        this.oldVelocity.x = this.velocity.x;
        this.oldVelocity.y = this.velocity.y;
        this.vxAdjustment = 0;
        this.vyAdjustment = 0;

        this.velocity.y += GRAVITY * deltaTime / 1000;

        const speed = Math.sqrt((this.velocity.x) * (this.velocity.x) + (this.velocity.y) * (this.velocity.y));
        if (speed > MAX_BALL_SPEED) {
            this.velocity.x = this.velocity.x * (MAX_BALL_SPEED / speed);
            this.velocity.y = this.velocity.y * (MAX_BALL_SPEED / speed);
        }

        const deltaX = this.velocity.x * deltaTime / 1000;
        const deltaY = this.velocity.y * deltaTime / 1000;
        this.x += deltaX;
        this.y += deltaY;
        this.body.update(deltaX, deltaY);
    }

    setPosition(x, y) {
        this.oldX = this.x;
        this.oldY = this.y;
        this.x = x;
        this.y = y;
        this.body.update(this.x - this.oldX, this.y - this.oldY);
        this.oldX = this.x;
        this.oldY = this.y;
    }

    /**
     * estimates based on velocity what the ball's next position will be
     * 
     * @param {Number} deltaTime
     * @returns {Point}
     */
    getNextPosition(deltaTime) {
        const nextVelocity = {
            x: this.velocity.x,
            y: this.velocity.y,
        }

        nextVelocity.y += GRAVITY * deltaTime / 1000;

        const speed = Math.sqrt((this.velocity.x) * (this.velocity.x) + (this.velocity.y) * (this.velocity.y));
        if (speed > MAX_BALL_SPEED) {
            nextVelocity.x = this.velocity.x * (MAX_BALL_SPEED / speed);
            nextVelocity.y = this.velocity.y * (MAX_BALL_SPEED / speed);
        }

        const deltaX = nextVelocity.x * deltaTime / 1000;
        const deltaY = nextVelocity.y * deltaTime / 1000;
        return {
            x: this.x + deltaX,
            y: this.y + deltaY,
        }
    }

    resolveCollisions(collisions) {
        for (const collision of collisions) {
            // if (collision.otherEntity.type !== ENTITY_TYPE.Ball) {
            //     collision.otherEntity.didCollideWith(this);
            // }
            if (this.respondsTo(collision.otherEntity.type)) {
                if (collision.otherEntity.type === ENTITY_TYPE.Trigger) {                    
                    if (collision.otherEntity.subType === TRIGGER_TYPE.Lane) {
                        if (!collision.otherEntity.hasCollided) {
                            collision.otherEntity.hasCollided = true;
                            this.triggersCollided[Date.now()] = collision.otherEntity;
                            SceneManager.scenes[SCENE.GAME].notifyBallCollision(collision.otherEntity);
                        }                        
                    }
                    if (collision.otherEntity.subType === TRIGGER_TYPE.Light) {
                        if (DEBUG) { console.log("Light Trigger Hit"); }
                        if (!collision.otherEntity.hasCollided) {
                            collision.otherEntity.hasCollided = true;
                            this.triggersCollided[Date.now()] = collision.otherEntity;
                            SceneManager.scenes[SCENE.GAME].notifyBallCollision(collision.otherEntity);
                        }
                    }
                } else if (collision.otherEntity.type === ENTITY_TYPE.Plunger) {
                    this.respondToPolygonCollision(collision);
                    this.vxAdjustment = -this.velocity.x;
                    this.vyAdjustment = (-this.velocity.y) - (collision.otherEntity.velocityRatio * MAX_BALL_SPEED);
                } else if (collision.otherEntity.type === ENTITY_TYPE.Habitrail) {
                    SceneManager.scenes[SCENE.GAME].notifyBallCollision(collision.otherEntity);
                } else if(collision.otherEntity.type === ENTITY_TYPE.RotatingGate){
                    SceneManager.scenes[SCENE.GAME].notifyBallCollision(collision.otherEntity);
                }
                else{
                    SceneManager.scenes[SCENE.GAME].notifyBallCollision(collision.otherEntity);
                    if (collision.edge) {
                        this.respondToPolygonCollision(collision);
                    } else {
                        this.respondToCircularCollision(collision);
                    }
                    this.clearTriggerCollisions();
                }
                
            }
        }

        this.x += this.xAdjustment;
        this.y += this.yAdjustment;
        this.body.update(this.xAdjustment, this.yAdjustment);
        this.velocity.x += this.vxAdjustment;
        this.velocity.y += this.vyAdjustment;
    }

    clearTriggerCollisions() {
        const removeEntities = [];
        // eslint-disable-next-line guard-for-in
        for (const datetime in this.triggersCollided) {
            const delta = Date.now() - datetime;
            if (delta >= LANE_TRIGGER_TIMEOUT) {
                this.triggersCollided[datetime].hasCollided = false;
                removeEntities.push(datetime);
            }
        }

        for (const key of removeEntities) {
            delete this.triggersCollided[key];
        }
    }

    respondsTo(type) {
        switch (type) {
            case ENTITY_TYPE.Ball:
            case ENTITY_TYPE.CircleBumper:
            case ENTITY_TYPE.CircleBumperSmall:
            case ENTITY_TYPE.Flipper:
            case ENTITY_TYPE.FlipperBumper:
            case ENTITY_TYPE.Plunger:
            case ENTITY_TYPE.Wall:
            case ENTITY_TYPE.Trigger:
            case ENTITY_TYPE.Habitrail:
            case ENTITY_TYPE.RotatingGate:
            case ENTITY_TYPE.Gate:
                return true;
            default:
                return false;
        }
    }

    respondToCircularCollision(collision) {
        let {reflectance} = collision.otherEntity;
        this.xAdjustment += (collision.distance) * collision.direction.x;
        this.yAdjustment += (collision.distance) * collision.direction.y;

        const speed = Math.sqrt((this.velocity.x) * (this.velocity.x) + (this.velocity.y) * (this.velocity.y));

        if (collision.body.reflectance) {
            reflectance = 1.1;
        }
        this.vxAdjustment += speed * reflectance * collision.direction.x - this.velocity.x;
        this.vyAdjustment += speed * reflectance * collision.direction.y - this.velocity.y;
        if (collision.otherEntity.type === ENTITY_TYPE.CircleBumper) {
            bumperSound.play();        
        }
    }

    respondToPolygonCollision(collision) {
        const {reflectance} = collision.edge;
        const velDot = this.velocity.x * collision.direction.x + this.velocity.y * collision.direction.y;

        let xPosAdjust = (this.radius - collision.distance) * collision.direction.x;
        let yPosAdjust = (this.radius - collision.distance) * collision.direction.y;
        let xVelAdjust = -(2 * reflectance * velDot * collision.direction.x);
        let yVelAdjust = -(2 * reflectance * velDot * collision.direction.y);

        if (collision.otherEntity.type === ENTITY_TYPE.Flipper) {
            const reflectedVelocity = collision.otherEntity.velocityForPointOnEdge(collision.point);
            xVelAdjust *= reflectedVelocity;
            yVelAdjust *= reflectedVelocity;       
        }

        this.xAdjustment += xPosAdjust;
        this.yAdjustment += yPosAdjust;
        this.vxAdjustment += xVelAdjust;
        this.vyAdjustment += yVelAdjust;
    }

    /**
     * @param {GameObject} gameObject
     * @param {Time} deltaTime
     * @returns {Boolean}
     */
    willCollideWith(gameObject, deltaTime) {
        if (deltaTime === undefined) return false;

        if (this.velocity.x === 0 && this.velocity.y === 0) return false;

        const nextPosition = this.getNextPosition(deltaTime);
        const distance = squaredDistance(nextPosition.x, nextPosition.y, gameObject.body.center.x, gameObject.body.center.y);
        const squaredRadii = (this.body.radius + gameObject.body.radius) * (this.body.radius + gameObject.body.radius);
        return distance <= squaredRadii;
    }
}