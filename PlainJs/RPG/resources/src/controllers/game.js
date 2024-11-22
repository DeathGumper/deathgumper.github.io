import Character from '../character/src/character.js';
import GearSystem from '../gear/src/gearSystem.js';

export default class Game {
    constructor() {
        this.gearSystem = new GearSystem();
        this.character = new Character();

        for (let i = 0; i < 10; ++i) {
            let gear = this.gearSystem.getRandomGear();
            let currentGear = this.character.getGearPiece(gear.getType())
            if (currentGear == null || 
                gear.getStat('armor') > currentGear.getStat('armor')
            ) {
                this.character.equip(gear);
                console.log('newGear')
            }
        }
        console.log(this.character);
    }
}