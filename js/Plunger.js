//Plunger.js
// eslint-disable-next-line no-unused-vars
function Plunger (objData, bodyData) {
    this.x = objData.x;
    this.y = objData.y - objData.height;
    this.width = objData.width;
    this.height = objData.height;
    
    this.type = ENTITY_TYPE.Plunger;

    this.image = images[objData.name];
    
    
    this.setInput = function(alias) {
        this.input = alias;
    }

    this.update = function(deltaTime) {
        
    }
    
    this.draw = function() {
       
    }
}