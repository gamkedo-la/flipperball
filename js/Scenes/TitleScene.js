//TitleScene
// eslint-disable-next-line no-unused-vars
function TitleScene() {
    let selectorPositionsIndex = 0;
    /*const selections = [
        SCENE.GAME,
        SCENE.OPTIONS,
    ];*/

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
        scene: SCENE.CONTROLS //TODO: Controls scene
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
        const mainMenuX = 235;
        const mainMenuY = 260;
        const buttonHeight = 36;
        const buttonTitlePadding = 0;
        
        if(buttons.length === 0) {
            //add these in the same order as the selections array above
            // buttons.push(buildPlayButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding));
            // buttons.push(buildOptionsButton(mainMenuX, mainMenuY + 40, buttonHeight, buttonTitlePadding));
        }

        selectorPositionsIndex = 0;
        goingToGame = false;
        left_flipper = images["left_flipper_selector"];
        right_flipper = images ["right_flipper_selector"];
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
                    console.log("UP: " + selectorPositionsIndex);
                }
                break;
            case KEY_LEFT:
                /*selectorPositionsIndex--;
                if (selectorPositionsIndex < 0) {
                    selectorPositionsIndex += selections.length;
                }
                return true;*/
            case KEY_DOWN:
                if(selectorPositionsIndex < SELECTIONS.length-1){
                    selectorPositionsIndex++;
                    console.log("DOWN: " + selectorPositionsIndex);
                }
                break;
            case KEY_RIGHT:
                /*selectorPositionsIndex++;
                if (selectorPositionsIndex >= selections.length) {
                    selectorPositionsIndex = 0;
                }*/
                return true;
            case ALIAS.SELECT1:
                // console.log("Activated the current button");
//                SceneManager.setState(selections[selectorPositionsIndex]);
                if(SELECTIONS[selectorPositionsIndex].selectionType == MENU_SELECTION_TYPE.SCENE){

                    if (SELECTIONS[selectorPositionsIndex].selectionName == "Start Game" && !goingToGame) {
                        playStartGameSound();
                        console.log("TitleScene: " + selected_table);
                        console.log("TitleScene: " + selected_top_table);
                        setTimeout(() => {SceneManager.setState(SCENE.GAME, selected_table);}, startGameSound.duration() + START_GAME_TIME_BUFFER);
                        goingToGame = true;    
                    }else{
                        SceneManager.setState(SELECTIONS[selectorPositionsIndex].scene);
                    }
                }
                return true;
            case ALIAS.SELECT2:
                // console.log("Selected the Play button");
//                SceneManager.setState(SCENE.GAME);
                return true;
            case ALIAS.POINTER:
                checkButtons();
                return true;
        }
        
        return false;
    };

    const buildPlayButton = function(x, y, height, padding) {
        const thisClick = function() {
            // console.log("Clicked the Play Button");
//            SceneManager.setState(SCENE.GAME);
        }

        return new UIButton("START", x, y, height, padding, thisClick, Color.Red);
    }

    // const buildHelpButton = function(x, y, height, padding) {
    //     const thisClick = function() {
    //         console.log("Clicked the Help Button");
    //         SceneManager.setState(SCENE.HELP);
    //     }

    //     return new UIButton("HELP", x, y, height, padding, thisClick, Color.Green);
    // }

    const buildOptionsButton = function(x, y, height, padding) {
        const thisClick = function() {
            // console.log("Clicked the Options Button");
            SceneManager.setState(SCENE.OPTIONS);
        }

        return new UIButton("OPTIONS", x, y, height, padding, thisClick, Color.Aqua);
    }

    // const buildCreditsButton = function(x, y, height, padding) {
    //     const thisClick = function() {
    //         console.log("Clicked the Credits Button");
    //         SceneManager.setState(SCENE.CREDITS);
    //     }

    //     return new UIButton("CREDITS", x, y, height, padding, thisClick, Color.Purple);
    // }

    const checkButtons = function() {
        let wasClicked = false;
        for(let button of buttons) {
            wasClicked = button.respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    }
    
    const drawMenu = function() {

        for(let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.draw();

            // const buttonBounds = button.getBounds();
            // if(i === selectorPositionsIndex) {
            //     canvasContext.drawImage(onMenuButton, 0, 0, onMenuButton.width, onMenuButton.height, buttonBounds.x - 20, buttonBounds.y + 10, GAME_SCALE * onMenuButton.width, GAME_SCALE * onMenuButton.height);
            // } else {
            //     canvasContext.drawImage(offMenuButton, 0, 0, offMenuButton.width, offMenuButton.height, buttonBounds.x - 20, buttonBounds.y + 10, GAME_SCALE * offMenuButton.width, GAME_SCALE * offMenuButton.height);
            // }
        }
	}
	
	const update = function(deltaTime) {

	}
	
	const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();
        drawSelection();
        // render menu
        // canvasContext.drawImage(uiMenuBorderPic, 0, 0, uiMenuBorderPic.width, uiMenuBorderPic.height, 200, 250, uiMenuBorderPic.width * GAME_SCALE, uiMenuBorderPic.height * GAME_SCALE);
//        fontRenderer.drawString(canvasContext, 220, 260, "START", GAME_SCALE);
        drawMenu();        
        const titlePic = images['flipper_title_small']
        canvasContext.drawImage(titlePic,  canvas.width/2 - titlePic.width/2, 0);

	}
	
    
	
	const drawBG = function() {
        // canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
        const PADDING = 35;
        drawRect(0, 0, canvas.width, canvas.height);

        if (SceneManager.scenes[SCENE.GAME].gameHasFinished) {
            colorText("Last Score: " + SceneManager.scenes[SCENE.GAME].score, canvas.width / 2, canvas.height / 2 - PADDING, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        }
        
        /*colorText("Press Enter to Play", canvas.width / 2, canvas.height / 2, Color.White, Fonts.Subtitle, TextAlignment.Center, 1);
        
        renderControlsInfo(canvas.width / 2, canvas.height / 2 + PADDING * 1.25, PADDING*0.75)*/
        
        for(var i = 0; i < SELECTIONS.length; i++){
            colorText(SELECTIONS[i].selectionName, canvas.width / 2, canvas.height / 2 + PADDING * (i + 1), Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        }

      }

      const drawSelection = function() {
        const PADDING = 35;
        //colorText("-------------", canvas.width / 2, canvas.height / 2 + PADDING * selectorPositionsIndex + 14, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        drawImageForTiledWithRotation(left_flipper, canvas.width / 2 - FLIPPER_HORIZONTAL_OFFSET, canvas.height / 2 - FLIPPER_VERTICAL_OFFSET + PADDING * (selectorPositionsIndex + 1), 0);
        drawImageForTiledWithRotation(right_flipper, canvas.width / 2 + FLIPPER_HORIZONTAL_OFFSET * 0.7, canvas.height / 2  - FLIPPER_VERTICAL_OFFSET + PADDING * (selectorPositionsIndex + 1), 0);
      }
        
    return this;
}