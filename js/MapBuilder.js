// MapBuilder.js
// eslint-disable-next-line no-unused-vars
function compareZ(a,b){
    return a.zOrder - b.zOrder;
}
function MapBuilder (tableName = selected_table) {
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
    this.drawOrder = [];
    this.slotMachines = [];
    if (mapData.properties) {
        for (const property of mapData.properties) {
            this[property.name] = property.value
        }
    }
    this.dynamicObjectsFirstIndex = 0;

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
            if (obj.properties) {
                for (const prop of obj.properties) {
                    obj[prop.name] = prop.value
                }
            }
            if (obj.type === ENTITY_TYPE.Slot) {
                const slot = new Slot(obj, null, {
                    ...ANIMATIONS.SLOT,
                    animationSpritesheet: images[ANIMATIONS.SLOT.imageNames[obj.animation]],
                })
                result.push(slot);

            } else {
                result.push(new StaticObject(obj));
            }
        }

        return result;
    }

    const buildDynamicObjects = function(objData, collisionData) {
        const result = [];

        for (const obj of objData) {
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
            if (bodyData.length === 1) {
                bodyData = bodyData[0];
            }
            
            if (obj.type === ENTITY_TYPE.Ball) {
                self.balls.push(new Ball(obj, bodyData));
            } else if ((obj.type === 'left_flipper') || (obj.type === 'right_flipper')) {
                self.flippers.push(new Flipper(obj, bodyData));
            } else if (obj.type === ENTITY_TYPE.FlipperBumper) {
                var newGameObject = null;
                if(obj.name.includes("forest")){
                    newGameObject = new FlipperBumper(obj, bodyData, {
                        ...ANIMATIONS.FOREST_FLIPPER_BUMPER,
                        animationSpritesheet: images[ANIMATIONS.FOREST_FLIPPER_BUMPER.imageNames[obj.name]],
                    });
                }else{
                    newGameObject = new FlipperBumper(obj, bodyData, {
                        ...ANIMATIONS.FLIPPER_BUMPER,
                        animationSpritesheet: images[ANIMATIONS.FLIPPER_BUMPER.imageNames[obj.name]],
                    });
            }
                result.push(newGameObject);
            } else if (obj.type === ENTITY_TYPE.WingBumper) {
                const newGameObject = new FlipperBumper(obj, bodyData, {
                    ...ANIMATIONS.WING_BUMPER,
                    animationSpritesheet: images[ANIMATIONS.WING_BUMPER.imageNames[obj.name]],
                });
                result.push(newGameObject);
            }else if(obj.type === ENTITY_TYPE.Banana){
                const newGameObject = new BananaObject(obj, bodyData, {
                    ...ANIMATIONS.BANANA,
                    animationSpritesheet: images[ANIMATIONS.BANANA.imageNames[obj.name]],
                });
                result.push(newGameObject);
            }
            else if(obj.type === ENTITY_TYPE.BananaTaken){
                const newGameObject = new BananaTakenObject(obj, bodyData, {
                    ...ANIMATIONS.BANANA_TAKEN,
                    animationSpritesheet: images[ANIMATIONS.BANANA_TAKEN.imageNames[obj.name]],
                });
                result.push(newGameObject);
            }
            else if (obj.type === ENTITY_TYPE.Trigger) {
                result.push(new TriggerMapObject(obj, bodyData));
            } else if (obj.type === 'plunger') {
                self.plunger = new Plunger(obj, bodyData, {
                    ...ANIMATIONS.PLUNGER_CONTRACT,
                    animationSpritesheet: images[ANIMATIONS.PLUNGER_CONTRACT.imageNames[obj.name]]},
                    {...ANIMATIONS.PLUNGER_RELEASE,
                        animationSpritesheet: images[ANIMATIONS.PLUNGER_CONTRACT.imageNames[obj.name]]});
            } else if (obj.type === 'rotating_gate') {
                const newGameObject = new RotatingGateObject(obj, bodyData, {
                    ...ANIMATIONS.ROTATING_GATE,
                    animationSpritesheet: images[ANIMATIONS.ROTATING_GATE.imageNames[obj.name]],
                });
                result.push(newGameObject);
            } else if (obj.type === ENTITY_TYPE.Spawner) {
                if (obj.name === ENTITY_NAME.SpawnerPlane) {
                    result.push(new PlaneSpawner(obj, bodyData))
                } else {
                    result.push(new Spawner(obj, bodyData));
                }
            } else if (obj.type === ENTITY_TYPE.VamMineral) {
                const newGameObject = new VamMineral(obj, bodyData);
                result.push(newGameObject);
            } else if (obj.type === 'letter_light') {
                // TBD: letter_light doesn't need a collider. This is the old way to load a collider, and it's just to keep other processes from crashing later. 
                // We need the ability for a dynObj to be generated without a collider but still function to remove this                
                const newGameObject = new ToggleLight(obj, null, {
                    ...ANIMATIONS.LETTER_LIGHT,
                    animationSpritesheet: images[ANIMATIONS.LETTER_LIGHT.imageNames[obj.name]],
                });
                result.push(newGameObject);
            } else if (obj.type === 'status_light') {
                if (obj.subtype === 'shuttle') {
                    const newGameObject = new ToggleLight(obj, null, {
                        ...ANIMATIONS.SHUTTLE,
                        animationSpritesheet: images[ANIMATIONS.SHUTTLE.imageNames[obj.name]],
                    });
                    result.push(newGameObject);    
                } else {
                    const newGameObject = new ToggleLight(obj, null, {
                        ...ANIMATIONS.BONUS_LIGHT,
                        animationSpritesheet: images[ANIMATIONS.BONUS_LIGHT.imageNames[obj.name]],
                    });
                    result.push(newGameObject);    
                }
            } else if (obj.type === 'empire_logo') {
                const newGameObject = new GameObject(obj, null, {
                    ...ANIMATIONS.EMPIRE_INF,
                    animationSpritesheet: images[ANIMATIONS.EMPIRE_INF.imageNames[obj.name]],
                });
                newGameObject.isAnimating = true;
                result.push(newGameObject);
            } else if (obj.type === 'habitrail' && obj.name === "habitrail_gateway") {
                var habitrail = new Habitrail(obj, bodyData);
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
                } else if (obj.type === ENTITY_TYPE.AsteroidBumper) {
                    const newAstBumper = new AsteroidBumper(obj, bodyData);
                    result.push(newAstBumper);
                } else if (obj.type === ENTITY_TYPE.Plane) {
                    const newPlane = new Plane(obj, bodyData, {
                        ...ANIMATIONS.PLANE_EXPLOSION,
                        animationSpritesheet: images[ANIMATIONS.PLANE_EXPLOSION.imageNames[obj.name]],
                    });
                    result.push(newPlane);
                } else if (obj.type === ENTITY_TYPE.SideDrainBumper) {
                    const newBumper = new SideDrainBumper(obj, bodyData, {
                        ...ANIMATIONS.SIDE_DRAIN_BUMPER,
                        animationSpritesheet: images[ANIMATIONS.SIDE_DRAIN_BUMPER.imageNames[obj.name]],
                    });
                    result.push(newBumper);
                } else if (obj.type === ENTITY_TYPE.Plug) {
                    const newBumper = new Plug(obj, bodyData);
                    result.push(newBumper);
                } else if (obj.type === ENTITY_TYPE.Earth) {
                    const newEarth = new Earth(obj, bodyData, {
                        ...ANIMATIONS.EARTH,
                        animationSpritesheet: images[ANIMATIONS.EARTH.imageNames[obj.name]],
                    });
                    result.push(newEarth);
                } else if (obj.type === ENTITY_TYPE.Mars) {
                    const newMars = new Mars(obj, bodyData, {
                        ...ANIMATIONS.MARS,
                        animationSpritesheet: images[ANIMATIONS.MARS.imageNames[obj.name]],
                    });
                    result.push(newMars);
                } else if (obj.type === ENTITY_TYPE.Jupiter) {
                    const newJupiter = new Jupiter(obj, bodyData, {
                        ...ANIMATIONS.JUPITER,
                        animationSpritesheet: images[ANIMATIONS.JUPITER.imageNames[obj.name]],
                    });
                    result.push(newJupiter);
                } else if (obj.type === ENTITY_TYPE.Saturn) {
                    const newSaturn = new Saturn(obj, bodyData, {
                        ...ANIMATIONS.SATURN,
                        animationSpritesheet: images[ANIMATIONS.SATURN.imageNames[obj.name]],
                    });
                    result.push(newSaturn);
                } else if (obj.type === ENTITY_TYPE.Sputnik) {
                    const newSputnik = new Sputnik(obj, bodyData);
                    result.push(newSputnik);
                } else {
                    if (obj.type === ENTITY_TYPE.Cloud) {
                        result.push(new Cloud(self.minX, self.maxX, obj, null));
                    } else if (obj.type === ENTITY_TYPE.Star) {
                        if (obj.name === ENTITY_NAME.TinyStar) {
                            result.push(new Star(self.minY, self.maxY, obj, null, {
                                ...ANIMATIONS.TINY_STAR,
                                animationSpritesheet: images[ANIMATIONS.TINY_STAR.imageNames[obj.name]],
                            }));
                        } else if (obj.name === ENTITY_NAME.SmallStar) {
                            result.push(new Star(self.minY, self.maxY, obj, null, {
                                ...ANIMATIONS.SMALL_STAR,
                                animationSpritesheet: images[ANIMATIONS.SMALL_STAR.imageNames[obj.name]],
                            }));
                        } else if (obj.name === ENTITY_NAME.ExpandingStar) {
                            result.push(new Star(self.minY, self.maxY, obj, null, {
                                ...ANIMATIONS.EXPANDING_STAR,
                                animationSpritesheet: images[ANIMATIONS.EXPANDING_STAR.imageNames[obj.name]],
                            }));
                        } else if (obj.name === ENTITY_NAME.ExpandingStar2) {
                            result.push(new Star(self.minY, self.maxY, obj, null, {
                                ...ANIMATIONS.EXPANDING_STAR_2,
                                animationSpritesheet: images[ANIMATIONS.EXPANDING_STAR_2.imageNames[obj.name]],
                            }));
                        }
                    } else if (obj.type === ENTITY_TYPE.Rocket) {
                        const newRocket = new Rocket(obj, null, {
                            ...ANIMATIONS.ROCKET_LAUNCH,
                            animationSpritesheet: images[ANIMATIONS.ROCKET_LAUNCH.imageNames[obj.name]],
                        });
                        result.push(newRocket);
                    } else if (obj.type === ENTITY_TYPE.Earth || obj.type === ENTITY_TYPE.Mars || obj.type === ENTITY_TYPE.Jupiter || obj.type === ENTITY_TYPE.Saturn || obj.type === ENTITY_TYPE.Shuttle || obj.type === ENTITY_TYPE.Sputnik) {

                    } else if (obj.type === ENTITY_TYPE.Bubble) {
                        result.push(new Bubble(self.minY, self.maxY, obj, null));
                    } else if (obj.type === 'card') {                        
                        const newGameObject = new PlayingCard(obj, bodyData);
                        result.push(newGameObject);    
                    } else {
                        result.push(new GameObject(obj, bodyData));
                    }
                }
            }
        }
        // result.sort(compareZ);
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

    const buildSlotMachines = function (objs) {
        const slotMachines = [];
        for (const obj of objs) { 
            if (obj.type === ENTITY_TYPE.Slot && obj.name === 'root_slot') {
                const finalSlots = [];
                finalSlots.push(obj);
                for (childSlotId of obj.childSlots) {
                    const childSlot = objs.find((data) => data.id == childSlotId);
                    if (childSlot) {
                        finalSlots.push(childSlot);
                    }
                }
                const slotMachine = new SlotMachine(finalSlots);
                slotMachines.push(slotMachine);
            }
        }

        return slotMachines;
    }

    this.getDynamicObject = function(type) {
        let dynamicObject = this.dynamicLayerData.objects.find(dObj => dObj.type === type);
        let dynamicObjectCollision = this.collisionLayerData.objects.find(dObj => dObj.type === type);

        // return newEntity;
        return { dynamicObject: dynamicObject, collisionBody: dynamicObjectCollision }
    }

    this.addDynamicObjectWithData = function(dynamicObject, dynamicObjectCollision) {
        return buildDynamicObjects([dynamicObject], [dynamicObjectCollision])[0];
    }

    this.staticObjects = buildStaticObjects(this.fixedLayerData.objects);
    this.slotMachines = buildSlotMachines(this.staticObjects);
    this.drawOrder.push(...this.staticObjects);
    this.dynamicObjectsFirstIndex = this.drawOrder.length;
    this.dynamicObjects = buildDynamicObjects(this.dynamicLayerData.objects, this.collisionLayerData.objects);
    this.drawOrder.push(...this.dynamicObjects);
    this.tableColliders = buildTableColliders(this.collisionLayerData.objects);
    this.drawOrder.push(...this.tableColliders);

    this.drawOrder.push(...this.balls);
    this.drawOrder.push(...this.flippers)
    if(this.plunger) this.drawOrder.push(this.plunger);

    for (const obj of this.drawOrder) {
        if (obj.zOrder === undefined) {
            obj.zOrder = 0
        }
    }
    this.drawOrder.sort(compareZ);
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
    this.subtype = objData.subtype;
    this.reflectance = objData.reflectance || 1;
    this.hasCollided = false;
    this.score = 0;
    this.active = true;
    
    for (i = 0; i < objData.properties?.length; i++) {
        switch (objData.properties[i].name) {
            case "score":
                this.score = objData.properties[i].value;
                break;
            case "targ_light":
                this.targ_light = objData.properties[i].value;
                break;
            case "ball_catch":
                this.ball_catch = objData.properties[i].value;
            case "slot_target":
                this.slot_target = objData.properties[i].value;
            default:
                break;
        }
    }
    
    this.update = function(deltaTime) {}
    this.draw = function() {
        if (this.active) {
            if (this.subtype === 'shuttle') {
                canvasContext.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                canvasContext.drawImage(this.image, this.x, this.y);
            }
            this.body.draw();
        }
    }
}
