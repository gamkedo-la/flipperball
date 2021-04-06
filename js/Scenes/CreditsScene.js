//Credits Scene
// eslint-disable-next-line no-unused-vars
function CreditsScene() {
    const CREDITS_BG_COLOR = "#010139";

    let selectorPositionsIndex = 0;
    const CREDITS_UPDATE_TIME = 20;
    const PADDING = 35;
    let paused = false;
    let timeCounter = 0;
    let stringPositionOffset;
    let keyPressed = false;
    let creditLines;


    this.transitionIn = function() {
        stringPositionOffset = 0;
        creditLines = [
            {line: "Flipperball", position: canvas.height, font: Fonts.Subtitle},
            {line: "Lorem Ipsum", position: canvas.height + PADDING * 2, font: Fonts.BodyText},
            {line: "Dolor sit amet", position: canvas.height + PADDING * 3, font: Fonts.BodyText},
            {line: "Consectetur", position: canvas.height + PADDING * 4, font: Fonts.BodyText},
            {line: "Adipiscing elit", position: canvas.height + PADDING * 5, font: Fonts.BodyText},
            {line: "Thanks for playing!!", position: canvas.height + PADDING * 8, font: Fonts.Subtitle},
        ];

    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime);
    }

    this.control = function(newKeyEvent, pressed) {
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            keyPressed = true;
            //return false;
        } else {
            keyPressed = false;
        }
        
        switch (newKeyEvent) {
            case KEY_UP:
                if(!paused){
                    DEBUG_LOG("up");
                    stringPositionOffset-=10;
                }
                return true;
            case KEY_LEFT:
                if(!paused){
                    DEBUG_LOG("left");
                    stringPositionOffset-=10;
                }
                return true;
            case KEY_DOWN:
                if(!paused){
                    DEBUG_LOG("down");
                    stringPositionOffset+=10;
                }
                return true;
            case KEY_RIGHT:
                if(!paused){
                    stringPositionOffset+=10;
                }
                return true;
            case ALIAS.SELECT1:
                if(!keyPressed){
                    flipperSoundMenu.play(); //sounds twice with the setTimeout
                    SceneManager.setState(SCENE.TITLE);
                }
                return true;
            case ALIAS.SELECT2:
                // console.log("Selected the Play button");
                
                if(!keyPressed){
                    flipperSoundMenu.play();
                    if(paused){
                        DEBUG_LOG("not paused");
                        paused = false;
                    }else{
                        DEBUG_LOG("pause");
                        paused = true;
                    }
                }
                return true;
            case ALIAS.POINTER:
                return true;
        }
        
        return false;
    }

    const update = function(deltaTime) {
        if(!keyPressed && !paused){
            if(timeCounter >= CREDITS_UPDATE_TIME){
                timeCounter = 0;
                stringPositionOffset-=1;
            }
            timeCounter+=deltaTime;
        }
    }


    const draw = function(deltaTime) {
        drawBG();
        drawLines();
         
	}
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, CREDITS_BG_COLOR);
        if(paused){
            colorText("PAUSED", canvas.width - 75, canvas.height - 25, Color.Red, Fonts.BodyText, TextAlignment.Center, 1); 
        }
    }

    const drawLines = function(){
        for(var i = 0; i<creditLines.length ; i++){
            colorText(creditLines[i].line, canvas.width / 2, creditLines[i].position + stringPositionOffset, Color.White, creditLines[i].font, TextAlignment.Center, 1);  
        }
        
    }

}