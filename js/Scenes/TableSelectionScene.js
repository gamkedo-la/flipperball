//GameOverScene
// eslint-disable-next-line no-unused-vars
function TableSelectionScene() {
    let selectorPositionsIndex = 0;
    const SELECTIONS = [
        {selectionName: "Clouds",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Prototype,
        topTable: TABLES.PrototypeTop,
        image: "clouds_screenshot"},
        {selectionName: "Space",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Space,
        topTable: TABLES.SpaceTop,
        image: "space_screenshot"},
        {selectionName: "Vam",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Vam,
        topTable: TABLES.VamTop,
        image: "vam_screenshot"},
        {selectionName: "Atlantis",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Aquarium,
        topTable: TABLES.AquariumTop,
        image: "aquarium_screenshot"},
        {selectionName: "Forest",
        selectionType: MENU_SELECTION_TYPE.TABLE,
        bottomTable: TABLES.Forest,
        topTable: TABLES.ForestTop,
        image: "forest_screenshot"}
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
                    flipperSoundMenu.play();
                }else if(selectorPositionsIndex == 0){
                    selectorPositionsIndex = SELECTIONS.length - 1;
                    flipperSoundMenu.play();
                }

                break;
            case KEY_DOWN:
                if(selectorPositionsIndex < SELECTIONS.length-1){
                    selectorPositionsIndex++;
                    flipperSoundMenu.play();
                }else if(selectorPositionsIndex == SELECTIONS.length-1){
                    selectorPositionsIndex = 0;
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
        drawTableImage();
	}
	
	const drawBG = function() {
        const PADDING = 35;
        drawRect(0, 0, canvas.width, canvas.height);
        colorText("SELECT TABLE", canvas.width / 2, 2 * canvas.height / 3 - PADDING, Color.White, Fonts.Subtitle, TextAlignment.Center, 1);   
        
        for(var i = 0; i < SELECTIONS.length; i++){
            colorText(SELECTIONS[i].selectionName, canvas.width / 2, 2 * canvas.height / 3 + PADDING * i, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        }
        
        /*colorText("Prototype", canvas.width / 2, canvas.height / 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Space", canvas.width / 2, canvas.height / 2 + PADDING, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        colorText("Vam", canvas.width / 2, canvas.height / 2 + PADDING * 2, Color.White, Fonts.BodyText, TextAlignment.Center, 1);*/
        colorText("Press Enter to", 3 * canvas.width / 4, PADDING * ++i, Color.White, Fonts.BodyText, TextAlignment.Center, 1);       
        colorText("select a table", 3 * canvas.width / 4, PADDING * ++i, Color.White, Fonts.BodyText, TextAlignment.Center, 1);       
      }

      const drawSelection = function() {
        const PADDING = 35;
        //colorText("-------------", canvas.width / 2, canvas.height / 2 + PADDING * selectorPositionsIndex + 14, Color.White, Fonts.BodyText, TextAlignment.Center, 1);
        //drawImageForTiledWithRotation(arrow, canvas.width / 2 - ARROW_HORIZONTAL_OFFSET, canvas.height / 2 - ARROW_VERTICAL_OFFSET + PADDING * selectorPositionsIndex, 0);

        drawImageForTiledWithRotation(left_flipper, canvas.width / 2 - FLIPPER_HORIZONTAL_OFFSET, 2 * canvas.height / 3 - FLIPPER_VERTICAL_OFFSET + PADDING * selectorPositionsIndex, 0);
        drawImageForTiledWithRotation(right_flipper, canvas.width / 2 + FLIPPER_HORIZONTAL_OFFSET * 0.7, 2 * canvas.height / 3 - FLIPPER_VERTICAL_OFFSET + PADDING * selectorPositionsIndex, 0);
      }

      const drawTableImage = function() {
          const imageName = SELECTIONS[selectorPositionsIndex].image
          const image = images[imageName];
          canvasContext.drawImage(image, (canvas.width - image.width) / 2, 0);
      }
        
    return this;
}