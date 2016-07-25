BasicGame.MainMenu = function (game) {

  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create:function () {

    //  We've already preloaded our assets, so let's kick right into the Main Menu itself.


    this.add.sprite(this.game.width / 4, 0, 'titlepage');

    this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Press Z or tap/click game to start", { font: "20px monospace", fill: "#000" });
    this.loadingText.anchor.setTo(0.5, 0.5);
    

  },

  update:function () {

    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      this.startGame();
    }
    //  Do some nice funky main menu effect here

  },

  startGame: function (pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game
    this.state.start('Game');

  }

};