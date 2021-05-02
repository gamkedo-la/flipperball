class Sputnik extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
    }
}