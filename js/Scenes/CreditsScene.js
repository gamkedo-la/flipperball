//Credits Scene
// eslint-disable-next-line no-unused-vars
function CreditsScene() {
    const CREDITS_BG_COLOR = "#010139";

    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.TITLE,
        SCENE.GAME
    ];
    const buttonHeight = 25;//TODO: Adjust this size based on custom font
    const buttonTitlePadding = 2;
    const buttons = [];
    const CREDITS_UPDATE_TIME = 20;
    let timeCounter = 0;
    let updateScreen = false;
    let stringPosition;


    this.transitionIn = function() {
        let mainMenuX = 0;
        const mainMenuY = canvas.height - canvas.height / 20;
        stringPosition = canvas.height;
        /*if(buttons.length === 0) {
            buttons.push(buildBackButton(canvas.width / 40, mainMenuY, buttonHeight, buttonTitlePadding));
            buttons.push(buildPlayButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding));

            mainMenuX = canvas.width - (buttons[1].getBounds().width + canvas.width / 40);
            buttons[1].updateXPosition(mainMenuX);
        } 

        selectorPositionsIndex = 0;*/
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
                // console.log("Activated the current button");
                SceneManager.setState(selections[selectorPositionsIndex]);
                return true;
            case ALIAS.SELECT2:
                // console.log("Selected the Play button");
                SceneManager.setState(SCENE.GAME);
                return true;
            case ALIAS.POINTER:
                checkButtons();
                return true;
        }
        
        return false;
    }

    const update = function(deltaTime) {
        if(timeCounter >= CREDITS_UPDATE_TIME){
            updateScreen = true;
        }
        timeCounter+=deltaTime;
    }


    const printNavigation = function(navItems) {
        for(let i = 0; i < navItems.length; i++) {
            navItems[i].draw();
        }
	}

    const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
		//drawTitle();
        
        if(updateScreen){
            //do things to move things up
            updateScreen = false;
            timeCounter = 0;
            stringPosition-=1;
        }
        //TODO read text from local file?
        colorText("Credits Test", canvas.width / 2, stringPosition, Color.White, Fonts.BodyText, TextAlignment.Center, 1);  

        // render menu
        printNavigation(buttons, selectorPositionIndex);        
	}
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, CREDITS_BG_COLOR);
    }
    
    const drawTitle = function() {
        fontRenderer.drawString(canvasContext, canvas.width / 2, canvas.height / 3, "CREDITS", 2 * GAME_SCALE);
    }
}