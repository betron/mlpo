BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

function create() {

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
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 1800, 2000);//(x, y, width, height)


    //  A simple background for our game
     bg = game.add.sprite(0, 0, 'sky');
     bg.fixedToCamera = true;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;


    game.camera.follow(player); //always center player

     // Flag to track if the jump button is pressed
    this.jumping = false;

    //  Now let's create four ledges

   ledge = platforms.create(1200, 160, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(1500, 160, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(900, 340, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(400, 450, 'groundL');
    ledge.body.immovable = true;

   

    ledge = platforms.create(30, 600, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(300, 750, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(500, 900, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(1200, 1000, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(900, 1000, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(1600, 1150, 'groundL');
    ledge.body.immovable = true;


    ledge = platforms.create(80, 1200, 'groundL');
    ledge.body.immovable = true;






    ledge = platforms.create(1800, 1300, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(200, 1300, 'groundL');
    ledge.body.immovable = true;    

    ledge = platforms.create(1200, 1300, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(900, 1300, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(1700, 1490, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(400, 1490, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(1200, 1650, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(900, 1650, 'groundL');
    ledge.body.immovable = true;





    ledge = platforms.create(0, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(300, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(600, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(900, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(1200, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(1500, 1800, 'groundL');
    ledge.body.immovable = true;

    ledge = platforms.create(795, 600, 'groundL');
    ledge.body.immovable = true;



    // The player and its settings
    player = game.add.sprite(50, 1600, 'lizard');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0,1,2,3], 8, true);
    player.animations.add('right', [0,3,2,1], 8, true);

     game.camera.follow(player); //always center player
    
    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 13 of them evenly spaced apart
    for (var i = 0; i < 5; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(1600, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // A fireball to collect
    fires = game.add.group();

    fires.enableBody = true;

    var fire = fires.create (800, 570, 'fire');

    //  The score
    scoreText = game.add.text(1600, 30, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(fires, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    game.physics.arcade.overlap(player, fires, collectFire, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -275;

        player.animations.play('left');

    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 275;

        player.animations.play('right');

        
    }
    else
    {
        player.animations.stop();   

        player.frame = 0;
    }
    
    
    //  Allow the player to jump if they are touching the ground.
    //if (cursors.up.isDown && player.body.touching.down) {  player.body.velocity.y = -375;}


  // Set a variable that is true when the player is touching the ground
    var onTheGround = player.body.touching.down;

    // If the player is touching the ground, let him have 2 jumps
    if (onTheGround) {
        this.jumps = 2;
        this.jumping = false;
    }

    // Jump!
    if (cursors.up.isDown && this.jumps > 0 ) {
        player.body.velocity.y = -260;
        this.jumping = true;
    }

    // Reduce the number of available jumps if the jump input is released
    if (cursors.up.isUp && this.jumping) {
        this.jumps--;
        this.jumping = false;
    }


    
    // define what should happen when a button is pressed
   


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 20;
    scoreText.text = 'Score: ' + score;

}

function collectFire (player, fire) {
    
    // Removes the fire from the screen
    fire.kill();

    //  Add and update the score
    score += 200;
    scoreText.text = 'Score: ' + score;

}


}

}