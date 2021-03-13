class SlotMachine extends GameObject {
    constructor(...props) {
        super(...props);
        this.isAnimating = false;
    }

    spin() {
        this.isAnimating = true;
    }

}