class PlaneSpawner extends Spawner {
    constructor(...props) {
        super(...props);

        this.colorIndex = 0;
        this.colors = ['plane_red', 'plane_blue', 'plane_green', 'plane_yellow'];
        this.score = 100;
        this.cycles = 0;
        this.despawn = props[0].despawn;
    }

    nextColor () {
        return this.colors[this.colorIndex];
    }

    nextScore () {
        return this.score;
    }

    childWasHit (child) {
        const childColorIndex = this.colors.indexOf(child.name)

        if (childColorIndex === this.colorIndex) {
            this.colorIndex++;
        }

        if (this.colorIndex === this.colors.length) {
            this.colorIndex = 0;
            this.cycles++;
        }

        this.score = 1000 * this.cycles + 200 * this.colorIndex || 100
    }
}