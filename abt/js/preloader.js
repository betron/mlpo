BasicGame.Preloader = function (game) {

  this.background = null;
 
};

BasicGame.Preloader.prototype = {

   preload:function () {

  	this.load.image('titlepage', 'assets/titlepage.png');
  	this.load.image('sky', 'assets/background2.png');
    this.load.image('groundL', 'assets/ledge.jpeg');
    this.load.image('star', 'assets/cloud.jpeg');
    this.load.image('fire', 'assets/fireball.png');
    this.load.spritesheet('dusty', 'assets/ballRoll.png', 64, 64); 

    this.load.text('level', 'assets/data/level.json');
},

update:function () { 
	
	this.state.start('MainMenu'); 

	}

};