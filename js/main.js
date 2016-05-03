(function() {
  'use strict';

  // give game dimensions 640 x 360
  // phaser use WebGL or default to canvas if WebGL is not avail
  // Pixi.js does the rendering of the WebGL
  var game = new Phaser.Game(640, 360, Phaser.AUTO); 
  var velocityText = 0.0;
  var velocitySize = 0;
  var velocityColor = 0;
  var style = {
    font: "12px Arial",
    fill: "#FFFFFF",
    align: "left"
  };
  var sliderStarIconBound;
  var redShiftText = 'When an object moves away from us, the light is shifted to the red end of the spectrum, as its wavelengths get longer.';
  var blueShiftText = 'If an object moves closer, the light moves to the blue end of the spectrum, as its wavelengths get shorter.';
  var hashSliderColorSpectrum = {};
  var hexColor;
  var colors; 

  // game state
  var GameState = {
    // all image loaded
    preload: function() {
      this.load.image('background', 'assets/images/earth_640x360.jpg');
      this.load.image('star', 'assets/images/star-small.png');

      
      var maxRed = 359; // red
      var minBlue = 180;  // blue
      var redMinusBlue = maxRed - minBlue;  // 179
      function findBase(num, pow) {
        return Math.pow(num, (1/pow));
      }

      colors = Phaser.Color.HSVColorWheel();
      
      var sliderUnits = -100;  // -100 -> 100
      var exponentialCounter = findBase(redMinusBlue, 200);  // 1^200
      for (var i = 1; i <= 200; i++) {  
        var currentColor = Math.floor(Math.pow(exponentialCounter,i));
        hashSliderColorSpectrum[sliderUnits] = colors[currentColor + 179].color;
        currentColor = currentColor < 359 ? currentColor : 359;
        sliderUnits++;

      }
    },
    create: function() {
      // this.scale is a scale manager
      // Phaser.ScaleManager.SHOW_ALL - this allows scaling while keeping aspect ratio
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;

      // create sprite for background
      this.background = this.game.add.sprite(0, 0, 'background'); // coords top left, key

      // anchor point is top left of sprite by default
      // world gives the center coords
      this.star = this.game.add.sprite(this.game.world.centerX * 0.4, this.game.world.centerY * 0.3, 'star');
      // change the anchor point
      // number proportion to width
      // 1 is left, 0 is right, first number is x
      // 0 is down, 1 is up, second number is y
      // (0.8,0.8) can be replaced with just one number (0.8)
      // use scale.setTo(-1, 1) to flip on x
      // can reduce the size by half if using .scale.setTo(0.5)
      // rotation starts from top left, to rotate from center anchor.setTo(0.5)
      // .angle = -45 45 degree counter
      this.star.anchor.setTo(0.5);
      // this.star.tint = 0xff0000;
      // this.star.tint = 0XFFFFFFF;
      // this.star.tint = '11600127';
      // this.star.tint = '43007'; // 200 light blue

      // this.star.tint = 64767;  // 180 light teal

      // slider
      this.slider = this.game.add.graphics(400, 300);
      this.slider.lineStyle(3, 0XFFFFFFF, 0.5);
      this.slider.moveTo(0,0);
      this.slider.lineTo(200,0);
      // graphics = this.game.add.graphics(400, 300);
      // graphics.lineStyle(3, 0XFFFFFFF, 0.5);
      // graphics.moveTo(0,0);
      // graphics.lineTo(200,0);

      this.sliderStarIcon = this.game.add.sprite(500, 300, 'star');
      this.sliderStarIcon.anchor.setTo(0.5);
      this.sliderStarIcon.scale.setTo(0.2);
      this.sliderStarIcon.inputEnabled = true;
      this.sliderStarIcon.input.enableDrag();

      // sliderStarIconBound = new Phaser.Rectangle(400, 300, 200, this.sliderStarIcon.height);
      // sliderStarIconBound = new Phaser.Rectangle(400, 300, 200, 85);
      // graphics = this.game.add.graphics(sliderStarIconBound.x, sliderStarIconBound.y);
      // graphics.beginFill(0XFFFFFFF);
      // graphics.drawRect(0, 0, sliderStarIconBound.width, sliderStarIconBound.heigth);

      game.stage.backgroundColor = '#2d2d2d';

      // var bounds = new Phaser.Rectangle(400, 260, 250, 85);
      var bounds = new Phaser.Rectangle(350, 260, 300, this.sliderStarIcon.height);

      //  Create a graphic so you can see the bounds
      var graphics = game.add.graphics(bounds.x, bounds.y);
      // graphics.beginFill(0x000077);
      graphics.drawRect(0, 0, bounds.width, bounds.height);
      // graphics.alpha = 0.2;

      this.sliderStarIcon.input.boundsRect = bounds;
      this.sliderStarIcon.events.onDragUpdate.add(this.onDragUpdate, this);
      this.sliderStarIcon.events.onDragStop.add(this.onDragStop, this);

      // Velocity
      this.velocityLabel = this.game.add.text(400, 320, "Velocity (km/s)", style);
      this.velocityInputBox = this.game.add.text(500, 320, velocityText, style);

      // INPUT BOX

    },
    update: function() {  // running multple time per sec to get input
      // can make star constantly rotate
      this.star.angle += 0.5;
      // game.input.onDown.addOnce(updateText, this);
    },
    onDragUpdate: function(sprite, pointer) {
      velocityText = Math.floor(pointer.x - 500);
      velocityText = velocityText > 100 ? 100 : velocityText;
      velocityText = velocityText < -100 ? -100 : velocityText;
      this.velocityInputBox.setText(velocityText);

      // size
      // smallest/furthest 0.1 
      velocitySize = parseFloat((100 + (-velocityText))/100).toFixed(2);
      velocitySize = velocitySize < 0.01 ? 0.01 : velocitySize;
      this.star.scale.setTo(velocitySize);


    },
    onDragStop: function(sprite, pointer) {
      // COLOR
      this.star.tint = hashSliderColorSpectrum[velocityText];
      console.log(hashSliderColorSpectrum[velocityText]);
      // console.log(hashSliderColorSpectrum[velocityText].toString(16));
    },
    render: function() {

    }
  };

  // assign state to game
  game.state.add('GameState', GameState);

  // launch game
  game.state.start('GameState');
}());