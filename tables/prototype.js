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
                 "x":380,
                 "y":539
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
                 "x":630,
                 "y":540
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
                 "x":761.166666666667,
                 "y":88.8333333333333
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
                 "x":360,
                 "y":363.5
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
                 "x":761.5,
                 "y":363
                }, 
                {
                 "gid":15,
                 "height":95,
                 "id":32,
                 "name":"circle_bumper_red",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94,
                 "x":541,
                 "y":291.5
                }, 
                {
                 "gid":14,
                 "height":95,
                 "id":33,
                 "name":"circle_bumper_blue",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94,
                 "x":540.5,
                 "y":98
                }, 
                {
                 "gid":12,
                 "height":95,
                 "id":34,
                 "name":"circle_bumper_yellow",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94,
                 "x":635.5,
                 "y":198
                }, 
                {
                 "gid":13,
                 "height":95,
                 "id":35,
                 "name":"circle_bumper_green",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94,
                 "x":446.5,
                 "y":197
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
                 "x":778,
                 "y":419
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
                 "x":319,
                 "y":420
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
                 "id":1,
                 "name":"circle_bumper_blue",
                 "rotation":0,
                 "type":"circle_bumper",
                 "visible":true,
                 "width":94.652,
                 "x":539.909,
                 "y":2.28997
                }, 
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
                 "y":101.98
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
                 "y":101.98
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
                 "x":359,
                 "y":183.5
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
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":-122.364,
                         "y":-100.364
                        }, 
                        {
                         "x":-132.909,
                         "y":-104.909
                        }, 
                        {
                         "x":-143.636,
                         "y":-104.909
                        }, 
                        {
                         "x":-152.364,
                         "y":-100.727
                        }, 
                        {
                         "x":-156.545,
                         "y":-97.6364
                        }, 
                        {
                         "x":-161.455,
                         "y":-92
                        }, 
                        {
                         "x":-164.545,
                         "y":-84.7273
                        }, 
                        {
                         "x":-164.727,
                         "y":-71.6364
                        }, 
                        {
                         "x":-162.545,
                         "y":-65.6364
                        }, 
                        {
                         "x":-157.636,
                         "y":-58.5455
                        }, 
                        {
                         "x":-152.909,
                         "y":-54.5455
                        }, 
                        {
                         "x":-12.1818,
                         "y":17.2727
                        }, 
                        {
                         "x":-9.09091,
                         "y":18.7273
                        }, 
                        {
                         "x":-2.54545,
                         "y":17.8182
                        }, 
                        {
                         "x":1.09091,
                         "y":14.3636
                        }, 
                        {
                         "x":3.09091,
                         "y":11.6364
                        }, 
                        {
                         "x":3.27273,
                         "y":3.09091
                        }],
                 "rotation":0,
                 "type":"flipper",
                 "visible":true,
                 "width":0,
                 "x":545.818,
                 "y":520
                }, 
                {
                 "height":0,
                 "id":43,
                 "name":"flipper_right",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":-127.455,
                         "y":103.636
                        }, 
                        {
                         "x":-129.455,
                         "y":106.182
                        }, 
                        {
                         "x":-129.818,
                         "y":114.545
                        }, 
                        {
                         "x":-127.091,
                         "y":118.182
                        }, 
                        {
                         "x":-122.182,
                         "y":121.455
                        }, 
                        {
                         "x":-115.091,
                         "y":120.909
                        }, 
                        {
                         "x":26.9091,
                         "y":48.1818
                        }, 
                        {
                         "x":34.1818,
                         "y":40.7273
                        }, 
                        {
                         "x":37.4545,
                         "y":34.7273
                        }, 
                        {
                         "x":38.3636,
                         "y":32.1818
                        }, 
                        {
                         "x":38.5455,
                         "y":18.9091
                        }, 
                        {
                         "x":34.7273,
                         "y":10.5455
                        }, 
                        {
                         "x":31.2727,
                         "y":6.36364
                        }, 
                        {
                         "x":26.5455,
                         "y":2.72727
                        }, 
                        {
                         "x":20.9091,
                         "y":-0.181818
                        }, 
                        {
                         "x":14.7273,
                         "y":-2
                        }, 
                        {
                         "x":6,
                         "y":-2
                        }],
                 "rotation":0,
                 "type":"flipper",
                 "visible":true,
                 "width":0,
                 "x":760.545,
                 "y":418
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
                 "x":761.469515151515,
                 "y":62.5148787878788
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
                         "x":107,
                         "y":-404.5
                        }, 
                        {
                         "x":91,
                         "y":-404.5
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
                         "x":15,
                         "y":-405
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
                 "x":859.25,
                 "y":178.75
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
                 "x":320,
                 "y":180.182
                }, 
                {
                 "height":0,
                 "id":53,
                 "name":"left",
                 "polygon":[
                        {
                         "x":0,
                         "y":0
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
                         "x":14,
                         "y":-0.5
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
                 "x":816.273,
                 "y":317.455
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }],
 "nextlayerid":6,
 "nextobjectid":56,
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
         "tilecount":20,
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
                 "image":"..\/raw\/img\/backgrounds\/flipper_left.png",
                 "imageheight":124,
                 "imagewidth":170,
                 "type":"left_flipper"
                }, 
                {
                 "id":2,
                 "image":"..\/raw\/img\/backgrounds\/flipper_right.png",
                 "imageheight":124,
                 "imagewidth":170,
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
                }],
         "tilewidth":197
        }],
 "tilewidth":10,
 "type":"map",
 "version":1.4,
 "width":100
});