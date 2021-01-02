//Game Play scene
// eslint-disable-next-line no-unused-vars
function GameScene() {
    this.properties = TABLES.Prototype
    this.table = null
    // eslint-disable-next-line consistent-this
    const self = this

    this.transitionIn = function() {
        this.table = new MapBuilder(this.properties.tableName)
    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime);
    }

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        switch (newKeyEvent) {
            case ALIAS.LEFT:
                // eslint-disable-next-line no-console
                console.log("Left Flipper Activated");
                return true;
            case ALIAS.RIGHT:
                // eslint-disable-next-line no-console
                console.log("Right Flipper Activated");
                return true;
            case ALIAS.PLUNGER:
                // eslint-disable-next-line no-console
                console.log("Plunger Activated");
                return true;
            case ALIAS.CHEATS:
                CHEATS_ACTIVE = !CHEATS_ACTIVE;
                return true;
            case ALIAS.DEBUG:
                DEBUG = !DEBUG;
                // eslint-disable-next-line no-console
                console.log("Debug? " + DEBUG);
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
    }

    const draw = function(deltaTime) {
        drawRect(0, 0, canvas.width, canvas.height, Color.Black);
        // canvasContext.drawImage(prototype, 0, 0, canvas.width, canvas.height);
        for (const staticObj of self.table.staticObjects) {
            staticObj.draw();
        }

        for (const dynamicObj of self.table.dynamicObjects) {
            dynamicObj.draw();
        }

        for (const wall of self.table.tableColliders) {
            wall.draw();
        }
    }
}