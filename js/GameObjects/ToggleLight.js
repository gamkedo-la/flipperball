class ToggleLight extends GameObject {

    constructor(...props) {
        super(...props);
        DEBUG_LOG("[ToggleLight] Constructor");
        this.isInReverse = false;
        this.isAnimating = false;
        
        this.objData = props[0];
        if (this.objData.properties) {
            for (const prop of this.objData.properties) {
                this.objData[prop.name] = prop.value;
            }            
        }
        
        if (this.objData.bonus) { this.bonusTargID = this.objData.bonus; }
        if (this.objData.requiredLights) {
            this.reqLights = this.objData.requiredLights;
            this.origReqLights = this.reqLights;
        }
        if (this.objData.bonusTime) { this.bonusTime = this.objData.bonusTime; }
        if (this.objData.bonusMult) { this.bonusMult = this.objData.bonusMult }
        if (this.objData.subtype) { this.subtype = this.objData.subtype }
        this.isLit = false;
    }

    turnOn() {
        if (!this.isLit) {
            this.isLit = true;
            this.isAnimating = true;
            return true;
        }
        return false;
    }
    
    turnOff() {
        if (this.isLit) {
            this.isLit = false;
            this.isAnimating = false;
            return true;
        }
        return false;
    }
    
    updateLightState(lightState) {
        if (this.subtype) {
            this.velocity.x = 380
            this.velocity.y = -60
        }

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
        DEBUG_LOG("Required Lights Left: " + this.reqLights);
        if (this.reqLights <= 0) {
            DEBUG_LOG("Bonus Light Triggered!");
            this.updateLightState(true);
            this.reqLights = this.origReqLights;
            return true;
        }
        return false;
    }
}