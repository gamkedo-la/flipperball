//Game Play scene
// eslint-disable-next-line no-unused-vars
function GameScene() {
    this.properties = TABLES.Prototype;
    this.table = null;
    this.collisionManager = null;
    this.collisionRate = 20;
    // eslint-disable-next-line consistent-this
    const self = this
    this.paused = false;

    this.transitionIn = function() {
        this.table = new MapBuilder(this.properties.tableName);
        this.collisionManager = new CollisionManager();

        for (const dynamicObj of self.table.dynamicObjects) {
            this.collisionManager.registerEntity(dynamicObj);
        }

        for (const wall of self.table.tableColliders) {
            this.collisionManager.registerEntity(wall);
        }

        for (const flipper of self.table.flippers) {
            this.collisionManager.registerFlipper(flipper);
        }

        if (this.properties.ball) {
            self.table.balls.length = 0
            if (this.properties.ballOffset) {
                this.properties.ball.setPosition(this.properties.ball.x + this.properties.ballOffset.x, this.properties.ball.y + this.properties.ballOffset.y);
                // this.properties.ball.x += this.properties.ballOffset.x;
                // this.properties.ball.y += this.properties.ballOffset.y;
            }
            self.table.balls.push(this.properties.ball);
            this.collisionManager.registerBall(this.properties.ball);
        } else {
            for (const ball of self.table.balls) {
                this.collisionManager.registerBall(ball);
            }
        }
    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        if (this.paused) {
            return
        }
        
        update(deltaTime);
        draw(deltaTime);
    }

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        switch (newKeyEvent) {
            case ALIAS.LEFT:
                return true;
            case ALIAS.RIGHT:
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
            case ALIAS.PAUSE:
            case ALIAS.PAUSE2:
                this.pauseScene(pressed);
                return true;
            case ALIAS.MUTE:
                if (pressed) {
                    toggleMute();
                }
                return true;
        }
        
        return false;
    };

    this.pauseScene = function(pressed) {
        if (pressed) {
            this.paused = !this.paused;
            if(this.paused) {
                playPauseSound();
            } else {
                playResumeSound();
            }
        }
    }

    const update = function(deltaTime) {
        for (let i = 0; i < self.collisionRate / 2; i++) {
            for (const flipper of self.table.flippers) {
                flipper.update(deltaTime / self.collisionRate);
            }
    
            for (const ball of self.table.balls) {
                ball.update(deltaTime / self.collisionRate);
            }

            self.collisionManager.checkBallFlipperCollisions();
        }

        for (const dynamicObj of self.table.dynamicObjects) {
            dynamicObj.update(deltaTime);
        }

        self.collisionManager.checkCollisions();

        for (let i = 0; i < self.collisionRate / 2; i++) {
            for (const flipper of self.table.flippers) {
                flipper.update(deltaTime / self.collisionRate);
            }
    
            for (const ball of self.table.balls) {
                ball.update(deltaTime / self.collisionRate);
            }

            self.collisionManager.checkBallFlipperCollisions();
        }

        //TODO: We'll need to change to figure out what to do about multi-ball
        for (const ball of self.table.balls) {
            if (ball.y < 0) {
                SceneManager.setState(SCENE.GAME, {tableName: TABLES.PrototypeTop, ball: ball, ballOffset: {x: 0, y: canvas.height}});
                break
            } else if (ball.y > canvas.height) {
                SceneManager.setState(SCENE.GAME, {tableName: TABLES.Prototype, ball: ball, ballOffset: {x: 0, y: -canvas.height}});
                break
            }
        }
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

        for (const flipper of self.table.flippers) {
            flipper.draw();
        }

        for (const ball of self.table.balls) {
            ball.draw();
        }
    }
}