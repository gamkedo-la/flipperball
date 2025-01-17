//Screen State
// eslint-disable-next-line no-unused-vars
const SceneManager = {
	log : [],
	currentScene: SCENE.TITLE,
	pauseCause:null,
	scenes: {
		[SCENE.TITLE]: new TitleScene(),
		[SCENE.TABLE_SELECTION]: new TableSelectionScene(),
		[SCENE.CONTROLS]: new ControlsScene(),
        [SCENE.OPTIONS]: new OptionsScene(),
		[SCENE.CREDITS]: new CreditsScene(),
		[SCENE.HELP]: new HelpScene(),
		[SCENE.GAME]: new GameScene(),
		[SCENE.GAMEOVER]: new GameOverScene(),
	},
	setState: function(newScene, properties) {
        this.scenes[this.currentScene].transitionOut();
        this.log.push(this.currentScene);
		this.currentScene = newScene;
		this.scenes[this.currentScene].properties = properties;
		this.scenes[this.currentScene].transitionIn();
		return this;
	},
	getPreviousState: function() {
		return this.log[this.log.length-1];
	},
	run: function(deltaTime) {
		this.scenes[this.currentScene].run(deltaTime);
	},
	control: function(newKeyEvent, pressed, pressedKeys) {
		return this.scenes[this.currentScene].control(newKeyEvent, pressed, pressedKeys);
    }
};