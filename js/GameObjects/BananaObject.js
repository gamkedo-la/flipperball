class BananaObject extends GameObject {
    constructor(...props) {
        super(...props);
        this.currFrame = 0;
        this.isInReverse = false;
        this.isAnimating = true;
        this.timeAlive = 10000;
        this.timeCounter = 0;
    }

    update (deltaTime) {
        super.update(deltaTime);
        this.timeCounter+=deltaTime;
        if(this.timeCounter >= this.timeAlive){
            DEBUG_LOG("Banana counter: " + this.timeCounter);
            SceneManager.scenes[SCENE.GAME].removeEntity(this);
            SceneManager.scenes[SCENE.GAME].spawnEntity(null, ENTITY_TYPE.BananaTaken, this);
        }
    }
}