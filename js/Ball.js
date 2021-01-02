//Ball.js
// eslint-disable-next-line no-unused-vars
function Ball (objData, bodyData) {
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    this.radius = (objData.width + objData.height) / 4; //Average of half width and half height
    this.velocity = {x: 0, y: 0};
    this.type = objData.type;
    this.image = images[objData.name];
    this.body = new CollisionBody(bodyData);


    this.update = function(deltaTime) {
        this.velocity.y += GRAVITY * deltaTime / 1000;

        this.x += this.velocity.x * deltaTime / 1000;
        this.y += this.velocity.y * deltaTime / 1000;
    }

    this.draw = function() {
        canvasContext.drawImage(this.image, this.x, this.y);
        this.body.draw();
    }

    this.didCollideWith = function() {

    }
}