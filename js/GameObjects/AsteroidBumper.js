class AsteroidBumper extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
    }

    spawnMineral() {
    
    
    }
    update (deltaTime) {
        super.update(deltaTime);
        if (this.isFinished) {
            this.active = false
        } 
    }
}