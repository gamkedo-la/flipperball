/* eslint-disable no-unused-vars */

//Globals
//----------Feature Flags---------//
const FEATURE_FLAGS = {
	/**
	 * true: canvas resizes based on width
	 * false: canvas is always fullscreen
	 */
	useCanvasContainer: true,
	/**
	 * true: debug window opens
	 * false: debug window closes
	 */
	useDebugWindow: false,
};

//----------Drawing and Canvas---------//
let canvas;
let canvasContext;

let DEBUG = false;
let CHEATS_ACTIVE = false;
let skipToGameDEBUG = false;

const GAME_SCALE = 1;
const GRAVITY = 300;
const MAX_BALL_SPEED = 1000;
const ROTATION_RATE = 5;
const MAX_ROTATION_ANGLE = Math.PI / 4;
const TEXT_LEFT_OFFSET = 0;
const SCORE_NEEDED_FOR_EXTRA_BALL = 10000;

const canvasClearColor = "black";

const STARTING_BALLS_COUNT = 2;

const LANE_TRIGGER_TIMEOUT = 3000;

const Color = {
	Red:"red",
	Blue:"blue",
	Green:"green",
	White:"white",
	Black:"black",
	Yellow:"yellow",
	Purple:"purple",
	Aqua:"aqua",
	WhiteFlash: "rgba(255, 255, 255, 0.3)",
	BlackOverlay: "rgba(0, 0, 0, 0.30)"
};

//---------------Persistence-----------//
const localStorageKey = {
	MusicVolume:"flipperball_musicVolume",
	SFXVolume:"flipperball_effectsVolume",
    FirstLoad:"flipperball_firstLoad"
};

//----------State Management----------//
const SCENE = {
	LOADING:"loading",
	TITLE:"title",
	SETTINGS:"settings",
	CREDITS:"credits",
	HELP:"help",
	PAUSE:"pause",
	GAME:"game",
	ENDING:"ending"
};

let canvasContainer = document.getElementById('canvas-container');
let fullScreenButton = document.createElement('BUTTON');
let debugButton = document.createElement('BUTTON');
let firstLoad = localStorage.getItem(localStorageKey.FirstLoad);
let timer;
let worldSpeed = 1;

//------------Tables----------//
const TABLES = {
	Prototype: 'prototype',
	PrototypeTop: 'prototype_top'
};

const TABLE_LAYERS = {
	Collision: 'Collision',
	Dynamic: 'Dynamic',
	Fixed: 'Fixed'
};

const BODY_TYPE = {
	Circle: 'circle',
	Polygon: 'polygon',
};

const ENTITY_TYPE = {
	Ball: 'ball',
	CircleBumper: 'circle_bumper',
	CircleBumperSmall: 'circle_bumper_small',
	Flipper: 'flipper',
	FlipperBumper: 'flipper_bumper',
	Plunger: 'plunger',
	Wall: 'wall',
	Trigger: 'trigger',
	Cyclone: 'cyclone',
	Gate: 'gate',
	RotatingGate: 'rotating_gate',
	Habitrail: 'habitrail',
	LetterLight: 'letter_light',
	Plane: 'plane',
	Cloud: 'cloud', 
	Spawner: 'spawner'
};

const TRIGGER_TYPE = {
	Lane: 'lane_trigger',
	Light: 'light_trigger',
	BallCatch: 'ball_catch'
}

const ENTITY_NAME = {
	CircleBumperRed: 'circle_bumper_red',
	CircleBumperBlue: 'circle_bumper_blue',
	CircleBumperYellow: 'circle_bumper_yellow',
	CircleBumperGreen: 'circle_bumper_green',
	CircleBumperSmallRed: 'circle_bumper_small_red',
	CircleBumperSmallBlue: 'circle_bumper_small_blue',
	CircleBumperSmallYellow: 'circle_bumper_small_yellow',
	CircleBumperSmallGreen: 'circle_bumper_small_green',
	FlipperBumperRight: 'flipper_bumper_right',
	FlipperBumperLeft: 'flipper_bumper_left',
	Cyclone: 'cyclone',
	LetterLight: 'letter_light',
	RotatingGate: 'rotating_gate',
	PlaneRed: 'plane_red',
	SpawnerPlane: 'spawner_plane'
}

const COLLISION_TYPE = {
	Circle: 'circleXcircle',
	Polygon: 'circleXpolygon'
};
//------------Asset Management----------//
const images = {};

const assetPath = {
	Audio:"./audio/",
	Image:"./img/"
};

//---------------Audio------------------//
let isMuted = false;

//------------Text------------------//
let fontRenderer;
const CHAR_WIDTH = 6;
const CHAR_HEIGHT = 9;

const TextAlignment = {
	Left:"left",
	Right:"right",
	Center:"center"
};

const Fonts = {
	MainTitle:"800 60px Poppins",
	Subtitle:"800 26px Poppins",
	BodyText:"400 20px Poppins",
	ButtonTitle:"400 20px Poppins",
	CreditsText:"400 16px Poppins"
};

const fontOverhangRatio = 4/5; // Currently 4/5 is correct for "Tahoma" font. Change if font changes

const ANIMATIONS = {
	CIRCLE_BUMPER: {
		imageNames: {
			"circle_bumper_blue": "circle_bumper_blue_anim",
			"circle_bumper_green": "circle_bumper_green_anim",
			"circle_bumper_red": "circle_bumper_red_anim",
			"circle_bumper_yellow": "circle_bumper_yellow_anim"		
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
		frameWidth: 96,
		frameHeight: 96,
		frameTimes: [64, 64, 64, 64, 64, 64, 64, 64, 64],
		reverses: true,
		loops: false
	},
	CIRCLE_BUMPER_SMALL: {
		imageNames: {
			"circle_bumper_small_red": "circle_bumper_small_red_anim",
			"circle_bumper_small_yellow": "circle_bumper_small_yellow_anim",
			"circle_bumper_small_blue": "circle_bumper_small_blue_anim",
			"circle_bumper_small_green": "circle_bumper_small_green_anim"	
		},
		frames: [0, 1, 2, 3, 4],
		frameWidth: 54,
		frameHeight: 54,
		frameTimes: [64, 64, 64, 64, 64],
		reverses: false,
		loops: false
	},
	FLIPPER_BUMPER: {
		imageNames: {
			"flipper_bumper_right": "flipper_bumper_right_anim",
			"flipper_bumper_left": "flipper_bumper_left_anim"	
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		frameWidth: 57,
		frameHeight: 186,
		frameTimes: [64, 64, 64, 64, 64, 64, 64, 64, 64],
		reverses: false,
		loops: false
	},
	PLUNGER_RELEASE: {
		imageNames: {
			"plunger": "plunger_anim"
		},
		frames: [0, 1, 2, 3, 4],
		frameWidth: 30,
		frameHeight: 255,
		frameTimes: [64, 64, 64, 64, 64],
		reverses: false,
		loops: false
	},
	PLUNGER_CONTRACT: {
		imageNames: {
			"plunger": "plunger_anim"
		},
		frames: [4, 3, 2, 1, 0],
		frameWidth: 30,
		frameHeight: 255,
		frameTimes: [64, 64, 64, 64, 64],
		reverses: false,
		loops: false
	},
	CYCLONE_SPIN: {
		imageNames: {
			"cyclone": "cyclone_anim"
		},
		frames: [0, 1, 2, 3],
		frameWidth: 96,
		frameHeight: 96,
		frameTimes: [64, 64, 64, 64],
		reverses: false,
		loops: true
	},
	PLANE_EXPLOSION: {
		imageNames: {
			"plane_blue": "plane_blue_explosion_anim",
			"plane_red": "plane_red_explosion_anim",
			"plane_green": "plane_green_explosion_anim",
			"plane_yellow": "plane_yellow_explosion_anim"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
		frameWidth: 51,
		frameHeight: 48,
		frameTimes: [64, 64, 64, 64, 64, 64, 64, 64, 64],
		reverses: false,
		loops: false
	},
	LETTER_LIGHT: {
		imageNames: {
			"letter_light": "letter_light_anim"
		},
		frames: [0, 1, 2, 3, 4],
		frameWidth: 24,
		frameHeight: 24,
		frameTimes: [64, 64, 64, 64, 64],
		reveres: false,
		loops: false,
		holds: true
	},
	/*ROTATING_GATE: {
		imageNames: {
			"rotating_gate": "rotating_gate_animation"
		},
		frames: [0, 1, 2, 3, 4, 5, 6],
		frameWidth: 20,
		frameHeight: 29,
		frameTimes: [64, 64, 64, 64, 64, 64, 64],
		reverses: false,
		loops: true
	}*/
	ROTATING_GATE: {
		imageNames: {
			"rotating_gate": "rotating_gate_animation"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
		frameWidth: 31,
		frameHeight: 17,
		frameTimes: [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64],
		reverses: false,
		loops: true
	}
};