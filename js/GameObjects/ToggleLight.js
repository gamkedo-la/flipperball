class ToggleLight extends GameObject {

    constructor(...props) {
        super(...props);
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
        if (this.objData.bonusTime) {this.bonusTime = this.objData.bonusTime;}
        if (this.objData.bonusMult) {this.bonusMult = this.objData.bonusMult;}
        if (this.objData.subtype) {this.subtype = this.objData.subtype;}
        this.isLit = false;
        this.start = {x: this.x, y: this.y};
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
        if (lightState) {
            this.isLit = true;            
            this.isAnimating = true; 
            if (this.subtype === 'shuttle') {
                this.velocity.x = 380
                this.velocity.y = -60
            }           
        } else {
            this.isLit = false;
            this.currFrame = 0;
            if (this.subtype) {
                this.x = this.start.x;
                this.y = this.start.y;
                this.isAnimating = false;
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.reqLights = this.origReqLights;
            }         
        }
    }
    
    triggerBonus() {
        this.reqLights -= 1;
        if (this.reqLights <= 0) {
            this.updateLightState(true);
            this.reqLights = this.origReqLights;
            return true;
        }
        return false;
    }
}