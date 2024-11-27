export default class Gear {
    type = null;
    constructor(info, name) {
        this.stats = info['stats'];
        this.name = name;
        let start = '../assets/gear/'
        this.image = start + info['image'];
        this.hasImage = info['image'] != undefined;
        this.id = crypto.randomUUID();
    }

    getStat = (stat) => {
        return this.stats[stat];
    }

    getType = () => {
        return this.type;
    }
    // Any data/methods for any piece of gear
}