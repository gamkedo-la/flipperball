//GameOverScene
// eslint-disable-next-line no-unused-vars
function GameOverScene() {
    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.GAME,
        SCENE.OPTIONS,
    ];

    const buttons = [];
    const START_GAME_TIME_BUFFER = 400; //milliseconds

    this.transitionIn = function() {
        playBackgroundMusic("Game Over Music");
    };

    this.transitionOut = function() {

    };

    this.run = function(deltaTime) {
        update(deltaTime);
        draw(deltaTime);
    };

    this.control = function(newKeyEvent, pressed) {
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }

        switch (newKeyEvent) {
            case ALIAS.SELECT1:
                // keeping it as a switch for now in case we want to add more functions to the scene
                    SceneManager.setState(SCENE.TITLE);  
                return true;
        }
        
        return false;
    };
	
	const update = function(deltaTime) {

	}
	
	const draw = function(deltaTime) {
        drawBG();
	}
	
    
	
	const drawBG = function() {
        const PADDING = 35;
        drawRect(0, 0, canvas.width, canvas.height);
        colorText("GAME OVER", canvas.width / 2, canvas.height / 2 - PADDING, Color.White, Fonts.Subtitle, TextAlignment.Center, 1);       
        colorText("You scored:" + SceneManager.scenes[SCENE.GAME].score, canvas.width / 2, canvas.height / 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Press Enter to return to title screen.", canvas.width / 2, canvas.height / 2 + PADDING * 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);       
      }
        
    return this;
}