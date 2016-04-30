(function() {
  'use strict';

  // let phaser decide WebGL or default to canvas if WebGL is not avail
  // Pixi.js does the rendering of the WebGL
  var game = new Phaser.Game(640, 360, Phaser.AUTO);

  // game state
  var GameState = {
    // all image loaded
    preload: function() {

    },
    create: function() {

    },
    update: function() {  // running multple time per sec to get input

    }
  };

  // assign state to game
  game.state.add('GameState', GameState);

  // launch game
  game.state.start('GameState');
}());