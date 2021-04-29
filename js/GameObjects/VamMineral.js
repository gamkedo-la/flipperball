class VamMineral extends GameObject {
    constructor(...props) {
        super(...props);
        this.minerals = [
            "min_copper", "min_diamond", "min_gold",
            "min_ice", "min_iron", "min_peridot",
            "min_platinum", "min_silver", "min_vanadinite"
        ];        
        this.mineral = this.minerals[Math.floor(Math.random() * this.minerals.length)];
        this.sprite = images[this.mineral];
        this.radius = (this.width + this.height) / 4;
        this.speed = 50;
        this.timeAlive = 10000;
        this.timeCounter = 0;
    }

    update (deltaTime) {
        super.update(deltaTime);
        this.timeCounter+=deltaTime;
        this.x += this.speed * deltaTime / 1000;
        this.body.update(this.speed * deltaTime / 1000, 0);
        if(this.timeCounter >= this.timeAlive){
            SceneManager.scenes[SCENE.GAME].removeEntity(this);            
        }
        if ((this.isFinished) || (this.x > this.maxX)) {
            SceneManager.scenes[SCENE.GAME].removeEntity(this)
        } 
    }
}