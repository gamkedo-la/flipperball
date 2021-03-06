class ToggleLight extends GameObject {

    constructor(...props) {
        super(...props);
        if (DEBUG) {
            console.log("[ToggleLight] Constructor");
        }
        this.isInReverse = false;
        this.isAnimating = false;
        
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
    
}