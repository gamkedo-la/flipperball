class ToggleLight extends GameObject {

    constructor(...props) {
        super(...props);
        if (DEBUG) {
            console.log("[ToggleLight] Constructor");
        }
        this.isInReverse = false;
        this.isAnimating = false;
    }
}