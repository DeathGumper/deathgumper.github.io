import Boots from './gearTypes/boots.js';
import Chestplate from './gearTypes/chestplate.js';
import Helmet from './gearTypes/helmet.js';
import Trousers from './gearTypes/trousers.js';
import allGear from './allGear.json' with { type: "json" };
import MainHand from './gearTypes/mainHand.js';
import OffHand from './gearTypes/offHand.js';

export default class GearSystem {
    gearTypes = {
        'helmet': Helmet, 
        'chestplate': Chestplate,
        'trousers': Trousers,
        'boots': Boots,
        'mainhand': MainHand,
        'offhand': OffHand,
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
        let gearInfo = JSON.parse(JSON.stringify(this.allGear[name]));

        for (let partName in gearInfo['parts']) {
            gearInfo['parts'][[partName]] = gearInfo['parts'][partName].sample();
        }
        return new this.gearTypes[gearInfo['type']](gearInfo, name);
    }
}