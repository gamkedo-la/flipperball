/* eslint-disable no-unused-vars */
//Main for Xeno Jackers
window.onload = function() {
    window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);

	canvas = document.createElement("canvas");
	canvas.classList.add("game-canvas")
    canvasContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = 800;
    canvas.height = 600;
	drawRect(0, 0, canvas.width, canvas.height, Color.Black);

    colorText("L..O..A..D..I..N..G..", canvas.width / 2, canvas.height / 2, Color.White, Fonts.MainTitle, TextAlignment.Center, 1);

	initializeInput();
	configureGameAudio();
	loadAudio();
//	currentBackgroundMusic.loopSong(menuMusic);//TODO: Restore once there is background music
	loadHTGDLogo();
};

function loadingDoneSoStartGame() {
	if(finishedLoading) {
		timer = new Chronogram();
		// fontRenderer = new FontBuilder(fontSheet, CHAR_WIDTH, CHAR_HEIGHT);
		SceneManager.setState(SCENE.TITLE);
		requestAnimationFrame(update);
	} else {
		finishedLoading = true;
	}
}

function update() {
	const deltaTime = timer.update();
	SceneManager.run(deltaTime);
	requestAnimationFrame(update);
}

function startGame() {
	if(!firstLoad) {
		firstLoad = false;
		localStorage.setItem(localStorageKey.FirstLoad, firstLoad);
	} 
}

function drawAll() {

}

function moveAll() {

}

function windowOnFocus() {
}

function windowOnBlur() {
}