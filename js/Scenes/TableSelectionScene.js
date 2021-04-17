//GameOverScene
// eslint-disable-next-line no-unused-vars
function TableSelectionScene() {
    let selectorPositionsIndex = 0;
    const SELECTIONS = [
        {selectionName: "Clouds",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Prototype,
        topTable: TABLES.PrototypeTop},
        {selectionName: "Space",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Space,
        topTable: TABLES.SpaceTop},
        {selectionName: "Vam",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Vam,
        topTable: TABLES.VamTop},
        {selectionName: "Aquarium",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Aquarium,
        topTable: TABLES.AquariumTop},
        {selectionName: "Forest",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Forest,
        topTable: TABLES.ForestTop}
    ];

    const FLIPPER_HORIZONTAL_OFFSET = 120;
    const FLIPPER_VERTICAL_OFFSET = 23;

    let left_flipper;
    let right_flipper;

    this.transitionIn = function() {
        left_flipper = images["left_flipper_selector"];
        right_flipper = images ["right_flipper_selector"];
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
                    flipperSoundMenu.play();
                    SceneManager.setState(SCENE.TITLE);  
                return true;
            case KEY_UP:
                
                if(selectorPositionsIndex > 0){
                    selectorPositionsIndex--;
                    console.log("UP: " + selectorPositionsIndex);
                    flipperSoundMenu.play();
                }

                break;
            case KEY_DOWN:
                if(selectorPositionsIndex < SELECTIONS.length-1){
                    selectorPositionsIndex++;
                    console.log("DOWN: " + selectorPositionsIndex);
                    flipperSoundMenu.play();
                }
                break;
            case KEY_LEFT:
                SceneManager.setState(SCENE.TITLE);  
                flipperSoundMenu.play();
                return true;
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
        
        for(var i = 0; i < SELECTIONS.length; i++){
            colorText(SELECTIONS[i].selectionName, canvas.width / 2, canvas.height / 2 + PADDING * i, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        }
        
        /*colorText("Prototype", canvas.width / 2, canvas.height / 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Space", canvas.width / 2, canvas.height / 2 + PADDING, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Vam", canvas.width / 2, canvas.height / 2 + PADDING * 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);*/
        colorText("Press Enter to select a table", canvas.width / 2, canvas.height / 2 + PADDING * ++i, Color.White, Fonts.BodyText, TextAlignment.Center, 1);       
      }

      const drawSelection = function() {
        const PADDING = 35;
        //colorText("-------------", canvas.width / 2, canvas.height / 2 + PADDING * selectorPositionsIndex + 14, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        //drawImageForTiledWithRotation(arrow, canvas.width / 2 - ARROW_HORIZONTAL_OFFSET, canvas.height / 2 - ARROW_VERTICAL_OFFSET + PADDING * selectorPositionsIndex, 0);

        drawImageForTiledWithRotation(left_flipper, canvas.width / 2 - FLIPPER_HORIZONTAL_OFFSET, canvas.height / 2 - FLIPPER_VERTICAL_OFFSET + PADDING * selectorPositionsIndex, 0);
        drawImageForTiledWithRotation(right_flipper, canvas.width / 2 + FLIPPER_HORIZONTAL_OFFSET * 0.7, canvas.height / 2  - FLIPPER_VERTICAL_OFFSET + PADDING * selectorPositionsIndex, 0);
      }
        
    return this;
}