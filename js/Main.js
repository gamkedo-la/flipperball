/* eslint-disable no-unused-vars */
//Main for Flipperball
window.onload = function() {
    window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);

	canvas = document.createElement("canvas");
	canvas.classList.add("game-canvas");
  canvasContext = canvas.getContext("2d");

  canvasContainer.appendChild(canvas);

  canvas.width = 1000;
  canvas.height = 600;
	drawRect(0, 0, canvas.width, canvas.height, Color.Black);

  colorText("L..O..A..D..I..N..G..", canvas.width / 2, canvas.height / 2, Color.White, Fonts.MainTitle, TextAlignment.Center, 1);

	initializeInput();
	configureGameAudio();
	loadAudio();
//	currentBackgroundMusic.loopSong(menuMusic);//TODO: Restore once there is background music
	htgdLogoPic.src = assetPath.Image + "screens/screen_HTGD_Logo.png";
};

fullScreenButton.innerHTML = 'Full Screen';
fullScreenButton.style.borderRadius = 0;
canvasContainer.appendChild(fullScreenButton);
fullScreenButton.onclick = function () {
	FEATURE_FLAGS.useCanvasContainer = !FEATURE_FLAGS.useCanvasContainer;
	toggleFullScreen();
}

function toggleFullScreen() {
	if (FEATURE_FLAGS.useCanvasContainer) {
		canvas.style.height = '';
  } else {
		 canvas.style.height = '100vh';
  }
}

function loadingDoneSoStartGame() {
	timer = new Chronogram();
	// fontRenderer = new FontBuilder(fontSheet, CHAR_WIDTH, CHAR_HEIGHT);
	if(skipToGameDEBUG) {
        SceneManager.setState(SCENE.GAME, selected_table);
    } else {
		SceneManager.setState(SCENE.TITLE);
	}
	requestAnimationFrame(update);
}

function update() {
	const deltaTime = timer.update();
	SceneManager.run(deltaTime);
	requestAnimationFrame(update);
}


function drawAll() {

}

function windowOnFocus() {
	//Resume game from pause?
}

function windowOnBlur() {
	//Pause game? - Probably not on a menu, but on SCENE.Game
}