import Boots from './gearTypes/boots.js';
import Chestplate from './gearTypes/chestplate.js';
import Helmet from './gearTypes/helmet.js';
import Trousers from './gearTypes/trousers.js';
import allGear from './allGear.json' with { type: "json" };

console.log(allGear);

export default class GearSystem {
    gearTypes = {
        'helmet': Helmet, 
        'chestplate': Chestplate,
        'trousers': Trousers,
        'boots': Boots,
    }

    constructor() {
        this.allGear = allGear;
    }

    getRandomGear = () => { 
        let keys = Object.keys(this.allGear);
        let randomGearName = keys[Math.floor(Math.random() * keys.length)];
        return this.getGearByName(randomGearName);
    }

    getGearByName = (name) => {
        let gearInfo = this.allGear[name];
        return new this.gearTypes[gearInfo["type"]](gearInfo["stats"]);
    }
}