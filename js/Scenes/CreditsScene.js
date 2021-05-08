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
        ];
        for(let i=0; i<creditsList.length;i++) {
            creditLines.push({line: creditsList[i], position: canvas.height + PADDING * (i+1), font: Fonts.CreditsText});
        }

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
                    stringPositionOffset-=70;
                }
                return true;
            case KEY_LEFT:
                if(!paused){
                    stringPositionOffset-=140;
                }
                return true;
            case KEY_DOWN:
                if(!paused){
                    stringPositionOffset+=70;
                    if(stringPositionOffset>-40) {
                        stringPositionOffset = -40;
                    }
                }
                return true;
            case KEY_RIGHT:
                if(!paused){
                    stringPositionOffset+=140;
                    if(stringPositionOffset>-40) {
                        stringPositionOffset = -40;
                    }
                }
                return true;
            case ALIAS.SELECT1:
                if(!keyPressed){
                    flipperSoundMenu.play(); //sounds twice with the setTimeout
                    SceneManager.setState(SCENE.TITLE);
                }
                return true;
            case ALIAS.SELECT2:
                
                if(!keyPressed){
                    flipperSoundMenu.play();
                    if(paused){
                        paused = false;
                    }else{
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

var creditsList = [
"H Trayford: Project lead, core gameplay and main engine code, base table functionality, Tiled map editor integration, ball/flipper physics,  additional asset integration and assorted bugfixes, layout tweaks, multi-collider object support, planet bumpers with animation, table selection screen",
"Sergio Ferrer: Rocket/space table art (background, star animations, planet sprite, sputnik, rocket, space shuttle), forest table (background, base layout, tree walls, bananas, monkeys, planes), title control tips, ball reset, extra ball score goal, rotating gates (including related additional scoring functionality), target plane spawner, short flipper art, sky table layout variation, better selection arrow (flippers), scroll credits page functionality, menu screen wrap, banana sound",
"Fahad Muntaz: Aquarium table (including bubbles effect), start song, habitrail (art, implementation, placement), slot machine feature (art, implementation, placement, sounds), title image integration, pause mode, mute toggle, volume controls, ball loss, extra ball support",
"Kyle Black: VAM Empire table (design, layout, asteroids, starfield, themed playfield components including sound), ball trail improvements, table state persistence, backlit letters with animation, collison and scoring updates, lane trigger updates, blocked sounds repeating too rapidly, additional flipper juice, minor reset fixes, team internal reference diagram, score multiplier feature, light bonus minigame, flipping card fix",
"Andrew Hind: Background songs (aquarium, forst, space table, VAM empire), menu music (honky tonk song, game over), sounds (flipper, ball capture, ball strike, rollover lane), title screen image",
"Ryan Lewis: Rails, plunger art, cloud background (top and bottom), animated bumpers, small bumper animations, 4 color variations for bumpers, font selection and related integration, cyclone animation, plane explosion, pluger animation",
"Daniel Xiao: Volume preferences save/load, variable canvas width support, additional animation support, game object base class, collision crash fix",
"Christian de Miranda: Shake and tilt detection, pause tint and tip, default key mapping",
"Brian J. Boucher: Playing card art, card flipping effect, card integration",
"Benjamin Zigh: One-way gate colliders, plunger gate, game over scene",
"Vinzenz Sinapius: Score support, sprite animations, lives reset, restart feature, pause control tips",
"Zarya Rowland Bintz: Score bonus debug cheat",
"Himar Gil Hernandez: Initial z-order sort support",
"Tanner Chrishop: Pop bumper sound, full screen toggle",
"Jason Harrison: Screen flash",
"Derek Miranda: Mute feature fix",
"Ben Stone: Collision fix",
"Farbs: Cloud looping fix",
"Chris DeLeon: Rotated part alignment fix, compiled credits",
"Practice commits: Filipe Dottori, Hamza Sehavdic",
" ",
"Game made by members of HomeTeam Lighthouse - apply to join us at HomeTeamGameDev.com"
];

function lineWrapCredits() { // note: gets calling immediately after definition!
  const newCut = [];
  var maxLineChar = 105;
  var findEnd;

  for(let i = 0; i < creditsList.length; i++) {
    const currentLine = creditsList[i];
    for(let j = 0; j < currentLine.length; j++) {
      const aChar = currentLine[j];
      if(aChar === ":") {
        if(i !== 0) {
          newCut.push("\n");
        }

        newCut.push(currentLine.substring(0, j + 1));
        newCut.push(currentLine.substring(j + 2, currentLine.length));
        break;
      } else if(j === currentLine.length - 1) {
        if((i === 0) || (i >= creditsList.length - 2)) {
          newCut.push(currentLine);
        } else {
          newCut.push(currentLine.substring(1, currentLine.length));
        }
      }
    }
  }

  const newerCut = [];
  for(var i=0;i<newCut.length;i++) {
    while(newCut[i].length > 0) {
      findEnd = maxLineChar;
      if(newCut[i].length > maxLineChar) {
        for(var ii=findEnd;ii>0;ii--) {
          if(newCut[i].charAt(ii) == " ") {
            findEnd=ii;
            break;
          }
        }
      }
      newerCut.push(newCut[i].substring(0, findEnd));
      newCut[i] = newCut[i].substring(findEnd, newCut[i].length);
    }
  }

  creditsList = newerCut;
}
lineWrapCredits(); // note: calling immediately as part of init, outside the function