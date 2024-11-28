import Character from '../character/src/character.js';
import GearSystem from '../gear/src/gearSystem.js';
import View from './view.js';

export default class Game {
    constructor() {
        this.view = new View();
        this.gearSystem = new GearSystem();
        this.character = new Character();
        console.log(this.character);
        this.view.displayWholeInventory(this.character, '#content');

        $('#newItem').click(() => {
            this.character.pickUp(this.gearSystem.getRandomGear());
            this.view.displayWholeInventory(this.character, '#content');
        });
    }
}