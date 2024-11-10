import Game from './game.js';
var game = null;

// When the document is loaded, start game.
$('document').ready(function() {
    game = new Game();
});