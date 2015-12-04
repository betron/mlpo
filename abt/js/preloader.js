BasicGame.Preloader = function (game) {

  this.background = null;
 
};

BasicGame.Preloader.prototype = {

   preload:function () {

  	this.load.image('titlepage', 'assets/titlepage.png');
  	this.load.image('sky', 'assets/background.png');
    this.load.image('groundL', 'assets/ledgeSquare.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('fire', 'assets/fireball.png');
    this.load.spritesheet('lizard', 'assets/ballRoll.png', 67, 67); 

    this.load.text('level', 'assets/data/level.json');
},

update:function () { 
	
	this.state.start('MainMenu'); 

	}

};