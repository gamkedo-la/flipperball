// MapBuilder.js
// eslint-disable-next-line no-unused-vars
function MapBuilder (selectedTable = TABLES.Prototype) {
    const mapData = TileMaps[selectedTable];
    this.collisionLayerData = null;
    this.dynamicLayerData = null;
    this.fixedLayerData = null;

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
    this.staticObjects = buildStaticObjects(this.fixedLayerData.objects);
    this.dynamicObjects = buildDynamicObjects(this.dynamicLayerData.objects, this.collisionLayerData.objects);

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
            const bodyData = collisionData.find((data) => data.name === obj.name)
            result.push(new DynamicMapObject(obj, bodyData));
        }

        return result;
    }
}

function StaticMapObject (objData) {
    this.x = objData.x;
    this.y = objData.y;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.image = images[objData.name];
}

function DynamicMapObject (objData, bodyData) {
    this.x = objData.x;
    this.y = objData.y;
    this.width = objData.width;
    this.height = objData.height;
    this.type = objData.type;
    this.image = images[objData.name];
}