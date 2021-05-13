//Game Play scene
// eslint-disable-next-line no-unused-vars

function GameScene() {
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
  this.highScore = localStorage.getItem("highScoreStorage");
  this.highScoreStorage = localStorage.getItem("highScoreStorage");
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
  let userModifiedVolume = false;
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
  const self = this;

  this.transitionIn = function () {
    console.log('transitionIn was just called');
    console.log(this.storedTables[this.currentTableIndex]);
    this.tablesForScene = [selected_table, selected_top_table];
    if (
      this.storedTables[this.currentTableIndex] &&
      this.storedCollisionManagers[this.currentTableIndex]
    ) {
      this.table = this.storedTables[this.currentTableIndex];
      console.log(this.storedTables[this.currentTableIndex]);
      this.collisionManager = this.storedCollisionManagers[
        this.currentTableIndex
      ];
    } else {
      if (this.currentTableIndex === 0) {
        stopBackgroundMusic();
      }
      this.table = new MapBuilder(this.properties.tableName);
      //console.log(this.storedTables);
      this.collisionManager = new CollisionManager();
      this.savedBall = this.properties.ball;
    }
    if (this.gameHasFinished) {
      // Reset numberOfRemainingBalls when we transition into a new game
      this.numberOfRemainingBalls = STARTING_BALLS_COUNT;
      this.score = 0;
      this.currentTableIndex = 0;

      // Restart music
      restartBackgroundMusic();

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

    if (self.table.plunger) {
      this.collisionManager.registerPlunger(self.table.plunger);
    }

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
        this.properties.ball.setPosition(
          this.properties.ball.x + this.properties.ballOffset.x,
          this.properties.ball.y + this.properties.ballOffset.y
        );
      }
      self.table.balls.push(this.properties.ball);
      this.collisionManager.registerBall(this.properties.ball);
      if (self.table.drawOrder.indexOf(this.properties.ball) < 0) {
        for (const obj of self.table.drawOrder) {
          if (obj.zOrder > this.properties.ball.zOrder) {
            self.table.drawOrder.splice(
              self.table.drawOrder.indexOf(obj),
              0,
              this.properties.ball
            );
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
            musicToPlay = "VAM_Empire_Table_Loop";
            
        break;
      case TABLES.Space:
        musicToPlay = "Space_Table_Music_Loop";
        break;
      case TABLES.Forest:
        musicToPlay = "Forest_Table_Loop";
        break;
      case TABLES.Aquarium:
        musicToPlay = "Aquarium_Table_Music_Loop";
        break;
    }
      playLoopBackgroundMusic(musicToPlay);
        
      if(localStorage.getItem(localStorageKey.MusicVolume) != null){
        currentMusicVolume = parseFloat(localStorage.getItem(localStorageKey.MusicVolume));
      }else{
        currentMusicVolume = userModifiedVolume?currentMusicVolume:defaultMusicVolume;
      }

      setMusicVolume(currentMusicVolume);

    this.bananaRandomSpawnTime = this.getRandomNumberBetweenTwo(
      this.bananaMinSpawnTime,
      this.bananaMaxSpawnTime
    );
  };

  this.transitionOut = function () {
    if (!this.gameHasFinished) {
      this.storedTables[this.lastTableIndex] = this.table;
      this.storedCollisionManagers[this.lastTableIndex] = this.collisionManager;
    } else {
      stopBackgroundMusic();
      this.bonusLive = false;
    }
  };

  this.run = function (deltaTime) {
    update(deltaTime);
    draw(deltaTime);
  };

  this.control = function (newKeyEvent, pressed, pressedKeys) {
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
        return true;
      case ALIAS.CHEATS_ADD_POINTS:
        if (CHEATS_ACTIVE) {
          incrementScore(3000);
          checkForExtraBall();
        }
        return true;
      case ALIAS.DEBUG:
        if (pressed) {

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
        if (pressed) {
          userModifiedVolume = true;
          turnVolumeUp();
        }
        return true;
      case ALIAS.VOLUME_DOWN:
        if (pressed) {
          userModifiedVolume = true;
          turnVolumeDown();
        }
        return true;
      case ALIAS.SFX_VOLUME_UP:
        if (pressed) {
          userModifiedVolume = true;
          turnSFXVolumeUp();
        }
        return true;
      case ALIAS.SFX_VOLUME_DOWN:
        if (pressed) {
          userModifiedVolume = true;
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
        if (pressed) {
          this.flashEnabled = !this.flashEnabled;
        }
        return true;
      case ALIAS.EXIT:
        if (self.paused) {
          self.storedTables = [];
          self.storedCollisionManagers = [];
          self.gameHasFinished = true;
          self.paused = false;
          SceneManager.setState(SCENE.TITLE);
        }
    }

    return false;
  };

  this.shakeScene = function (pressed) {
    if (!pressed) {
      return;
    }

    if (tilt) {
      return;
    }

    if (this.paused) {
      return;
    }

    currentShakes++;
    if (shakeStartTime != -1) {
      if (currentShakes >= shakesBeforeTilt) {
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
  };

  function shakeAnimation() {
    requestAnimationFrame(shakeAnimation); // tells the context to save animation
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    shakeCanvasMovement();

    //drawing scene
    update(0);
    draw(0);

    if (shakeStartTime == -1) {
      // shake endend -> return
      return;
    }
    canvasContext.restore();
  }

  function shakeCanvasMovement() {
    if (shakeStartTime === -1) {
      // shake ended -> no move
      currentShakes = 0;
      return;
    }

    const dt = Date.now() - shakeStartTime; // actual shake duration

    if (dt > shakeDuration) {
      // shake duration limit reached -> stop
      currentShakes = 0;
      shakeStartTime = -1;
      return;
    }

    canvasContext.save();

    const dx = Math.random() * 10; // increase or drecrease horizontal shake effect
    const dy = Math.random() * 10; // increase or drecrease vertical shake effect

    canvasContext.translate(dx, dy);
  }

  this.pauseScene = function (pressed) {
    if (pressed) {
      this.paused = !this.paused;
      if (this.paused) {
        pauseSoundAndMusic();
      } else {
        resumeSoundAndMusic();
      }
    }
  };

  const determineBallAndTableState = function () {
    for (const ball of self.table.balls) {
      if (ball.y < 0) {
        if (DEBUG) {
          outputTableBallState(ball);
        }
        if (self.currentTableIndex < self.tablesForScene.length - 1) {
          self.lastTableIndex = self.currentTableIndex;
          self.currentTableIndex++;
          SceneManager.setState(SCENE.GAME, {
            tableName: self.tablesForScene[self.currentTableIndex],
            ball: ball,
            ballOffset: { x: 0, y: canvas.height },
          });

          if (DEBUG) {
            outputTableBallState(ball);
          }
        }
      } else if (ball.y > canvas.height) {
        if (DEBUG) {
          outputTableBallState(ball);
        }
        if (self.currentTableIndex == 0) {
          if (DEBUG) {
            outputTableBallState(ball);
          }
          self.lastTableIndex = self.currentTableIndex;
          loseBall(ball);
          playRemainingBall();
          if (!self.gameHasFinished) {
            SceneManager.setState(SCENE.GAME, {
              tableName: self.tablesForScene[self.currentTableIndex],
              ball: ball,
              ballOffset: { x: 0, y: 0 },
            });
            ball.reset();
          }
        } else if (self.currentTableIndex >= self.tablesForScene.length - 1) {
          self.lastTableIndex = self.currentTableIndex;
          self.currentTableIndex--;
          SceneManager.setState(SCENE.GAME, {
            tableName: self.tablesForScene[self.currentTableIndex],
            ball: ball,
            ballOffset: { x: 0, y: -canvas.height },
          });
        }
      }
    }
  };
  const outputTableBallState = function (ball) {
  };
  const loseBall = function (ball) {
    self.table.dynamicObjects.forEach((data) => {
      if (data.type === ENTITY_TYPE.Plug) {
        data.inactivate();
      } else if (data.subtype === "shuttle") {
        data.active = true;
        if (data.updateLightState) {
          data.updateLightState(false);
        }
      }
    });

    let ballIndex = self.table.balls.indexOf(ball);
    if (ballIndex !== -1) {
      for (const ball of self.table.balls) {
        ball.reset();
      }
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
  };

  const extraBall = function () {
    self.numberOfRemainingBalls++;
    freePlaySound.play();
  };

  const playRemainingBall = function () {
    if (self.numberOfRemainingBalls > 0) {
      self.numberOfRemainingBalls--;
    } else {
      self.storedTables = [];
      self.storedCollisionManagers = [];
      self.gameHasFinished = true;
      endBonusRound();
      stopBackgroundMusic();

      //console.log(self.storedTables);
      //console.log(self.storedTables[self.currentTableIndex]);
      //console.log(this.storedTables); not even defined, use `self`, not `this`
      //console.log(this.storedTables[this.currentTableIndex]);
      if (self.score > self.highScore) {
        self.highScore = self.score;
        localStorage.setItem("highScoreStorage", self.score);
      } //set the new high score both as a property and as storage

      SceneManager.setState(SCENE.GAMEOVER);
    }
  };

  this.releasePlunger = function () {
  };

  this.incrementScoreFromObject = function (score) {
    incrementScore(score);
  };

  const checkForRotatingGateScore = function () {
    if (self.remainingRotatingScore > 0) {
      self.rotatingGateEntity.updateAnimationTiedToScore(
        self.remainingRotatingScore
      );

      if (self.remainingRotatingScore > 150) {
        incrementScore(10);
        self.remainingRotatingScore -= 10;
      } else {
        incrementScore(1);
        self.remainingRotatingScore--;
      }
    } else {
      if (self.rotatingGateEntity != null)
        self.rotatingGateEntity.resetRotatingGate();
    }
  };

  const incrementScore = function (increment) {
    self.score += increment * self.bonusMultiplier;
    self.scoreIncrementForExtraBall += increment * self.bonusMultiplier;
  };

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
  };

  var checkForExtraBall = function () {
    if (self.scoreIncrementForExtraBall >= SCORE_NEEDED_FOR_EXTRA_BALL) {
      extraBall();
      self.scoreIncrementForExtraBall -= SCORE_NEEDED_FOR_EXTRA_BALL;
    }
  };

  this.restartScene = function (force = false) {
    if (isGameOver() || force) {
      self.storedTables = [];
      self.storedCollisionManagers = [];
      self.gameHasFinished = true;
      SceneManager.setState(SCENE.GAME, selected_table);
    }
  };

  const isGameOver = function () {
    return self.table.balls.length == 0;
  };

  const update = function (deltaTime) {
    if (self.paused) {
      return;
    }

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

      if (self.table.plunger) {
        self.table.plunger.update(deltaTime / self.collisionRate);
      }

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

    self.collisionManager.checkCollisions(deltaTime / 2);

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

      if (self.table.plunger) {
        self.table.plunger.update(deltaTime / self.collisionRate);
      }

      self.collisionManager.checkBallFlipperCollisions();
    }

    for (const dynamicObj of self.table.dynamicObjects) {
      dynamicObj.update(deltaTime / 2, self.bonusActivated);
    }

    self.collisionManager.checkCollisions(deltaTime / 2);

    for (let i = self.table.animations.length - 1; i >= 0; i--) {
      const animation = self.table.animations[i];
      animation.update(deltaTime);
      if (animation.isFinished) {
        // remove finished animations
        self.table.animations.splice(i, 1);
      }
    }

    checkForRotatingGateScore();

    checkForExtraBall();
    if (self.bonusLive) {
      self.bonusTime -= deltaTime / 1000;
      if (self.bonusTime <= 0) {
        endBonusRound();
      }
    }
    determineBallAndTableState();

    if (selected_table == TABLES.Forest || selected_table == TABLES.ForestTop) {
      self.bananaCounter += deltaTime;
      if (self.bananaCounter >= self.bananaRandomSpawnTime) {
        self.bananaCounter = 0;
        self.getRandomNumberBetweenTwo(
          self.bananaMinSpawnTime,
          self.bananaMaxSpawnTime
        );
        var bananaEntity = { name: ENTITY_NAME.Banana };
        self.spawnEntity(bananaEntity);
      }
    }
  };

  const draw = function () {
    drawRect(0, 0, canvas.width, canvas.height, Color.Black);

    for (const obj of self.table.drawOrder) {
      obj.draw();
    }

    for (const animation of self.table.animations) {
      animation.draw();
    }

    if (self.flashEnabled && self.flash) {
      drawRect(0, 0, canvas.width, canvas.height, Color.WhiteFlash);
      self.flash = false;
    }

    drawRect(0, 0, self.table.minX, canvas.height, Color.Black);

    if (self.paused) {
      colorText(
        "[GAME PAUSED]",
        TEXT_LEFT_OFFSET,
        120,
        Color.Red,
        Fonts.Subtitle,
        TextAlignment.Left,
        1
      );
      colorText(
        "press P to resume",
        TEXT_LEFT_OFFSET,
        150,
        Color.Red,
        Fonts.ButtonTitle,
        TextAlignment.Left,
        1
      );
      colorText(
        "press R to restart",
        TEXT_LEFT_OFFSET,
        180,
        Color.Red,
        Fonts.ButtonTitle,
        TextAlignment.Left,
        1
      );
      colorText(
        "press X to exit",
        TEXT_LEFT_OFFSET,
        210,
        Color.Red,
        Fonts.ButtonTitle,
        TextAlignment.Left,
        1
      );
      renderControlsInfo(TEXT_LEFT_OFFSET, 235, 20, TextAlignment.Left);

      drawRect(0, 0, canvas.width, canvas.height, Color.BlackOverlay);
    }

    if (tilt) {
      colorText(
        "[GAME TILT]",
        TEXT_LEFT_OFFSET,
        60,
        Color.Red,
        Fonts.Subtitle,
        TextAlignment.Left,
        1
      );
    } else if (currentShakes > 0) {
      colorText(
        "Warning...",
        TEXT_LEFT_OFFSET,
        60,
        Color.Red,
        Fonts.Subtitle,
        TextAlignment.Left,
        1
      );
    }
    if (self.bonusLive) {
      colorText(
        "Bonus: " +
          self.bonusMultiplier +
          "X" +
          " (" +
          Math.round(self.bonusTime) +
          ")",
        TEXT_LEFT_OFFSET,
        canvas.height - 200,
        Color.Yellow,
        Fonts.Subtitle,
        TextAlignment.Left,
        1
      );
    }
    colorText(
      "Score: " + self.score,
      TEXT_LEFT_OFFSET,
      canvas.height - 160,
      Color.White,
      Fonts.Subtitle,
      TextAlignment.Left,
      1
    );

    if (self.highScore) {
      //console.log(self.table); //that is a map builder object, not useful to me.
      //console.log(self.storedTables[self.currentTableIndex]); //idk if this _also_ uses the `self` alias, but let's try it
      //console.log(this.storedTables); //undefined
      //console.log(self.storedTables); //it's an empty array...
      colorText(
        "High Score: " + self.highScore,
        TEXT_LEFT_OFFSET,
        canvas.height - 120,
        Color.White,
        Fonts.Subtitle,
        TextAlignment.Left,
        1
      );
      colorText(
        "No. of plays left: " + self.numberOfRemainingBalls,
        TEXT_LEFT_OFFSET,
        canvas.height - 80,
        Color.White,
        Fonts.Subtitle,
        TextAlignment.Left,
        1
      );
    } else {
      colorText(
        "No. of plays left: " + self.numberOfRemainingBalls,
        TEXT_LEFT_OFFSET,
        canvas.height - 120,
        Color.White,
        Fonts.Subtitle,
        TextAlignment.Left,
        1
      );
    }

    if (isGameOver()) {
      colorText(
        "Press 'r' to Restart",
        135,
        canvas.height / 2,
        Color.Red,
        Fonts.Subtitle,
        TextAlignment.Center,
        1
      );
    }
  };

  this.notifyBallCollision = function (otherEntity, ball) {
    if (otherEntity.type !== ENTITY_TYPE.Spawner) {
      //Not more collisions with the spawner so the spawner can be activated again (so it doesn´t spawn one entity per frame)
      spawnerCollisionOn = false;
    }

    if (
      otherEntity.type !== ENTITY_TYPE.Banana &&
      otherEntity.type !== ENTITY_TYPE.BananaTaken
    ) {
      //Not more collisions with the spawner so the spawner can be activated again (so it doesn´t spawn one entity per frame)
      this.isColliding = false;
    }
    switch (otherEntity.type) {
      case ENTITY_TYPE.CircleBumper:
        self.flash = true;
        incrementScore(otherEntity.score);
        if (otherEntity.hasAnimation) {
          otherEntity.animate(0);
        } else {
          self.playAnimation(
            otherEntity.body.name,
            ANIMATIONS.CIRCLE_BUMPER,
            otherEntity.x,
            otherEntity.y
          );
        }
        break;
      case ENTITY_TYPE.CircleBumperSmall:
        self.flash = true;
        incrementScore(otherEntity.score);
        self.playAnimation(
          otherEntity.body.name,
          ANIMATIONS.CIRCLE_BUMPER_SMALL,
          otherEntity.x,
          otherEntity.y
        );
        bumperSound.play();
        break;
      case ENTITY_TYPE.AsteroidBumper:
        incrementScore(otherEntity.score);

        self.spawnEntity(otherEntity);
        asteroidBumperSound.play();

        break;
      case ENTITY_TYPE.VamMineral:
        incrementScore(otherEntity.score);
        this.collisionManager.unregisterEntity(otherEntity);
        self.removeEntity(otherEntity);
        mineralPickupSound.play();
        break;
      case ENTITY_TYPE.FlipperBumper:
        if (otherEntity.hasAnimation) {
          otherEntity.animate(0);
          bumperSound.play();
        }
        break;
      case ENTITY_TYPE.Earth:
        if (otherEntity.hasAnimation) {
          incrementScore(otherEntity.getScore());
          otherEntity.animate(0);
          bumperSound.play();
        }
        break;
      case ENTITY_TYPE.Mars:
        if (otherEntity.hasAnimation) {
          incrementScore(otherEntity.getScore());
          otherEntity.animate(0);
          bumperSound.play();
        }
        break;
      case ENTITY_TYPE.Jupiter:
        if (otherEntity.hasAnimation) {
          incrementScore(otherEntity.getScore());
          otherEntity.animate(0);
          bumperSound.play();
        }
        break;
      case ENTITY_TYPE.Saturn:
        if (otherEntity.hasAnimation) {
          incrementScore(otherEntity.getScore());
          otherEntity.animate(0);
          bumperSound.play();
        }
        break;
      case ENTITY_TYPE.Sputnik:
        incrementScore(otherEntity.score);
        bumperSound.play();
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
        explosionSound.play();
        if (otherEntity.hasAnimation) {
          otherEntity.animate(0);
        }
        break;
      case ENTITY_TYPE.Spawner:
        if (!spawnerCollisionOn) {
          self.spawnEntity(otherEntity);
          spawnerCollisionOn = true;
        }
        break;
      case ENTITY_TYPE.Banana:
        if (!this.isColliding) {
          incrementScore(otherEntity.score);
          self.removeEntity(otherEntity);
          this.isColliding = true;
          bananaSound.play();
        }
        break;
      case ENTITY_TYPE.BananaTaken:
        if (!this.isColliding) {
          incrementScore(otherEntity.score);
          self.removeEntity(otherEntity);
          this.isColliding = true;
          bananaSound.play();
        }
        break;
      case ENTITY_TYPE.Card:
        if (!otherEntity.isSpinning && !otherEntity.isFaceUp) {
          otherEntity.flipCard();
        }
        break;
      default:
        break;
    }

    if (
      otherEntity.type != ENTITY_TYPE.Habitrail &&
      this.activeHabitrails.length > 0 &&
      otherEntity.body?.name != "habitrail"
    ) {
      this.disableHabitrailColliders();
    }
  };

  this.playAnimation = function (imageName, animationData, x, y) {
    const newAnimation = new SpriteAnimation(
      imageName,
      images[animationData.imageNames[imageName]],
      x,
      y,
      animationData.frames,
      animationData.frameWidth,
      animationData.frameHeight,
      animationData.frameTimes,
      animationData.reverses,
      animationData.loops
    );

    self.table.animations.push(newAnimation);
  };

    this.handleTriggerCollision = function (triggerEntity, ball) {
        if (!triggerEntity.active) return;
        incrementScore(triggerEntity.score);
        if (triggerEntity.targ_light) {
            const lightTarget = self.table.dynamicObjects.find(
                (data) => data.id === triggerEntity.targ_light
            );
            const targetLit = lightTarget.turnOn();
            this.bonusLights.push(lightTarget);
            // If light wasn't already lit, `trigger` any attached bonus switches
            if (targetLit) {
                if (lightTarget.name == "energy_light") {
                    energyLightSound.play();
                }
                // Send bonus light a trigger signal if this light is attached to a bonus condition
                if (lightTarget.bonusTargID) {
                    const bonusTarg = self.table.dynamicObjects.find(
                        (data) => data.id === lightTarget.bonusTargID
                    );
                    const bonusLit = bonusTarg.triggerBonus();
                    if (bonusLit && bonusTarg.subtype === "shuttle") {
                        const plug = self.table.dynamicObjects.find(
                            (data) => data.type === ENTITY_TYPE.Plug
                        );
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
                        if (lightTarget.name == "energy_light") {
                            energyLightBonusSound.play();
                        }
                        if (
                            selected_table == TABLES.Forest ||
                            selected_table == TABLES.ForestTop
                        ) {
                            self.bananaMinSpawnTime = 2000;
                            self.bananaMaxSpawnTime = 4000;
                        }
                    }
                }
            }
            if (triggerEntity.subtype === "shuttle") triggerEntity.active = false;
        } else if (triggerEntity.subType === TRIGGER_TYPE.BallCatch) {
            ball.reset();
            if (this.currentTableIndex > 0) {
                self.transitionIn();
            }
        } else if (triggerEntity.slot_target) {
            const slotMachineTarget = self.slotMachines.find(
                (data) => data.id === triggerEntity.slot_target
            );
            slotMachineTarget.spin();
        }
    };

  this.handleRotatingGateCollision = function (rotatingEntity) {
    const rate = 0.01;
    self.rotatingGateEntity = rotatingEntity;
    let ballSpeed = Math.sqrt(
      this.properties.ball.velocity.x * this.properties.ball.velocity.x +
        this.properties.ball.velocity.y * this.properties.ball.velocity.y
    );

    self.remainingRotatingScore +=
      Math.ceil(ballSpeed * rate) * rotatingEntity.score;
    if (rotatingEntity.isLeft) {
      const plug = self.table.dynamicObjects.find(
        (data) => data.type === ENTITY_TYPE.Plug
      );
      if (plug) {
        plug.inactivate();
      }
    }
  };

  this.spawnEntity = function (spawnerEntity, otherType, otherTypeSpawnInfo) {
    let newObjectData;
    if (spawnerEntity != null) {
      switch (spawnerEntity.name) {
        case "spawner_plane":
          newObjectData = self.table.getDynamicObject(ENTITY_TYPE.Plane);
          newObjectData.dynamicObject.name = spawnerEntity.nextColor();
          newObjectData.dynamicObject.score = spawnerEntity.nextScore();
          newObjectData.dynamicObject.maxX = spawnerEntity.despawn;
          break;
        case ENTITY_NAME.Banana:
          newObjectData = self.table.getDynamicObject(ENTITY_TYPE.Banana);
          break;
        case ENTITY_TYPE.AsteroidBumper:
          newObjectData = self.table.getDynamicObject(ENTITY_TYPE.VamMineral);
          break;
        default:
          break;
      }
    } else if (otherType != null) {
      switch (otherType) {
        case ENTITY_TYPE.BananaTaken:
          newObjectData = self.table.getDynamicObject(ENTITY_TYPE.BananaTaken);
          break;
        default:
          break;
      }
    }

    if (newObjectData) {
      if (otherTypeSpawnInfo) {
        newObjectData.dynamicObject.x = otherTypeSpawnInfo.x;
        newObjectData.dynamicObject.y =
          otherTypeSpawnInfo.y + newObjectData.dynamicObject.height;
        newObjectData.collisionBody.x = otherTypeSpawnInfo.body.center.x;
        newObjectData.collisionBody.y = otherTypeSpawnInfo.body.center.y;
      } else if (spawnerEntity.name == ENTITY_NAME.Banana) {
        let randomPositionX = this.getRandomNumberBetweenTwo(
          this.bananaMinPositionX,
          this.bananaMaxPositionX
        );
        let randomPositionY = this.getRandomNumberBetweenTwo(
          this.bananaMinPositionY,
          this.bananaMaxPositionY
        );

        newObjectData.dynamicObject.x = randomPositionX;
        newObjectData.dynamicObject.y =
          randomPositionY + newObjectData.dynamicObject.height;
        newObjectData.collisionBody.x = randomPositionX + 15;
        newObjectData.collisionBody.y = randomPositionY + 12;
      }
      const newObject = self.table.addDynamicObjectWithData(
        newObjectData.dynamicObject,
        newObjectData.collisionBody
      );
      for (const obj of self.table.drawOrder) {
        if (obj.zOrder > newObject.zOrder) {
          self.table.drawOrder.splice(
            self.table.drawOrder.indexOf(obj),
            0,
            newObject
          );
          break;
        }
      }
      self.table.dynamicObjects.push(newObject);
      if (newObject.body || newObject.bodies) {
        this.collisionManager.registerEntity(newObject);
      }
    }
  };

  this.handleHabitrailCollision = function (habitrailEntity) {
    if (this.activeHabitrails.indexOf(habitrailEntity) != -1) {
      return;
    }
    for (var collider of habitrailEntity.relatedCollisionObjects) {
      for (var entity of this.collisionManager.entities.values()) {
        if ("id" in entity) {
          if (entity.id == collider) {
            entity.type = "wall";
          }
        }
      }
    }
    this.activeHabitrails.push(habitrailEntity);
  };

  this.disableHabitrailColliders = function () {
    for (const habitrail of this.activeHabitrails) {
      for (var collider of habitrail.relatedCollisionObjects) {
        for (var entity of this.collisionManager.entities.values()) {
          if ("id" in entity) {
            if (entity.id == collider) {
              entity.type = "NA";
            }
          }
        }
      }
    }
    this.activeHabitrails = [];
  };

  this.removeEntity = function (entityToRemove) {
    self.table.dynamicObjects.splice(
      self.table.dynamicObjects.indexOf(entityToRemove),
      1
    );
    self.table.drawOrder.splice(
      self.table.drawOrder.indexOf(entityToRemove),
      1
    );
    this.collisionManager.unregisterEntity(entityToRemove);
    if (entityToRemove.type === ENTITY_TYPE.Plane) {
      for (const obj of self.table.dynamicObjects) {
        if (
          obj.type === ENTITY_TYPE.Spawner &&
          obj.name === ENTITY_NAME.SpawnerPlane
        ) {
          obj.childWasHit(entityToRemove);
        }
      }
    }
  };

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
  };

  this.getRandomNumberBetweenTwo = function (min, max) {
    return Math.random() * (max - min) + min;
  };
}
