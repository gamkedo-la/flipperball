//TitleScene
// eslint-disable-next-line no-unused-vars
function TitleScene() {
    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.GAME,
        SCENE.OPTIONS,
    ];

    const buttons = [];
    const START_GAME_TIME_BUFFER = 400; //milleseconds

    let goingToGame = false;

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
            case KEY_LEFT:
                selectorPositionsIndex--;
                if (selectorPositionsIndex < 0) {
                    selectorPositionsIndex += selections.length;
                }
                return true;
            case KEY_DOWN:
            case KEY_RIGHT:
                selectorPositionsIndex++;
                if (selectorPositionsIndex >= selections.length) {
                    selectorPositionsIndex = 0;
                }
                return true;
            case ALIAS.SELECT1:
                // console.log("Activated the current button");
//                SceneManager.setState(selections[selectorPositionsIndex]);
                if (!goingToGame) {
                    playStartGameSound();
                    setTimeout(() => {SceneManager.setState(SCENE.GAME, TABLES.Prototype);}, startGameSound.duration() + START_GAME_TIME_BUFFER);
                    goingToGame = true;    
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

        // render menu
        // canvasContext.drawImage(uiMenuBorderPic, 0, 0, uiMenuBorderPic.width, uiMenuBorderPic.height, 200, 250, uiMenuBorderPic.width * GAME_SCALE, uiMenuBorderPic.height * GAME_SCALE);
//        fontRenderer.drawString(canvasContext, 220, 260, "START", GAME_SCALE);
        drawMenu();        
	}
	
	const drawBG = function() {
        // canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
        const PADDING = 35;
        drawRect(0, 0, canvas.width, canvas.height);

        if (SceneManager.scenes[SCENE.GAME].gameHasFinished) {
            colorText("Last Score: " + SceneManager.scenes[SCENE.GAME].score, canvas.width / 2, canvas.height / 2 - PADDING, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        }
        
        colorText("Flipper Ball", canvas.width / 2, canvas.height / 2 - PADDING*2.5, Color.White, Fonts.MainTitle, TextAlignment.Center, 1);
        colorText("Press Enter to Play", canvas.width / 2, canvas.height / 2, Color.White, Fonts.Subtitle, TextAlignment.Center, 1);
        colorText("'Left Arrow' = left flipper", canvas.width / 2, canvas.height / 2 + PADDING * 1.25, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'Right Arrow' = right flipper", canvas.width / 2, canvas.height / 2 + PADDING*2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'Down Arrow' = plunger", canvas.width / 2, canvas.height / 2 + PADDING*2.75, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'Space Bar' = bump table", canvas.width / 2, canvas.height / 2 + PADDING*3.5, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'M' = mute", canvas.width / 2, canvas.height / 2 + PADDING*4.25, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'<' = volume down", canvas.width / 2, canvas.height / 2 + PADDING*5, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'>' = volume up", canvas.width / 2, canvas.height / 2 + PADDING*5.75, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'k' = sfx volume down", canvas.width / 2, canvas.height / 2 + PADDING*6.5, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'l' = sfx volume up", canvas.width / 2, canvas.height / 2 + PADDING*7.25, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("'f' = toggle flash", canvas.width / 2, canvas.height / 2 + PADDING*8, Color.White, Fonts.BodyText, TextAlignment.Center, 1);

      }
        
    return this;
}