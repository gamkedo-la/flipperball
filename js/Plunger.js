//Plunger.js
// eslint-disable-next-line no-unused-vars
function Plunger (objData, bodyData) {
    // this.objData = objData;
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    
    this.type = ENTITY_TYPE.Plunger;

    this.image = images[objData.name];
    
    // this.body = new CollisionBody(bodyData)
    
    this.setInput = function(alias) {
        this.input = alias;
    }

    // this.reflectance = objData.reflectance || 1.1;
    // this.reflectedVelocity = 15;

    // this.input = ALIAS.PLUNGER
    // this.setInput = function(alias) {
    //     this.input = alias;
    // }

    this.update = function(deltaTime) {
        // const oldY = this.y
        // if (heldButtons.includes(this.input)) {
        //     this.y += 200*(deltaTime/1000);
        //     //limit this to 535 (figure out a better way than hard coding)
        //     if (this.y > 535) {
        //         this.y = 535
        //     }
        // } else if (this.y > this.objData.y - this.objData.height) {
        //     this.y -= 300*(deltaTime/1000);
        //     if (this.y < this.objData.y - this.objData.height) {
        //         this.y = this.objData.y - this.objData.height;
        //     }
        // }

        // this.body.update(0, this.y - oldY);
    }
    
    this.draw = function() {
        // canvasContext.drawImage(this.image, this.x, this.y);
        // this.body.draw();
    }
}