class Habitrail extends GameObject {
    constructor(...props) {
        super(...props);
        this.rotation = props[0].rotation * (Math.PI/180) || 0;
        this.relatedCollisionObjects = String(props[0].properties[0].value).split(',');
    }

    draw = function() {
        if (this.rotation > 0) {
            drawImageForTiledWithRotation(this.sprite, this.x, this.y, this.rotation);
        } else {
            canvasContext.drawImage(this.sprite, this.x, this.y);
        }
    }

}