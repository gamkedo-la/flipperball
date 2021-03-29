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
    const PADDING = 35;
    let timeCounter = 0;
    let updateScreen = false;
    let stringPositionOffset;
    let keyPressed = false;
    let creditLines;


    this.transitionIn = function() {
        let mainMenuX = 0;
        const mainMenuY = canvas.height - canvas.height / 20;
        stringPositionOffset = 0;

        creditLines = [
            {line: "Lorem Ipsum", position: canvas.height},
            {line: "Dolor sit amet", position: canvas.height + PADDING},
            {line: "Consectetur", position: canvas.height + PADDING * 2},
            {line: "Adipiscing elit", position: canvas.height + PADDING * 3},
        ];

    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime, buttons, selectorPositionsIndex);
    }

    this.control = function(newKeyEvent, pressed) {
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            keyPressed = true;
            //return false;
        } else {
            keyPressed = false;
        }
        
        switch (newKeyEvent) {
            case ALIAS.UP:
            case ALIAS.LEFT:
                stringPositionOffset-=10;
                return true;
            case ALIAS.DOWN:
            case ALIAS.RIGHT:
                stringPositionOffset+=10;
                return true;
            case ALIAS.SELECT1:

                SceneManager.setState(SCENE.TITLE); 
                return true;
            case ALIAS.SELECT2:
                // console.log("Selected the Play button");
                SceneManager.setState(SCENE.TITLE); 
                return true;
            case ALIAS.POINTER:
                return true;
        }
        
        return false;
    }

    const update = function(deltaTime) {
        if(!keyPressed){
            if(timeCounter >= CREDITS_UPDATE_TIME){
                updateScreen = true;
            }
            timeCounter+=deltaTime;
        }
    }


    const printNavigation = function(navItems) {
        for(let i = 0; i < navItems.length; i++) {
            navItems[i].draw();
        }
	}

    const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();
        drawLines();
		//drawTitle();
        
        if(updateScreen){
            //do things to move things up
            updateScreen = false;
            timeCounter = 0;
            stringPositionOffset-=1;
        }
        

        // render menu
        printNavigation(buttons, selectorPositionIndex);        
	}
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, CREDITS_BG_COLOR);
    }

    const drawLines = function(){
        for(var i = 0; i<creditLines.length ; i++){
            //TODO read text from local file?
            colorText(creditLines[i].line, canvas.width / 2, creditLines[i].position + stringPositionOffset, Color.White, Fonts.BodyText, TextAlignment.Center, 1);  
        }
        
    }
    
    const drawTitle = function() {
        fontRenderer.drawString(canvasContext, canvas.width / 2, canvas.height / 3, "CREDITS", 2 * GAME_SCALE);
    }
}