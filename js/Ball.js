//Ball.js
// eslint-disable-next-line no-unused-vars
function Ball (objData, bodyData) {
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

        const deltaX = this.velocity.x * deltaTime / 1000;
        const deltaY = this.velocity.y * deltaTime / 1000;
        this.x += deltaX;
        this.y += deltaY;
        this.body.update(deltaX, deltaY);
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
                if (collision.edge) {
                    const {reflectance} = collision.edge;
                    const dot = this.velocity.x * collision.direction.x + this.velocity.y * collision.direction.y;
                    if (dot <= 0) {
                        this.xAdjustment += (this.radius - collision.distance) * collision.direction.x;
                        this.yAdjustment += (this.radius - collision.distance) * collision.direction.y;    
                    } else {
                        this.xAdjustment -= (this.radius - collision.distance) * collision.direction.x;
                        this.yAdjustment -= (this.radius - collision.distance) * collision.direction.y;    
                    }
                    
                    this.vxAdjustment -= (2 * reflectance * dot * collision.direction.x);
                    this.vyAdjustment -= (2 * reflectance * dot * collision.direction.y);
                } else {
                    const {reflectance} = collision.otherEntity;
                    this.xAdjustment += (this.radius - collision.distance) * collision.direction.x;
                    this.yAdjustment += (this.radius - collision.distance) * collision.direction.y;
                    const speed = Math.sqrt((this.velocity.x) * (this.velocity.x) + (this.velocity.y) * (this.velocity.y));
                    this.vxAdjustment += speed * reflectance * collision.direction.x - this.velocity.x;
                    this.vyAdjustment += speed * reflectance * collision.direction.y - this.velocity.y;
                }
            }
        }

        this.x += this.xAdjustment;
        this.y += this.yAdjustment;
        this.body.update(this.xAdjustment, this.yAdjustment);
        this.velocity.x += this.vxAdjustment;
        this.velocity.y += this.vyAdjustment;
    }

    const respondsTo = function (type) {
        switch (type) {
            case ENTITY_TYPE.Ball:
            case ENTITY_TYPE.CircleBumper:
            case ENTITY_TYPE.Flipper:
            case ENTITY_TYPE.FlipperBumper:
            case ENTITY_TYPE.Plunger:
            case ENTITY_TYPE.Wall:
                return true;
            default:
                return false;
        }
    }

    this.didCollideWith = function() {

    }
}