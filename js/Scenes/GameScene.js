//Game Play scene
// eslint-disable-next-line no-unused-vars
function GameScene() {
    this.properties = TABLES.Prototype;
    this.table = null;
    this.collisionManager = null;
    this.collisionRate = 20;
    this.paused = false;
    this.tablesForScene = [TABLES.Prototype, TABLES.PrototypeTop];
    this.currentTableIndex = 0;
    this.numberOfRemainingBalls = STARTING_BALLS_COUNT;
    this.score = 0;
    this.gameHasFinished = false;

    // eslint-disable-next-line consistent-this
    const self = this
    

    this.transitionIn = function() {
        this.table = new MapBuilder(this.properties.tableName);
        this.collisionManager = new CollisionManager();
        
        if (this.gameHasFinished) {
            // Reset numberOfRemainingBalls when we transition into a new game
            this.numberOfRemainingBalls = STARTING_BALLS_COUNT;
            this.score = 0;

            this.gameHasFinished = false;
        }

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
            }
            self.table.balls.push(this.properties.ball);
            this.collisionManager.registerBall(this.properties.ball);
        } else {
            for (const ball of self.table.balls) {
                this.collisionManager.registerBall(ball);
            }
        }

        playBackgroundMusic();
    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        if (this.paused) {
			colorText("[GAME PAUSED]" , leftOffset, 120, Color.Red, Fonts.Subtitle, TextAlignment.Left, 1);    
			colorText("press P to resume" , leftOffset, 150, Color.Red, Fonts.ButtonTitle, TextAlignment.Left, 1);    
            return;
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
            case ALIAS.VOLUME_UP:
                if(pressed) {
                    turnVolumeUp();
                }
                return true;
            case ALIAS.VOLUME_DOWN:
                if (pressed) {
                    turnVolumeDown();
                }
                return true;
            case ALIAS.SFX_VOLUME_UP:
                if(pressed) {
                    turnSFXVolumeUp();
                }
                return true;
            case ALIAS.SFX_VOLUME_DOWN:
                if (pressed) {
                    turnSFXVolumeDown();
                }
                return true;
            case ALIAS.RESTART:
                if (pressed) {
                    this.restartScene();
                }
        }
        
        return false;
    };

    this.pauseScene = function(pressed) {
        if (pressed) {
            this.paused = !this.paused;
            if(this.paused) {
                pauseSoundAndMusic();
            } else {
                resumeSoundAndMusic();
            }
        }
    }

    //TODO: FM: To be Removed; To Help with Debugging
    const originalBallAndTableTransition = function() {
        for (const ball of self.table.balls) {
            if (ball.y < 0) {
                SceneManager.setState(SCENE.GAME, {tableName: TABLES.PrototypeTop, ball: ball, ballOffset: {x: 0, y: canvas.height}});
            } else if (ball.y > canvas.height) {
                SceneManager.setState(SCENE.GAME, {tableName: TABLES.Prototype, ball: ball, ballOffset: {x: 0, y: canvas.height}});
            }
        }
    }

    const determineBallAndTableState = function() {
        for (const ball of self.table.balls) {
            if (ball.y < 0) {
                if (self.currentTableIndex < self.tablesForScene.length - 1) {
                    self.currentTableIndex++;
                    SceneManager.setState(SCENE.GAME, {tableName: self.tablesForScene[self.currentTableIndex], ball: ball, ballOffset: {x: 0, y: canvas.height}});
                    //TODO: FM: Determine when extra ball should actually be given to player
                    //Probably at some number of points and under some special circumstances
                    extraBall();
                }
            } else if (ball.y > canvas.height) {
                if (self.currentTableIndex == 0) {
                    loseBall(ball);
                    playRemainingBall();
                } else if (self.currentTableIndex >= self.tablesForScene.length - 1) {
                    self.currentTableIndex--;
                    SceneManager.setState(SCENE.GAME, {tableName: self.tablesForScene[self.currentTableIndex], ball: ball, ballOffset: {x: 0, y: -canvas.height}});
                }
            }
        }
    }
        
    const loseBall = function(ball) {
        let ballIndex = self.table.balls.indexOf(ball);
        if (ballIndex !== -1) {
            self.collisionManager.unregisterBall(ball);
            self.table.balls.splice(ballIndex, 1);
        }
    }

    const extraBall = function() {
        self.numberOfRemainingBalls++;
    }

    const playRemainingBall = function() {
        if (self.numberOfRemainingBalls > 0) {
            self.numberOfRemainingBalls--;
            self.transitionIn();
        } else {            
            self.gameHasFinished = true
            //TODO: This should be a game over scene once we've got it
            SceneManager.setState(SCENE.TITLE);
        }
    }

    this.restartScene = function() {
        if (isGameOver()) {
            this.currentTableIndex = 0;
            this.transitionIn();
        }
    }

    const isGameOver = function() {
        return self.table.balls.length == 0;
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


        for (let i = 0; i < self.table.animations.length; i++) {
            animation = self.table.animations[i]
            animation.update(deltaTime);
            if (animation.isFinished) {
                // remove finished animations
                self.table.animations.splice(i, 1);
            }
        }

        //TODO: We'll need to change to figure out what to do about multi-ball
        //FM: If Debug use originalBallAndTableTransition instead
        determineBallAndTableState();
    }

    const draw = function() {
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

        for (const animation of self.table.animations) {
            animation.draw();
        }

        leftOffset = 20;
        colorText("Score: " + self.score, leftOffset, canvas.height - 120, Color.White, Fonts.Subtitle, TextAlignment.Left, 1);    

        colorText("No. of plays left: " + self.numberOfRemainingBalls, leftOffset, canvas.height - 80, Color.White, Fonts.Subtitle, TextAlignment.Left, 1);
       
        if (isGameOver()) {
            colorText("Press 'r' to Restart", 135, canvas.height / 2, Color.Red, Fonts.Subtitle, TextAlignment.Center, 1);
        }
        
    }

    this.notifyBallCollision = function(otherEntity) {
        switch (otherEntity.type) {
            case ENTITY_TYPE.CircleBumper:
                self.score += 100;
                self.playAnimation(ANIMATIONS.CIRCLE_BUMPER_BLUE, otherEntity.x, otherEntity.y)

            default:
        }
    }

    this.playAnimation = function(animationData, x, y) {
        newAnimation = new SpriteAnimation(
            animationData.imageName, 
            images[animationData.imageName],
            x, y,
            animationData.frames,
            animationData.frameWidth,
            animationData.frameHeight,
            animationData.frameTimes,
            animationData.reverses,
            animationData.loops);
            
       self.table.animations.push(newAnimation);
    }
}