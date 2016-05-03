(function() {
  'use strict';

  var GAME_WIDTH = 640;
  var GAME_HEIGHT = 360;

  var game = new Phaser.Game(
    GAME_WIDTH, 
    GAME_HEIGHT, 
    Phaser.AUTO
  );

  var velocityText = 0.0;
  var velocitySize = 0;
  var velocityColor = 0;

  var style = {
    font: "12px Arial",
    fill: "#FFFFFF",
    align: "left"
  };
  var style1 = {
    font: "12px Arial",
    fill: "#000000",
    align: "left"
  };
  var style2 = {
    font: "12px Arial",
    fill: "#FFFFFF",
    align: "left",
    wordWrap: true, 
    wordWrapWidth: 300
  };

  var sliderStarIconBound;
  var REDSHIFTTEXT = 'When an object moves away from us, the light is shifted to the red end of the spectrum, as its wavelengths get longer.';
  var BLUESHIFTTEXT = 'If an object moves closer, the light moves to the blue end of the spectrum, as its wavelengths get shorter.';
  var hashSliderColorSpectrum = {};
  var hexColor;
  var colors;
  var educationalMessage;
  var text;
  var sliderX = 280;

  // game state
  var GameState = {
    // all image loaded
    preload: function() {
      this.load.image('background', 'assets/images/earth_640x360.jpg');
      this.load.image('star', 'assets/images/star-small.png');
      this.generateColorWheel();
      this.game.add.plugin(Fabrique.Plugins.InputField);
    },
    create: function() {
      // FIX ASPECT
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;

      this.background = this.game.add.sprite(0, 0, 'background'); 

      // STAR
      this.star = this.game.add.sprite(this.game.world.centerX * 0.4, this.game.world.centerY * 0.3, 'star');
      this.star.anchor.setTo(0.5);

      // SLIDER
      this.generateSlider();

      // BLUESHIFT / REDSHIFT
      educationalMessage = this.game.add.text(385, 150, text, style2);
      educationalMessage.setTextBounds(16, 16, 200, 200);

      // INPUT BOX FROM PLUGIN
      this.input = game.add.inputField(490, 318, {
        font: '12px Arial',
        fill: '#212121',
        height: 10,
        width: 50,
        padding: 3,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        placeHolder: velocityText,
        type: 'numeric',
        onkeydown: this.updateVelocity
      });
      // console.log(this.input);
      // console.log(this.input.domElement.value);

      // VELOCITY
      this.velocityLabel = this.game.add.text(400, 320, "Velocity (km/s)", style);
      this.velocityInputBox = this.game.add.text(500, 320, velocityText, style1);

    },
    update: function() {
      this.star.angle += 0.5;
    },
    onDragUpdate: function(sprite, pointer) {
      this.updateVelocityText(pointer);
      this.changeStarSize();
    },
    onDragStop: function(sprite, pointer) {
      // CHANGE STAR COLOR
      this.star.tint = hashSliderColorSpectrum[velocityText];
    
      text = velocityText >= 0 ? REDSHIFTTEXT : BLUESHIFTTEXT;
      educationalMessage.setText(text);

      this.input.domElement.value = velocityText;
      // console.log(this.input.domElement.value);
    },
    updateVelocity: function() {
      velocityText = 0;
    },
    generateColorWheel: function() {
      var maxRed = 359;
      var minBlue = 180;
      var redMinusBlue = maxRed - minBlue;

      colors = Phaser.Color.HSVColorWheel();
      
      var sliderUnits = -100;
      var exponentialCounter = this.findBase(redMinusBlue, 200);

      for (var i = 1; i <= 200; i++) {  
        var currentColor = Math.floor(Math.pow(exponentialCounter,i));
        hashSliderColorSpectrum[sliderUnits] = colors[currentColor + 179].color;
        currentColor = currentColor < 359 ? currentColor : 359;
        sliderUnits++;
      }
    },
    findBase: function(num, pow) {
      return Math.pow(num, (1/pow));
    },
    generateSlider: function() {
      this.slider = this.game.add.graphics(400, sliderX);
      this.slider.lineStyle(3, 0XFFFFFFF, 0.5);
      this.slider.moveTo(0,0);
      this.slider.lineTo(200,0);

      this.sliderStarIcon = this.game.add.sprite(500, sliderX, 'star');
      this.sliderStarIcon.anchor.setTo(0.5);
      this.sliderStarIcon.scale.setTo(0.2);
      this.sliderStarIcon.inputEnabled = true;
      this.sliderStarIcon.input.enableDrag();

      this.sliderStarIconBound = new Phaser.Rectangle(350, 240, 300, this.sliderStarIcon.height);
      this.sliderStarIconBoundGraphics = this.game.add.graphics(this.sliderStarIconBound.x, this.sliderStarIconBound.y);
      this.sliderStarIconBoundGraphics.drawRect(0, 0, this.sliderStarIconBound.width, this.sliderStarIconBound.height);

      this.sliderStarIcon.input.boundsRect = this.sliderStarIconBound;
      this.sliderStarIcon.events.onDragUpdate.add(this.onDragUpdate, this);
      this.sliderStarIcon.events.onDragStop.add(this.onDragStop, this);
    },
    updateVelocityText: function(pointer) {
      velocityText = Math.floor(pointer.x - 500);
      velocityText = velocityText > 100 ? 100 : velocityText;
      velocityText = velocityText < -100 ? -100 : velocityText;
      this.velocityInputBox.setText(velocityText);
    },
    changeStarSize: function() {
      velocitySize = parseFloat((100 + (-velocityText))/100).toFixed(2);
      velocitySize = velocitySize < 0.01 ? 0.01 : velocitySize;
      this.star.scale.setTo(velocitySize);
    }
  };

  // assign state to game
  game.state.add('GameState', GameState);

  // launch game
  game.state.start('GameState');
}());