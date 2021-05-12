/* eslint-disable no-unused-vars */
//Main for Flipperball
window.onload = function() {
	canvas = document.createElement("canvas");
	canvas.focus();
	canvas.onblur = function () {
		setTimeout(() => {
			canvas.focus();
		}, 200);
	}
	canvas.classList.add("game-canvas");
	canvasContext = canvas.getContext("2d");

	canvasContainer.appendChild(canvas);

	canvas.width = 1000;
	canvas.height = 600;
	drawRect(0, 0, canvas.width, canvas.height, Color.Black);

	colorText("L..O..A..D..I..N..G..", canvas.width / 2, canvas.height / 2, Color.White, Fonts.MainTitle, TextAlignment.Center, 1);

	htgdLogoPic.src = assetPath.Image + "screens/screen_HTGD_Logo.png";
};

function loadingDoneSoStartGame() {
	timer = new Chronogram();
	if(skipToGameDEBUG) {
        SceneManager.setState(SCENE.GAME, selected_table);
    } else {
		SceneManager.setState(SCENE.TITLE);
	}
	requestAnimationFrame(update);
}

function update() {
	const deltaTime = timer.update();
	canvas.focus();
	SceneManager.run(deltaTime);
	requestAnimationFrame(update);
}