import Gear from './gear.js';
import Boots from './gearTypes/boots.js';
import Chestplate from './gearTypes/chestplate.js';
import Helmet from './gearTypes/helmet.js';
import Trousers from './gearTypes/trousers.js';

export default class GearSystem {
    gearTypes = {
        'helmet': Helmet, 
        'chestplate': Chestplate,
        'trousers': Trousers,
        'boots': Boots,
    }

    getRandomGear = () => {
        let types = Object.keys(this.gearTypes)
        return this.getGear(
            types[Math.floor(Math.random() * types.length)],
            Math.floor(Math.random()*10) + 5, 
            0
        )
    }

    getGear = (type, armor=0, damage=0) => {

        return new this.gearTypes[type](armor, damage);
    }
}