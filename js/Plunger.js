class Plunger extends GameObject {
    constructor(...props) {
        super(...props)

        this.PULL_SPEED = 300;
        this.RELEASE_SPEED = 1200;
        this.objData = props[0];
        for (const prop of this.objData.properties) {
            const {name, value} = prop;
            if (name === 'stop') {
                this.stop = value;
            }
        }
        this.input = ALIAS.PLUNGER;

        this.reflectedVelocity = 15;
        this.velocityRatio = 0;
        this.positionRatio = 0;
        this.isContracted = false;
        this.isContracting = false;
        this.startY = this.body.center.y;
        this.DELTA_POS = this.stop - this.startY
    }

    update(deltaTime) {
        const oldY = this.body.center.y;
        let newY = this.body.center.y;
        if (heldButtons.includes(this.input)) {
            newY += this.PULL_SPEED * (deltaTime / 1000);
            console.log(`NewY: ${newY}, Stop: ${this.stop}`)
            if (newY > this.stop) {
                newY = this.stop
            }
            this.velocityRatio = 0;
            this.positionRatio = (newY - (this.objData.y - this.objData.height)) / this.DELTA_POS;
        } else if (newY > this.startY) {
            newY -= this.RELEASE_SPEED * (deltaTime / 1000);
            if (newY < this.objData.y - this.objData.height) {
                newY = this.objData.y - this.objData.height;
                this.positionRatio = 0;
            }
            if (this.velocityRatio === 0) {
                this.velocityRatio = this.positionRatio;
            }
        } else {
            this.velocityRatio = 0;
        }

        this.body.update(0, newY - oldY);

        // this.oldVelocity.x = this.velocity.x;
        // this.oldVelocity.y = this.velocity.y;

        // const deltaX = this.velocity.x * deltaTime / 1000;
        // const deltaY = this.velocity.y * deltaTime / 1000;

        // const newX = this.x + deltaX;
        // const newY = this.y + deltaY;
        
        // this.setPosition(newX, newY);

        // this.body.update(0, this.y - oldY);


        if (heldButtons.includes(this.input)) {
            this.isContracting = true;
            this.isContracted = true;
            this.isAnimating = true;
            this.updateAnimation(deltaTime);
        } else {
            this.isAnimating = false;
        }        
    }
}