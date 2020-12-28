//Game Play scene
// eslint-disable-next-line no-unused-vars
function GameScene() {
    this.transitionIn = function() {

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
        drawRect(0, 0, canvas.width, canvas.height, 'blue');
        // canvasContext.drawImage(tempBackground, 0, 0, canvas.width, canvas.height);
    }
}