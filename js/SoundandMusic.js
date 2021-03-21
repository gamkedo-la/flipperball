/* eslint-disable no-unused-vars */
//SoundandMusic
let audioFormat;
let musicSound = null;
let pauseSound;
let resumeSound;
let startGameSound;
let flipperSound;
let bumperSound;
let slotDingSound;
let slotCrankSound;
let menuMusic;
let musicVolume;
let effectsVolume;
let currentBackgroundMusic;
let currentBackgroundMusicInitialized = false;
let defaultPlayDelta = 100;

const VOLUME_INCREMENT = 0.05;
const MILLESECOND_MULTIPLIER = 1000;

function configureGameAudio() {
	currentBackgroundMusic = new BackgroundMusicClass();
	musicVolume = parseFloat(localStorage.getItem(localStorageKey.MusicVolume));
	effectsVolume = parseFloat(localStorage.getItem(localStorageKey.SFXVolume));
	
	if(isNaN(musicVolume)) {
		musicVolume = 1;
	}
	
	if(isNaN(effectsVolume)) {
		effectsVolume = 1;
	}	
}

function loadAudio() {
	
	pauseSound = new SoundOverlapsClass(assetPath.Audio + "PauseSoundLow");
	resumeSound = new SoundOverlapsClass(assetPath.Audio + "ResumeSoundLow");
	startGameSound = new SoundOverlapsClass(assetPath.Audio + "BeepBox-Song");
	flipperSound = new SoundOverlapsClass(assetPath.Audio + "Flipper_Activated_SFX", 10);
	bumperSound = new SoundOverlapsClass(assetPath.Audio + "ding", 50);
	slotDingSound = new SoundOverlapsClass(assetPath.Audio + "slot_ding", 0.5);
	slotCrankSound = new SoundOverlapsClass(assetPath.Audio + "slow_crank");


	//	menuMusic = assetPath.Audio + "beeblebrox";
}

function setFormat() {
    const audio = new Audio();
    if (audio.canPlayType("audio/mp3")) {
        audioFormat = ".mp3";
    } else {
        audioFormat = ".ogg";
    }
}

function BackgroundMusicClass(filenameWithPath) {	
    this.loopSong = function(filenameWithPath) {
        setFormat(); // calling this to ensure that audioFormat is set before needed

        if (musicSound != null) {
            musicSound.pause();
            musicSound = null;
		}
        musicSound = new Audio(filenameWithPath + audioFormat);
        musicSound.loop = true;
        this.setVolume(musicVolume);
    }

	this.playSong = function(filenameWithPath) {
        setFormat(); // calling this to ensure that audioFormat is set before needed

        if (musicSound != null) {
            musicSound.pause();
            musicSound = null;
		}
        musicSound = new Audio(filenameWithPath + audioFormat);
        musicSound.loop = false;
        this.setVolume(musicVolume);
    }

    this.pauseSound = function() {
        musicSound.pause();
    }

    this.resumeSound = function() {
        musicSound.play();
    }

    this.startOrStopMusic = function() {
        if (musicSound.paused) {
            musicSound.play();
        } else {
            musicSound.pause();
        }
    }
	
	this.setVolume = function(volume) {
		// Multipliction by a boolean serves as 1 for true and 0 for false
		// console.log("Music Sound: " + musicSound + ", musicSound.volume: " + musicSound.volume);
		if(isMuted) {
			musicSound.volume = 0;
		} else {
			musicSound.volume = Math.pow(volume, 2);
		}
		
		if(musicSound.volume == 0) {
			musicSound.pause();
		} else if (musicSound.paused) {
			if(skipToGameDEBUG == false) {
				musicSound.play();
			} else {
				console.log("using skipToGameDEBUG from globals.js for quicker testing loop, music not playing since code reached before first user interaction");
			}
		}
	}
}

function SoundOverlapsClass(filenameWithPath, minDeltaBtwPlays) {
	setFormat();
	let minTimeElapsed = defaultPlayDelta;
	let lastPlayed = 0;
	if (minDeltaBtwPlays) {
		minTimeElapsed = minDeltaBtwPlays;		
	}
    const fullFilename = filenameWithPath;
	let soundIndex = 0;
    const sounds = [new Audio(fullFilename + audioFormat), new Audio(fullFilename + audioFormat)];

	this.play = function () {
		if ((Date.now() - lastPlayed) > minTimeElapsed) {
			if (!sounds[soundIndex].paused) {
				sounds.splice(soundIndex, 0, new Audio(fullFilename + audioFormat));
			}
			sounds[soundIndex].currentTime = 0;
			sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
			sounds[soundIndex].play();

			soundIndex = (++soundIndex) % sounds.length;
			lastPlayed = Date.now();
		}
	}

	this.isPlaying = function() {
		for (const sound of sounds) {
			if (!sound.paused) {
				return true;
			}
		}

		return false;
	}

	this.duration = function() {
		//return duration in milleseconds
		return sounds[0].duration * MILLESECOND_MULTIPLIER;
	}
}

function getRandomVolume(){
	var min = 0.9;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function toggleMute() {
	isMuted = !isMuted;
	if (isMuted) {
		currentBackgroundMusic.pauseSound();	
	} else {
		currentBackgroundMusic.resumeSound();
	}	
}

function setEffectsVolume(amount)
{
	effectsVolume = amount;
	if(effectsVolume > 1.0) {
		effectsVolume = 1.0;
	} else if (effectsVolume < 0.0) {
		effectsVolume = 0.0;
	}
  localStorage.setItem(localStorageKey.SFXVolume, musicVolume);
}

function setMusicVolume(amount){
	musicVolume = amount;
	if(musicVolume > 1.0) {
		musicVolume = 1.0;
	} else if (musicVolume < 0.0) {
		musicVolume = 0.0;
	}
	currentBackgroundMusic.setVolume(musicVolume);
  localStorage.setItem(localStorageKey.MusicVolume, musicVolume);
}

function turnVolumeUp() {
	setMusicVolume(musicVolume + VOLUME_INCREMENT);
}

function turnVolumeDown() {
	setMusicVolume(musicVolume - VOLUME_INCREMENT);
}

function turnSFXVolumeUp() {
	setEffectsVolume(effectsVolume + VOLUME_INCREMENT);
}

function turnSFXVolumeDown() {
	setEffectsVolume(effectsVolume - VOLUME_INCREMENT);
}

function playPauseSound() {
	if(!isMuted) {
		pauseSound.play();
	}
}

function playResumeSound() {
	if(!isMuted) {
		resumeSound.play();
	}
}

function pauseSoundAndMusic() {
	playPauseSound();
	currentBackgroundMusic.pauseSound();
}

function resumeSoundAndMusic() {
	playResumeSound();
	currentBackgroundMusic.resumeSound();
}

function playLoopBackgroundMusic(trackToPlay = "Honky_Tonk_Piano_Loop") { 
	if (!currentBackgroundMusicInitialized) {
		currentBackgroundMusicInitialized = true;
		currentBackgroundMusic.loopSong(assetPath.Audio + trackToPlay);
	}
}

function playBackgroundMusic(trackToPlay = "Honky_Tonk_Piano_Loop") { 
	if (!currentBackgroundMusicInitialized) {
		currentBackgroundMusicInitialized = true;
		currentBackgroundMusic.playSong(assetPath.Audio + trackToPlay);
	}
}

function stopBackgroundMusic() {
	currentBackgroundMusic.pauseSound();
	currentBackgroundMusicInitialized = false;
}

function restartBackgroundMusic() {
	if (!isMuted) {
		musicSound.currentTime = 0
		musicSound.play()
	}
}

function playStartGameSound() {
	if(!isMuted) {
		startGameSound.play();
	}
}