import Tile from './tile.js';

// Some code I snatched for checking if an array exist in a 2d array
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

// Some more code I snatched because I didnt want to write it out
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

// Main game class
export default class Game {
    constructor() {
        // Losses and wins in this session

        // Could make this into a localstorage variable so you can always have access to it
        this.losses = 0;
        this.wins = 0;

        // Makes a new game.
        this.newGame();
    }

    updateBoard = () => {
        // Calls display board with the current board
        this.displayBoard(this.board);
    }

    displayStats = () => {
        // Display your wins and losses
        $('#wins').text('Wins: ' + this.wins);
        $('#losses').text('Losses: ' + this.losses);
    }

    newGame = () => {
        // Clear the win or loss status
        $('#statusDisplay').text('');

        // Display wins and losses
        this.displayStats();

        // Make the board
        this.setupBoard(20, 20, 50);

        // Update the board
        this.updateBoard();
    }

    lost = () => {
        // Basically same as won just increments losses
        this.losses++;
        $('#statusDisplay').text('YOU LOST!');
        setTimeout(this.newGame, 2000);
    }

    won = () => {
        // Basically same as lost just increments wons
        this.wins++;
        $('#statusDisplay').text('YOU WON!');
        setTimeout(this.newGame, 2000);
    }

    getAdjTiles = (ri, ci) => {
        // Returns the adjacent tiles
        let t = [ 
            [Math.min(ri + 1, this.size[0]-1), ci], 
            [Math.max(ri - 1, 0), ci], 
            [ri, Math.min(ci + 1, this.size[1]-1)], 
            [ri, Math.max(ci - 1, 0)] 
        ]
        return removeDuplicates(t.filter(p => {return (p != [ri, ci])}));
    }

    getAllAround = (ri, ci) => {
        // Returns all of the 8 tiles around
        // Unless the tiles are duplicates
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
        // Uses BFS to reveal all of the 0's in a lake

        // Adds new tiles to this array when the adj tiles are recived and will check if they are not a bomb
        var tilesToSearch = [[row, column]];
        // Keeps track of all of the searched tiles in order to make sure they arent searched again
        var tilesSearched = [];

        while (tilesToSearch.length > 0) {
            // Gets the current tiles row and column
            let [ri, ci] = tilesToSearch[0];
            // Removes the first tile from the list (the current one)
            tilesToSearch.shift();
            // Gets the physical tile of it
            let tile = this.board[ri][ci];

            // Reveal the current tile
            tile.reveal();
            // Get the tiles around the current one
            let adjTiles = this.getAllAround(ri, ci);

            // Loops through all of the tiles that are adj
            for (let i = 0; i < adjTiles.length; i++) {

                // Gets the row and column of adj tile
                let [r, c] = adjTiles[i];

                // Makes sure that this a unique tile and a 0
                if (this.board[r][c].held == '0' && !includesArray(tilesSearched, [r, c]) && !includesArray(tilesToSearch, [r, c])) {
                    tilesToSearch.push([r, c]);

                // If not, makes sure its not a bomb and reveals it
                } else if (this.board[r][c].held != 'bomb') {
                    this.board[r][c].reveal();
                }
            }
            
            // Adds the tile that was just searched to the tiles searched
            tilesSearched.push([ri, ci]);
        }

        // Update board
        this.updateBoard();
    }

    bfs = (row, column, tilesSearched) => {
        tilesSearched.push([row, column]);
        if (includesArray(tilesSearched, [row, column])) 
            return;

        this.board[row][column].reveal();

        if (this.board[row][column].held != '0') {
            return;
        }
        
        let tilesAround = this.getAllAround(row, column);
        for (let i = 0; i < tilesAround.length; i++) {
            let [r, c] = tilesAround[i];
            this.bfs(r, c, tilesSearched);
        }
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
                    >${tile.revealed? (tile.held == '0'? '': tile.held): (tile.flagged? 'O': '')}</div>`);
                cell.mousedown((event) => {
                    switch (event.which) {
                        case 1:
                            tile.clicked((bomb) => {
                                if (bomb) {
                                    this.lost();
                                    return;
                                } else
                                    this.revealTiles(ri, ci, bomb)
                                });
                            break;
                        case 3:
                            tile.flag();
                            this.updateBoard();
                            break;
                    }
                });

                if (tile.held != 'bomb') {
                    let n = Number(tile.held)
                    cell.css('color', `rgb(${ (n == 3 || n == 5? 50 * n: 50) }, ${ (n == 2? 100: 50) }, ${ (n == 1 || n == 4? 200 / (n/2): 0) })`)
                }

                if (tile.flagged) {
                    cell.css('color', `rgb(150, 20, 20)`)
                }

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
        this.bombAmt = bombAmt;

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