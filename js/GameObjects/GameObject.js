class GameObject {
    /**
    * @param {Object} objData
    * @param {Object} bodyData
    */
    constructor(objData, bodyData) {
        this.type = objData.type;
        this.name = objData.name;

        this.width = objData.width;
        this.height = objData.height;

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
        this.animationData;

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
        canvasContext.drawImage(this.sprite, this.x, this.y, this.width, this.height);

        if (this.body) {
          this.body.draw();
        }
    }

    /** @interface */
    animate() {}

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