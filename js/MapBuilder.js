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
    this.fixedObjects = getFixedObjects(this.fixedLayerData)

    const getFixedObjects = function(data) {
        
    }
}