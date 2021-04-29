//Game Play scene
// eslint-disable-next-line no-unused-vars

function GameScene() {
    // this.properties gets overwritten with SceneManager.js->setState([..], properties)
    // this.properties = selected_table;
    this.table = null;
    this.storedTables = [];
    this.collisionManager = null;
    this.storedCollisionManagers = [];
    this.collisionRate = 100;
    this.paused = false;
    this.tablesForScene = [];
    this.currentTableIndex = 0;
    this.lastTableIndex = 0;
    this.numberOfRemainingBalls = STARTING_BALLS_COUNT;
    this.hasPlungerReleased = false;
    this.score = 0;
    this.scoreIncrementForExtraBall = 0;
    this.bonusMultiplier = 1;
    this.bonusLive = false;
    this.bonusTime = 0;
    this.bonusLights = [];
    this.isColliding = false;
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
    this.slotMachines = [];
    this.bonusActivated = false;
    this.bananaCounter = 0;
    this.bananaMinSpawnTime = 5000;
    this.bananaMaxSpawnTime = 10000;
    this.bananaRandomSpawnTime = 0;
    this.bananaMinPositionX = 400;
    this.bananaMaxPositionX = 750;
    this.bananaMinPositionY = 100;
    this.bananaMaxPositionY = 450;

    // eslint-disable-next-line consistent-this
    const self = this

    this.transitionIn = function () {
        // console.log("Current Table Index: " + this.currentTableIndex);
        this.tablesForScene = [selected_table, selected_top_table];
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
        
        if (self.table.slotMachines.length > 0) {
            this.slotMachines = self.table.slotMachines;
        }

        for (var i = 0; i < this.slotMachines.length; i++) {
            const slotMachine = this.slotMachines[i];
            slotMachine.setDelegate(this);
        } 

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

        let musicToPlay = "Honky_Tonk_Piano_Loop";
        switch (selected_table) {
            case TABLES.Vam:
            case TABLES.Space:
                musicToPlay = "Space_Table_Maybe";
                break;
            case TABLES.Forest:
                musicToPlay = "Forest_table_Maybe";
                break;
            case TABLES.Aquarium:
                    musicToPlay = "Aquarium Table Music Loop";
                    break;
        }
        playLoopBackgroundMusic(musicToPlay);

        this.bananaRandomSpawnTime = this.getRandomNumberBetweenTwo(this.bananaMinSpawnTime, this.bananaMaxSpawnTime);
    }

    this.transitionOut = function () {        
        if (!this.gameHasFinished) {
            // console.log("Current Stored Tables: " + this.storedTables.length);
            this.storedTables[this.lastTableIndex] = this.table;
            this.storedCollisionManagers[this.lastTableIndex] = this.collisionManager;
            // console.log("Transitioning out. Stored table and collisions at index" + this.lastTableIndex);
        } else {
            stopBackgroundMusic();
            this.bonusLive = false;
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
                CHEATS_ACTIVE = true; //not toggling because key is rapid fire
                console.log("cheats on? "+ CHEATS_ACTIVE);
                return true;
            case ALIAS.CHEATS_ADD_POINTS:
                if(CHEATS_ACTIVE){
                    console.log ("adding cheat points");
                    incrementScore(3000);
                    checkForExtraBall();
                }
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
            case ALIAS.EXIT:
                if(self.paused){
                    self.storedTables = [];
                    self.storedCollisionManagers = [];
                    self.gameHasFinished = true;
                    self.paused = false;
                    SceneManager.setState(SCENE.TITLE);  
                }
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
                SceneManager.setState(SCENE.GAME, {tableName: selected_top_table, ball: ball, ballOffset: {x: 0, y: canvas.height}});
            } else if (ball.y > canvas.height) {
                SceneManager.setState(SCENE.GAME, {tableName: selected_table, ball: ball, ballOffset: {x: 0, y: canvas.height}});
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
        self.table.dynamicObjects.forEach((data) => {
            if (data.type === ENTITY_TYPE.Plug) {
                data.inactivate();
            } else if (data.subtype === 'knockdown') {
                data.active = true
            }
        })

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
            endBonusRound();
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

    const checkForRotatingGateScore = function(){
        if(self.remainingRotatingScore > 0){
            DEBUG_LOG(self.remainingRotatingScore);
            self.rotatingGateEntity.updateAnimationTiedToScore(self.remainingRotatingScore);

            if(self.remainingRotatingScore > 150){ 
                incrementScore(10);
                self.remainingRotatingScore-=10;
            } else {                          
                incrementScore(1);
                self.remainingRotatingScore--;
                
            }
        }else{
            if(self.rotatingGateEntity != null)
                self.rotatingGateEntity.resetRotatingGate();
        } 
    }
    
    const incrementScore = function(increment){
        self.score += increment * self.bonusMultiplier;
        self.scoreIncrementForExtraBall += increment * self.bonusMultiplier;    
    }
    
    const endBonusRound = function () {
        self.bonusMultiplier = 1;
        self.bonusTime = 0;
        self.bonusLive = false;
        if (selected_table == TABLES.Forest || selected_table == TABLES.ForestTop) {
            self.bananaMinSpawnTime = 5000;
            self.bananaMaxSpawnTime = 10000;
        }
        
        for (const togLight of self.bonusLights) {
            const togOff = togLight.turnOff();                        
        }
        self.bonusLights = [];
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
            SceneManager.setState(SCENE.GAME, selected_table);
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
            dynamicObj.update(deltaTime / 2, self.bonusActivated);
        }

        for (const staticObj of self.table.staticObjects) {
            if (staticObj.type === ENTITY_TYPE.Slot) {
                staticObj.update(deltaTime / 2, self.bonusActivated);
            }
        }

        self.bonusActivated = false;

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
            dynamicObj.update(deltaTime / 2, self.bonusActivated);
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
        if (self.bonusLive) {
            self.bonusTime -= deltaTime/1000;            
            if (self.bonusTime <= 0) {
                endBonusRound();
            }
        }
        //TODO: We'll need to change to figure out what to do about multi-ball
        if (DEBUG) {
            //originalBallAndTableTransition();
            determineBallAndTableState();
        } else {
            determineBallAndTableState();
        }

        if (selected_table == TABLES.Forest || selected_table == TABLES.ForestTop) {
            self.bananaCounter+=deltaTime;
            if(self.bananaCounter >= self.bananaRandomSpawnTime){
                DEBUG_LOG("[GameScene] Update: Banana counter >= banana random spawn time");
                self.bananaCounter = 0;
                self.getRandomNumberBetweenTwo(self.bananaMinSpawnTime, self.bananaMaxSpawnTime);
                var bananaEntity = {name: ENTITY_NAME.Banana};
                self.spawnEntity(bananaEntity)
            }
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
          colorText("press X to exit" , TEXT_LEFT_OFFSET, 210, Color.Red, Fonts.ButtonTitle, TextAlignment.Left, 1);   
          renderControlsInfo(TEXT_LEFT_OFFSET, 235, 20, TextAlignment.Left)

          drawRect(0,0,canvas.width,canvas.height, Color.BlackOverlay);
        }
        
        if (tilt) {
            colorText("[GAME TILT]", TEXT_LEFT_OFFSET, 60, Color.Red, Fonts.Subtitle, TextAlignment.Left, 1);
        } else if (currentShakes > 0) {
	        colorText("Warning...", TEXT_LEFT_OFFSET, 60, Color.Red, Fonts.Subtitle, TextAlignment.Left, 1);
        }
        if (self.bonusLive) {
            colorText("Bonus: " + self.bonusMultiplier + "X" + " (" + Math.round(self.bonusTime) + ")", TEXT_LEFT_OFFSET, canvas.height - 160, Color.Yellow, Fonts.Subtitle, TextAlignment.Left, 1);
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

        if(otherEntity.type !== ENTITY_TYPE.Banana && otherEntity.type !== ENTITY_TYPE.BananaTaken){
            //Not more collisions with the spawner so the spawner can be activated again (so it doesn´t spawn one entity per frame)
            this.isColliding = false;
        }
        switch (otherEntity.type) {
            case ENTITY_TYPE.CircleBumper:
                self.flash = true;
                DEBUG_LOG("otherEntity.score:" + otherEntity.score);
                incrementScore(otherEntity.score);
                if (otherEntity.hasAnimation) {
                    otherEntity.animate(0);
                } else {
                    self.playAnimation(otherEntity.body.name, ANIMATIONS.CIRCLE_BUMPER, otherEntity.x, otherEntity.y)
                }
                break;
            case ENTITY_TYPE.CircleBumperSmall:
                self.flash = true;
                DEBUG_LOG("otherEntity.score:" + otherEntity.score);
                incrementScore(otherEntity.score);
                self.playAnimation(otherEntity.body.name, ANIMATIONS.CIRCLE_BUMPER_SMALL, otherEntity.x, otherEntity.y);
                break;
            case ENTITY_TYPE.AsteroidBumper:
                incrementScore(otherEntity.score);
                //otherEntity.spawnMineral();
                asteroidBumperSound.play();
                
                break;
            case ENTITY_TYPE.FlipperBumper:
                //self.playAnimation(otherEntity.bodies[0].name, ANIMATIONS.FLIPPER_BUMPER, otherEntity.x, otherEntity.y);
                if (otherEntity.hasAnimation) {
                    otherEntity.animate(0);
                    bumperSound.play();
                }
                break;
            case ENTITY_TYPE.Earth:
                if (otherEntity.hasAnimation) {
                    incrementScore(otherEntity.score);
                    otherEntity.animate(0);
                    bumperSound.play();
                }
                break;
            case ENTITY_TYPE.Mars:
                if (otherEntity.hasAnimation) {
                    incrementScore(otherEntity.score);
                    otherEntity.animate(0);
                    bumperSound.play();
                }
                break;
            case ENTITY_TYPE.Jupiter:
                if (otherEntity.hasAnimation) {
                    incrementScore(otherEntity.score);
                    otherEntity.animate(0);
                    bumperSound.play();
                }
                break;
            case ENTITY_TYPE.Saturn:
                if (otherEntity.hasAnimation) {
                    incrementScore(otherEntity.score);
                    otherEntity.animate(0);
                    bumperSound.play();
                }
                break;    
            case ENTITY_TYPE.SideDrainBumper:
                if (otherEntity.hasAnimation) {
                    otherEntity.animate(0);
                    bumperSound.play();
                }
                break;
            case ENTITY_TYPE.WingBumper:
                if (otherEntity.hasAnimation) {
                    otherEntity.animate(0);
                }
                //self.playAnimation(otherEntity.bodies[0].name, ANIMATIONS.WING_BUMPER, otherEntity.x, otherEntity.y);
                //otherEntity.animating = true;
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
                incrementScore(otherEntity.score);
                this.collisionManager.unregisterEntity(otherEntity);
                if (otherEntity.hasAnimation) {
                    otherEntity.animate(0);
                }
                // self.playAnimation(otherEntity.body.name, ANIMATIONS.PLANE_EXPLOSION, otherEntity.x, otherEntity.y);
                break;
            case ENTITY_TYPE.Spawner:                
                DEBUG_LOG("[GameScene]: NotifyBallCollision() -> Spawner collision detected");
                if(!spawnerCollisionOn){
                    self.spawnEntity(otherEntity);
                    spawnerCollisionOn = true;
                }
                break;
            case ENTITY_TYPE.Banana:
                DEBUG_LOG("[GameScene]: NotifyBallCollision() -> Banana collision detected");
                if(!this.isColliding){
                    incrementScore(otherEntity.score);
                    self.removeEntity(otherEntity);
                    this.isColliding = true;
                }
                break;
            case ENTITY_TYPE.BananaTaken:
                DEBUG_LOG("[GameScene]: NotifyBallCollision() -> BananaTaken collision detected");
                if(!this.isColliding){
                    incrementScore(otherEntity.score);
                    self.removeEntity(otherEntity);
                    this.isColliding = true;
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
        if (!triggerEntity.active) return;
        incrementScore(triggerEntity.score);
        if (triggerEntity.targ_light) {
            const lightTarget = self.table.dynamicObjects.find((data) => data.id === triggerEntity.targ_light);            
            const targetLit = lightTarget.turnOn();
            this.bonusLights.push(lightTarget);
            // If light wasn't already lit, `trigger` any attached bonus switches
            if (targetLit) {
                // Send bonus light a trigger signal if this light is attached to a bonus condition
                if (lightTarget.bonusTargID) {
                    const bonusTarg = self.table.dynamicObjects.find((data) => data.id === lightTarget.bonusTargID);
                    const bonusLit = bonusTarg.triggerBonus();
                    if (bonusLit && bonusTarg.subtype === 'knockdown') {
                        const plug = self.table.dynamicObjects.find((data) => data.type === ENTITY_TYPE.Plug);
                        if (plug) {
                            plug.activate();
                        }
                    } else if (bonusLit) {
                        if (!this.bonusLive) {
                            this.bonusActivated = true;
                        }
                        this.bonusLights.push(bonusTarg);
                        this.bonusMultiplier = bonusTarg.bonusMult || 2;
                        this.bonusLive = true;
                        this.bonusTime = bonusTarg.bonusTime || 60;
                        if (selected_table == TABLES.Forest || selected_table == TABLES.ForestTop) {
                            DEBUG_LOG("DOUBLE BANANA");
                            self.bananaMinSpawnTime = 2000;
                            self.bananaMaxSpawnTime = 4000;
                        }
                    }
                }
            }
            if (triggerEntity.subtype === 'knockdown') triggerEntity.active = false;
        } else if (triggerEntity.subType === TRIGGER_TYPE.BallCatch) {
            ball.reset();
            if (this.currentTableIndex > 0) {
                self.transitionIn();
            }
        } else if (triggerEntity.slot_target) {
            const slotMachineTarget = self.slotMachines.find((data) => data.id === triggerEntity.slot_target);            
            slotMachineTarget.spin();
        }
    }

    this.handleRotatingGateCollision = function(rotatingEntity) {

        const rate = 0.01;
        self.rotatingGateEntity = rotatingEntity;
        let ballSpeed = Math.sqrt((this.properties.ball.velocity.x) * (this.properties.ball.velocity.x)
         + (this.properties.ball.velocity.y) * (this.properties.ball.velocity.y));

        self.remainingRotatingScore += Math.ceil(ballSpeed * rate) * rotatingEntity.score;
        if (rotatingEntity.isLeft) {
            const plug = self.table.dynamicObjects.find((data) => data.type === ENTITY_TYPE.Plug);
            if (plug) {
                plug.inactivate();
            }
        }
        
    }

    this.spawnEntity = function(spawnerEntity, otherType, otherTypeSpawnInfo) {
        // var type = null;
        let newObjectData;
        if(spawnerEntity != null){
            switch(spawnerEntity.name){
                case "spawner_plane":
                    newObjectData = self.table.getDynamicObject(ENTITY_TYPE.Plane);
                    newObjectData.dynamicObject.name = spawnerEntity.nextColor();
                    newObjectData.dynamicObject.score = spawnerEntity.nextScore();
                    newObjectData.dynamicObject.maxX = spawnerEntity.despawn;
                break;
                case ENTITY_NAME.Banana:
                    newObjectData = self.table.getDynamicObject(ENTITY_TYPE.Banana);
                break;
                default:
                    break;
            }
        }else if(otherType != null){
            switch(otherType){
                case ENTITY_TYPE.BananaTaken:
                    newObjectData = self.table.getDynamicObject(ENTITY_TYPE.BananaTaken);
                    DEBUG_LOG("Spawning Banana Taken");
                break;
                default:
                    break;
            }
        }

        if (newObjectData) {

            if(otherTypeSpawnInfo){
                newObjectData.dynamicObject.x = otherTypeSpawnInfo.x;
                newObjectData.dynamicObject.y = otherTypeSpawnInfo.y + newObjectData.dynamicObject.height;
                newObjectData.collisionBody.x = otherTypeSpawnInfo.body.center.x;
                newObjectData.collisionBody.y = otherTypeSpawnInfo.body.center.y;
            } else if(spawnerEntity.name == ENTITY_NAME.Banana){

                let randomPositionX = this.getRandomNumberBetweenTwo(this.bananaMinPositionX, this.bananaMaxPositionX);
                let randomPositionY = this.getRandomNumberBetweenTwo(this.bananaMinPositionY, this.bananaMaxPositionY);

                newObjectData.dynamicObject.x = randomPositionX;
                newObjectData.dynamicObject.y = randomPositionY + newObjectData.dynamicObject.height;
                newObjectData.collisionBody.x = randomPositionX + 15;
                newObjectData.collisionBody.y = randomPositionY + 12;
            }
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
        DEBUG_LOG("[GameScene]: RemoveEntity -> Entity name: " + entityToRemove.name);
        self.table.dynamicObjects.splice(self.table.dynamicObjects.indexOf(entityToRemove), 1);
        self.table.drawOrder.splice(self.table.drawOrder.indexOf(entityToRemove), 1);
        this.collisionManager.unregisterEntity(entityToRemove);
        if (entityToRemove.type === ENTITY_TYPE.Plane) {
            for (const obj of self.table.dynamicObjects) {
                if (obj.type === ENTITY_TYPE.Spawner && obj.name === ENTITY_NAME.SpawnerPlane) {
                    obj.childWasHit(entityToRemove);
                }
            }
        }
    }

    this.slotMachineFinishedSpinning = function (slotMachine) {
        var score = 0;
        switch (slotMachine.choice) {
            case SLOTMACHINE_CHOICES.random:
                score += 100;
                break;
            case SLOTMACHINE_CHOICES.cherry:
                score += 125;
                break;
            case SLOTMACHINE_CHOICES.seven:
                score += 200;
                break;
            case SLOTMACHINE_CHOICES.theme:
                score += 300;
                break;
            case SLOTMACHINE_CHOICES.hometeam:
                score += 10000;
                break;
            default:
                score += 50;
                break;
        }

        incrementScore(score);
    }

    this.getRandomNumberBetweenTwo = function(min, max){
        return Math.random() * (max - min) + min;
    }

}