/* eslint-disable no-unused-vars */
//Image Loading
const TITLE_IMG_EXISTS = false;
let finishedLoading = false;

//-----Global Img Objects-----//
let titlePic;
let angledWall1Img;
let angledWall2Img;
let angledWall3Img;
let angledWall4img;
let ballImg;
let circleBumperBlueImg;
let circleBumperGreenImg;
let circleBumperRedImg;
let circleBumperYellowImg;
let drainRailLeftImg;
let drainRailRightImg;
let drainWallLeftImg;
let drainWallRightImg;
let flipperBumperLeftImg;
let flipperBumperRightImg;
let flipperLeftImg;
let flipperRightImg;
let plungerChuteImg;
let plungerImg;
let titleScreenPic;
let verticalWallImg;

//-----Load the HTGD Logo-----//
let startTime;
const htgdLogoPic = document.createElement("img");//src set in Main.js
htgdLogoPic.onload = function() {
    if (TITLE_IMG_EXISTS) {
        //Begin loading the Title Image
        titlePic = document.createElement("img");
        titleScreenPic.onload = function() {
            //Begin Loading remaining images
            loadImages();
            showTitleScreen();
        }
        titlePic.src = assetPath.Image + "screens/titlePic.png"
    }

    startTime = Date.now();
    animateHTGDLogo();
}


//-----Animate the HTGD Logo-----//
let htgdLogoScale = 0.5;
function animateHTGDLogo () {
    drawRect(0, 0, canvas.width, canvas.height, '#000000');

    //Draw the HTGD Logo Image
    canvasContext.drawImage(
        htgdLogoPic, 
        0, 0,
        htgdLogoPic.width, htgdLogoPic.height,
        canvas.width/2 - (htgdLogoScale * htgdLogoPic.width)/2, canvas.height/2 - (htgdLogoScale * htgdLogoPic.height)/2,
        (htgdLogoScale * htgdLogoPic.width), (htgdLogoScale * htgdLogoPic.height)
    );

    if(Date.now() - startTime < 1000) {
        htgdLogoScale += 0.003125;
        requestAnimationFrame(animateHTGDLogo);
    } else if (!TITLE_IMG_EXISTS) {
        loadImages();
    } else {
        showTitleScreen();
    }
}

//-----Show the Title Screen even though other images haven't loaded yet-----//
function showTitleScreen() {
    if (TITLE_IMG_EXISTS) {
        //draw the title image, no UI because images haven't finished loading yet
        canvasContext.drawImage(titlePic, 0, 0);
    } else {
        //draw black screen - terrible UI, but shouldn't happen once we have a title image
        drawRect(0, 0, canvas.width, canvas.height, '#000000');
    }
}

//------Actually do some image loading------//
let picsToLoad = 0;
function loadImages() {
    const imageList = [
        // List them here alphabetically to make it easier to find the one you're looking for
        {imgName: angledWall1Img, theFile: "tables/angled_wall_1.png"},
        {imgName: angledWall2Img, theFile: "tables/angled_wall_2.png"},
        {imgName: angledWall3Img, theFile: "tables/angled_wall_3.png"},
        {imgName: angledWall4img, theFile: "tables/angled_wall_4.png"},

        {imgName: ballImg, theFile: "tables/ball.png"},

        {imgName: circleBumperBlueImg, theFile: "tables/circle_bumper_blue.png"},
        {imgName: circleBumperGreenImg, theFile: "tables/circle_bumper_green.png"},
        {imgName: circleBumperRedImg, theFile: "tables/circle_bumper_red.png"},
        {imgName: circleBumperYellowImg, theFile: "tables/circle_bumper_yellow.png"},

        {imgName: drainRailLeftImg, theFile: "tables/drain_rail_left.png"},
        {imgName: drainRailRightImg, theFile: "tables/drain_rail_right.png"},

        {imgName: drainWallLeftImg, theFile: "tables/drain_wall_left.png"},
        {imgName: drainWallRightImg, theFile: "tables/drain_wall_right.png"},

        {imgName: flipperBumperLeftImg, theFile: "tables/flipper_bumper_left.png"},
        {imgName: flipperBumperRightImg, theFile: "tables/flipper_bumper_right.png"},

        {imgName: flipperLeftImg, theFile: "tables/flipper_left.png"},
        {imgName: flipperRightImg, theFile: "tables/flipper_right.png"},

        {imgName: plungerChuteImg, theFile: "tables/plunger_chute.png"},
        {imgName: plungerImg, theFile: "tables/plunger.png"},

        {imgName: verticalWallImg, theFile: "tables/vertical_wall.png"}
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {
        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);
    }
}

function beginLoadingImage(imgVar, fileName) {
    // eslint-disable-next-line no-param-reassign
    imgVar = document.createElement("img");
    imgVar.onload = function() {
        picsToLoad--;
        if (picsToLoad === 0) { // last image loaded?
            loadingDoneSoStartGame();
        }
    }
    imgVar.src = assetPath.Image + fileName;
}