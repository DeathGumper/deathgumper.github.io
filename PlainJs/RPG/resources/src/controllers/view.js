export default class View {
    displayInventory = (character) => {
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

        let inventory = character.inventory;
        let inventoryContainer = $('#inventory');

        for (let i = 0; i < Math.max(100, inventory.length); i++) {
            let key = i + 'item';
            let gearSlot;
            let item = inventory[i];

            if (inventoryContainer.find('#' + key).length > 0) {
                gearSlot = $('#' + key);
            } else {
                gearSlot = $(`
                    <div id="${key}" class="item" key="0">
                    
                    </div>
                `)
            }

            if (i < inventory.length) {
                if (gearSlot.attr('key') != item.id) {
                    gearSlot.empty();
                    if (item.hasImage) {
                        gearSlot.append($(`<img src="${item.image}"></img>`))
                    } else {
                        gearSlot.append($(`<span>${item.name}</span>`))
                    }

                    gearSlot.on('mousedown', () => {
                        if (i == inventory.selected) {
                            character.equip(item);
                            this.displayInventory(character);
                        }
                        if (inventoryContainer.find('#' + inventory.selected + 'item').length > 0)
                            $('#' + inventory.selected + 'item').removeClass('selected');
                        inventory.selected = i;
                        $('#' + key).addClass('selected');
                    })
                    gearSlot.attr("key", item.id)
                }
            } else {
                gearSlot.empty();
                gearSlot.attr("key", 0)
            }

            
            inventoryContainer.append(gearSlot);
        }
    }
}