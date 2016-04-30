(function() {
  'use strict';

  // give game dimensions 640 x 360
  // phaser use WebGL or default to canvas if WebGL is not avail
  // Pixi.js does the rendering of the WebGL
  var game = new Phaser.Game(640, 360, Phaser.AUTO); 

  // game state
  var GameState = {
    // all image loaded
    preload: function() {
      this.load.image('background', 'assets/images/earth_640x360.jpg');
    },
    create: function() {
      this.background = this.game.add.sprite(0, 0, 'background') // coords top left, key
    },
    update: function() {  // running multple time per sec to get input

    }
  };

  // assign state to game
  game.state.add('GameState', GameState);

  // launch game
  game.state.start('GameState');
}());