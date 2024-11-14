import View from './view.js';
import { removeDuplicates, includesArray } from './utils.js';
import Board from './board.js';

// Main game class
export default class Game {
    constructor() {
        // Declares a new view
        this.view = new View();

        // Makes a new game.
        this.newGame();

        // Bind new game
        $('#difficulty').on('change', this.newGame);
    }

    done = (status) => {
        // Basically same as lost just increments wons
        console.log(Date.now() - this.startTime);

        $('#boardContainer').addClass(status + 'Border');
        this.revealAll();
        setTimeout(() => {this.newGame(); $('#boardContainer').removeClass(status + 'Border')}, 2000);
    }

    getElementData = (board) => {
        let elementRows = [];
        let tilesLeft;

        for (let ri = 0; ri < board.tiles.length; ri++) {
            let rowElement = $('<div class="boardRow"></div>');

            for (let ci = 0; ci < board.tiles[0].length; ci++) {
                let tile = board.tiles[ri][ci];

                tilesLeft += (tile.revealed? 0: 1);

                let cell = $(
                    `<div class="boardCell ${tile.revealed? "revealedCell": "hiddenCell"}">
                    ${tile.revealed? (tile.held == '0'? '': tile.held): (tile.flagged? 'O': '')}</div>`);
                    
                
                cell.mousedown((event) => {
                    switch (event.which) {
                        case 1:
                            if (this.board.bombAmt == 0) {
                                this.newBoard(null, [ri, ci])
                                this.updateBoard();
                            } else {
                                tile.clicked((bomb) => {
                                    if (bomb) {
                                        this.done('lost');
                                        return;
                                    } else
                                        board.bfs(ri, ci, [], 0);
                                        this.updateBoard();
                                    });
                                break;
                            }
                        case 3:
                            tile.flag();
                            this.updateBoard();
                            break;
                    }
                });

                cell.css('color', tile.getColor());

                rowElement.append(cell);
            }

            elementRows.push(rowElement);
        }

        if (tilesLeft == this.board.bombAmt) {
            this.done('won');
        }

        return elementRows;
    }

    newBoard = (cstmBomb=null, avoidPos=null) => {
        // Make the board
        let data = $('#difficulty').val().split('-');
        this.board = new Board(data[1], data[0], 
            (cstmBomb == null? data[2]: cstmBomb), 
            (avoidPos == null? []: avoidPos));
    }

    newGame = () => {
        this.newBoard(0);

        // Update the board
        this.updateBoard();
        this.startTime = Date.now();
    }

    revealAll = () => {
        for (let i = 0; i < this.board.tiles.length; i++) {
            for (let j = 0; j < this.board.tiles[0].length; j++) {
                this.board.tiles[i][j].reveal();
            }
        }

        this.updateBoard();
    }

    updateBoard = (board=null) => {
        if (board == null) {
            board = this.board;
        }

        // Calls display board with the current board
        this.view.display(this.getElementData(board));
    }
}