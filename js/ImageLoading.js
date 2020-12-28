/* eslint-disable no-unused-vars */
//Image Loading
let shouldShowTitleImage = false;
let finishedLoading = false;

function showTitleImage() {
    if(shouldShowTitleImage) {
        // canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
        loadingDoneSoStartGame();
    } else {
        shouldShowTitleImage = true;
    }
    
}

//-----Load the HTGD Logo-----//
const htgdLogoPic = document.createElement("img");
let startTime;
function loadHTGDLogo() {
    htgdLogoPic.onload = function() {
        //Begin loading the Start Image
        loadStartImagePic();

        startTime = Date.now();
        animatedHTGDLogo();
    }
    
    htgdLogoPic.src = assetPath.Image + "screens/screen_HTGD_Logo.png";
}

let htgdLogoScale = 0.5;
function animatedHTGDLogo() {
    
    drawRect(0, 0, canvas.width, canvas.height, '#000000');

    //Draw the HTGD Logo Image
    canvasContext.drawImage(
        htgdLogoPic, 
        0, 0,
        htgdLogoPic.width, htgdLogoPic.height,
        canvas.width/2 - (htgdLogoScale * htgdLogoPic.width)/2, canvas.height/2 - (htgdLogoScale * htgdLogoPic.height)/2,
        (htgdLogoScale * htgdLogoPic.width), (htgdLogoScale * htgdLogoPic.height)
    );

    const nowTime = Date.now();
    if(nowTime - startTime < 1000) {
        htgdLogoScale += 0.0125;
        requestAnimationFrame(animatedHTGDLogo);
    } else {
        showTitleImage();
    }
}

//-----Load the title screen image-----//
// const titleScreenPic = document.createElement("img");
function loadStartImagePic() {
//     titleScreenPic.onload = function() {
//         //Show the Start Image if ready
//         showTitleImage();

//         //Begin Loading remaining images
//         loadImages();
//     } 
    
//     titleScreenPic.src = assetPath.Image + "screens/screen_title_base.png";
}

//-----Load the rest of the game images----//
// const onMenuButton = document.createElement("img");

let picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) { // last image loaded?
        loadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImageAndLaunchIfReady;
    imgVar.src = assetPath.Image + fileName;
}

function loadImages() {
    const imageList = [
        // flippers

        // ball

        // scenes

        // UI
        // { imgName: fontSheet, theFile: "interface/xjfont.png" },
        // { imgName: offMenuButton, theFile: "interface/menu_button_off.png" },
        // { imgName: onMenuButton, theFile: "interface/menu_button_on.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages