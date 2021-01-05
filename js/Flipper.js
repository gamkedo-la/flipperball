//Flipper.js
// eslint-disable-next-line no-unused-vars
function Flipper (objData, bodyData) {
    //Rotate around larger circle whose radius is 27pixels and located at position (27, 27)
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    
    this.type = ENTITY_TYPE.Flipper

    this.image = images[objData.name];
    this.body = new CollisionBody(bodyData);
    this.reflectance = objData.reflectance || 0.4;
    this.rotation = 0;
    this.oldRotation = 0;
    this.rotationCenter = {};
    if (objData.type === 'left_flipper') {
        this.input = ALIAS.LEFT;
        this.side = 'left'
        this.rotationCenter = {x: this.x + 27, y: this.y + 27}
    } else if (objData.type === 'right_flipper') {
        this.input = ALIAS.RIGHT;
        this.side = 'right'
        this.rotationCenter = {x:this.x + (this.image.width - 27), y: this.y + 27};
    }

    this.update = function(deltaTime) {
        this.oldRotation = this.rotation;
        if (heldButtons.includes(this.input)) {
            if (this.side === 'right') {
                this.rotation += (deltaTime * ROTATION_RATE / 1000);
                if (this.rotation > MAX_ROTATION_ANGLE) {
                    this.rotation = MAX_ROTATION_ANGLE;
                }
            } else {
                this.rotation -= (deltaTime * ROTATION_RATE / 1000);
                if (this.rotation < -MAX_ROTATION_ANGLE) {
                    this.rotation = -MAX_ROTATION_ANGLE;
                }
            }
        } else if (this.side === 'right') {
            this.rotation -= (deltaTime * ROTATION_RATE / 1000);
            if (this.rotation < 0) {
                this.rotation = 0;
            }         
        } else if (this.side === 'left') {
            this.rotation += (deltaTime * ROTATION_RATE / 1000);
            if (this.rotation > 0) {
                this.rotation = 0;
            }
        }

        this.body.rotate(this.rotationCenter, this.rotation);
    }

    this.getLinearVelocityForPosition = function(x, y) {
        if (Math.abs(this.rotation - this.oldRotation) < Number.EPSILON) {
            return 0;
        }

        const deltaAngle = this.rotation - this.oldRotation;
        const flipperLength = Math.sqrt((x - this.rotationCenter.x) * (x - this.rotationCenter.x) + (y - this.rotationCenter.y) * (y - this.rotationCenter.y));
        return {x: flipperLength * Math.cos(deltaAngle), y: flipperLength * Math.sin(deltaAngle)};
    }
    
    this.draw = function() {
        if (this.rotation !== 0) {
            if (this.side === 'left') {
                canvasContext.save();
                canvasContext.translate(this.x + 27, this.y + 27);
                canvasContext.rotate(this.rotation);
                canvasContext.translate(-this.x - 27, -this.y - 27);
                canvasContext.drawImage(this.image, this.x, this.y);
            } else {
                canvasContext.save();
                canvasContext.translate(this.x + (this.image.width - 27), this.y + 27);
                canvasContext.rotate(this.rotation);
                canvasContext.translate(-this.x - (this.image.width - 27), -this.y - 27);
                canvasContext.drawImage(this.image, this.x, this.y);
            }
        } else {
            canvasContext.drawImage(this.image, this.x, this.y);
        }

        this.body.draw();

        canvasContext.restore();
    }
}