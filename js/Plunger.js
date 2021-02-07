//Plunger.js
// eslint-disable-next-line no-unused-vars
function Plunger (objData, bodyData) {
    this.objData = objData;
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;

    for (const prop of objData.properties) {
        const {name, value} = prop;
        if (name === 'stop') {
            this.stop = value;
        }
    }
    
    this.type = ENTITY_TYPE.Plunger;
    this.image = images[objData.name];
    this.body = new CollisionBody(bodyData)

    const PULL_SPEED = 300;
    const RELEASE_SPEED = 1200;
    
    this.setInput = function(alias) {
        this.input = alias;
    }

    this.reflectance = objData.reflectance || 1.1;
    this.reflectedVelocity = 15;
    this.velocityRatio = 0;
    let positionRatio = 0;
    const DETLA_POS = this.stop - (this.objData.y - this.objData.height)

    this.input = ALIAS.PLUNGER
    this.setInput = function(alias) {
        this.input = alias;
    }

    this.update = function(deltaTime) {
        const oldY = this.y
        if (heldButtons.includes(this.input)) {
            this.y += PULL_SPEED*(deltaTime/1000);
            if (this.y > this.stop) {
                this.y = this.stop
            }
            this.velocityRatio = 0;
            positionRatio = (this.y - (this.objData.y - this.objData.height)) / DETLA_POS;
        } else if (this.y > this.objData.y - this.objData.height) {
            this.y -= RELEASE_SPEED*(deltaTime/1000);
            if (this.y < this.objData.y - this.objData.height) {
                this.y = this.objData.y - this.objData.height;
                positionRatio = 0;
            }
            if (this.velocityRatio === 0) {
                this.velocityRatio = positionRatio;
            }
        } else {
            this.velocityRatio = 0;
        }

        this.body.update(0, this.y - oldY);
    }
    
    this.draw = function() {
        canvasContext.drawImage(this.image, this.x, this.y);
        this.body.draw();
    }
}