//TitleScene
// eslint-disable-next-line no-unused-vars
function TitleScene() {
    let selectorPositionsIndex = 0;
    const SELECTIONS = [
        {selectionName: "Start Game",
        selectionType: MENU_SELECTION_TYPE.SCENE,
        scene: SCENE.GAME
        },
        {selectionName: "Table Selection",
        selectionType: MENU_SELECTION_TYPE.SCENE,
        scene: SCENE.TABLE_SELECTION},
        {selectionName: "Controls",
        selectionType: MENU_SELECTION_TYPE.SCENE,
        scene: SCENE.CONTROLS
        },
        {selectionName: "Credits",
        selectionType: MENU_SELECTION_TYPE.SCENE,
        scene: SCENE.CREDITS //TODO: Credits scene
        }
    ];

    const buttons = [];
    const START_GAME_TIME_BUFFER = 400; //milleseconds
    const FLIPPER_HORIZONTAL_OFFSET = 120;
    const FLIPPER_VERTICAL_OFFSET = 23;

    let goingToGame = false;
    let left_flipper;
    let right_flipper;

    this.transitionIn = function() {
        selectorPositionsIndex = 0;
        goingToGame = false;
        left_flipper = images["left_flipper_selector"];
        right_flipper = images ["right_flipper_selector"];
        playLoopBackgroundMusic("Theme_Music");
    };

    this.transitionOut = function() {
    };

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime, selectorPositionsIndex);
    };

    this.control = function(newKeyEvent, pressed) {
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }

        switch (newKeyEvent) {
            case KEY_UP:
                if(selectorPositionsIndex > 0){
                    selectorPositionsIndex--;
                    flipperSoundMenu.play();
                }else if(selectorPositionsIndex == 0){
                    selectorPositionsIndex = SELECTIONS.length - 1;
                    flipperSoundMenu.play();
                }
                
                break;
            case KEY_LEFT:
            case KEY_DOWN:
                if(selectorPositionsIndex < SELECTIONS.length-1){
                    selectorPositionsIndex++;
                    flipperSoundMenu.play();
                }else if(selectorPositionsIndex == SELECTIONS.length-1){
                    selectorPositionsIndex = 0;
                    flipperSoundMenu.play();
                }
                
                break;
            case KEY_RIGHT:
                return true;
            case ALIAS.SELECT1:
                if(SELECTIONS[selectorPositionsIndex].selectionType == MENU_SELECTION_TYPE.SCENE){

                    if (SELECTIONS[selectorPositionsIndex].selectionName == "Start Game" && !goingToGame) {
                        stopBackgroundMusic()
                        playStartGameSound();
                        setTimeout(() => {SceneManager.setState(SCENE.GAME, selected_table);}, startGameSound.duration() + START_GAME_TIME_BUFFER);
                        goingToGame = true;    
                    }else{
                        flipperSoundMenu.play();
                        SceneManager.setState(SELECTIONS[selectorPositionsIndex].scene);
                    }
                }
                return true;
            case ALIAS.SELECT2:
                return true;
        }
        
        return false;
    };
    
    const drawMenu = function() {

        for(let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.draw();
        }
	}
	
	const update = function(deltaTime) {

	}
	
	const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();
        drawSelection();
        // render menu

        drawMenu();        
        const titlePic = images['flipper_title_small'];

        canvasContext.drawImage(titlePic,  canvas.width/2 - titlePic.width/2, 0);
	}
	
	const drawBG = function() {
        // canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
        const PADDING = 35;
        drawRect(0, 0, canvas.width, canvas.height, Color.Black);

        if (SceneManager.scenes[SCENE.GAME].gameHasFinished) {
            colorText("Last Score: " + SceneManager.scenes[SCENE.GAME].score, canvas.width / 2, canvas.height / 2 - PADDING, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        }
                
        for(var i = 0; i < SELECTIONS.length; i++){
            colorText(SELECTIONS[i].selectionName, canvas.width / 2, canvas.height / 2 + PADDING * (i + 1), Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        }

      }

      const drawSelection = function() {
        const PADDING = 35;
        drawImageForTiledWithRotation(left_flipper, canvas.width / 2 - FLIPPER_HORIZONTAL_OFFSET, canvas.height / 2 - FLIPPER_VERTICAL_OFFSET + PADDING * (selectorPositionsIndex + 1), 0);
        drawImageForTiledWithRotation(right_flipper, canvas.width / 2 + FLIPPER_HORIZONTAL_OFFSET * 0.7, canvas.height / 2  - FLIPPER_VERTICAL_OFFSET + PADDING * (selectorPositionsIndex + 1), 0);
      }
        
    return this;
}