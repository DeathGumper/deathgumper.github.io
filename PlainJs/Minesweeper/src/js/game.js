import Tile from './tile.js';
import View from './view.js';
import { removeDuplicates, includesArray, getElementWidthInVmin } from './utils.js';
import Board from './board.js';

// Main game class
export default class Game {
    constructor() {
        // Declares a new view
        this.view = new View();

        // Could make this into a localstorage variable so you can always have access to it
        this.score = 0;
        this.highscore = 0;

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

    newGame = () => {
        // Make the board
        let data = $('#difficulty').val().split('-');
        this.board = new Board(data[1], data[0], data[2]);

        // Update the board
        this.updateBoard();
        this.startTime = Date.now();
    }

    getAllAround = (ri, ci) => {
        // Returns all of the 8 tiles around
        // Unless the tiles are duplicates

        let t = [
            [Math.min(ri + 1, this.board.size[0]-1), ci], 
            [Math.max(ri - 1, 0), ci], 
            [ri, Math.min(ci + 1, this.board.size[1]-1)], 
            [ri, Math.max(ci - 1, 0)],
            [Math.max(ri - 1, 0), Math.max(ci - 1, 0)], 
            [Math.min(ri + 1, this.board.size[0]-1), Math.max(ci - 1, 0)], 
            [Math.min(ri + 1, this.board.size[0]-1), Math.min(ci + 1, this.board.size[1]-1)], 
            [Math.max(ri - 1, 0), Math.min(ci + 1, this.board.size[1]-1)]
        ];
        return removeDuplicates(t.filter(p => {return p != [ri, ci]}));
    }

    

    bfs = (row, column, tilesSearched) => {
        // Store if this is the start of the search
        let first = tilesSearched.length == 0

        // If this is already searched, don't continue
        if (includesArray(tilesSearched, [row, column])) 
            return;

        tilesSearched.push([row, column]);

        // If this is a bomb then dont reveal it
        if (this.board.tiles[row][column].held == 'B')
            return;

        // Reveal the current tile
        this.board.tiles[row][column].reveal();

        // If its a 0, then add the tiles around this one
        if (this.board.tiles[row][column].held == '0') {
            let tilesAround = this.getAllAround(row, column);
            for (let i = 0; i < tilesAround.length; i++) {
                let [r, c] = tilesAround[i];
                this.bfs(r, c, tilesSearched);
            }
        }

        // If it is the first, then at the very end of the loop update the board
        if (first) this.updateBoard();
    }

    revealAll = () => {
        for (let i = 0; i < this.board.tiles.length; i++) {
            for (let j = 0; j < this.board.tiles[0].length; j++) {
                this.board.tiles[i][j].reveal();
            }
        }

        this.updateBoard();
    }

    updateBoard = () => {
        // Calls display board with the current board
        this.displayBoard(this.board);
    }

    displayBoard = (board) => {
        const boardContainer = $('#boardContainer');
        boardContainer.empty();

        let tilesLeft = 0;

        for (let ri = 0; ri < board.tiles.length; ri++) {
            let rowElement = $('<div class="boardRow"></div>');

            for (let ci = 0; ci < board.tiles[0].length; ci++) {
                let tile = board.tiles[ri][ci];

                tilesLeft += (tile.revealed? 0: 1);

                let cell = $(
                    `<div 
                        class="boardCell ${tile.revealed? "revealedCell": "hiddenCell"}"
                    >${tile.revealed? (tile.held == '0'? '': tile.held): (tile.flagged? 'O': '')}</div>`);
                    
                cell.mousedown((event) => {
                    switch (event.which) {
                        case 1:
                            tile.clicked((bomb) => {
                                if (bomb) {
                                    this.done('lost');
                                    return;
                                } else
                                    this.bfs(ri, ci, [], 0);
                                    //this.revealTiles(ri, ci)
                                });
                            break;
                        case 3:
                            tile.flag();
                            this.updateBoard();
                            break;
                    }
                });

                cell.css('color', tile.getColor());

                rowElement.append(cell);
            }

            boardContainer.append(rowElement);
        }

        if (tilesLeft == this.board.bombAmt) {
            this.done('won');
        }
    }
    
    setupBoard = (rowAmt, columnAmt, bombAmt, avoidPos=[]) => {
        this.board = [];
        this.size = [rowAmt, columnAmt];
        this.bombAmt = bombAmt;

        let bombs = [];

        while (bombs.length < bombAmt) {
            let loc = [Math.floor(Math.random() * rowAmt), Math.floor(Math.random() * columnAmt)];

            let bad = false;
            if (includesArray(bombs, loc)) {
                bad = true;
            }

            if (!bad) bombs.push(loc);
        }

        for (let i = 0; i < rowAmt; i++) {
            let row = [];

            for (let j = 0; j < columnAmt; j++) {
                let pos = [i, j];
                let held = 0;

                if (includesArray(bombs, pos)) held = 'B';
                else {
                    let bombsAround = 0;
                    let around = this.getAllAround(i, j);
                    for (let k = 0; k < around.length; k++) {
                        if (includesArray(bombs, around[k])) bombsAround++;
                    }

                    held = String(bombsAround);
                }
                

                let cell = new Tile(held);
                row.push(cell);
            }

            this.board.push(row);
        }
    }
}