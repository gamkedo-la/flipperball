/* eslint-disable no-unused-vars */

//Globals
//----------Feature Flags---------//
const FEATURE_FLAGS = {
	/**
	 * true: canvas resizes based on width
	 * false: canvas is always fullscreen
	 */
	useCanvasContainer: true,
};

//----------Drawing and Canvas---------//
let canvas;
let canvasContext;

let DEBUG = false;
let CHEATS_ACTIVE = false;

const GAME_SCALE = 1;
const GRAVITY = 300;
const MAX_BALL_SPEED = 800;
const ROTATION_RATE = 5;
const MAX_ROTATION_ANGLE = Math.PI / 4;

const canvasClearColor = "black";

const STARTING_BALLS_COUNT = 2

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
	Polygon: 'polygon'
};

const ENTITY_TYPE = {
	Ball: 'ball',
	CircleBumper: 'circle_bumper',
	CircleBumperSmall: 'circle_bumper_small',
	Flipper: 'flipper',
	FlipperBumper: 'flipper_bumper',
	Plunger: 'plunger',
	Wall: 'wall',
	Trigger: 'trigger'
};

const TRIGGER_TYPE = {
	Lane: 'lane_trigger'
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
	FlipperBumperLeft: 'flipper_bumper_left'
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
	MainTitle:"40px Tahoma",
	Subtitle:"30px Tahoma",
	ButtonTitle:"20px Tahoma",
	CreditsText:"16px Tahoma"
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
			"circle_bumper_small_red": "circle_bumper_small_red_anim"	
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
		frameWidth: 66,
		frameHeight: 288,
		frameTimes: [64, 64, 64, 64, 64],
		reverses: false,
		loops: false
	},
	PLUNGER_CONTRACT: {
		imageNames: {
			"plunger": "plunger_anim"
		},
		frames: [4, 3, 2, 1, 0],
		frameWidth: 66,
		frameHeight: 288,
		frameTimes: [64, 64, 64, 64, 64],
		reverses: false,
		loops: false
	}
};