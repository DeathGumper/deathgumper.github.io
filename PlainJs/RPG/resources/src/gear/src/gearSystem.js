import Boots from './gearTypes/boots.js';
import Chestplate from './gearTypes/chestplate.js';
import Helmet from './gearTypes/helmet.js';
import Trousers from './gearTypes/trousers.js';
import allGear from './allGear.json' with { type: "json" };
import MainHand from './gearTypes/mainHand.js';
import OffHand from './gearTypes/offHand.js';

console.log(allGear);

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

    getGearByName = (name, standardStats=false) => {
        let gearInfo = this.allGear[name];
        if (typeof standardStats == 'object') {
            console.log(gearInfo['stats'])
            for (let [key, value] of Object.entries(gearInfo['stats'])) {
                if (key in standard) {
                    gearInfo['stats'][key] = standardStats[key];
                }
            }
        } else if (standardStats == false) {
            for (const [key, value] of Object.entries(gearInfo['stats'])) {
                if (value > 0) {
                    let newValue = Math.max(Math.floor(value + ((
                        (value*2) * Math.random()) - value
                    )), 0);
                    gearInfo[key] = newValue;
                }

            }
        }
        return new this.gearTypes[gearInfo['type']](gearInfo, name);
    }
}