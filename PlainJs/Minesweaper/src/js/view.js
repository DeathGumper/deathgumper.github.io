export default class View {
    display = (board) => {
        const boardContainer = $('#boardContainer');
        boardContainer.empty();

        let tilesLeft = 0;

        for (let ri = 0; ri < board.length; ri++) {
            let rowElement = $('<div class="boardRow"></div>');

            for (let ci = 0; ci < board[0].length; ci++) {
                let tile = board[ri][ci];

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

                if (tile.held != 'B') {
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
            this.done('won');
        }
    }
}