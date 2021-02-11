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

function drawImageCenteredWithRotation(image, atX, atY, withAng) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  canvasContext.rotate(withAng);
  canvasContext.drawImage(image, -image.width/2, -image.height/2);
  canvasContext.restore();
}