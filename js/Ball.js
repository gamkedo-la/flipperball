//Ball.js
// eslint-disable-next-line no-unused-vars
function Ball (objData, bodyData) {
    // eslint-disable-next-line consistent-this
    const self = this;
    this.x = objData.x;
    this.oldX = objData.x;
    this.xAdjustment = 0;
    this.y = objData.y - objData.height;
    this.oldY = objData.y - objData.height;
    this.yAdjustment = 0;
    this.width = objData.width;
    this.height = objData.height;
    this.radius = (objData.width + objData.height) / 4; //Average of half width and half height
    this.velocity = {x: 0, y: 0};
    this.oldVelocity = {x: 0, y: 0};
    this.vxAdjustment = 0;
    this.vyAdjustment = 0;
    this.type = objData.type;
    this.image = images[objData.name];
    this.body = new CollisionBody(bodyData);
    this.center = this.body.center;
    this.triggersCollided = {};

    this.update = function(deltaTime) {
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

    this.setPosition = function (x, y) {
        this.oldX = this.x;
        this.oldY = this.y;
        this.x = x;
        this.y = y;
        this.body.update(this.x - this.oldX, this.y - this.oldY);
        this.oldX = this.x;
        this.oldY = this.y;
    }

    this.draw = function() {
        canvasContext.drawImage(this.image, this.x, this.y);
        this.body.draw();
    }

    this.resolveCollisions = function(collisions) {
        for (const collision of collisions) {
            // if (collision.otherEntity.type !== ENTITY_TYPE.Ball) {
            //     collision.otherEntity.didCollideWith(this);
            // }
            if (respondsTo(collision.otherEntity.type)) {
                if (collision.otherEntity.type === ENTITY_TYPE.Trigger && collision.otherEntity.subType === TRIGGER_TYPE.Lane) {
                    if (!collision.otherEntity.hasCollided) {
                        collision.otherEntity.hasCollided = true;
                        this.triggersCollided[Date.now()] = collision.otherEntity;
                        SceneManager.scenes[SCENE.GAME].notifyBallCollision(collision.otherEntity);
                    } 
                } else {
                    SceneManager.scenes[SCENE.GAME].notifyBallCollision(collision.otherEntity);
                    if (collision.edge) {
                        respondToPolygonCollision(collision);
                    } else {
                        respondToCircularCollision(collision);
                    }
                    self.clearTriggerCollisions();
                }
                
            }
        }

        this.x += this.xAdjustment;
        this.y += this.yAdjustment;
        this.body.update(this.xAdjustment, this.yAdjustment);
        this.velocity.x += this.vxAdjustment;
        this.velocity.y += this.vyAdjustment;
    }

    this.clearTriggerCollisions = function() {
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

    const respondsTo = function (type) {
        switch (type) {
            case ENTITY_TYPE.Ball:
            case ENTITY_TYPE.CircleBumper:
            case ENTITY_TYPE.CircleBumperSmall:
            case ENTITY_TYPE.Flipper:
            case ENTITY_TYPE.FlipperBumper:
            case ENTITY_TYPE.Plunger:
            case ENTITY_TYPE.Wall:
            case ENTITY_TYPE.Trigger:
                return true;
            default:
                return false;
        }
    }

    const respondToCircularCollision = function(collision) {
        let {reflectance} = collision.otherEntity;
        self.xAdjustment += (collision.distance) * collision.direction.x;
        self.yAdjustment += (collision.distance) * collision.direction.y;

        const speed = Math.sqrt((self.velocity.x) * (self.velocity.x) + (self.velocity.y) * (self.velocity.y));

        if (collision.body.reflectance) {
            reflectance = 1.1;
        }
        self.vxAdjustment += speed * reflectance * collision.direction.x - self.velocity.x;
        self.vyAdjustment += speed * reflectance * collision.direction.y - self.velocity.y;
        if (collision.otherEntity.type === ENTITY_TYPE.CircleBumper) {
            bumperSound.play();        
        }
    }

    const respondToPolygonCollision = function(collision) {
        const {reflectance} = collision.edge;
        const velDot = self.velocity.x * collision.direction.x + self.velocity.y * collision.direction.y;

        let xPosAdjust = (self.radius - collision.distance) * collision.direction.x;
        let yPosAdjust = (self.radius - collision.distance) * collision.direction.y;
        let xVelAdjust = -(2 * reflectance * velDot * collision.direction.x);
        let yVelAdjust = -(2 * reflectance * velDot * collision.direction.y);

        if (collision.otherEntity.type === ENTITY_TYPE.Flipper) {
            const reflectedVelocity = collision.otherEntity.velocityForPointOnEdge(collision.point);
            xVelAdjust *= reflectedVelocity;
            yVelAdjust *= reflectedVelocity;       
        }

        self.xAdjustment += xPosAdjust;
        self.yAdjustment += yPosAdjust;
        self.vxAdjustment += xVelAdjust;
        self.vyAdjustment += yVelAdjust;
    }

    this.didCollideWith = function() {

    }
}