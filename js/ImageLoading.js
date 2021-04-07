/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
//Image Loading
const TITLE_IMG_EXISTS = false;

//-----Global Img Objects-----//
let titlePic;

//-----Load the HTGD Logo-----//
let startTime;
const htgdLogoPic = document.createElement("img");//src set in Main.js
htgdLogoPic.onload = function() {
    if (TITLE_IMG_EXISTS) {
        //Begin loading the Title Image
        titlePic = document.createElement("img");
        titlePic.onload = function() {
            //Begin Loading remaining images
            loadImages();
            showTitleScreen();
        }
        titlePic.src = assetPath.Image + "screens/titlePic.png"
    }

    startTime = Date.now();
    if(skipToGameDEBUG) {
        loadImages();
    } else {
        animateHTGDLogo();
    }
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
        { imgName: "bonus_light_2x", theFile: "tables/2x_bonus_light_unlit.png" },
        { imgName: "bonus_light_2x_anim", theFile: "animations/2x_bonus_light_anim.png"},
        
        {imgName: "angled_wall_1", theFile: "tables/angled_wall_1.png", image: {}},
        {imgName: "angled_wall_2", theFile: "tables/angled_wall_2.png"},
        {imgName: "angled_wall_3", theFile: "tables/angled_wall_3.png"},
        {imgName: "angled_wall_4", theFile: "tables/angled_wall_4.png"},
        {imgName: "angled_wall_5", theFile: "tables/angled_wall_5.png"},
        {imgName: "angled_wall_6", theFile: "tables/angled_wall_6.png"},

        {imgName: "ball", theFile: "tables/ball.png"},

        {imgName: "circle_bumper_blue", theFile: "tables/circle_bumper_blue.png"},
        {imgName: "circle_bumper_blue_anim", theFile: "animations/circle_bumper_blue_anim.png"},
        {imgName: "circle_bumper_green", theFile: "tables/circle_bumper_green.png"},
        {imgName: "circle_bumper_green_anim", theFile: "animations/circle_bumper_green_anim.png"},
        {imgName: "circle_bumper_red", theFile: "tables/circle_bumper_red.png"},
        {imgName: "circle_bumper_red_anim", theFile: "animations/circle_bumper_red_anim.png"},
        {imgName: "circle_bumper_yellow", theFile: "tables/circle_bumper_yellow.png"},
        {imgName: "circle_bumper_yellow_anim", theFile: "animations/circle_bumper_yellow_anim.png"},

        {imgName: "circle_bumper_small_red", theFile: "tables/circle_bumper_small_red.png"},
        {imgName: "circle_bumper_small_red_anim", theFile: "animations/circle_bumper_small_red_anim.png"},
        {imgName: "circle_bumper_small_yellow", theFile: "tables/circle_bumper_small_yellow.png"},
        {imgName: "circle_bumper_small_yellow_anim", theFile: "animations/circle_bumper_small_yellow_anim.png"},
        {imgName: "circle_bumper_small_blue", theFile: "tables/circle_bumper_small_blue.png"},
        {imgName: "circle_bumper_small_blue_anim", theFile: "animations/circle_bumper_small_blue_anim.png"},
        {imgName: "circle_bumper_small_green", theFile: "tables/circle_bumper_small_green.png"},
        {imgName: "circle_bumper_small_green_anim", theFile: "animations/circle_bumper_small_green_anim.png"},

        {imgName: "cloud_bg", theFile: "tables/cloud_bg.png"},
        {imgName: "cloud_bg_top", theFile: "tables/cloud_bg_top.png"},
        {imgName: "cloud_bg_top_empty", theFile: "tables/cloud_bg_top_empty.png"},
        {imgName: "cloud_1", theFile: "tables/cloud_1.png"},
        {imgName: "cloud_2", theFile: "tables/cloud_2.png"},
        {imgName: "cloud_3", theFile: "tables/cloud_3.png"},
        {imgName: "cloud_4", theFile: "tables/cloud_4.png"},
        {imgName: "cloud_5", theFile: "tables/cloud_5.png"},
        {imgName: "cloud_6", theFile: "tables/cloud_6.png"},
        {imgName: "cloud_7", theFile: "tables/cloud_7.png"},
        {imgName: "space_bottom_bg", theFile: "tables/space_bottom_bg.png"},
        {imgName: "expanding_star", theFile: "tables/expanding_star.png"},
        {imgName: "expanding_star_anim", theFile: "animations/expanding_star_anim.png"},
        {imgName: "expanding_star_2", theFile: "tables/expanding_star_2.png"},
        {imgName: "expanding_star_2_anim", theFile: "animations/expanding_star_2_anim.png"},
        {imgName: "tiny_star", theFile: "tables/tiny_star.png"},
        {imgName: "tiny_star_anim", theFile: "animations/tiny_star_anim.png"},
        {imgName: "small_star", theFile: "tables/small_star.png"},
        {imgName: "small_star_anim", theFile: "animations/small_star_anim.png"},

        { imgName: "diamond_div_1", theFile: "tables/diamond_div.png" },
        { imgName: "diamond_div_2", theFile: "tables/diamond_div.png" },
        { imgName: "diamond_div_3", theFile: "tables/diamond_div.png" },
        { imgName: "diamond_div_4", theFile: "tables/diamond_div.png" },
        { imgName: "diamond_div_5", theFile: "tables/diamond_div.png" },
        

        {imgName: "drain_rail_left", theFile: "tables/drain_rail_left.png"},
        {imgName: "drain_rail_right", theFile: "tables/drain_rail_right.png"},

        {imgName: "drain_wall_left", theFile: "tables/drain_wall_left.png"},
        {imgName: "drain_wall_right", theFile: "tables/drain_wall_right.png"},

        {imgName: "flipper_bumper_left", theFile: "tables/flipper_bumper_left.png"},
        {imgName: "flipper_bumper_left_anim", theFile: "animations/flipper_bumper_left_anim.png"},
        {imgName: "flipper_bumper_right", theFile: "tables/flipper_bumper_right.png"},
        {imgName: "flipper_bumper_right_anim", theFile: "animations/flipper_bumper_right_anim.png"},

        {imgName: "flipper_left", theFile: "tables/flipper_left.png"},
        {imgName: "flipper_right", theFile: "tables/flipper_right.png"},

        {imgName: "flipper_left_short", theFile: "tables/flipper_left_short.png"},
        {imgName: "flipper_right_short", theFile: "tables/flipper_right_short.png"},

        {imgName: "plunger_chute", theFile: "tables/plunger_chute.png"},
        {imgName: "plunger", theFile: "tables/plunger.png"},
        {imgName: "plunger_retracted", theFile: "tables/plunger_retracted.png"},
        {imgName: "plunger_anim", theFile: "animations/plunger_anim.png"},
        {imgName: "plunger_gate", theFile: "tables/plunger_gate.png"},
        {imgName: "chute_wall", theFile: "tables/chute_wall.png"},

        {imgName: "vertical_wall", theFile: "tables/vertical_wall.png"},
        {imgName: "horizontal_wall", theFile: "tables/horizontal_wall.png"},
        {imgName: "lane_trigger", theFile: "tables/lane_trigger.png"},

        { imgName: "letter_light", theFile: "tables/letter_light_unlit.png" },                
        { imgName: "light_trigger", theFile: "tables/light_trigger.png" },               
        { imgName: "letter_light_unlit", theFile: "tables/letter_light_unlit.png" },
        { imgName: "letter_light_lit", theFile: "tables/letter_light_lit.png" },
        { imgName: "demo_letter_lights", theFile: "tables/letter_light_lit.png" },
        { imgName: "letter_light_anim", theFile: "animations/letter_light_anim.png" },   

        {imgName: "rotating_gate", theFile: "tables/rotating_gate_provisional.png"},
        {imgName: "rotating_gate_animation", theFile: "animations/rotating_gate_red_animation.png"},

        {imgName: "cyclone", theFile: "tables/cyclone.png"},
        {imgName: "cyclone_anim", theFile: "animations/cyclone_anim.png"},

        {imgName: "plane_red", theFile: "tables/plane_red.png"},
        {imgName: "plane_red_explosion_anim", theFile: "animations/plane_red_explosion_anim.png"},
        {imgName: "plane_blue", theFile: "tables/plane_blue.png"},
        {imgName: "plane_blue_explosion_anim", theFile: "animations/plane_blue_explosion_anim.png"},
        {imgName: "plane_yellow", theFile: "tables/plane_yellow.png"},
        {imgName: "plane_yellow_explosion_anim", theFile: "animations/plane_yellow_explosion_anim.png"},
        {imgName: "plane_green", theFile: "tables/plane_green.png"},
        {imgName: "plane_green_explosion_anim", theFile: "animations/plane_green_explosion_anim.png"},

        {imgName: "plane_pipe_right", theFile: "tables/plane_pipe_right.png"},
        {imgName: "plane_pipe_left", theFile: "tables/plane_pipe_left.png"},        

        {imgName: "ball_catch", theFile: "tables/ball_catch.png"},
        {imgName: "ball_catch_arrow", theFile: "tables/ball_catch_arrow.png"},     

        {imgName: "habitrail_gateway", theFile: "tables/habitrail_gateway.png"},
        {imgName: "habitrail_small_track", theFile: "tables/habitrail_small_track.png"},
        {imgName: "habitrail_track", theFile: "tables/habitrail_track.png"},
        {imgName: "flipper_title_medium", theFile: "screens/Flipperball_Title_Image_Medium.png"},
        {imgName: "flipper_title_small", theFile: "screens/Flipperball_Title_Image_Small.png"},

        {imgName: "spawner_plane", theFile: "tables/spawner_plane.png"},

        {imgName: "rocket", theFile: "tables/rocket.png"},
        {imgName: "rocket_anim", theFile: "animations/rocket_anim.png"},
        {imgName: "earth", theFile: "tables/earth.png"},
        {imgName: "mars", theFile: "tables/mars.png"},
        {imgName: "jupiter", theFile: "tables/jupiter.png"},
        {imgName: "saturn", theFile: "tables/saturn.png"},
        {imgName: "shuttle", theFile: "tables/space_shuttle.png"},
        {imgName: "sputnik", theFile: "tables/sputniksatellite.png"},

        {imgName: "slot", theFile: "tables/slot.png"},
        {imgName: "slot_animation", theFile: "animations/slot_frame_anim.png"},
        {imgName: "slot_animation_t", theFile: "animations/slot_frame_anim_t.png"},
        {imgName: "slot_animation_g", theFile: "animations/slot_frame_anim_g.png"},
        {imgName: "slot_animation_d", theFile: "animations/slot_frame_anim_d.png"},
        {imgName: "slot_trigger", theFile: "tables/lane_trigger.png"},
        
        // V.A.M. Table Sprites
        { imgName: "vam_logo", theFile: "tables/vam/vam_logo.png" },
        { imgName: "emp_inf_anim", theFile: "animations/emp_inf_anim.png" },
        { imgName: "empire_logo", theFile: "tables/vam/empire_logo.png" },
        { imgName: "asteroid", theFile: "tables/vam/asteroid.png" },
        { imgName: "starfield", theFile: "tables/vam/starfield.png" },
        { imgName: "wing_bumper_left", theFile: "tables/vam/wing_bumper_left.png" },
        { imgName: "wing_bumper_right", theFile: "tables/vam/wing_bumper_right.png" },
        { imgName: "vam_drain_rail_left", theFile: "tables/vam/vam_drain_rail_left.png" },
        { imgName: "vam_drain_rail_right", theFile: "tables/vam/vam_drain_rail_right.png" },
        { imgName: "vam_flipper_left", theFile: "tables/vam/vam_flipper_left.png" },
        { imgName: "vam_flipper_right", theFile: "tables/vam/vam_flipper_right.png" },
        { imgName: "wing_bumper_left_anim", theFile: "animations/wing_bumper_left_anim.png" },
        { imgName: "wing_bumper_right_anim", theFile: "animations/wing_bumper_right_anim.png" },         
        { imgName: "backplate", theFile: "tables/vam/backplate.png" },
        { imgName: "arrow_selection", theFile: "tables/arrow_selection.png"},
        { imgName: "left_flipper_selector", theFile: "tables/left_flipper_selector.png"},
        { imgName: "right_flipper_selector", theFile: "tables/right_flipper_selector.png"},

        //Forest Table Sprites
        {imgName: "forest_bottom_bg", theFile: "tables/forest_bottom_bg.png"},
        {imgName: "forest_vertical_wall", theFile: "tables/forest_vertical_wall.png"},
        {imgName: "forest_drain_wall_left", theFile: "tables/forest_drain_wall_left.png"},
        {imgName: "forest_drain_wall_right", theFile: "tables/forest_drain_wall_right.png"},
        {imgName: "forest_plunger_chute", theFile: "tables/forest_plunger_chute.png"},
        {imgName: "forest_angled_wall_5", theFile: "tables/forest_angled_wall_5.png"},
        {imgName: "forest_angled_wall_6", theFile: "tables/forest_angled_wall_6.png"},
        
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {
        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);
    }
}

function beginLoadingImage(imgName, fileName) {
    const newImg = document.createElement("img");
    newImg.onload = function() {
        images[imgName] = newImg;
        picsToLoad--;
        if (picsToLoad === 0) { // last image loaded?
            loadingDoneSoStartGame();
        }
    }
    newImg.src = assetPath.Image + fileName;
}