BasicGame.Game = function (game) {


};

BasicGame.Game.prototype = {

create:function () {

var player;
var platforms;
var cursors;

var stars;
var fires;
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

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;


    this.game.camera.follow(player); //always center player

     // Flag to track if the jump button is pressed
    this.jumping = false;

    /*  Now let's create ledges

   ledge = this.platforms.create(1200, 160, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(1500, 160, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(900, 340, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(400, 450, 'groundL');
    ledge.body.immovable = true;

   

    ledge = this.platforms.create(30, 600, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(300, 750, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(500, 900, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(1200, 1000, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(900, 1000, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(1600, 1150, 'groundL');
    ledge.body.immovable = true;


    ledge = this.platforms.create(80, 1200, 'groundL');
    ledge.body.immovable = true;






    ledge = this.platforms.create(1800, 1300, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(200, 1300, 'groundL');
    ledge.body.immovable = true;    

    ledge = this.platforms.create(1200, 1300, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(900, 1300, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(1700, 1490, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(400, 1490, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(1200, 1650, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(900, 1650, 'groundL');
    ledge.body.immovable = true;*/


    this.levelData = JSON.parse(this.game.cache.getText('level'));

    console.log(this.levelData);

    this.levelData.platformData.forEach(function(element){
       ledge = this.platforms.create(element.x, element.y, 'groundL');
    }, this);

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    /*first platform on bottom left 
    ledge = this.platforms.create(0, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(300, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(600, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(900, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(1200, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(1500, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = this.platforms.create(795, 600, 'groundL');
    ledge.body.immovable = true;*/



    // The player and its settings
    this.player = this.game.add.sprite(50, 1600, 'lizard');

    //  We need to enable physics on the player
    this.physics.enable(this.player, Phaser.Physics.ARCADE);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 500;
    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0,1,2,3], 8, true);
    this.player.animations.add('right', [0,3,2,1], 8, true);

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
    this.scoreText = this.game.add.text(1600, 30, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    
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
        this.jumps = 1;
        this.jumping = false;
    }

    // Jump!
    if (this.cursors.up.isDown && this.jumps > 0 ) {
        this.player.body.velocity.y = -250;
        this.jumping = true;
    }

    // Reduce the number of available jumps if the jump input is released
    if (this.cursors.up.isUp && this.jumping) {
        this.jumps--;
        this.jumping = false;
    }


    
    // define what should happen when a button is pressed
   


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this.score += 20;
    this.scoreText.text = 'Score: ' + this.score;

}

function collectFire (player, fire) {
    
    // Removes the fire from the screen
    fire.kill();

    //  Add and update the score
    this.score += 200;
    this.scoreText.text = 'Score: ' + this.score;

}


}

}