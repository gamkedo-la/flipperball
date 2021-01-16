/* eslint-disable no-unused-vars */
//Main for Flipperball
window.onload = function() {
    window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);

	canvas = document.createElement("canvas");
	canvas.classList.add("game-canvas")
    canvasContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
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

function loadingDoneSoStartGame() {
	timer = new Chronogram();
	// fontRenderer = new FontBuilder(fontSheet, CHAR_WIDTH, CHAR_HEIGHT);
	SceneManager.setState(SCENE.TITLE);
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