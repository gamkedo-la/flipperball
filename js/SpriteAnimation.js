//Animation
// eslint-disable-next-line no-unused-vars
function SpriteAnimation(name, //string identifier for this animation
                   image, //image in which the frames reside,
                   x, // x position
                   y, // y position
                   frames = [0], //array of frame indexes to use for this animation
                   frameWidth = 32, //width of each frame
                   frameHeight = 32, //height of each frame
                   frameTimes = [64],//array of milliseconds to show each frame
                   reverses = false, //boolean indicates if animation reverses (true)
                   loops = false) { //boolean indicates if animation loops (true) 

    // eslint-disable-next-line consistent-this
    const self = this;
    this.name = name;
    this.scale = 1;
    this.isFinished = false; //only becomes true if loops is false 

    let times;
    let isInReverse = false;
    let currentFrameIndex = 0;
    const framesPerRow = Math.round(image.width / frameWidth);
    
    let remainderTime = 0;

    this.x = x;
    this.y = y;
    
    this.update = function(deltaTime) {
        if(times == null) {return;}

        remainderTime += deltaTime;
        while(remainderTime >= times[currentFrameIndex]) {
            remainderTime -= times[currentFrameIndex];
            currentFrameIndex = nextFrameIndex(currentFrameIndex, frames);
        }
    }

    this.drawAt = function(x = 0, y = 0) {
        const thisFrameRect = getCurrentFrameRect();
        canvasContext.drawImage(image, 
                                thisFrameRect.x, thisFrameRect.y, thisFrameRect.width, thisFrameRect.height,
                                x, y, thisFrameRect.width * this.scale, thisFrameRect.height * this.scale);
    }

    this.draw = function() {
        this.drawAt(this.x, this.y);
    }

    const getCurrentFrameRect = function() {
        const nowFrameIndex = frames[currentFrameIndex];
        const xClipPos = frameWidth * (nowFrameIndex % framesPerRow);
        const yClipPos = frameHeight * (Math.floor(nowFrameIndex / framesPerRow));
        return {x:xClipPos, y:yClipPos, width:frameWidth, height:frameHeight};
    }

    const initializeFrameTimes = function(frameTimes, frames) {
        let newFrameTimes = [];
        if(frameTimes.length != frames.length) {
            for(let i = 0; i < frames.length; i++) {
                newFrameTimes.push(frameTimes[0]);
            }
        } else {
            newFrameTimes = frameTimes;
        }

        return newFrameTimes;
    }
    times = initializeFrameTimes(frameTimes, frames);//need to call this function now that it is defined

    const nextFrameIndex = function(currentFrame, frames) {
        let newFrameIndex;
        if(isInReverse) {
            newFrameIndex = currentFrame - 1;
            if(newFrameIndex < 0) {
                if (loops) {
                    newFrameIndex = currentFrame + 1;
                    isInReverse = false;
                } else {
                    self.isFinished = true;
                    newFrameIndex = currentFrame;
                }                
            } 
        } else {
            newFrameIndex = currentFrame + 1;
            if(newFrameIndex >= frames.length) {
                if(reverses) {
                    newFrameIndex = currentFrame - 1;
                    isInReverse = true;
                } else if(loops) {
                    newFrameIndex = 0;
                } else {
                    newFrameIndex = currentFrame;
                    self.isFinished = true;
                }
            }
        }

        return newFrameIndex;
    }
}