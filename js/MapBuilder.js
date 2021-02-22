// MapBuilder.js
// eslint-disable-next-line no-unused-vars
function MapBuilder (tableName = TABLES.Prototype) {
    const mapData = TileMaps[tableName];
    // eslint-disable-next-line consistent-this
    const self = this;
    this.collisionLayerData = null;
    this.dynamicLayerData = null;
    this.fixedLayerData = null;
    this.balls = [];
    this.flippers = [];
    this.animations = [];
    this.plunger = null;

    for (const layerData of mapData.layers) {
        switch(layerData.name) {
            case TABLE_LAYERS.Collision:
                this.collisionLayerData = layerData;
                break;
            case TABLE_LAYERS.Dynamic:
                this.dynamicLayerData = layerData;
                break;
            case TABLE_LAYERS.Fixed:
                this.fixedLayerData = layerData;
                break;
            default:
                // eslint-disable-next-line no-console
                console.error("Unknown Layer name encountered");
                break;
        }
    }

    const buildStaticObjects = function(objData) {
        const result = [];

        for (const obj of objData) {     
            result.push(new StaticMapObject(obj));
        }
        return result;
    }

    const buildDynamicObjects = function(objData, collisionData) {
        const result = [];

        for (const obj of objData) {
            if (DEBUG) { console.log("Building DynObj: " + obj.name + ":" + obj.id); }

            if (obj.properties) {
                for (const prop of obj.properties) {
                    obj[prop.name] = prop.value
                }
            }
            
            // Find all colliders that are connected to this DynamicObject. (Have dynObjConn property -> obj.id)
            let bodyData = [];
            for (const colData of collisionData) {                
                if (colData.properties) {
                    const colProps = {};
                    for (const property of colData.properties) {
                        colProps[property['name']] = property['value'];
                    }
                    if (colProps.dynObjConn) {                        
                        if (colProps.dynObjConn === obj.id) { bodyData.push(colData); }
                    }
                }
            }
            if (DEBUG) { console.log("Colliders Found: " + bodyData.length); }
            if (bodyData.length === 1) {
                bodyData = bodyData[0];
            }
            
            if (obj.type === ENTITY_TYPE.Ball) {                
                self.balls.push(new Ball(obj, bodyData));
            } else if ((obj.type === 'left_flipper') || (obj.type === 'right_flipper')) {                
                self.flippers.push(new Flipper(obj, bodyData));
            } else if (obj.type === ENTITY_TYPE.FlipperBumper) {
                result.push(new FlipperBumper(obj, bodyData));
            } else if (obj.type === ENTITY_TYPE.Trigger) {                
                result.push(new TriggerMapObject(obj, bodyData));
            } else if (obj.type === 'plunger') {                
                self.plunger = new Plunger(obj, bodyData);
            } else if (obj.type === 'rotating_gate'){
                const newGameObject = new RotatingGateObject(obj, bodyData, {
                    ...ANIMATIONS.ROTATING_GATE,
                    animationSpritesheet: images[ANIMATIONS.ROTATING_GATE.imageNames[obj.name]],
                });
                result.push(newGameObject);
            } else if (obj.type === 'letter_light') {
                // TBD: letter_light doesn't need a collider. This is the old way to load a collider, and it's just to keep other processes from crashing later. 
                // We need the ability for a dynObj to be generated without a collider but still function to remove this
                const bodyData = collisionData.find((data) => data.name === obj.name);
                const newGameObject = new GameObject(obj, bodyData, {
                    ...ANIMATIONS.LETTER_LGHT_GLOW,
                    animationSpritesheet: images[ANIMATIONS.LETTER_LIGHT.imageNames[obj.name]],
                });
                result.push(newGameObject);
            } else if (obj.type === 'habitrail' && obj.name === "habitrail_gateway") {
                const bodyData = collisionData.find((data) => data.name === obj.name);
                var habitrail = new HabitrailMapObject(obj, bodyData);
                for (const collisionId of habitrail.relatedCollisionObjects) {
                    var foundCollisionData = collisionData.find((data) => data.id == collisionId);
                    foundCollisionData.type = 'NA';
                }
                result.push(habitrail);
            } else {                
                if (obj.type === ENTITY_TYPE.CircleBumper) {
                    const newGameObject = new GameObject(obj, bodyData, {
                        ...ANIMATIONS.CIRCLE_BUMPER,
                        animationSpritesheet: images[ANIMATIONS.CIRCLE_BUMPER.imageNames[obj.name]],
                    });
                    result.push(newGameObject);
                } else if (obj.type === ENTITY_TYPE.Plane) {
                    const newPlane = new Plane(obj, bodyData, {
                        ...ANIMATIONS.PLANE_EXPLOSION,
                        animationSpritesheet: images[ANIMATIONS.PLANE_EXPLOSION.imageNames[obj.name]],
                    });
                    result.push(newPlane);
                } else {
                    if (obj.type === ENTITY_TYPE.Cloud) {
                        result.push(new GameObject(obj, null));
                    } else {
                        result.push(new GameObject(obj, bodyData));
                    }
                }
            }
        }

        return result;
    }

    const buildTableColliders = function (collisionData) {
        const result = [];

        for (const obj of collisionData) {
            if (obj.type === 'wall'|| obj.type === 'NA') {
                result.push(new TableObject(obj));
            }
        }

        return result;
    }

    this.staticObjects = buildStaticObjects(this.fixedLayerData.objects);
    this.dynamicObjects = buildDynamicObjects(this.dynamicLayerData.objects, this.collisionLayerData.objects);
    this.tableColliders = buildTableColliders(this.collisionLayerData.objects);
}

function StaticMapObject(objData) {
    this.gid = objData.gid;
    this.id = objData.id;
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.reflectance = objData.reflectance || 0.75;
    this.image = images[objData.name];
    this.rotation = objData.rotation * (Math.PI/180) || 0;
    //console.log("Object: " + objData.name + " id: " + this.id);
    this.draw = function() {
        if (this.rotation > 0) {
            drawImageForTiledWithRotation(this.image, this.x, this.y, this.rotation);
        } else {
            canvasContext.drawImage(this.image, this.x, this.y);
        }
    }
}

function HabitrailMapObject(objData, bodyData, collisionData = undefined) {
    this.gid = objData.gid;
    this.id = objData.id;
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.reflectance = objData.reflectance || 0.75;
    this.image = images[objData.name];
    this.rotation = objData.rotation * (Math.PI/180) || 0;
    this.body = new CollisionBody(bodyData);
    this.relatedCollisionObjects = String(objData.properties[0].value).split(',');

    this.draw = function() {
        if (this.rotation > 0) {
            drawImageForTiledWithRotation(this.image, this.x, this.y, this.rotation);
        } else {
            canvasContext.drawImage(this.image, this.x, this.y);
        }
    }
    
    this.update = function(deltaTime) {}

}

function TableObject(objData) {
    this.gid = objData.gid;
    this.id = objData.id;
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.reflectance = objData.reflectance || 0.4;
    this.body = new CollisionBody(objData);
    this.draw = function() {
        this.body.draw();
    }
}

function TriggerMapObject(objData, bodyData) {
    this.gid = objData.gid;
    this.id = objData.id;
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.image = images[objData.name];
    this.subType = objData.name;
    this.body = new CollisionBody(bodyData);
    this.reflectance = objData.reflectance || 1;
    this.hasCollided = false;
    this.score = 0;
    
    for (i = 0; i < objData.properties?.length; i++) {
        switch (objData.properties[i].name) {
            case "score":
                this.score = objData.properties[i].value;
                //console.log("Score set to " + this.score + " for " + objData.name);
                break;
            case "targ_light":
                this.targ_light = objData.properties[i].value;
                if (DEBUG) { console.log("Target Light set to " + this.targ_light + " for " + objData.name); }
                break;
            case "ball_catch":
                this.ball_catch = objData.properties[i].value;
                if (DEBUG) { console.log("Ball Catch set to " + this.ball_catch + " for " + objData.name); }
            default:
                break;
        }
        //console.log("Name: " + objData.name + " Properties: " + objData.properties[i].name);
    }
    
    this.update = function(deltaTime) {}
    this.draw = function() {
        canvasContext.drawImage(this.image, this.x, this.y);
        this.body.draw();
    }
}
