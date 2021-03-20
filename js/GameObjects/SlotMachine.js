class SlotMachine {

    constructor(slots) {
        this.slots = slots;
        this.id = slots[0].id; //assume 0 is always root_slot
    }

    spin() {
        this.slots.forEach(function(slot) {
           slot.spin();
         });
    }
}