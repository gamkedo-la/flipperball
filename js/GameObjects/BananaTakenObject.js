class BananaTakenObject extends GameObject {
    constructor(...props) {
        super(...props);
        this.isInReverse = false;
        this.isAnimating = true;
    }

    update (deltaTime) {
        super.update(deltaTime);
        if(this.currFrame == ANIMATIONS.BANANA_TAKEN.frames.length - 1){
            SceneManager.scenes[SCENE.GAME].removeEntity(this)
        }
    }
}