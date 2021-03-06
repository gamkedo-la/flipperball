class StaticObject extends GameObject {
    constructor(...props) {
        super(...props);
        this.rotation = props[0].rotation * (Math.PI/180) || 0;
        if (props[0].properties) {
            for (const prop of props[0].properties) {
                this[prop.name] = prop.value
            }
        } 
    }

    draw = function() {
        if (this.rotation > 0) {
            drawImageForTiledWithRotation(this.sprite, this.x, this.y, this.rotation);
        } else {
            canvasContext.drawImage(this.sprite, this.x, this.y);
        }
    }

}