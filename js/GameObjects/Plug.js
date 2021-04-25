class Plug extends GameObject {
    constructor(...props) {
        super(...props);
        
        this.radius = (this.width + this.height) / 4;
        this.active = false
    }

    activate () {
        this.active = true
    }

    inactivate () {
        this.active = false
    }

    draw () {
        if (this.active) {
            super.draw();
        }
    }
}