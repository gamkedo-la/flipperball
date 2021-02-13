//Game Play scene
// eslint-disable-next-line no-unused-vars
function GameScene() {
    // this.properties gets overwritten with SceneManager.js->setState([..], properties)
    this.properties = TABLES.Prototype;
    this.table = null;
    this.collisionManager = null;
    this.collisionRate = 100;
    this.paused = false;
    this.tablesForScene = [TABLES.Prototype, TABLES.PrototypeTop];
    this.currentTableIndex = 0;
    this.numberOfRemainingBalls = STARTING_BALLS_COUNT;
    this.hasPlungerReleased = false;
    this.score = 0;
    this.scoreIncrementForExtraBall = 0;
    this.gameHasFinished = false;
    this.flashEnabled = true;
    this.flash = false;
   
    let shakeStartTime = -1;
    const shakeDuration = 500;
    let currentShakes = 0;
    const shakesBeforeTilt = 2;
    let tilt = false;

    // eslint-disable-next-line consistent-this
    const self = this
    const TEXT_LEFT_OFFSET = 0
    const SCORE_NEEDED_FOR_EXTRA_BALL = 750;

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

        if (self.table.plunger) {this.collisionManager.registerPlunger(self.table.plunger);}

        if (this.properties.ball) {
            // we are moving the balls inbetween table scenes?
            self.table.balls.length = 0
            if (this.properties.ballOffset) {
                this.properties.ball.setPosition(this.properties.ball.x + this.properties.ballOffset.x, this.properties.ball.y + this.properties.ballOffset.y);
            }
            self.table.balls.push(this.properties.ball);
            this.collisionManager.registerBall(this.properties.ball);
        } else {
            // we lost the ball and are adding a new one to the scene? 
            for (const ball of self.table.balls) {
                this.collisionManager.registerBall(ball);
            }
        }

        playBackgroundMusic();
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
                return true;
            case ALIAS.RIGHT:
                return true;
            case ALIAS.PLUNGER:
                this.releasePlunger();
                return true;
            case ALIAS.CHEATS:
                CHEATS_ACTIVE = !CHEATS_ACTIVE;
                return true;
            case ALIAS.DEBUG:
                if (pressed) {
                    DEBUG = !DEBUG;
                    console.log("Debug? " + DEBUG);
                    if (DEBUG) {
                        canvasContainer.appendChild(debugButton);
                    } else {
                        canvasContainer.removeChild(debugButton);
                    }
                }
                // eslint-disable-next-line no-console
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
                    if (self.paused) {
                        // force restart when in pause menu
                        self.paused = false;
                        this.restartScene(true);
                        tilt = false;
                    } else {
                        this.restartScene();
                    }
                }
                return true;
            case ALIAS.SHAKE:
                this.shakeScene(pressed);
                return true;
            case ALIAS.TOGGLE_FLASH:
                if(pressed){
                  this.flashEnabled = !this.flashEnabled;
                }
                return true;
        }
        
        return false;
    };
    
    this.shakeScene = function(pressed) {
        if (!pressed) {return;}
        
        if (tilt) {return;}

        if (this.paused) {return;}
		
		currentShakes++;
		if (shakeStartTime != -1) {
			if (currentShakes >= shakesBeforeTilt) {
				console.log("TILT");
				tilt = true;
				shakeStartTime = -1;
				currentShakes = 0;
				return;
			}
		} else {
			currentShakes = 0;
		}
		
		shakeStartTime = Date.now();

		shakeAnimation();
    }
    
    function shakeAnimation() {
        requestAnimationFrame(shakeAnimation); // tells the context to save animation
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);

		shakeCanvasMovement();
		
		//drawing scene
		update(0);
        draw(0);
		
		if (shakeStartTime ==-1) { // shake endend -> return
			return;
		}
		canvasContext.restore();
		
    }
    
    function shakeCanvasMovement() {
		if (shakeStartTime === -1) { // shake ended -> no move
			currentShakes = 0;
			return;
		}

        // The Chronogram object (Chronogram.js) keeps a timer and allows registering events
        // Also, the GameScene object gets a deltaTime passed to it each update cycle, that
        // could be summed and compared to shakeDuration
		const dt = Date.now() - shakeStartTime; // actual shake duration

		if (dt > shakeDuration) { // shake duration limit reached -> stop
			currentShakes = 0;
            shakeStartTime = -1; 
            return;
		}

		canvasContext.save();

		const dx = Math.random() * 10; // increase or drecrease horizontal shake effect
		const dy = Math.random() * 10; // increase or drecrease vertical shake effect

		canvasContext.translate(dx, dy);  
	}

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
    //We can probably leave it in, not a big deal
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
                    //extraBall();
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
            //Setting properties.ball to undefined so it doesn´t propagate to the next TransitionIn()
            self.properties.ball = undefined;
            self.collisionManager.unregisterBall(ball);
            self.table.balls.splice(ballIndex, 1);
            // reset flipper input (in case of tilt)
            if (tilt) {
                tilt = false;
                for (const flipper of self.table.flippers) {
                    if (flipper.side === "left") {
                        flipper.setInput(ALIAS.LEFT);
                    } else {
                        flipper.setInput(ALIAS.RIGHT);
                    }
                }
            }
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
            self.gameHasFinished = true;
            //TODO: This should be a game over scene once we've got it
            SceneManager.setState(SCENE.TITLE);
        }
    }

    this.releasePlunger = function() {
        // if(!this.hasPlungerReleased) {
        //     this.hasPlungerReleased = true;
        //     // eslint-disable-next-line no-console
        //     console.log("Plunger Activated");
        //     this.playAnimation("plunger", ANIMATIONS.PLUNGER_RELEASE, 912, 552);
        // }
    }

    this.restartScene = function(force=false) {
        if (isGameOver() || force) {
            self.gameHasFinished = true;
            SceneManager.setState(SCENE.GAME, TABLES.Prototype);
        }
    }

    const isGameOver = function() {
        return self.table.balls.length == 0;
    }

    const update = function(deltaTime) {
        if (self.paused) {return;}

        for (let i = 0; i < self.collisionRate / 2; i++) {
            for (const flipper of self.table.flippers) {
                if (tilt) {
                    flipper.setInput(null);
                }
                flipper.update(deltaTime / self.collisionRate);
            }
    
            for (const ball of self.table.balls) {
                ball.update(deltaTime / self.collisionRate);
            }

            if (self.table.plunger) {self.table.plunger.update(deltaTime/self.collisionRate);}

            self.collisionManager.checkBallFlipperCollisions();
        }

        for (const dynamicObj of self.table.dynamicObjects) {
            dynamicObj.update(deltaTime / 2);
        }

        self.collisionManager.checkCollisions(deltaTime/2);

        for (let i = 0; i < self.collisionRate / 2; i++) {
            for (const flipper of self.table.flippers) {
                if (tilt) {
                    flipper.setInput(null);
                }
                flipper.update(deltaTime / self.collisionRate);
            }
    
            for (const ball of self.table.balls) {
                ball.update(deltaTime / self.collisionRate);
            }

            if (self.table.plunger) {self.table.plunger.update(deltaTime/self.collisionRate);}

            self.collisionManager.checkBallFlipperCollisions();
        }

        for (const dynamicObj of self.table.dynamicObjects) {
            dynamicObj.update(deltaTime / 2);
        }

        self.collisionManager.checkCollisions(deltaTime/2);

        for (let i = self.table.animations.length - 1; i >= 0; i--) {
            //Need to iterate backwards to avoid skipping anything or going
            //past the end of the array if we remove an element part way
            //through the loop.
            const animation = self.table.animations[i];
            animation.update(deltaTime);
            if (animation.isFinished) {
                // remove finished animations
                self.table.animations.splice(i, 1);
                // is it possible to inactivate the animations rather than
                // destroying them so we don't have to create a new object
                // when we just want to play the same animation again?
            }
        }

        //TODO: We'll need to change to figure out what to do about multi-ball
        if (DEBUG) {
            originalBallAndTableTransition();
        } else {
            determineBallAndTableState();
        }
    }

    const draw = function() {
        drawRect(0, 0, canvas.width, canvas.height, Color.Black);
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

        if (self.table.plunger) {self.table.plunger.draw();}

        for (const ball of self.table.balls) {
            ball.draw();
        }

        for (const animation of self.table.animations) {
            animation.draw();
        }

        if (self.flashEnabled && self.flash){
          drawRect(0, 0, canvas.width, canvas.height, Color.WhiteFlash);
          self.flash = false;
        }

        if (self.paused) {
          colorText("[GAME PAUSED]" , TEXT_LEFT_OFFSET, 120, Color.Red, Fonts.Subtitle, TextAlignment.Left, 1);    
          colorText("press P to resume" , TEXT_LEFT_OFFSET, 150, Color.Red, Fonts.ButtonTitle, TextAlignment.Left, 1);    
          colorText("press R to restart" , TEXT_LEFT_OFFSET, 180, Color.Red, Fonts.ButtonTitle, TextAlignment.Left, 1);       
          drawRect(0,0,canvas.width,canvas.height, Color.BlackOverlay);
        }
        
        if (tilt) {
            colorText("[GAME TILT]", TEXT_LEFT_OFFSET, 60, Color.Red, Fonts.Subtitle, TextAlignment.Left, 1);
        } else if (currentShakes > 0) {
	        colorText("Warning...", TEXT_LEFT_OFFSET, 60, Color.Red, Fonts.Subtitle, TextAlignment.Left, 1);
        }

        colorText("Score: " + self.score, TEXT_LEFT_OFFSET, canvas.height - 120, Color.White, Fonts.Subtitle, TextAlignment.Left, 1);    

        colorText("No. of plays left: " + self.numberOfRemainingBalls, TEXT_LEFT_OFFSET, canvas.height - 80, Color.White, Fonts.Subtitle, TextAlignment.Left, 1);
       
        if (isGameOver()) {
            colorText("Press 'r' to Restart", 135, canvas.height / 2, Color.Red, Fonts.Subtitle, TextAlignment.Center, 1);
        }
        
    }

    this.notifyBallCollision = function(otherEntity) {    
        switch (otherEntity.type) {
            case ENTITY_TYPE.CircleBumper:
                self.flash = true;
                self.score += otherEntity.score;  
                self.scoreIncrementForExtraBall += otherEntity.score; 
                if (otherEntity.hasAnimation) {
                    otherEntity.animate(0);
                } else {
                    self.playAnimation(otherEntity.body.name, ANIMATIONS.CIRCLE_BUMPER, otherEntity.x, otherEntity.y)
                }
                break;
            case ENTITY_TYPE.CircleBumperSmall:
                self.flash = true;
                self.score += otherEntity.score;   
                self.scoreIncrementForExtraBall += otherEntity.score; 
                self.playAnimation(otherEntity.body.name, ANIMATIONS.CIRCLE_BUMPER_SMALL, otherEntity.x, otherEntity.y)
                break;
            case ENTITY_TYPE.FlipperBumper:
                self.playAnimation(otherEntity.body.name, ANIMATIONS.FLIPPER_BUMPER, otherEntity.x, otherEntity.y)
                break;  
            case ENTITY_TYPE.Trigger:
                self.handleTriggerCollision(otherEntity);
                break;
            case ENTITY_TYPE.RotatingGate:
                self.handleRotatingGateCollision(otherEntity);
                break;
            case ENTITY_TYPE.Habitrail:
                self.handleHabitrailCollision(otherEntity);
            default:
                break;
        }
        if(self.scoreIncrementForExtraBall >= SCORE_NEEDED_FOR_EXTRA_BALL){
            extraBall();
            //Maybe add a SFX to tell the player they got an extra ball?
            this.scoreIncrementForExtraBall-=SCORE_NEEDED_FOR_EXTRA_BALL;
        }
        
    }

    this.playAnimation = function(imageName, animationData, x, y) {
        //is it possible to only make these once and then play them when
        //we want to run them, rather than creating a new object every time?
        const newAnimation = new SpriteAnimation(
            imageName, 
            images[animationData.imageNames[imageName]],
            x, y,
            animationData.frames,
            animationData.frameWidth,
            animationData.frameHeight,
            animationData.frameTimes,
            animationData.reverses,
            animationData.loops);
            
       self.table.animations.push(newAnimation);
    }

    this.handleTriggerCollision = function(triggerEntity) {
        self.score += triggerEntity.score;
        self.scoreIncrementForExtraBall += triggerEntity.score; 
    }

    this.handleRotatingGateCollision = function(rotatingEntity) {
        //TODO: Add rotating gate score increasing logic
        self.score += rotatingEntity.score;
        self.scoreIncrementForExtraBall += rotatingEntity.score; 
    }
    this.handleHabitrailCollision = function(habitrailEntity) {
        for (const collider of habitrailEntity.relatedCollisionObjects) {
            for (var entity of this.collisionManager.entities) {
                if (entity.id == collider) {
                    entity.type = "wall";
                }
            }
        }
    }
}