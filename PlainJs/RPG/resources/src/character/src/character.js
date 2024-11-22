export default class Character {
    constructor() {
        this.health = 100;
        this.gear = {
            'helmet': null,
            'chestplate': null,
            'trousers': null,
            'boots': null,
        };
    }

    equip = (gear) => {
        this.gear[gear.type] = gear;
    }

    getGearPiece = (type) => {
        return this.gear[type];
    }
}