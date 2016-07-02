BasicGame.Game = function (game) {


};

BasicGame.Game.prototype = {

create:function () {

var player;
var platforms;
var cursors;

var stars;
var fires;
var forest;
var grass;
var trees;
var mage;
var score = 0;
var scoreText;
var left=false;
var right=false;
var jump=false;

    

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.world.setBounds(0, 0, 1800, 2000);//(x, y, width, height)


    //  A simple background for our game
     bg = this.game.add.sprite(0, 0, 'sky');
     bg.fixedToCamera = true;

     

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.game.add.group();
    this.forest = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    this.forest.enableBody = true;


    this.game.camera.follow(player); //always center player

     // Flag to track if the jump button is pressed
    this.jumping = false;

    this.levelData = JSON.parse(this.game.cache.getText('level'));


    this.levelData.platformData.forEach(function(element){
       ledge = this.platforms.create(element.x, element.y, 'groundL');
    }, this);

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);




    this.forest.setAll('body.immovable', true);
    this.forest.setAll('body.allowGravity', false);


    //this.setupPlayer ();

    // The player and its settings
    this.player = this.game.add.sprite(50, 1600, 'lizard');


    //  We need to enable physics on the player
    this.physics.enable(this.player, Phaser.Physics.ARCADE);


    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 500;
    this.player.body.collideWorldBounds = true;


    //  Our two animations, walking left and right.
    //this.player.animations.add ('left', [0, 1, 2, 3], 4, true);
    //this.player.animations.add('right', [0, 1, 2, 3], 4, true);







































    this.game.camera.follow(this.player); //always center player
    
    //  Finally some stars to collect
    this.stars = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;

    //  Here we'll create 13 of them evenly spaced apart
    for (var i = 0; i < 5; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = this.stars.create(450, 1590, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // A fireball to collect
    this.fires = this.game.add.group();

    this.fires.enableBody = true;

    var fire = this.fires.create (800, 570, 'fire');

    //  The score
    this.scoreText = this.game.add.text(70, 1600, 'score: 0' , { fontSize: '32px', fill: '#999900' });

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();

     this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    
    
},

update:function () {

    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide( this.platforms, this.player, this.collisionHandler, null, this);
    this.physics.arcade.collide(this.stars, this.platforms, this.collisionHandler, null, this);
    this.physics.arcade.collide(this.fires, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.arcade.overlap(this.player, this.stars, collectStar, null, this);

    this.physics.arcade.overlap(this.player, this.fires, collectFire, null, this);

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0;
    
    if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player.body.velocity.x = -275;

        this.player.animations.play('left');

    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player.body.velocity.x = 275;

        this.player.animations.play('right');

        
    }
    else
    {
        this.player.animations.stop();   

        this.player.frame = 0;
    }

  // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.touching.down;

  // If the player is touching the ground, let him have 2 jumps
    if (onTheGround) {
        this.jumps = 2;
        this.jumping = false;

        
    }

    // Jump!
    if (this.jumps > 0 && this.cursors.up.isDown) {
        this.player.body.velocity.y = -300;
        this.jumping = true;
    }

    // Reduce the number of available jumps if the jump input is released
    if (this.jumping && this.cursors.up.isUp) {
        this.jumps--;
        this.jumping = false;
    }

   



   /* if (this.jumping && this.cursors.up.isDown) {
        this.jumping = true;
    }

   // this.cursors.up.onDown.add(this.jumpCheck, this); //tells phaser to fire jumpCheck() ONCE per onDown event.


    

    if (!onTheGround && this.cursors.up.isDown ){
          this.jumps--;
          this.jumping = true;
       }  


*/
    
   


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this.score += 20;
    this.scoreText.text = 'score: ' + this.score;

}

function collectFire (player, fire) {
    
    // Removes the fire from the screen
    fire.kill();

    //  Add and update the score
    this.score += 200;
    this.scoreText.text = 'score: ' + this.score;

}




}

}