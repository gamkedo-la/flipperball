//Game Play scene
// eslint-disable-next-line no-unused-vars

function GameScene() {
    // this.properties gets overwritten with SceneManager.js->setState([..], properties)
    this.properties = TABLES.Prototype;
    this.table = null;
    this.storedTables = [];
    this.collisionManager = null;
    this.storedCollisionManagers = [];
    this.collisionRate = 100;
    this.paused = false;
    this.tablesForScene = [TABLES.Prototype, TABLES.PrototypeTop];
    this.currentTableIndex = 0;
    this.lastTableIndex = 0;
    this.numberOfRemainingBalls = STARTING_BALLS_COUNT;
    this.hasPlungerReleased = false;
    this.score = 0;
    this.scoreIncrementForExtraBall = 0;
    this.rotatingGateEntity = null;
    this.remainingRotatingScore = 0;
    this.gameHasFinished = false;
    this.flashEnabled = true;
    this.flash = false;
    this.activeHabitrails = [];
    let shakeStartTime = -1;
    const shakeDuration = 500;
    let currentShakes = 0;
    const shakesBeforeTilt = 2;
    let tilt = false;
    let spawnerCollisionOn = false;

    // eslint-disable-next-line consistent-this
    const self = this

    this.transitionIn = function () {
        // console.log("Current Table Index: " + this.currentTableIndex);
        if (this.storedTables[this.currentTableIndex] && this.storedCollisionManagers[this.currentTableIndex]) {            
            this.table = this.storedTables[this.currentTableIndex];
            this.collisionManager = this.storedCollisionManagers[this.currentTableIndex];
        } else {
            this.table = new MapBuilder(this.properties.tableName);
            this.collisionManager = new CollisionManager();
            this.savedBall = this.properties.ball;
        }
        if (this.gameHasFinished) {
            // Reset numberOfRemainingBalls when we transition into a new game
            this.numberOfRemainingBalls = STARTING_BALLS_COUNT;
            this.score = 0;
            this.currentTableIndex = 0;

            // Restart music
            restartBackgroundMusic()

            this.gameHasFinished = false;
        }

        for (const dynamicObj of self.table.dynamicObjects) {
            if (dynamicObj.body || dynamicObj.bodies) {
                this.collisionManager.registerEntity(dynamicObj);
            }
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
            self.table.balls.length = 0;
            if (this.properties.ballOffset) {
                this.properties.ball.setPosition(this.properties.ball.x + this.properties.ballOffset.x, this.properties.ball.y + this.properties.ballOffset.y);
            }
            self.table.balls.push(this.properties.ball);
            this.collisionManager.registerBall(this.properties.ball);
            if (self.table.drawOrder.indexOf(this.properties.ball) < 0) {
                for (const obj of self.table.drawOrder) {
                    if (obj.zOrder > this.properties.ball.zOrder) {
                        self.table.drawOrder.splice(self.table.drawOrder.indexOf(obj), 0, this.properties.ball);
                        break;
                    }
                }
            }
        } else {
            // we lost the ball and are adding a new one to the scene? 
            for (const ball of self.table.balls) {                
                this.collisionManager.registerBall(ball);
            }
        }

        playLoopBackgroundMusic();
    }

    this.transitionOut = function () {        
        if (!this.gameHasFinished) {
            // console.log("Current Stored Tables: " + this.storedTables.length);
            this.storedTables[this.lastTableIndex] = this.table;
            this.storedCollisionManagers[this.lastTableIndex] = this.collisionManager;
            // console.log("Transitioning out. Stored table and collisions at index" + this.lastTableIndex);
        } else {
            stopBackgroundMusic();
        }
        
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
                    // console.log("Debug? " + DEBUG);
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
                if (DEBUG) {
                    // console.log("if(ball.y < 0)");
                    outputTableBallState(ball);
                }
                if (self.currentTableIndex < self.tablesForScene.length - 1) {
                    self.lastTableIndex = self.currentTableIndex;
                    self.currentTableIndex++;
                    SceneManager.setState(SCENE.GAME, { tableName: self.tablesForScene[self.currentTableIndex], ball: ball, ballOffset: { x: 0, y: canvas.height } });
                    
                    //TODO: FM: Determine when extra ball should actually be given to player
                    //Probably at some number of points and under some special circumstances
                    //extraBall();
                    if (DEBUG) {
                        // console.log("if(self.currentTableIndex < self.tablesForScene.length - 1)");
                        outputTableBallState(ball);
                    }
                }
            } else if (ball.y > canvas.height) {
                if (DEBUG) {
                    // console.log("else if (ball.y > canvas.height)");
                    outputTableBallState(ball);
                }
                if (self.currentTableIndex == 0) {
                    if (DEBUG) {
                        // console.log("if (self.currentTableIndex == 0)");
                        outputTableBallState(ball);
                    }
                    self.lastTableIndex = self.currentTableIndex;
                    loseBall(ball);
                    playRemainingBall();
                    if (!self.gameHasFinished) {
                        SceneManager.setState(SCENE.GAME, { tableName: self.tablesForScene[self.currentTableIndex], ball: ball, ballOffset: { x: 0, y: 0 } });
                        ball.reset();
                    }
                } else if (self.currentTableIndex >= self.tablesForScene.length - 1) {
                    self.lastTableIndex = self.currentTableIndex;
                    self.currentTableIndex--;                    
                    SceneManager.setState(SCENE.GAME, { tableName: self.tablesForScene[self.currentTableIndex], ball: ball, ballOffset: { x: 0, y: -canvas.height } });                    
                }
            }
        }
    }
    const outputTableBallState = function (ball) {
        // console.log("Ball Y:" + ball.y);
        // console.log("self.currenTableIndex:" + self.currentTableIndex);
        // console.log("self.tablesForScene.length:" + self.tablesForScene.length);
        // console.log("self.table.balls.length:" + self.table.balls.length);
        // console.log("-----");
    }        
    const loseBall = function(ball) {
        let ballIndex = self.table.balls.indexOf(ball);
        if (ballIndex !== -1) {
            //TODO: KYLE Get loseball back to working the way it did previously. I tore this up debugging other ball behavior
            //      and just needed it out of the way, but now that it's working it can be put back in place.
            //Setting properties.ball to undefined so it doesn´t propagate to the next TransitionIn()
            //self.properties.ball = undefined;
            //self.collisionManager.unregisterBall(ball);            
            //self.table.balls.splice(ballIndex, 1);
            for (const ball of self.table.balls) {
                ball.reset();
            }
            // console.log("self.table.balls.length: " + self.table.balls.length);
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

    const playRemainingBall = function () {        
        if (self.numberOfRemainingBalls > 0) {            
            self.numberOfRemainingBalls--;      
        } else {
            self.storedTables = [];
            self.storedCollisionManagers = [];
            self.gameHasFinished = true;            
            //TODO: This should be a game over scene once we've got it
            SceneManager.setState(SCENE.GAMEOVER);
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

    var checkForRotatingGateScore = function(){
        if(self.remainingRotatingScore > 0){
            if(DEBUG){
                console.log(self.remainingRotatingScore);
            }

            self.rotatingGateEntity.updateAnimationTiedToScore(self.remainingRotatingScore);

            if(self.remainingRotatingScore > 150){
                self.score+=10;
                self.scoreIncrementForExtraBall+=10; 
                self.remainingRotatingScore-=10;
            } else {
            
                self.score++;
                self.scoreIncrementForExtraBall++; 
                self.remainingRotatingScore--;
                
            }
        }else{
            if(self.rotatingGateEntity != null)
                self.rotatingGateEntity.resetRotatingGate();
        } 
    }

    var checkForExtraBall = function(){
        if(self.scoreIncrementForExtraBall >= SCORE_NEEDED_FOR_EXTRA_BALL){
            extraBall();
            //Maybe add a SFX to tell the player they got an extra ball?
            self.scoreIncrementForExtraBall-=SCORE_NEEDED_FOR_EXTRA_BALL;
        }
    }

    this.restartScene = function(force=false) {
        if (isGameOver() || force) {            
            self.storedTables = [];
            self.storedCollisionManagers = [];
            self.gameHasFinished = true;
            SceneManager.setState(SCENE.GAME, TABLES.Prototype);
        }
    }

    const isGameOver = function () {        
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

        checkForRotatingGateScore();

        checkForExtraBall();

        //TODO: We'll need to change to figure out what to do about multi-ball
        if (DEBUG) {
            //originalBallAndTableTransition();
            determineBallAndTableState();
        } else {
            determineBallAndTableState();
        }
    }

    const draw = function() {
        drawRect(0, 0, canvas.width, canvas.height, Color.Black);

        for (const obj of self.table.drawOrder) {
            obj.draw();
        }

        for (const animation of self.table.animations) {
            animation.draw();
        }

        if (self.flashEnabled && self.flash){
          drawRect(0, 0, canvas.width, canvas.height, Color.WhiteFlash);
          self.flash = false;
        }

        drawRect(0, 0, self.table.minX, canvas.height, Color.Black);

        if (self.paused) {
          colorText("[GAME PAUSED]" , TEXT_LEFT_OFFSET, 120, Color.Red, Fonts.Subtitle, TextAlignment.Left, 1);    
          colorText("press P to resume" , TEXT_LEFT_OFFSET, 150, Color.Red, Fonts.ButtonTitle, TextAlignment.Left, 1);    
          colorText("press R to restart" , TEXT_LEFT_OFFSET, 180, Color.Red, Fonts.ButtonTitle, TextAlignment.Left, 1);   
          renderControlsInfo(TEXT_LEFT_OFFSET, 205, 20, TextAlignment.Left)

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

    this.notifyBallCollision = function(otherEntity, ball) {    
        if(otherEntity.type !== ENTITY_TYPE.Spawner){
            //Not more collisions with the spawner so the spawner can be activated again (so it doesn´t spawn one entity per frame)
            spawnerCollisionOn = false;
        }
        switch (otherEntity.type) {
            case ENTITY_TYPE.CircleBumper:
                self.flash = true;
                if (DEBUG) {
                    console.log("otherEntity.score:" + otherEntity.score);
                }
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
                if (DEBUG) {
                    console.log("otherEntity.score:" + otherEntity.score);
                }
                self.score += otherEntity.score;   
                self.scoreIncrementForExtraBall += otherEntity.score; 
                self.playAnimation(otherEntity.body.name, ANIMATIONS.CIRCLE_BUMPER_SMALL, otherEntity.x, otherEntity.y);
                break;
            case ENTITY_TYPE.FlipperBumper:
                self.playAnimation(otherEntity.bodies[0].name, ANIMATIONS.FLIPPER_BUMPER, otherEntity.x, otherEntity.y);
                break;  
            case ENTITY_TYPE.Trigger:
                self.handleTriggerCollision(otherEntity, ball);
                break;
            case ENTITY_TYPE.RotatingGate:
                self.handleRotatingGateCollision(otherEntity);
                break;
            case ENTITY_TYPE.Habitrail:
                self.handleHabitrailCollision(otherEntity);
                break;
            case ENTITY_TYPE.Plane:
                self.score += otherEntity.score;  
                self.scoreIncrementForExtraBall += otherEntity.score; 
                this.collisionManager.unregisterEntity(otherEntity);
                if (otherEntity.hasAnimation) {
                    otherEntity.animate(0);
                }
                // self.playAnimation(otherEntity.body.name, ANIMATIONS.PLANE_EXPLOSION, otherEntity.x, otherEntity.y);
                break;
            case ENTITY_TYPE.Spawner:
                
                if(DEBUG){
                    console.log("[GameScene]: NotifyBallCollision() -> Spawner collision detected");
                }
                if(!spawnerCollisionOn){
                    self.handleSpawnerCollision(otherEntity);
                    spawnerCollisionOn = true;
                }
                break;
            default:
                break;
        }
        
        if (otherEntity.type != ENTITY_TYPE.Habitrail && this.activeHabitrails.length > 0 && otherEntity.body?.name != 'habitrail') {
            this.disableHabitrailColliders();
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

    this.handleTriggerCollision = function (triggerEntity, ball) {
        self.score += triggerEntity.score;
        self.scoreIncrementForExtraBall += triggerEntity.score;
        if (triggerEntity.targ_light) {
            const lightTarget = self.table.dynamicObjects.find((data) => data.id === triggerEntity.targ_light);
            //lightTarget.currentFrame = lightTarget.frames;
            self.playAnimation(lightTarget.name, ANIMATIONS.LETTER_LIGHT, lightTarget.x, lightTarget.y);
        } else if (triggerEntity.subType === TRIGGER_TYPE.BallCatch) {
            ball.reset();
            self.transitionIn();
        }
    }

    this.handleRotatingGateCollision = function(rotatingEntity) {

        const rate = 0.01;
        self.rotatingGateEntity = rotatingEntity;
        let ballSpeed = Math.sqrt((this.properties.ball.velocity.x) * (this.properties.ball.velocity.x)
         + (this.properties.ball.velocity.y) * (this.properties.ball.velocity.y));

        self.remainingRotatingScore += Math.ceil(ballSpeed * rate) * rotatingEntity.score;
        
    }

    this.handleSpawnerCollision = function(spawnerEntity) {
        // var type = null;
        let newObjectData;

        switch(spawnerEntity.name){
            case "spawner_plane":
                newObjectData = self.table.getDynamicObject(ENTITY_TYPE.Plane);
                newObjectData.dynamicObject.name = spawnerEntity.nextColor();
                newObjectData.dynamicObject.score = spawnerEntity.nextScore();
            break;
            default:
                break;
        }

        if (newObjectData) {
            const newObject = self.table.addDynamicObjectWithData(newObjectData.dynamicObject, newObjectData.collisionBody);
            for (const obj of self.table.drawOrder) {
                if (obj.zOrder > newObject.zOrder) {
                    self.table.drawOrder.splice(self.table.drawOrder.indexOf(obj), 0, newObject);
                    break;
                }
            }
            self.table.dynamicObjects.push(newObject);
            if (newObject.body || newObject.bodies) {
                this.collisionManager.registerEntity(newObject);
            }
        }
        // if(type !== null) {
        //     const dynamicObj = self.table.getDynamicObject(type);
        //     if(dynamicObj) {
        //         self.table.drawOrder.splice(self.table.dynamicObjectsFirstIndex, 0, dynamicObj);
        //         self.table.dynamicObjects.push(dynamicObj);
        //         if (dynamicObj.body || dynamicObj.bodies) {
        //             this.collisionManager.registerEntity(dynamicObj);
        //         }
        //     }
        // }
    }
    this.handleHabitrailCollision = function(habitrailEntity) {
        if (this.activeHabitrails.indexOf(habitrailEntity) != -1) {
            return;
        }
        for (var collider of habitrailEntity.relatedCollisionObjects) {
            for (var entity of this.collisionManager.entities.values()) {
                if ('id' in entity) {
                    if (entity.id == collider) {
                        entity.type = 'wall';
                    }
                }
            }
        }
        this.activeHabitrails.push(habitrailEntity);
    }

    this.disableHabitrailColliders = function() {
        for (const habitrail of this.activeHabitrails) {
            for (var collider of habitrail.relatedCollisionObjects) {
                for (var entity of this.collisionManager.entities.values()) {
                    if ('id' in entity) {
                        if (entity.id == collider) {
                            entity.type = 'NA';
                        }
                    }
                }
            }
        }
        this.activeHabitrails = [];
    }

    this.removeEntity = function (entityToRemove) {
        self.table.dynamicObjects.splice(self.table.dynamicObjects.indexOf(entityToRemove), 1);
        self.table.drawOrder.splice(self.table.drawOrder.indexOf(entityToRemove), 1);
        if (entityToRemove.type === ENTITY_TYPE.Plane) {
            for (const obj of self.table.dynamicObjects) {
                if (obj.type === ENTITY_TYPE.Spawner && obj.name === ENTITY_NAME.SpawnerPlane) {
                    obj.childWasHit(entityToRemove);
                }
            }
        }
    }
}