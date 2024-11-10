export default class Tile {
    constructor(held) {
        this.held = held;
        this.revealed = false;
        this.flagged = false;
    }

    clicked = (callback) => {
        this.reveal();
        console.log(this.held)
        callback(this.held == 'bomb');
    }

    reveal = () => {
        this.revealed = true;
    }

    flag = () => {
        this.flagged = !this.flagged;
    }
}