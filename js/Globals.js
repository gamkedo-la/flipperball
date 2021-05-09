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
	TABLE_SELECTION:"table_selection",
	CONTROLS: "controls",
	SETTINGS:"settings",
	CREDITS:"credits",
	HELP:"help",
	PAUSE:"pause",
	GAME:"game",
	ENDING:"ending"
};

const MENU_SELECTION_TYPE = {
	SCENE: "Scene",
	TABLE: "Table",
	EXIT: "Exit"
}

let canvasContainer = document.getElementById('canvas-container');
let fullScreenButton = document.createElement('BUTTON');
let debugButton = document.createElement('BUTTON');
let firstLoad = localStorage.getItem(localStorageKey.FirstLoad);
let timer;
let worldSpeed = 1;

//------------Tables----------//
const TABLES = {
	Prototype: 'prototype',
	PrototypeTop: 'prototype_top',
	ShortFlipperPrototype: 'prototype_short_flipper',
	Space: 'space',
	SpaceTop: 'space_top',
	Vam: 'vam',
	VamTop: 'vam_top',
	Aquarium: 'aquarium',
	AquariumTop: 'aquarium_top',
	Forest: 'forest',
	ForestTop: 'forest_top'
};

// Set these to easily test new table designs
const DEFAULT_TABLE = TABLES.Prototype;
const DEFAULT_TABLE_TOP = TABLES.PrototypeTop;
var selected_table = DEFAULT_TABLE;
var selected_top_table = DEFAULT_TABLE_TOP;

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
	AsteroidBumper: 'asteroid_bumper',
	Ball: 'ball',
	CircleBumper: 'circle_bumper',
	CircleBumperSmall: 'circle_bumper_small',
	Flipper: 'flipper',
	FlipperBumper: 'flipper_bumper',
	WingBumper: 'wing_bumper',
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
	Star: 'star',
	Spawner: 'spawner',
	Slot: 'slot',
	SlotMachine: 'slot_machine',
	Earth: 'earth',
	Mars: 'mars',
	Sputnik: 'sputnik',
	Jupiter: 'jupiter',
	Saturn: 'saturn',
	Rocket: 'rocket',
	Shuttle: 'shuttle',
	Bubble: 'bubble',
	SideDrainBumper: 'side_drain_bumper', 
	Banana: 'banana',
	BananaTaken: 'banana_taken',
	VamMineral: 'vam_mineral',
	Plug: 'plug',
	Card: 'card'
};

const TRIGGER_TYPE = {
	Lane: 'lane_trigger',
	Light: 'light_trigger',
	BallCatch: 'ball_catch',
	SlotMachine: 'slot_trigger'
}

const ENTITY_NAME = {
	AsteroidBumper: 'asteroid_bumnper',
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
	WingBumperRight: 'wing_bumper_right',
	WingBumperLeft: 'wing_bumper_left',
	Cyclone: 'cyclone',
	LetterLight: 'letter_light',
	EnergyLight: 'energy_light',
	RotatingGate: 'rotating_gate',
	PlaneRed: 'plane_red',
	SpawnerPlane: 'spawner_plane',
	SmallStar: 'small_star',
	TinyStar: 'tiny_star',
	ExpandingStar: 'expanding_star',
	ExpandingStar2: 'expanding_star_2',
	EmpireLogo: 'empire_logo',
	Banana: 'forest_banana',
	BananaTaken: 'forest_banana_taken',
	VamMineral: 'vam_mineral'
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
		frameTimes: [64],
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
		frameTimes: [64],
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
		frameTimes: [64],
		reverses: false,
		loops: false
	},
	FOREST_FLIPPER_BUMPER: {
		imageNames: {
			"forest_flipper_bumper_right": "forest_flipper_bumper_right_anim",
			"forest_flipper_bumper_left": "forest_flipper_bumper_left_anim"		
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		frameWidth: 57,
		frameHeight: 186,
		frameTimes: [64],
		reverses: false,
		loops: false
	},
	WING_BUMPER: {
		imageNames: {
			"wing_bumper_right": "wing_bumper_right_anim",
			"wing_bumper_left": "wing_bumper_left_anim"		
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		frameWidth: 75,
		frameHeight: 186,
		frameTimes: [64, 64, 64, 46, 46, 46, 46, 46, 64, 64],
		reverses: false,
		loops: false
	
	},
	TINY_STAR: {
		imageNames: {
			"tiny_star": "tiny_star_anim"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		frameWidth: 1,
		frameHeight: 1,
		frameTimes: [128],
		reverses: false,
		loops: true
	},
	SMALL_STAR: {
		imageNames: {
			"small_star": "small_star_anim"	
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		frameWidth: 5,
		frameHeight: 5,
		frameTimes: [128],
		reverses: false,
		loops: true
	},
	EXPANDING_STAR: {
		imageNames: {
			"expanding_star": "expanding_star_anim"
		},
		frames: [0, 1, 2, 3, 4, 5],
		frameWidth: 1,
		frameHeight: 1,
		frameTimes: [256],
		reverses: false,
		loops: true
	},
	EXPANDING_STAR_2: {
		imageNames: {
			"expanding_star_2": "expanding_star_2_anim"
		},
		frames: [0, 1, 2, 3, 4, 5, 6],
		frameWidth: 1,
		frameHeight: 1,
		frameTimes: [256],
		reverses: false,
		loops: true
	},
	EARTH: {
		imageNames: {
			"earth": "earth_anim"
		},
		frames: [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7],
		frameWidth: 24,
		frameHeight: 23,
		frameTimes: [128],
		reverses: false,
		loops: false
	},
	MARS: {
		imageNames: {
			"mars": "mars_anim"
		},
		frames: [1, 2, 3, 4, 5, 6, 7],
		frameWidth: 24,
		frameHeight: 23,
		frameTimes: [128],
		reverses: true,
		loops: false
	},
	JUPITER: {
		imageNames: {
			"jupiter": "jupiter_anim"
		},
		frames: [1, 2, 3, 4, 5, 6, 7, 8],
		frameWidth: 94,
		frameHeight: 92,
		frameTimes: [128, 128, 128, 128, 512, 128, 128, 128],
		reverses: false,
		loops: false
	},
	SATURN: {
		imageNames: {
			"saturn": "saturn_anim"
		},
		frames: [1, 2, 3, 4, 5, 6, 7],
		frameWidth: 120,
		frameHeight: 80,
		frameTimes: [128, 128, 128, 128, 512, 128, 128],
		reverses: true,
		loops: false
	},
	PLUNGER_RELEASE: {
		imageNames: {
			"plunger": "plunger_anim"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		frameWidth: 30,
		frameHeight: 255,
		frameTimes: [8],
		reverses: false,
		loops: false,
		holds: true
	},
	PLUNGER_CONTRACT: {
		imageNames: {
			"plunger": "plunger_anim"
		},
		frames: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
		frameWidth: 30,
		frameHeight: 255,
		frameTimes: [64],
		reverses: false,
		loops: false,
		holds: true
	},
	CYCLONE_SPIN: {
		imageNames: {
			"cyclone": "cyclone_anim"
		},
		frames: [0, 1, 2, 3],
		frameWidth: 96,
		frameHeight: 96,
		frameTimes: [64],
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
		frameTimes: [64],
		reverses: false,
		loops: false
	},
	SIDE_DRAIN_BUMPER: {
		imageNames: {
			"side_drain_bumper": "side_drain_bumper_anim"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
		frameWidth: 40,
		frameHeight: 30,
		frameTimes: [64],
		reverses: false,
		loops: false
	},
	LETTER_LIGHT: {
		imageNames: {
			"letter_light": "letter_light_anim",
			"energy_light": "energy_light_anim"
		},
		frames: [0, 1, 2, 3, 4],
		frameWidth: 24,
		frameHeight: 24,
		frameTimes: [256],
		reverses: false,
		loops: false,
		holds: true
	},
	ROCKET_LAUNCH: {
		imageNames: {
			"rocket": "rocket_anim"
		},
		frames: [0, 1, 2],
		frameWidth: 58,
		frameHeight: 96,
		frameTimes: [64],
		reverses: false,
		loops: true,
		holds: false
	},
	BONUS_LIGHT: {
			imageNames: {
			"bonus_light_2x": "bonus_light_2x_anim"
		},
		frames: [0, 1, 2, 3, 4, 5],
		frameWidth: 24,
		frameHeight: 24,
		frameTimes: [64, 64, 64, 32, 32, 256],
		reverses: false,
		loops: true,
		holds: false	
	},
	SHUTTLE: {
		imageNames: {
		"shuttle": "shuttle_anim"
	},
	frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	frameWidth: 75,
	frameHeight: 75,
	frameTimes: [64],
	reverses: false,
	loops: false,
	holds: true	
},
	EMPIRE_INF: {
		imageNames: {
			"empire_logo": "emp_inf_anim"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
		frameWidth: 256,
		frameHeight: 81,
		frameTimes: [64],
		reverses: false,
		loops: true
		
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
		frameTimes: [32],
		reverses: false,
		loops: true
	},
	SLOT: {
		imageNames: {
			"slot": "slot_animation",
			"root_slot": "slot_animation",
			"slot_t": "slot_animation_t",
			"slot_g": "slot_animation_g",
			"slot_d": "slot_animation_d"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
		frameWidth: 31,
		frameHeight: 45,
		frameTimes:[64],
		reverses: false,
		loops: true
	},

	BANANA: {
		imageNames: {
			"forest_banana": "forest_banana_anim"
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7],
		frameWidth: 64,
		frameHeight: 64,
		frameTimes: [64],
		reverses: false,
		loops: true
	},

	BANANA_TAKEN: {
		imageNames: {
			"forest_banana_taken": "forest_banana_taken_anim"	
		},
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
		frameWidth: 64,
		frameHeight: 64,
		frameTimes: [64],
		reverses: false,
		loops: false
	}
};