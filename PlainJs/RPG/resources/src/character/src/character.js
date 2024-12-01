export default class Character {
    constructor() {
        this.health = 100;
        this.equipped = {
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
        this.maxInventoryCount = 100
        this.updateStats();
    }
    
    getItemFromKey = (key) => {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].key == key) 
                return this.inventory[i];
        }

        return false;
    }

    getEquippedItem = (type) => {
        return this.equipped[type];
    }

    getEquipped = () => {
        return this.equipped;
    }

    sortInventory = () => {
        let sorting = {

        }
        let i = 0;
        for (const key in this.equipped) {
            sorting[key] = i;
            i++;
        }
        this.inventory.sort(function(a, b) {
            return sorting[a.type] - sorting[b.type];
        });
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

        for (const [gearType, gear] of Object.entries(this.equipped)) {
            if (gear != null) {
                for (const [stat, value] of Object.entries(gear.stats)) {
                    this.stats[stat] += value;
                }
            }
        }
    }

    pickUp = (item) => {
        this.inventory.push(item);
    }

    equip = (gear) => {
        this.inventory = this.inventory.filter((value) => {
            return value.key !== gear.key
        });
        if (gear['type'] in this.equipped) {
            if (this.equipped[gear['type']] != null) 
                this.pickUp(this.equipped[gear['type']])
            this.equipped[gear['type']] = gear;
            this.updateStats();
        }
    }
}