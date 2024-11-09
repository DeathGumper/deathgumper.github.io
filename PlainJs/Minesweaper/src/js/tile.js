export default class Tile {
    constructor(held) {
        this.held = held;
        this.revealed = false;
    }

    clicked = (callback) => {
        this.reveal();
        console.log(this.held)
        callback(this.held == 'bomb');
    }

    reveal = () => {
        this.revealed = true;
    }
}