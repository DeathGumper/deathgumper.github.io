import Tile from './tile.js';
import { removeDuplicates, includesArray } from './utils.js';

export default class Board {
    constructor(rowAmt, columnAmt, bombAmt, avoidPos=[]) {
        this.tiles = [];
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

            this.tiles.push(row);
        }
    }

    bfs = (row, column, tilesSearched) => {
        // Store if this is the start of the search
        let first = tilesSearched.length == 0

        // If this is already searched, don't continue
        if (includesArray(tilesSearched, [row, column])) 
            return;

        tilesSearched.push([row, column]);

        // If this is a bomb then dont reveal it
        if (this.getTile(row, column).held == 'B')
            return;

        // Reveal the current tile
        this.getTile(row, column).reveal();

        // If its a 0, then add the tiles around this one
        if (this.getTile(row, column).held == '0') {
            let tilesAround = this.getAllAround(row, column);
            for (let i = 0; i < tilesAround.length; i++) {
                let [r, c] = tilesAround[i];
                this.bfs(r, c, tilesSearched);
            }
        }

        // If it is the first, then at the very end of the loop update the board
        if (first) this.updateBoard();
    }

    getAllAround = (ri, ci) => {
        // Returns all of the 8 tiles around
        // Unless the tiles are duplicates

        let t = [
            [Math.min(ri + 1, this.size[0]-1), ci], 
            [Math.max(ri - 1, 0), ci], 
            [ri, Math.min(ci + 1, this.size[1]-1)], 
            [ri, Math.max(ci - 1, 0)],
            [Math.max(ri - 1, 0), Math.max(ci - 1, 0)], 
            [Math.min(ri + 1, this.size[0]-1), Math.max(ci - 1, 0)], 
            [Math.min(ri + 1, this.size[0]-1), Math.min(ci + 1, this.size[1]-1)], 
            [Math.max(ri - 1, 0), Math.min(ci + 1, this.size[1]-1)]
        ];
        return removeDuplicates(t.filter(p => {return p != [ri, ci]}));
    }

    getTile = (row, column) => {
        return this.board[row][column];
    }

    revealAll = () => {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                this.getTile(i, j).reveal();
            }
        }
    }
}