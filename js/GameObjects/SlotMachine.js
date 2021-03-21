const SLOTMACHINE_CHOICES = Object.freeze({"random":1, "cherry":0, "seven":17, "theme":36, "hometeam":46});

class SlotMachine {

    constructor(slots) {
        this.slots = slots;
        this.id = slots[0].id; //assume 0 is always root_slot
        this.choice = SLOTMACHINE_CHOICES.random;
        for (var i = 0; i < slots.length; i++) {
            const slot = this.slots[i];
            slot.setDelegate(this);
        }
         this.totalSlotsFinishedSpin = 0;
         this.delegate = null;
         this.isSpinning = false;
    }

    setDelegate(delegate) {
        this.delegate = delegate;
    }

    spin() {
        if (!this.isSpinning) {
            slotCrankSound.play();        
            this.isSpinning = true;
            this.randomizeChoice();
            for (var i = 0; i < this.slots.length; i++) {
               const slot = this.slots[i];
               slot.setChoice(this.choice);
               slot.spin();
           }
        }
    }

    randomizeChoice() {
        let rand = Math.floor(Math.random() * Object.keys(SLOTMACHINE_CHOICES).length);
        this.choice = SLOTMACHINE_CHOICES[Object.keys(SLOTMACHINE_CHOICES)[rand]];
    }

    slotFinishedSpin(slot) {
        this.totalSlotsFinishedSpin++;
        slot.playSlotFinishedSound();
        if (this.totalSlotsFinishedSpin == this.slots.length) {
            this.totalSlotsFinishedSpin = 0;
            if (this.delegate) {
                this.delegate.slotMachineFinishedSpinning(this);
            }
            this.isSpinning = false;
        }
    }
}