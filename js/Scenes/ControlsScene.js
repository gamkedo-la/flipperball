//GameOverScene
// eslint-disable-next-line no-unused-vars
function ControlsScene() {

    this.transitionIn = function() {
       
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
        renderControlsInfo(canvas.width / 2, canvas.height / 4 + PADDING * 1.25, PADDING*0.75)
        colorText("Press Enter to go back", canvas.width / 2, canvas.height - PADDING, Color.White, Fonts.BodyText, TextAlignment.Center, 1);       
      }

        
    return this;
}