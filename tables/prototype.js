(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("prototype",
{ "compressionlevel":-1,
 "editorsettings":
    {
     "export":
        {
         "format":"js",
         "target":"prototype.js"
        }
    },
 "height":60,
 "infinite":false,
 "layers":[
        {
         "draworder":"topdown",
         "id":5,
         "name":"Fixed",
         "objects":[
                {
                 "gid":22,
                 "height":600,
                 "id":56,
                 "name":"cloud_bg",
                 "rotation":0,
                 "type":"",
                 "visible":false,
                 "width":720,
                 "x":280,
                 "y":600
                }, 
                {
                 "gid":4,
                 "height":598,
                 "id":23,
                 "name":"plunger_chute",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":105,
                 "x":893,
                 "y":598
                }, 
                {
                 "gid":6,
                 "height":195,
                 "id":24,
                 "name":"drain_wall_right",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":197,
                 "x":698,
                 "y":598
                }, 
                {
                 "gid":5,
                 "height":195,
                 "id":25,
                 "name":"drain_wall_left",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":197,
                 "x":289,
                 "y":598
                }, 
                {
                 "gid":7,
                 "height":598,
                 "id":26,
                 "name":"vertical_wall",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":14,
                 "x":276,
                 "y":598
                }, 
                {
                 "gid":11,
                 "height":86,
                 "id":36,
                 "name":"angled_wall_4",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":52,
                 "x":843,
                 "y":138
                }, 
                {
                 "gid":8,
                 "height":86,
                 "id":37,
                 "name":"angled_wall_1",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":52,
                 "x":290,
                 "y":138
                }, 
                {
                 "gid":10,
                 "height":52,
                 "id":39,
                 "name":"angled_wall_3",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":52,
                 "x":842.667,
                 "y":52.3333
                }, 
                {
                 "gid":9,
                 "height":52,
                 "id":40,
                 "name":"angled_wall_2",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":52,
                 "x":290,
                 "y":53
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":4,
         "name":"Dynamic",
         "objects":[
                {
                 "gid":1,
                 "height":289,
                 "id":13,
                 "name":"plunger",
                 "rotation":0,
                 "type":"plunger",
                 "visible":true,
                 "width":68,
                 "x":912,
                 "y":552
                }, 
                {
                 "gid":2,
                 "height":124,
                 "id":14,
                 "name":"flipper_left",
                 "rotation":0,
                 "type":"left_flipper",
                 "visible":true,
                 "width":170,
                 "x":381,
                 "y":532
                }, 
                {
                 "gid":3,
                 "height":124,
                 "id":15,
                 "name":"flipper_right",
                 "rotation":0,
                 "type":"right_flipper",
                 "visible":true,
                 "width":170,
                 "x":636,
                 "y":533
                }, 
                {
                 "gid":16,
                 "height":26,
                 "id":16,
                 "name":"ball",
                 "rotation":0,
                 "type":"ball",
                 "visible":true,
                 "width":26,
                 "x":761.167,
                 "y":88.8333
                }, 
                {
                 "gid":17,
                 "height":186,
                 "id":30,
                 "name":"flipper_bumper_left",
                 "rotation":0,
                 "type":"flipper_bumper",
                 "visible":true,
                 "width":55,
                 "x":363,
                 "y":360.5
                }, 
                {
                 "gid":18,
                 "height":186,
                 "id":31,
                 "name":"flipper_bumper_right",
                 "rotation":0,
                 "type":"flipper_bumper",
                 "visible":true,
                 "width":55,
                 "x":758.5,
                 "y":360
                }, 
                {
                 "gid":15,
                 "height":95,
                 "id":32,
                 "name":"circle_bumper_red",
                 "properties":[
                        {
                         "name":"score",
                         "type":"int",
                         "value":100
                        }],
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94,
                 "x":541,
                 "y":291.5
                }, 
                {
                 "gid":12,
                 "height":95,
                 "id":34,
                 "name":"circle_bumper_yellow",
                 "properties":[
                        {
                         "name":"score",
                         "type":"int",
                         "value":100
                        }],
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94,
                 "x":635.5,
                 "y":158
                }, 
                {
                 "gid":13,
                 "height":95,
                 "id":35,
                 "name":"circle_bumper_green",
                 "properties":[
                        {
                         "name":"score",
                         "type":"int",
                         "value":100
                        }],
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94,
                 "x":446.5,
                 "y":157
                }, 
                {
                 "gid":20,
                 "height":240,
                 "id":48,
                 "name":"drain_rail_right",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":82,
                 "x":775,
                 "y":416
                }, 
                {
                 "gid":19,
                 "height":240,
                 "id":49,
                 "name":"drain_rail_left",
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":82,
                 "x":322,
                 "y":417
                }, 
                {
                 "gid":21,
                 "height":26,
                 "id":58,
                 "name":"lane_trigger",
                 "properties":[
                        {
                         "name":"score",
                         "type":"int",
                         "value":25
                        }],
                 "rotation":0,
                 "type":"trigger",
                 "visible":true,
                 "width":5,
                 "x":827.18,
                 "y":242.818
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":3,
         "name":"Collision",
         "objects":[
                {
                 "ellipse":true,
                 "height":95.4154,
                 "id":3,
                 "name":"circle_bumper_green",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94.652,
                 "x":445.784,
                 "y":61.98
                }, 
                {
                 "ellipse":true,
                 "height":95.4154,
                 "id":4,
                 "name":"circle_bumper_yellow",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94.652,
                 "x":634.561,
                 "y":61.98
                }, 
                {
                 "ellipse":true,
                 "height":95.4154,
                 "id":5,
                 "name":"circle_bumper_red",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94.652,
                 "x":539.909,
                 "y":195.946
                }, 
                {
                 "height":0,
                 "id":9,
                 "name":"flipper_bumper_left",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":0.25,
                         "y":134.75
                        }, 
                        {
                         "x":2.5,
                         "y":138.5
                        }, 
                        {
                         "x":45.25,
                         "y":178.25
                        }, 
                        {
                         "x":48.5,
                         "y":179.5
                        }, 
                        {
                         "x":51.25,
                         "y":179.5
                        }, 
                        {
                         "x":54.75,
                         "y":176.25
                        }, 
                        {
                         "x":55.25,
                         "y":172.75
                        }, 
                        {
                         "x":19,
                         "y":-0.25
                        }, 
                        {
                         "x":17,
                         "y":-4
                        }, 
                        {
                         "x":13,
                         "y":-6.25
                        }, 
                        {
                         "x":6,
                         "y":-6.25
                        }, 
                        {
                         "x":2,
                         "y":-4.25
                        }],
                 "rotation":0,
                 "type":"flipper_bumper",
                 "visible":true,
                 "width":0,
                 "x":362,
                 "y":180.5
                }, 
                {
                 "height":0,
                 "id":41,
                 "name":"plunger",
                 "polygon":[
                        {
                         "x":0,
                         "y":-1.81818
                        }, 
                        {
                         "x":0,
                         "y":13
                        }, 
                        {
                         "x":67.75,
                         "y":13.5
                        }, 
                        {
                         "x":67.75,
                         "y":-1.75
                        }, 
                        {
                         "x":33.875,
                         "y":0.0340909
                        }],
                 "rotation":0,
                 "type":"plunger",
                 "visible":true,
                 "width":0,
                 "x":912.25,
                 "y":263.25
                }, 
                {
                 "height":0,
                 "id":42,
                 "name":"flipper_left",
                 "polygon":[
                        {
                         "x":2.33333,
                         "y":-2
                        }, 
                        {
                         "x":-123.302666666667,
                         "y":-102.575333333333
                        }, 
                        {
                         "x":-154.242333333333,
                         "y":-54.5455333333333
                        }, 
                        {
                         "x":-11.8484999999999,
                         "y":16.2726666666666
                        }],
                 "rotation":0,
                 "type":"flipper",
                 "visible":true,
                 "width":0,
                 "x":545.484666666666,
                 "y":515.666666666667
                }, 
                {
                 "height":0,
                 "id":43,
                 "name":"flipper_right",
                 "polygon":[
                        {
                         "x":-13.6666700000001,
                         "y":9.6666633333333
                        }, 
                        {
                         "x":-130.788666666667,
                         "y":103.515666666667
                        }, 
                        {
                         "x":-117.515333333333,
                         "y":122.788333333333
                        }, 
                        {
                         "x":24.5151,
                         "y":48.7273
                        }],
                 "rotation":0,
                 "type":"flipper",
                 "visible":true,
                 "width":0,
                 "x":772.545,
                 "y":409.333333333333
                }, 
                {
                 "ellipse":true,
                 "height":26,
                 "id":45,
                 "name":"ball",
                 "rotation":0,
                 "type":"ball",
                 "visible":true,
                 "width":25.4545,
                 "x":761.47,
                 "y":62.5149
                }, 
                {
                 "height":0,
                 "id":50,
                 "name":"right",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":-194.5,
                         "y":195
                        }, 
                        {
                         "x":107.5,
                         "y":194.5
                        }, 
                        {
                         "x":103.736,
                         "y":-484
                        }, 
                        {
                         "x":87.736,
                         "y":-484
                        }, 
                        {
                         "x":90.5,
                         "y":141.5
                        }, 
                        {
                         "x":16,
                         "y":141.5
                        }, 
                        {
                         "x":11.736,
                         "y":-484.5
                        }, 
                        {
                         "x":-0.5,
                         "y":-484.223
                        }, 
                        {
                         "x":0.5,
                         "y":-404.5
                        }, 
                        {
                         "x":-49.5,
                         "y":-352.5
                        }, 
                        {
                         "x":0,
                         "y":-270.5
                        }],
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":0,
                 "x":892.5,
                 "y":404.5
                }, 
                {
                 "height":0,
                 "id":51,
                 "name":"drain_rail_right",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":-10.5,
                         "y":1.5
                        }, 
                        {
                         "x":-10.25,
                         "y":161.159
                        }, 
                        {
                         "x":-80.9773,
                         "y":231.432
                        }, 
                        {
                         "x":-73.3409,
                         "y":238.886
                        }, 
                        {
                         "x":-0.25,
                         "y":165.159
                        }],
                 "rotation":0,
                 "type":"drain_divider",
                 "visible":true,
                 "width":0,
                 "x":856.25,
                 "y":175.75
                }, 
                {
                 "height":0,
                 "id":52,
                 "name":"drain_rail_left",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":0,
                         "y":164.364
                        }, 
                        {
                         "x":72.5455,
                         "y":237.818
                        }, 
                        {
                         "x":80.1818,
                         "y":230.909
                        }, 
                        {
                         "x":10.1818,
                         "y":161.091
                        }, 
                        {
                         "x":9.81818,
                         "y":1.63636
                        }],
                 "rotation":0,
                 "type":"drain_divider",
                 "visible":true,
                 "width":0,
                 "x":323,
                 "y":177.182
                }, 
                {
                 "height":0,
                 "id":53,
                 "name":"left",
                 "polygon":[
                        {
                         "x":0,
                         "y":-80
                        }, 
                        {
                         "x":-1,
                         "y":599.5
                        }, 
                        {
                         "x":210.5,
                         "y":598.5
                        }, 
                        {
                         "x":13.5,
                         "y":401.5
                        }, 
                        {
                         "x":13,
                         "y":136.5
                        }, 
                        {
                         "x":64.5,
                         "y":52
                        }, 
                        {
                         "x":13.6667,
                         "y":0.5
                        }, 
                        {
                         "x":13.0214,
                         "y":-80.4187
                        }],
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":0,
                 "x":276.5,
                 "y":0.5
                }, 
                {
                 "height":0,
                 "id":54,
                 "name":"drain",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":-0.5,
                         "y":41
                        }, 
                        {
                         "x":312,
                         "y":39
                        }, 
                        {
                         "x":312.5,
                         "y":-0.5
                        }],
                 "rotation":0,
                 "type":"drain",
                 "visible":true,
                 "width":0,
                 "x":443.5,
                 "y":600
                }, 
                {
                 "height":0,
                 "id":55,
                 "name":"flipper_bumper_right",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":0.181818,
                         "y":-134.545
                        }, 
                        {
                         "x":-1.81818,
                         "y":-138.545
                        }, 
                        {
                         "x":-5.81818,
                         "y":-140.545
                        }, 
                        {
                         "x":-12.5455,
                         "y":-140.727
                        }, 
                        {
                         "x":-16.3636,
                         "y":-138.727
                        }, 
                        {
                         "x":-18.7273,
                         "y":-134.545
                        }, 
                        {
                         "x":-54.3636,
                         "y":38
                        }, 
                        {
                         "x":-54.5455,
                         "y":42.3636
                        }, 
                        {
                         "x":-51.6364,
                         "y":45.2727
                        }, 
                        {
                         "x":-48.3636,
                         "y":45.2727
                        }, 
                        {
                         "x":-44.9091,
                         "y":44
                        }, 
                        {
                         "x":-2.18182,
                         "y":3.63636
                        }],
                 "rotation":0,
                 "type":"flipper_bumper",
                 "visible":true,
                 "width":0,
                 "x":813.273,
                 "y":314.455
                }, 
                {
                 "ellipse":true,
                 "height":25.9091,
                 "id":59,
                 "name":"lane_trigger",
                 "rotation":0,
                 "type":"trigger",
                 "visible":true,
                 "width":5.09091,
                 "x":827.18,
                 "y":216.909
                }, 
                {
                 "ellipse":true,
                 "height":24,
                 "id":60,
                 "name":"flipper_right",
                 "rotation":0,
                 "type":"flipper_tip",
                 "visible":true,
                 "width":24,
                 "x":636.674,
                 "y":509.958966666666
                }, 
                {
                 "ellipse":true,
                 "height":55,
                 "id":61,
                 "name":"flipper_right",
                 "rotation":0,
                 "type":"flipper_base",
                 "visible":true,
                 "width":55,
                 "x":751.340666666667,
                 "y":409.2923
                }, 
                {
                 "ellipse":true,
                 "height":24,
                 "id":62,
                 "name":"flipper_left",
                 "rotation":0,
                 "type":"flipper_tip",
                 "visible":true,
                 "width":24,
                 "x":526.666666666667,
                 "y":510
                }, 
                {
                 "ellipse":true,
                 "height":55,
                 "id":63,
                 "name":"flipper_left",
                 "rotation":0,
                 "type":"flipper_base",
                 "visible":true,
                 "width":55,
                 "x":379.833333333333,
                 "y":409.5
                }, 
                {
                 "height":0,
                 "id":66,
                 "name":"flipper_right",
                 "polygon":[
                        {
                         "x":-35.6667,
                         "y":58.0833
                        }, 
                        {
                         "x":-126.456,
                         "y":124.766
                        }, 
                        {
                         "x":-116.182,
                         "y":128.121
                        }, 
                        {
                         "x":-17.9849,
                         "y":77.144
                        }],
                 "rotation":0,
                 "type":"flipper_inner",
                 "visible":true,
                 "width":0,
                 "x":770,
                 "y":398.666666666667
                }, 
                {
                 "height":0,
                 "id":67,
                 "name":"flipper_left",
                 "polygon":[
                        {
                         "x":-2.91667,
                         "y":10.25
                        }, 
                        {
                         "x":-107.303,
                         "y":-67.075
                        }, 
                        {
                         "x":-123.492,
                         "y":-42.0455
                        }, 
                        {
                         "x":-16.3485,
                         "y":11.2727
                        }],
                 "rotation":0,
                 "type":"flipper_inner",
                 "visible":true,
                 "width":0,
                 "x":546,
                 "y":515
                }, 
                {
                 "height":0,
                 "id":68,
                 "name":"right",
                 "polygon":[
                        {
                         "x":1.5,
                         "y":-3
                        }, 
                        {
                         "x":-43.5,
                         "y":45.5
                        }, 
                        {
                         "x":10,
                         "y":136
                        }, 
                        {
                         "x":9,
                         "y":-84.5
                        }, 
                        {
                         "x":0.5,
                         "y":-84.5
                        }],
                 "rotation":0,
                 "type":"wall",
                 "visible":true,
                 "width":0,
                 "x":893.5,
                 "y":7
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }],
 "nextlayerid":6,
 "nextobjectid":69,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.4.3",
 "tileheight":10,
 "tilesets":[
        {
         "columns":0,
         "firstgid":1,
         "grid":
            {
             "height":1,
             "orientation":"orthogonal",
             "width":1
            },
         "margin":0,
         "name":"dynamic",
         "spacing":0,
         "tilecount":21,
         "tileheight":598,
         "tiles":[
                {
                 "id":0,
                 "image":"..\/raw\/img\/backgrounds\/plunger.png",
                 "imageheight":289,
                 "imagewidth":68,
                 "type":"plunger"
                }, 
                {
                 "id":1,
                 "image":"..\/img\/tables\/flipper_left.png",
                 "imageheight":126,
                 "imagewidth":171,
                 "type":"left_flipper"
                }, 
                {
                 "id":2,
                 "image":"..\/img\/tables\/flipper_right.png",
                 "imageheight":126,
                 "imagewidth":171,
                 "type":"right_flipper"
                }, 
                {
                 "id":3,
                 "image":"..\/raw\/img\/backgrounds\/plunger_chute.png",
                 "imageheight":598,
                 "imagewidth":105,
                 "type":"wall"
                }, 
                {
                 "id":4,
                 "image":"..\/raw\/img\/backgrounds\/drain_wall_left.png",
                 "imageheight":195,
                 "imagewidth":197,
                 "type":"wall"
                }, 
                {
                 "id":5,
                 "image":"..\/raw\/img\/backgrounds\/drain_wall_right.png",
                 "imageheight":195,
                 "imagewidth":197,
                 "type":"wall"
                }, 
                {
                 "id":6,
                 "image":"..\/raw\/img\/backgrounds\/vertical_wall.png",
                 "imageheight":598,
                 "imagewidth":14,
                 "type":"wall"
                }, 
                {
                 "id":7,
                 "image":"..\/raw\/img\/backgrounds\/angled_wall_1.png",
                 "imageheight":86,
                 "imagewidth":52,
                 "type":"wall"
                }, 
                {
                 "id":8,
                 "image":"..\/raw\/img\/backgrounds\/angled_wall_2.png",
                 "imageheight":52,
                 "imagewidth":52,
                 "type":"wall"
                }, 
                {
                 "id":9,
                 "image":"..\/raw\/img\/backgrounds\/angled_wall_3.png",
                 "imageheight":52,
                 "imagewidth":52,
                 "type":"wall"
                }, 
                {
                 "id":10,
                 "image":"..\/raw\/img\/backgrounds\/angled_wall_4.png",
                 "imageheight":86,
                 "imagewidth":52,
                 "type":"wall"
                }, 
                {
                 "id":11,
                 "image":"..\/raw\/img\/backgrounds\/circle_bumper_yellow.png",
                 "imageheight":95,
                 "imagewidth":94,
                 "type":"circle_bumper"
                }, 
                {
                 "id":12,
                 "image":"..\/raw\/img\/backgrounds\/circle_bumper_green.png",
                 "imageheight":95,
                 "imagewidth":94,
                 "type":"circle_bumper"
                }, 
                {
                 "id":13,
                 "image":"..\/raw\/img\/backgrounds\/circle_bumper_blue.png",
                 "imageheight":95,
                 "imagewidth":94,
                 "type":"circle_bumper"
                }, 
                {
                 "id":14,
                 "image":"..\/raw\/img\/backgrounds\/circle_bumper_red.png",
                 "imageheight":95,
                 "imagewidth":94,
                 "type":"circle_bumper"
                }, 
                {
                 "id":15,
                 "image":"..\/raw\/img\/backgrounds\/ball.png",
                 "imageheight":26,
                 "imagewidth":26,
                 "type":"ball"
                }, 
                {
                 "id":16,
                 "image":"..\/raw\/img\/backgrounds\/flipper_bumper_left.png",
                 "imageheight":186,
                 "imagewidth":55,
                 "type":"flipper_bumper"
                }, 
                {
                 "id":17,
                 "image":"..\/raw\/img\/backgrounds\/flipper_bumper_right.png",
                 "imageheight":186,
                 "imagewidth":55,
                 "type":"flipper_bumper"
                }, 
                {
                 "id":18,
                 "image":"..\/raw\/img\/backgrounds\/drain_rail_left.png",
                 "imageheight":240,
                 "imagewidth":82,
                 "type":"wall"
                }, 
                {
                 "id":19,
                 "image":"..\/raw\/img\/backgrounds\/drain_rail_right.png",
                 "imageheight":240,
                 "imagewidth":82,
                 "type":"wall"
                }, 
                {
                 "id":20,
                 "image":"..\/raw\/img\/backgrounds\/lane_trigger.png",
                 "imageheight":26,
                 "imagewidth":5,
                 "type":"trigger"
                }],
         "tilewidth":197
        }, 
        {
         "columns":0,
         "firstgid":22,
         "grid":
            {
             "height":1,
             "orientation":"orthogonal",
             "width":1
            },
         "margin":0,
         "name":"cloud_bg",
         "spacing":0,
         "tilecount":1,
         "tileheight":600,
         "tiles":[
                {
                 "id":0,
                 "image":"..\/raw\/img\/backgrounds\/cloud_bg.png",
                 "imageheight":600,
                 "imagewidth":720
                }],
         "tilewidth":720
        }, 
        {
         "columns":0,
         "firstgid":23,
         "grid":
            {
             "height":1,
             "orientation":"orthogonal",
             "width":1
            },
         "margin":0,
         "name":"habitrail",
         "spacing":0,
         "tilecount":3,
         "tileheight":125,
         "tiles":[
                {
                 "id":0,
                 "image":"C:\/Users\/The Haad\/Desktop\/habitrail3.png",
                 "imageheight":75,
                 "imagewidth":36,
                 "type":"habitrail"
                }, 
                {
                 "id":1,
                 "image":"C:\/Users\/The Haad\/Desktop\/habitrail2.png",
                 "imageheight":125,
                 "imagewidth":36,
                 "type":"habitrail"
                }, 
                {
                 "id":2,
                 "image":"C:\/Users\/The Haad\/Desktop\/habitrail1.png",
                 "imageheight":75,
                 "imagewidth":36,
                 "type":"habitrail"
                }],
         "tilewidth":36
        }],
 "tilewidth":10,
 "type":"map",
 "version":1.4,
 "width":100
});