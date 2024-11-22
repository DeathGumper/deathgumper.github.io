export default class Gear {
    type = null
    constructor(stats) {
        this.stats = stats
    }

    getStat = (stat) => {
        return this.stats[stat];
    }

    getType = () => {
        return this.type;
    }
    // Any data/methods for any piece of gear
}