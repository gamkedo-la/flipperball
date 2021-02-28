class Plane extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
        this.speed = 50;
    }

    update (deltaTime) {
        super.update(deltaTime);
        this.x += this.speed * deltaTime / 1000;
        this.body.update(this.speed * deltaTime / 1000, 0);
        if ((this.isFinished) || (this.x > this.maxX)) {
            SceneManager.scenes[SCENE.GAME].removeEntity(this)
        } 
    }
}