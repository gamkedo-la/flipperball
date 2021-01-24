/* eslint-disable no-unused-vars */

//Globals
//----------Drawing and Canvas---------//
let canvas;
let canvasContext;

let DEBUG = false;
let CHEATS_ACTIVE = false;

const GAME_SCALE = 1;
const GRAVITY = 300;
const MAX_BALL_SPEED = 800;
const ROTATION_RATE = 10;
const MAX_ROTATION_ANGLE = Math.PI / 4;

const canvasClearColor = "black";

const STARTING_BALLS_COUNT = 2

const Color = {
	Red:"red",
	Blue:"blue",
	Green:"green",
	White:"white",
	Black:"black",
	Yellow:"yellow",
	Purple:"purple",
	Aqua:"aqua"
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
	Flipper: 'flipper',
	FlipperBumper: 'flipper_bumper',
	Plunger: 'plunger',
	Wall: 'wall'
};

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
	CIRCLE_BUMPER_BLUE: {
		imageName: "circle_bumper_blue_anim",
		frames: [0, 1, 2, 3, 4, 5, 6, 7],
		frameWidth: 96,
		frameHeight: 96,
		frameTimes: [64, 64, 64, 64, 64, 64, 64, 64],
		reverses: true,
		loops: false
	}
};