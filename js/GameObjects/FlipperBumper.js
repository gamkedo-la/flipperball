//FlipperBumper.js
// eslint-disable-next-line no-unused-vars
//function FlipperBumper (objData, bodyData) {
class FlipperBumper extends GameObject {
    constructor(...props) {
        super(...props);
        const objData = props[0];
        const bodyData = props[1];
        this.x = objData.x;
        this.y = objData.y - objData.height;
        this.width = objData.width;
        this.height = objData.height;
        this.isAnimating = false;
        if (objData.type === ENTITY_TYPE.FlipperBumper) {
            this.type = ENTITY_TYPE.FlipperBumper;
        }
        if (objData.type === ENTITY_TYPE.WingBumper) {
            this.type = ENTITY_TYPE.WingBumper;
        }
        this.bodies = [];
        this.body = undefined;
        this.image = images[objData.name];
        for (const body of bodyData) {
            this.bodies.push(new CollisionBody(body));
        }
        this.reflectance = objData.reflectance || 0.9;
/*
        this.update = function (deltaTime) {

        }

        this.draw = function () {
            if (!this.animating) {
                canvasContext.drawImage(this.image, this.x, this.y);
                for (const body of this.bodies) {
                    body.draw();
                }
            }
        }
*/
    }
}