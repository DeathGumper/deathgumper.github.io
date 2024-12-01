import Game from './controllers/game.js';

$(function() {
    Array.prototype.sample = function(){
        return this[Math.floor(Math.random()*this.length)];
    }
    const game = new Game();
})