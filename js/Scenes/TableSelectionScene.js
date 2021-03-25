//GameOverScene
// eslint-disable-next-line no-unused-vars
function TableSelectionScene() {
    let selectorPositionsIndex = 0;
    const SELECTIONS = [
        {bottomTable: TABLES.Prototype,
        topTable: TABLES.PrototypeTop},
        {bottomTable: TABLES.Space,
        topTable: TABLES.SpaceTop},
        {bottomTable: TABLES.Vam,
        topTable: TABLES.VamTop},
    ];

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
                // keeping it as a switch for now in case we want to add more functions to the scene
                    selected_table = SELECTIONS[selectorPositionsIndex].bottomTable;
                    selected_top_table = SELECTIONS[selectorPositionsIndex].topTable;
                    console.log("Selected table: " + selected_table);
                    console.log("Selected top table: " + selected_top_table);
                    SceneManager.setState(SCENE.TITLE);  
                return true;
            case KEY_UP:
                
                if(selectorPositionsIndex > 0){
                    selectorPositionsIndex--;
                    console.log("UP: " + selectorPositionsIndex);
                }
                break;
            case KEY_DOWN:
                if(selectorPositionsIndex < SELECTIONS.length-1){
                    selectorPositionsIndex++;
                    console.log("DOWN: " + selectorPositionsIndex);
                }
                break;
        }
        
        return false;
    };
	
	const update = function(deltaTime) {

	}
	
	const draw = function(deltaTime) {
        drawBG();
        drawSelection();
	}
	
    
	
	const drawBG = function() {
        const PADDING = 35;
        drawRect(0, 0, canvas.width, canvas.height);
        colorText("SELECT TABLE", canvas.width / 2, canvas.height / 2 - PADDING, Color.White, Fonts.Subtitle, TextAlignment.Center, 1);       
        colorText("Prototype", canvas.width / 2, canvas.height / 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Space", canvas.width / 2, canvas.height / 2 + PADDING, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Vam", canvas.width / 2, canvas.height / 2 + PADDING * 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Press Enter to return to select a table", canvas.width / 2, canvas.height / 2 + PADDING * 4, Color.White, Fonts.BodyText, TextAlignment.Center, 1);       
      }

      const drawSelection = function() {
        const PADDING = 35;
        colorText("-------------", canvas.width / 2, canvas.height / 2 + PADDING * selectorPositionsIndex + 14, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
      }
        
    return this;
}