class BaseEntity {
    /**
    * @param {Object} objData
    * @param {Object} bodyData
    */
    constructor(objData, bodyData) {
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

        if (bodyData) {
          this.body = new CollisionBody(bodyData);
          this.center = this.body.center;
        }
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
        canvasContext.drawImage(this.image, this.x, this.y, this.width, this.height);

        if (this.body) {
          this.body.draw();
        }
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
    didCollideWith() {}
}