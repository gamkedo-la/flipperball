/* eslint-disable no-unused-vars */
//Graphics Common
function drawRect(x,y,w,h,color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x,y,w,h);
}

function colorText(showWords,textX,textY,fillColor,fontface,textAlign = 'left',opacity = 1) {
  canvasContext.save();
  canvasContext.textAlign = textAlign;
  canvasContext.font = fontface;
  canvasContext.globalAlpha = opacity;
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
  canvasContext.restore();
}

function getTextWidth(txt) {
  return fontRenderer.getWidthOfText (txt, GAME_SCALE);
}

// "ForTiled" since for whatever reason Tiled seems to pivot rotations from the bottom :)
function drawImageForTiledWithRotation(image, atX, atY, withAng) {
  canvasContext.save();
  canvasContext.translate(atX, atY+image.height);
  canvasContext.rotate(withAng);
  canvasContext.drawImage(image, 0, -image.height);
  canvasContext.restore();
}

//Only meant to be given imageFront and imageBack with the same dimensions
function drawImageForTiledWithVerticalSpin(imageFront, imageBack, atX, atY, withAng) {

  let spinScale = Math.cos(withAng);

  canvasContext.save();
  canvasContext.translate(atX + imageFront.width/2, atY+imageFront.height);
  canvasContext.scale(Math.abs(spinScale), 1.0);
  canvasContext.drawImage((spinScale < 0 ? imageBack : imageFront), -imageFront.width/2, -imageFront.height);
  canvasContext.restore();
}


function renderControlsInfo (x, y, y_offset, align=TextAlignment.Center) {        
  texts = [ 
      "'Left Arrow' = left flipper",
      "'Right Arrow' = right flipper",
      "'Down Arrow' = plunger",
      "'Space Bar' = bump table",
      "'M' = mute",
      "'<' = volume down",
      "'>' = volume up",
      "'k' = sfx volume down",
      "'l' = sfx volume up",
      "'f' = toggle flash"
  ];

  for (let i = 0; i < texts.length; i++) {
      colorText(texts[i], x, y + y_offset*i, Color.White, Fonts.BodyText, align, 1);
  }      

}