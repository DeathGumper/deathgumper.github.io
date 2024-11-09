import Tile from './tile.js';

function includesArray(matrix, subArray) {
    for (let row of matrix) {
      if (row.length !== subArray.length) continue;
  
      let match = true;
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== subArray[i]) {
          match = false;
          break;
        }
      }
  
      if (match) return true;
    }
  
    return false;
  }

function removeDuplicates(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

export default class Game {
    constructor() {

        this.losses = 0;
        this.wins = 0;
        this.newGame();
    }

    updateBoard = () => {
        this.displayBoard(this.board);
    }

    displayStats = () => {
        $('#wins').text('Wins: ' + this.wins);
        $('#losses').text('Losses: ' + this.losses);
    }

    newGame = () => {
        this.displayStats();
        this.setupBoard(20, 20, 50);

        this.displayBoard(this.board);
    }

    lost = () => {
        this.losses++;

        this.newGame();
    }

    won = () => {
        this.wins++;
        
        this.newGame();
    }

    getAdjTiles = (ri, ci) => {
        let t = [ 
            [Math.min(ri + 1, this.size[0]-1), ci], 
            [Math.max(ri - 1, 0), ci], 
            [ri, Math.min(ci + 1, this.size[1]-1)], 
            [ri, Math.max(ci - 1, 0)] 
        ]
        return removeDuplicates(t.filter(p => {return (p != [ri, ci])}));
    }

    getAllAround = (ri, ci) => {
        let t = this.getAdjTiles(ri, ci);

        t.push(
            [Math.max(ri - 1, 0), Math.max(ci - 1, 0)], 
            [Math.min(ri + 1, this.size[0]-1), Math.max(ci - 1, 0)], 
            [Math.min(ri + 1, this.size[0]-1), Math.min(ci + 1, this.size[1]-1)], 
            [Math.max(ri - 1, 0), Math.min(ci + 1, this.size[1]-1)]
        );
        return removeDuplicates(t.filter(p => {return p != [ri, ci]}));
    }

    revealTiles = (row, column, bomb) => {
        if (bomb) {
            this.lost();
            return;
        }

        var tilesToSearch = [[row, column]];
        var tilesSearched = [];
        var loops = 0;

        while (tilesToSearch.length > 0) {
            let [ri, ci] = tilesToSearch[0];
            tilesToSearch.shift();
            let tile = this.board[ri][ci];
            loops++;

            tile.reveal();
            let adjTiles = this.getAdjTiles(ri, ci);

            for (let i = 0; i < adjTiles.length; i++) {
                let [r, c] = adjTiles[i];
                if (this.board[r][c].held == '0' && !includesArray(tilesSearched, [r, c]) && !includesArray(tilesToSearch, [r, c])) {
                    tilesToSearch.push([r, c]);
                } else if (this.board[r][c].held != 'bomb') {
                    this.board[r][c].reveal();
                }
            }

            if (loops > 5000) {
                break;
            }

            tilesSearched.push([ri, ci]);
        }

        console.log(loops)

        this.updateBoard();
    }

    displayBoard = (board) => {
        const boardContainer = $('#boardContainer');
        boardContainer.empty();

        let tilesLeft = 0;

        for (let ri = 0; ri < board.length; ri++) {
            let rowElement = $('<div class="boardRow"></div>');

            for (let ci = 0; ci < board[0].length; ci++) {
                let tile = this.board[ri][ci];

                tilesLeft += (tile.revealed? 0: 1);

                let cell = $(
                    `<div 
                        class="boardCell ${tile.revealed? "revealedCell": "hiddenCell"}"
                    >${tile.revealed? tile.held: ""}</div>`);
                cell.on('mousedown', () => {this.board[ri][ci].clicked((bomb) => {this.revealTiles(ri, ci, bomb)})});
                
                rowElement.append(cell);
            }

            boardContainer.append(rowElement);
        }

        if (tilesLeft == this.bombAmt) {
            this.won();
        }

    }
    
    setupBoard = (rowAmt, columnAmt, bombAmt) => {
        this.board = [];
        this.size = [rowAmt, columnAmt];
        this.amtOfBombs = bombAmt;

        let bombs = [];

        while (bombs.length < bombAmt) {
            let loc = [Math.floor(Math.random() * rowAmt), Math.floor(Math.random() * columnAmt)];

            if (!includesArray(bombs, loc)) {
                bombs.push(loc);
            }
        }

        for (let i = 0; i < rowAmt; i++) {
            let row = [];

            for (let j = 0; j < columnAmt; j++) {
                let pos = [i, j];
                let held = 0;

                if (includesArray(bombs, pos)) held = 'bomb';
                else {
                    let bombsAround = 0;
                    let around = this.getAllAround(i, j);
                    console.log(around)
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