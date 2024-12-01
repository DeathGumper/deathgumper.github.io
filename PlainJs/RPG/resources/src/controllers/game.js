import Character from '../character/src/character.js';
import GearSystem from '../gear/src/gearSystem.js';
import View from './view.js';

export default class Game {
    constructor() {
        this.view = new View();
        this.gearSystem = new GearSystem();
        this.character = new Character();

        this.screen = 'main menu';
        this.display();

        // Listeners
        $('button#backBtn').on('click', () => {
            this.screen = 'main menu';
            this.display();
        })

        $('button#newItem').on('click', () => {
            this.character.pickUp(this.gearSystem.getRandomGear());
            this.view.displayWholeInventory(this.character, '#content');
            console.log('hi')
        });

        $('button#sort').on('click', () => {this.character.sortInventory(); this.view.displayInventoryItems(this.character)})
    }

    setMainMenuEvents = () => {
        $('div#mainMenuBtnContainer button.mainMenuBtn').on('click', (event) => {
            let btn = $(event.currentTarget);
            let key = btn.attr('id').slice(0, -3);

            this.screen = key;

            this.display();
        })
    }

    setInventoryEvents = () => {
        // Helper function
        let deselect = () => {
            $('div.selected').removeClass('selected')
        }
        

        // On click events for the tiles in the inventory grid
        $('div#inventoryContainer div#itemGrid div.slot').on('click', (event) => {
            let slot = $(event.currentTarget);
            let key = slot.attr('key');
            let item = this.character.getItemFromKey(key);

            
            if (slot.hasClass('selected')) {
                deselect();
                if (key != '0') {
                    this.character.equip(item);
                    this.view.displayWholeInventory(this.character);
                }
            } else {
                deselect();

                slot.addClass('selected');
                $('#' + item.type).addClass('selected');

                this.view.displayInventoryComparing(item, this.character.getEquippedItem(item.type));
            }

        })
        
        // On click event for the slots in the equipped items
        $('div#equipped div.slot').on('click', (event) => {
            let slot = $(event.currentTarget);
            let key = slot.attr('id');
            let item = this.character.getEquippedItem(key);

            deselect();
            slot.addClass('selected');
            this.view.displayInventoryComparing(null, item);
        })

    }

    display = () => {
        const screens = {
            'main menu': () => {this.view.displayMainMenu(); this.setMainMenuEvents()},
            'inventory': () => {this.view.displayWholeInventory(this.character); this.setInventoryEvents()}
        }

        $('#content').children().hide();
        screens[this.screen]()
    }
}