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
            if (obj.type === 'ball') {
                const bodyData = collisionData.find((data) => data.name === obj.name);
                self.balls.push(new Ball(obj, bodyData));
            } else if ((obj.type === 'left_flipper') || (obj.type === 'right_flipper')) {
                const bodyData = []
                for (const colData of collisionData) {
                    if (colData.name === obj.name) {bodyData.push(colData);}
                    if (bodyData.length === 4) {break;}
                }
                self.flippers.push(new Flipper(obj, bodyData));
            } else if (obj.type === 'trigger') {
                const bodyData = collisionData.find((data) => data.name === obj.name);
                result.push(new TriggerMapObject(obj, bodyData));
            } else if (obj.type === 'plunger') {
                const bodyData = collisionData.find((data) => data.name === obj.name);
                self.plunger = new Plunger(obj, bodyData);
            }  else if (obj.type === 'habitrail' && obj.name === "habitrail1") {
                const bodyData = collisionData.find((data) => data.name === obj.name);
                var habitrail = new HabitrailMapObject(obj, bodyData);
                var habitrailCollisionData = [];
                for (const collisionId of habitrail.relatedCollisionObjects) {
                    var foundCollisionData = collisionData.find((data) => data.id == collisionId);
                    foundCollisionData.type = 'NA';
                    habitrailCollisionData.push(foundCollisionData);
                }
                habitrail.collisionData = habitrailCollisionData;
                result.push(habitrail);
            }
             else {
                const bodyData = collisionData.find((data) => data.name === obj.name);
                if (obj.type === ENTITY_TYPE.CircleBumper) {
                    const newGameObject = new GameObject(obj, bodyData, {
                        ...ANIMATIONS.CIRCLE_BUMPER,
                        animationSpritesheet: images[ANIMATIONS.CIRCLE_BUMPER.imageNames[obj.name]],
                    });
                    result.push(newGameObject);

                } else {
                    result.push(new GameObject(obj, bodyData));
                }
            }
        }

        return result;
    }

    const buildTableColliders = function (collisionData) {
        const result = [];

        for (const obj of collisionData) {
            if (obj.type === 'wall') {
                result.push(new TableObject(obj));
            }
        }

        return result;
    }

    this.staticObjects = buildStaticObjects(this.fixedLayerData.objects, this.collisionLayerData.objects);
    this.dynamicObjects = buildDynamicObjects(this.dynamicLayerData.objects, this.collisionLayerData.objects);
    this.tableColliders = buildTableColliders(this.collisionLayerData.objects);
}

function StaticMapObject (objData) {
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.reflectance = objData.reflectance || 0.75;
    this.image = images[objData.name];
    this.rotation = objData.rotation * (Math.PI/180) || 0;

    this.draw = function() {
        if (this.rotation > 0) {
            drawImageForTiledWithRotation(this.image, this.x, this.y, this.rotation);
        } else {
            canvasContext.drawImage(this.image, this.x, this.y);
        }
    }
}

function HabitrailMapObject (objData, bodyData, collisionData = undefined) {
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.reflectance = objData.reflectance || 0.75;
    this.image = images[objData.name];
    this.rotation = objData.rotation * (Math.PI/180) || 0;
    this.body = new CollisionBody(bodyData);
    this.collisionData = collisionData;
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

function TableObject (objData) {
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
    this.score = objData.properties[0].value || 0;

    this.update = function(deltaTime) {}
    this.draw = function() {
        canvasContext.drawImage(this.image, this.x, this.y);
        this.body.draw();
    }
}