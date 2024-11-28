export default class View {
    displayWholeInventory = (character) => {
        this.displayCharacterGear(character);
        this.displayInventory(character, 0);
        this.displayInventoryComparing(character);
    }

    displayCharacterGear = (character) => {
        let gear = character.gear;

        for (let [type, item] of Object.entries(gear)) {
            const gearSlot = $('#' + type);

            if (item != null) {  
                if (gearSlot.attr('key') != item.id) {
                    gearSlot.empty();  
                    if (item.hasImage) {
                        gearSlot.append($(`<img src="${item.image}"></img>`))
                    } else {
                        gearSlot.append($(`<span>${item.name}</span>`))
                    }

                    gearSlot.attr('key', item.id)
                }
            }
        }

    }

    displayInventoryComparing = (character) => {
        var item1 = null;
        var item2 = null;
        if (this.itemSelected) {
            item1 = character.inventory[this.itemSelected];
            item2 = character.gear[item1.type];
        }

        console.log(item1, item2)

        let displayItem = (item, container) => {
            container.empty();
            container.append($(`<h3>${item.name}</h3>`));
            for (const [stat, value] of Object.entries(item.stats)) {
                container.append($(`<p>${stat}: ${value}</p>`))
            }
        }
        if (item1) {
            displayItem(item1, $('#itemCompare #inventoryItem'));
        } 
        if (item2) {
            displayItem(item2, $('#itemCompare #gearItem'));
        }
    }

    displayInventory = (character, startingIndex=0) => {
        let inventory = character.inventory
        let inventoryContainer = $('#inventory');

        inventoryContainer.empty();

        for (let i = startingIndex; i < Math.max(100, inventory.length); i++) {
            let key = i + 'item';
            let gearSlot = $(`
                <div id="${key}" class="item" key="0">
                
                </div>
            `)

            if (i < inventory.length) {
                let item = inventory[i];
                // There is a item at that index
                gearSlot.empty();
                gearSlot.append($(`<img src="${item.image}" alt="${item.name}"></img>`))

                gearSlot.on('click', () => {
                    if (this.itemSelected == i) {
                        character.equip(item);
                        $('#' + this.itemSelected + 'item').removeClass('selected');
                        this.itemSelected = undefined;
                        this.displayWholeInventory(character);
                    } else {
                        if (inventoryContainer.find('#' + this.itemSelected + 'item').length > 0)
                            $('#' + this.itemSelected + 'item').removeClass('selected');
                        this.itemSelected = i;
                        $('#' + key).addClass('selected');
                    }
                    this.displayInventoryComparing(character);
                })

                gearSlot.attr('key', item.id);
            }

            inventoryContainer.append(gearSlot)
            

        }
    }
}