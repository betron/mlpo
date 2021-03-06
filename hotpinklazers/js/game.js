var gameProperties = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,

    delayToStartLevel: 3,
    padding: 30,
};

var states = {
    main: "main",
    game: "game",
};

var graphicAssets = {
    ship:{URL:'assets/shipNew.png', name: 'ship'},
    bullet: {URL:'assets/bulletNew.png', name: 'bullet'},

    asteroidLarge: {URL: 'assets/asteroidLarge.png', name:'asteroidLarge'},
    asteroidMedium: {URL:'assets/asteroidMedium.png', name: 'asteroidMedium'},
    asteroidSmall: {URL: 'assets/asteroidSmall.png', name: 'asteroidSmall'},

    background:{URL:'assets/background.png', name:'background'},
    explosionLarge:{URL:'assets/explosionLarge.png', name:'explosionLarge', width:64, height:64, frames:8},
    explosionMedium:{URL:'assets/explosionMedium.png', name:'explosionMedium', width:58, height:58, frames:8},
    explosionSmall:{URL:'assets/explosionSmall.png', name:'explosionSmall', width:41, height:41, frames:8},

   // buttonfire: { URL:'assets/button-round-a.png', name: 'buttonfire', width:96, height:96, frames:2},
    //buttonthrust: {URL:'assets/button-round-b.png', name: 'buttonthrust', width: 96, height: 96, frames:2},
    //buttonhorizontal: {URL:'assets/button-horizontal.png', name: 'buttonhorizontal', width: 96, height:64, frames:2},
};

var soundAssets = {
    fire:{URL:['assets/fire.m4a', 'assets/fire.ogg'], name:'fire'},
    destroyed:{URL:['assets/destroyed.m4a', 'assets/destroyed.ogg'], name:'destroyed'},
};

var shipProperties = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    acceleration: 300,
    drag: 1,
    maxVelocity: 300,
    angularVelocity: 300,
    startingLives: 3,
    timeToReset: 3,
    blinkDelay: 0.2,
};

var bulletProperties = {
    speed: 400,
    interval: 250,
    lifeSpan: 2000,
    maxCount: 30,
};

var asteroidProperties = {
    startingAsteroids: 4,
    maxAsteroids: 20,
    incrementAsteroids: 2,

    asteroidLarge: { minVelocity: 50, maxVelocity: 100, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, nextSize: graphicAssets.asteroidMedium.name, pieces: 2, explosion:'explosionLarge' },
    asteroidMedium: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: graphicAssets.asteroidSmall.name, pieces: 2, explosion: 'explosionMedium' },
    asteroidSmall: { minVelocity: 50, maxVelocity: 250, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100, explosion: 'explosionSmall' },
};

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
    titleFontStyle: {font: '35px braggadocio', fill: '#FF006F', align: 'center'},
}
var gameState = function(game){
    this.shipSprite;
    this.shipIsInvulnerable;
    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;
    
    //this.buttonfire;
    //this.buttonhorizontal;
    //this.buttonthrust;

    this.bulletGroup;
    

    this.asteroidGroup;

    this.tf_lives;

    
    this.tf_score;

    this.sndDestroyed;
    this.sndFire;

    this.backgroundSprite;

    this.explosionLargeGroup;
    this.explosionMediumGroup;
    this.explosionSmallGroup;
};

gameState.prototype = {
    
    preload: function () {
        game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
        game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
        game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
        
        game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
        game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
        
        game.load.audio(soundAssets.destroyed.name, soundAssets.destroyed.URL);
        game.load.audio(soundAssets.fire.name, soundAssets.fire.URL);
    
        game.load.image(graphicAssets.background.name, graphicAssets.background.URL);
        game.load.spritesheet(graphicAssets.explosionLarge.name, graphicAssets.explosionLarge.URL, graphicAssets.explosionLarge.width, graphicAssets.explosionLarge.height, graphicAssets.explosionLarge.frames);
        game.load.spritesheet(graphicAssets.explosionMedium.name, graphicAssets.explosionMedium.URL, graphicAssets.explosionMedium.width, graphicAssets.explosionMedium.height, graphicAssets.explosionMedium.frames);
        game.load.spritesheet(graphicAssets.explosionSmall.name, graphicAssets.explosionSmall.URL, graphicAssets.explosionSmall.width, graphicAssets.explosionSmall.height, graphicAssets.explosionSmall.frames);

        //game.load.spritesheet(graphicAssets.buttonfire.name, graphicAssets.buttonfire.URL, graphicAssets.buttonfire.frames);
        //game.load.spritesheet(graphicAssets.buttonthrust.name, graphicAssets.buttonthrust.URL, graphicAssets.buttonthrust.frames);
        //game.load.spritesheet(graphicAssets.buttonhorizontal.name, graphicAssets.buttonhorizontal.URL, graphicAssets.buttonhorizontal.frames);

    },

    init: function () {
        this.bulletInterval = 0;
        this.asteroidsCount = asteroidProperties.startingAsteroids;
        this.shipLives = shipProperties.startingLives;
        this.score = 0;
    },
    
    create: function () {
        this.initGraphics();
        this.initSounds();
        this.initPhysics();
        this.initKeyboard();
        this.resetAsteroids();
        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
        game.input.onDown.add(dump, this);

       /* this.buttonfire = game.add.button(640, 530, graphicAssets.buttonfire.name, null, this, 0,1,0,1);
        this.buttonthrust = game.add.button(690, 530, graphicAssets.buttonthrust.name, null, this, 0,1,0,1);
        this.buttonhorizontal = game.add.button(50, 550, graphicAssets.buttonhorizontal.name, null, this, 0,1,0,1);


    buttonfire.events.onInputOver.add(function(){fire=true;});
    buttonfire.events.onInputOut.add(function(){fire=false;});
    buttonfire.events.onInputDown.add(function(){fire=true;});
    buttonfire.events.onInputUp.add(function(){fire=false;}); */

    },

    dump: function () {
        console.log(pad1._axes[0]);
        console.log(pad1_rawPad.axes[0]);
    },

    update: function () {
        this.checkPlayerInput();
        this.checkBoundaries(this.shipSprite);
        this.bulletGroup.forEachExists(this.checkBoundaries, this);
        this.asteroidGroup.forEachExists(this.checkBoundaries, this);

        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);

        if (!this.shipIsInvulnerable) {
            game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
        }
    },

    initGraphics: function () {
        this.backgroundSprite = game.add.tileSprite(0, 0, this.game.width, this.game.height, graphicAssets.background.name);
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5); 

        //this.buttonfire = game.add.button(600, 530, graphicAssets.buttonfire.name, null, this, 0,1,0,1);
        //this.buttonfire.callAll('animations.add', 'animations', null, 2);


        this.bulletGroup = game.add.group();
        this.asteroidGroup = game.add.group();

        this.tf_lives = game.add.text(50, 50, 'Lives: '+ shipProperties.startingLives, fontAssets.counterFontStyle);
        
        this.tf_score = game.add.text(gameProperties.screenWidth - 50, 50, 'Score: '+"0", fontAssets.counterFontStyle);
        this.tf_score.align = 'right';
        this.tf_score.anchor.set(1, 0);

        this.explosionLargeGroup = game.add.group();
        this.explosionLargeGroup.createMultiple(20, graphicAssets.explosionLarge.name, 0);
        this.explosionLargeGroup.setAll('anchor.x', 0.5);
        this.explosionLargeGroup.setAll('anchor.y', 0.5);
        this.explosionLargeGroup.callAll('animations.add', 'animations', 'explode', null, 30);
        
        this.explosionMediumGroup = game.add.group();
        this.explosionMediumGroup.createMultiple(20, graphicAssets.explosionMedium.name, 0);
        this.explosionMediumGroup.setAll('anchor.x', 0.5);
        this.explosionMediumGroup.setAll('anchor.y', 0.5);
        this.explosionMediumGroup.callAll('animations.add', 'animations', 'explode', null, 30);
        
        this.explosionSmallGroup = game.add.group();
        this.explosionSmallGroup.createMultiple(20, graphicAssets.explosionSmall.name, 0);
        this.explosionSmallGroup.setAll('anchor.x', 0.5);
        this.explosionSmallGroup.setAll('anchor.y', 0.5);
        this.explosionSmallGroup.callAll('animations.add', 'animations', 'explode', null, 30);
    },

    initSounds: function() {
        this.sndDestroyed = game.add.audio(soundAssets.destroyed.name);
        this.sndFire = game.add.audio(soundAssets.fire.name);
    },

    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipProperties.drag);
        this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(30, graphicAssets.bullet.name);
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 0.5);
        this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);

        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    initKeyboard: function () {
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },



    checkPlayerInput: function () { 
        if (this.key_left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT || pad1.isDown(Phaser.Gamepad.DUALSHOCK_DPAD_LEFT)) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
        } else if (this.key_right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 ) {
            this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
        } else {
            this.shipSprite.body.angularVelocity = 0;
        }
        
        if (this.key_thrust.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER)) {
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
        } else {
            this.shipSprite.body.acceleration.set(0);
        }

        if (this.key_fire.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
            this.fire();
        }
    },

    checkBoundaries: function (sprite) {
         if (sprite.x + gameProperties.padding < 0) {
            sprite.x = game.width + gameProperties.padding;
        } else if (sprite.x - gameProperties.padding > game.width) {
            sprite.x = -gameProperties.padding;
        } 
 
        if (sprite.y + gameProperties.padding < 0) {
            sprite.y = game.height + gameProperties.padding;
        } else if (sprite.y - gameProperties.padding > game.height) {
            sprite.y = -gameProperties.padding;
        }
    },

    fire: function (){
         if (!this.shipSprite.alive) {
            return;
        }
        if (game.time.now > this.bulletInterval) {   
            this.sndFire.play();

            var bullet = this.bulletGroup.getFirstExists(false);
            
            if (bullet) {
                var length = this.shipSprite.width * 0.5;
                var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
                var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);
                
                bullet.reset(x, y);
                bullet.lifespan = bulletProperties.lifeSpan;
                bullet.rotation = this.shipSprite.rotation;
                
                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletProperties.interval;
            }
        }
    },

    createAsteroid: function (x, y, size, pieces) {
        if (pieces === undefined) {pieces = 1;}

        for (var i=0; i<pieces; i++) {
            var asteroid = this.asteroidGroup.create(x, y, size);
            asteroid.anchor.set(0.5, 0.5);
            asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, asteroidProperties[size].maxAngularVelocity);

            var randomAngle = game.math.degToRad(game.rnd.angle());
            var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, asteroidProperties[size].maxVelocity);
     
            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },

    resetAsteroids: function (){
        for (var i=0; i < this.asteroidsCount; i++){
            var side = Math.round(Math.random());
            var x;
            var y;

            if (side) {
                x = Math.round(Math.random()) * gameProperties.screenWidth;
                y = Math.random() * gameProperties.screenHeight;
            } else {
                x= Math.random()* gameProperties.screenWidth;
                y= Math.round(Math.random()) * gameProperties.screenHeight;
            }

            this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
        }
    },

    asteroidCollision: function (target, asteroid) {
        this.sndDestroyed.play();
        target.kill();
        asteroid.kill();

        if (target.key == graphicAssets.ship.name){
            this.destroyShip();
        }

        this.splitAsteroid(asteroid);
        this.updateScore(asteroidProperties[asteroid.key].score);

        if (!this.asteroidGroup.countLiving()) {
            game.time.events.add(Phaser.Timer.SECOND * gameProperties.delayToStartLevel, this.nextLevel, this);
        }

        var explosionGroup = asteroidProperties[asteroid.key].explosion + "Group";
        var explosion = this[explosionGroup].getFirstExists(false);
        explosion.reset(asteroid.x, asteroid.y);
        explosion.animations.play('explode', null, false, true);
    },

    destroyShip: function () {
        this.shipLives --;
        this.tf_lives.text = this.shipLives;

        if(this.shipLives) {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
        } else {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.endGame, this);
        }

        var explosion = this.explosionLargeGroup.getFirstExists(false);
        explosion.reset(this.shipSprite.x, this.shipSprite.y);
        explosion.animations.play('explode', 30, false, true);

    },

    resetShip: function () {
        this.shipIsInvulnerable = true;
        this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
        this.shipSprite.angle = -90;

        game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.shipReady, this);
        game.time.events.repeat(Phaser.Timer.SECOND * shipProperties.blinkDelay, shipProperties.timeToReset / shipProperties.blinkDelay, this.shipBlink, this);
    },

    shipReady: function () {
        this.shipIsInvulnerable = false;
        this.shipSprite.visible = true;
    },

    shipBlink: function () {
        this.shipSprite.visible = !this.shipSprite.visible;
    },

    splitAsteroid: function (asteroid) {
        if (asteroidProperties[asteroid.key].nextSize) {
            this.createAsteroid(asteroid.x, asteroid.y, asteroidProperties[asteroid.key].nextSize, asteroidProperties[asteroid.key].pieces);
        }
    },

    updateScore: function (score) {
        this.score += score;
        this.tf_score.text = this.score;
    },

    nextLevel: function () {
        this.asteroidGroup.removeAll(true);

        if (this.asteroidsCount < asteroidProperties.maxAsteroids) {
            this.asteroidsCount += asteroidProperties.incrementAsteroids;
        }
        this.resetAsteroids();
    },

    endGame: function () {
        game.state.start(states.main);
    },
};

var mainState = function(game){
    this.tf_title;
    this.tf_start;


};

mainState.prototype = {

     preload: function () {
                this.load.image('titlepage', 'assets/openingbg.png');
    },

    create: function () {
          this.add.image( (gameProperties.screenWidth*0.5) - 400 , gameProperties.screenHeight* 0.5 - 300, 'titlepage');

        var startInstructions = 'Use arrow keys to move, Spacebar to fire.\n\nClick to Start';

        this.tf_start = game.add.text((gameProperties.screenWidth*0.5), gameProperties.screenHeight* 0.5 + 200, startInstructions, fontAssets.counterFontStyle);
        this.tf_start.anchor.set(0.5, 0.5);
        
        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
        
        
        game.input.onDown.addOnce(this.startGame, this);


    },

    update: function () {
        if (pad1.justPressed(Phaser.Gamepad.XBOX360_START)){
            this.startGame();
        }
    },

   

    startGame: function () {
        game.state.start(states.game);
    },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.main, mainState);
game.state.add(states.game, gameState);
game.state.start(states.main);