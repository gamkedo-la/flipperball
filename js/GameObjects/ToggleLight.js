class ToggleLight extends GameObject {

    constructor(...props) {
        super(...props);
        if (DEBUG) {
            console.log("[ToggleLight] Constructor");
        }        
        this.isInReverse = false;
        this.isAnimating = false;
        const objData = props[0];
        if (objData.properties) {
            for (const prop of objData.properties) {
                objData[prop.name] = prop.value;
            }            
        }
        
        if (objData.bonus) {
            this.bonusTargID = objData.bonus;
        }
        if (objData.requiredLights) {
            this.reqLights = objData.requiredLights;
        }

        this.isLit = false;
    }

    updateLightState(lightState) {
        if (lightState) {
            this.isLit = true;            
            this.isAnimating = true;            
        } else {
            this.isLit = false;
            this.currFrame = 0;            
        }
    }
    
    triggerBonus() {
        this.reqLights -= 1;
        console.log("Required Lights Left: " + this.reqLights);
        if (this.reqLights <= 0) {
            console.log("Bonus Light Triggered!");
            this.updateLightState(true);            
        }
    }
}