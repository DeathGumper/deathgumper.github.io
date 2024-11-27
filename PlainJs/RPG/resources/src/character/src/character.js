export default class Character {
    constructor() {
        this.health = 100;
        this.gear = {
            'helmet': null,
            'chestplate': null,
            'trousers': null,
            'boots': null,
            'mainhand': null,
            'offhand': null
        };

        this.updateStats();
        this.inventory = [

        ]
    }

    updateStats = () => {
        this.stats = {
            'armor': 0,
            'damage': 0,
            'fire res': 0,
            'poison res': 0,
            'ice res': 0,
            'electric res': 0,
            'fire damage': 0,
            'poison damage': 0,
            'ice damage': 0,
            'electric damage': 0,
            'weight': 0,
            'block': 0,
        }

        for (const [gearType, gear] of Object.entries(this.gear)) {
            if (gear != null) {
                for (const [stat, value] of Object.entries(gear.stats)) {
                    this.stats[stat] += value;
                }
            }
        }
        
        console.log(this)
    }

    pickUp = (item) => {
        this.inventory.push(item);
    }

    equip = (gear) => {
        this.inventory = this.inventory.filter((value) => {
            console.log(value.id, gear.id)
            return value.id !== gear.id
        });
        if (gear['type'] in this.gear) {
            if (this.gear[gear['type']] != null) 
                this.pickUp(this.gear[gear['type']])
            this.gear[gear['type']] = gear;
            this.updateStats();
        }
    }

    getGearPiece = (type) => {
        return this.gear[type];
    }
}