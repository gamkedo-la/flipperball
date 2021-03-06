class Spawner extends GameObject {
    constructor(...props) {
        super(...props);

        console.log("[Spawner]: Constructor");
        if (!this.score) {
            this.score = 0
        }
    }

    nextScore () {
        //override in subclass
        return this.score
    }

    // eslint-disable-next-line class-methods-use-this
    childWasHit () {
        //override in subclass
    }
}