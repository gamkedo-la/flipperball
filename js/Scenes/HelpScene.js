//Help Scene
// eslint-disable-next-line no-unused-vars
function HelpScene() {
    const HELP_BG_COLOR = "#010139";

    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.TITLE,
        SCENE.GAME
    ];
    const buttonHeight = 25;//TODO: Adjust this size based on custom font
    const buttonTitlePadding = 2;
    const buttons = [];


    this.transitionIn = function() {
        let mainMenuX = 0;
        const mainMenuY = canvas.height - canvas.height / 20;
        
        if(buttons.length === 0) {
            buttons.push(buildBackButton(canvas.width / 40, mainMenuY, buttonHeight, buttonTitlePadding));
            buttons.push(buildPlayButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding));

            mainMenuX = canvas.width - (buttons[1].getBounds().width + canvas.width / 40);
            buttons[1].updateXPosition(mainMenuX);
        }

        selectorPositionsIndex = 0;
    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime, buttons, selectorPositionsIndex);
    }

    this.control = function(newKeyEvent, pressed) {
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        switch (newKeyEvent) {
            case ALIAS.UP:
            case ALIAS.LEFT:
                selectorPositionsIndex--;
                if (selectorPositionsIndex < 0) {
                    selectorPositionsIndex += selections.length;
                }
                return true;
            case ALIAS.DOWN:
            case ALIAS.RIGHT:
                selectorPositionsIndex++;
                if (selectorPositionsIndex >= selections.length) {
                    selectorPositionsIndex = 0;
                }
                return true;
            case ALIAS.SELECT1:
                SceneManager.setState(selections[selectorPositionsIndex]);
                return true;
            case ALIAS.SELECT2:
                SceneManager.setState(SCENE.GAME);
                return true;
            case ALIAS.POINTER:
                checkButtons();
                return true;
        }
        
        return false;
    }

    const update = function(deltaTime) {

    }

    const checkButtons = function() {
        let wasClicked = false;
        for(let i = 0; i < buttons.length; i++) {
            wasClicked = buttons[i].respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    }

    const buildPlayButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneManager.setState(SCENE.GAME);
        }

        return new UIButton("PLAY", x, y, height, padding, thisClick, Color.Aqua);
    }

    const buildBackButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneManager.setState(SCENE.TITLE);
        }

        return new UIButton("BACK", x, y, height, padding, thisClick, Color.Purple);
    }

    const printNavigation = function(navItems) {
        for(let i = 0; i < navItems.length; i++) {
            navItems[i].draw();
        }
	}

    const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
		drawTitle();

        // render menu
        printNavigation(buttons, selectorPositionIndex);        
	}
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, HELP_BG_COLOR);
    }
    
    const drawTitle = function() {
        fontRenderer.drawString(canvasContext, canvas.width / 2, canvas.height / 3, "HELP", 2 * GAME_SCALE);
    }
}