export default class Gear {
    type = null
    constructor(armor=0, damage=0) {
        this.stats = {
            'armor': armor,
            'damage': damage
        }
    }

    getStat = (stat) => {
        return this.stats[stat];
    }

    getType = () => {
        return this.type;
    }
    // Any data/methods for any piece of gear
}