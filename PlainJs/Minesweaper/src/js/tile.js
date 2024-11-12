export default class Tile {
    constructor(held) {
        this.held = held;
        this.revealed = false;
        this.flagged = false;
    }

    clicked = (callback) => {
        if (!this.flagged) {
            if (!this.revealed) {
                $('#boardContainer').addClass('shake');
                setTimeout(() => {$('#boardContainer').removeClass('shake')}, 200);
            }
            callback(this.held == 'B');
        }
    }

    reveal = () => {
        this.revealed = true;
        this.flagged = false;
    }

    flag = () => {
        if (!this.revealed)
            this.flagged = !this.flagged;
    }

    getColor = () => {
        let color;
        // switch (this.held) {
        //     case '0':
        //         color = 'rgb(255, 255, 255)';
        //         break;
        //     case 'B':
        //         color = 'rgb(0, 0, 0)';
        //         break;
        //     case '1':
        //         color = 'rgb(100, 140, 230)';
        //         break;
        //     case '2':
        //         color = 'rgb(125, 235, 230)';
        //         break;
        //     case '3':
        //         color = 'rgb(30, 240, 125)';
        //         break;
        //     case '4':
        //         color = 'rgb(155, 240, 30)';
        //         break;
        //     case '5':
        //         color = 'rgb(240, 200, 30)';
        //         break;
        //     case '6':
        //         color = 'rgb(235, 95, 20)';
        //         break;
        //     case '7':
        //         color = 'rgb(240, 10, 0)';
        //         break;
        //     case '8':
        //         color = 'rgb(240, 0, 215)';
        //         break;
        // }

        if (this.flagged) color = 'rgb(255, 0, 0)';
        else if (this.held == 'B') color = 'rgb(0, 0, 0)';
        else color =  `rgb(${255}, ${255 / (Number(this.held)+1)}, ${255 / (Number(this.held)+1)})`

        return color;
    }
}