import Game from './game.js';
var game = null;

$('#newGameBtn').on('click', function() {
    game = new Game();
});