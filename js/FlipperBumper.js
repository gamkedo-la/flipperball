//FlipperBumper.js
// eslint-disable-next-line no-unused-vars
function FlipperBumper (objData, bodyData) {
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    
    this.type = ENTITY_TYPE.FlipperBumper
    this.bodies = []

    this.image = images[objData.name];
    for (const body of bodyData) {
        this.bodies.push(new CollisionBody(body));
    }
    this.reflectance = objData.reflectance || 0.9;
    
    this.update = function(deltaTime) {

    }
    
    this.draw = function() {
        canvasContext.drawImage(this.image, this.x, this.y);
        for (const body of this.bodies) {
            body.draw();
        }
    }
}