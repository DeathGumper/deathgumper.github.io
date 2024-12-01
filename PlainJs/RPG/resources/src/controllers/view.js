export default class View {
    // Display

    // ### Main Menu Display ###
    displayMainMenu = (character) => {
        $('#mainMenuScreen').show();
    }

    // ### Inventory Display ###
    displayWholeInventory = (character) => {
        $('#inventoryScreen').show();
        this.displayInventoryCharacterEquipped(character);
        this.displayInventoryItems(character, 0);
        this.displayInventoryComparing(null, null)
        this.displayInventoryCharacterStats(character);
    }

    displayInventoryCharacterStats = (character) => {
        let characterStats = $('#characterStats');
        characterStats.empty();
        characterStats.append($(`<h3 class="title">Character</h3>`))
        for (const [stat, value] of Object.entries(character.stats)) {
            characterStats.append($(`<p class="stat">${stat}: ${value}</p>`))
        }
    }

    displayInventoryComparing = (inventorySelected, equippedSelected) => {
        let displayItem = (item, container, otherItem) => {
            container.empty();

            if (item) {
                container.append($(`<h3 class="title">${item.name}</h3>`));
                container.append($(`<h4 class="power">Power: ${item.power}</h4>`));
                for (const [stat, value] of Object.entries(item.stats)) {
                    container.append($(`<p class="stat 
                        ${(value > (otherItem? otherItem.stats[stat]: 0)? 'greenText': '')}
                        ${(value < (otherItem? otherItem.stats[stat]: 0)? 'redText': '')}
                        ">
                        ${value > 0? '+': ''}${value} ${stat}
                    </p>`))
                }
                if (Object.keys(item.parts).length > 0) {
                    container.append($(`<h3 class="title">Parts</h3>`));
                    for (const part in item.parts) {
                        container.append($(`<h4 class="part">${item.parts[part]['name']}</h4>`));
                        for (const [stat, value] of Object.entries(item.parts[part]['stats'])) {
                            container.append($(`<p class="stat">${value > 0? '+': ''}${value} ${stat}</p>`))
                        }
                    }
                }
            }
        }

        displayItem(inventorySelected, $('#itemCompare #inventoryItem'), equippedSelected);
        displayItem(equippedSelected, $('#itemCompare #gearItem'), inventorySelected);
    }

    displayInventoryCharacterEquipped = (character) => {
        let equipped = character.getEquipped();

        for (let [type, item] of Object.entries(equipped)) {
            const gearSlot = $('#' + type);

            if (item != null) {  
                if (gearSlot.attr('key') != item.key) {
                    gearSlot.empty();  
                    gearSlot.append($(`<img src="${item.image}" alt="${item.name}"></img>`))
                    gearSlot.attr('key', item.key)
                }
            } else {
                gearSlot.empty();
                gearSlot.attr('key', 0); 
            }
        }

    }

    displayInventoryItems = (character) => {
        let inventory = character.inventory;
        let itemGrid = $('#itemGrid');

        if (itemGrid.children().length == 0) {
            for (let i = 0; i < character.maxInventoryCount; i++) {
                let id = i + 'slot';
                let gearSlot = $(`
                    <div id="${id}" class="slot" key="0">
                    
                    </div>
                `)

                itemGrid.append(gearSlot);
            }
        }

        for (let i = 0; i < character.maxInventoryCount; i++) {
            let id = i + 'slot';
            let gearSlot = $('#' + id);
            if (i < inventory.length) {
                // There is a item at that index
                let item = inventory[i];
                gearSlot.removeClass('better equal worse');
                let equipped = character.equipped[item.type];
                if (equipped == null || item.power > equipped.power) gearSlot.addClass('better');
                else if (equipped.power == item.power) gearSlot.addClass('equal');
                else gearSlot.addClass('worse');

                if (item.key != gearSlot.attr('key')) {
                    gearSlot.empty();
                    gearSlot.append($(`<img src="${item.image}" alt="${item.name}"></img>`))
                    gearSlot.attr('key', item.key);
                }
            } else {
                gearSlot.empty();
                gearSlot.attr('key', 0);
                gearSlot.removeClass('better equal worse');
            }
            

        }
    }
}