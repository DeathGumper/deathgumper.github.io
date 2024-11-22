import Character from '../../resources/src/character/src/character.js';
import GearSystem from '../../resources/src/gear/src/gearSystem.js';

$(() => {
    const gearSystem = new GearSystem();
    const character = new Character();

    for (let i = 0; i < 10; ++i) {
        let gear = gearSystem.getRandomGear();
        let currentGear = character.getGearPiece(gear.getType())
        if (currentGear == null || 
            gear.getStat('armor') > currentGear.getStat('armor')
        ) {
            character.equip(gear);
            console.log('newGear')
        }
    }
    console.log(character);
})