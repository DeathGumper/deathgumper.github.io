export default class Gear {
    type = null;
    constructor(info, name) {
        this.parts = info['parts'];
        this.stats = info['stats'];
        this.name = name;
        this.key = crypto.randomUUID();

        this.image = '../assets/gear/' + info['image'];
        this.hasImage = info['image'] != undefined;

        this.calculateStats();
        this.calculatePower();
    }

    calculateStats = () => {
        for (let part in this.parts) {
            for (let [stat, value] of Object.entries(this.parts[part]['stats'])) {
                this.stats[stat] += value;
            }
        }
    }

    calculatePower = () => {
        this.power = 0;
        for (const [key, value] of Object.entries(this.stats)) {
            this.power += value;
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