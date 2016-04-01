
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

  create: function () {
    this.setupBackground();
    this.setupPlayer();
    this.setupEnemies();
    //this.setupBullets();
    this.setupExplosions();
    this.setupPlayerIcons();
    this.setupText();
    this.setupAudio();

    this.game.world.setBounds(0, 0, 1200, 1200);//(x, y, width, height)

    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {
      this.checkCollisions();
      this.spawnEnemies();
      //this.enemyFire();
      this.processPlayerInput();
      this.processDelayedEffects();
    },

    render: function()  {
     
    },

    //
    //create()- related funcitons
    //
    setupBackground: function () {
    this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
    this.sea.autoScroll(0, BasicGame.SEA_SCROLL_SPEED);
  },

  setupPlayer: function () {
    this.player = this.add.sprite(this.game.width / 2, this.game.height - 50, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);
    this.player.animations.add('ghost', [ 3, 0, 3, 1 ], 20, true);
    this.player.play('fly');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.speed = BasicGame.PLAYER_SPEED;
    this.player.body.collideWorldBounds = true;
    //20 x 20 pixel hitbox
    this.player.body.setSize(20, 20, 0, -10);
    this.weaponLevel = 0;
  },

  setupEnemies: function () {
    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    //this.enemyPool.setAll.body.setSize( 62, 179, 0, 0);
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(15, 'greenEnemy');
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('reward', BasicGame.ENEMY_REWARD, false, false, 0, true);
    this.enemyPool.setAll(
      'dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true
    );
    

    this.nextEnemyAt = 0;
    this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;

    
  },



  setupExplosions: function () {
    this.explosionPool = this.add.group();
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosionPool.createMultiple(100, 'explosion');
    this.explosionPool.setAll('anchor.x', 0.5);
    this.explosionPool.setAll('anchor.y', 0.5);
    this.explosionPool.forEach(function (explosion){
      explosion.animations.add('boom');
    });
  },

  setupPlayerIcons: function () {
    this.powerUpPool = this.add.group();
    this.powerUpPool.enableBody = true;
    this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
    //this.powerUpPool.createMultiple(5, 'powerup1');
    this.powerUpPool.setAll('anchor.x', 0.5);
    this.powerUpPool.setAll('anchor.y', 0.5);
    this.powerUpPool.setAll('outOfBoundsKill', true);
    this.powerUpPool.setAll('checkWorldBounds', true);
    this.powerUpPool.setAll(
      'reward', BasicGame.POWERUP_REWARD, false, false, 0, true
    );

   /* this.lives = this.add.group();
    //calculate locaiton of first life icon
    var firstLifeIconX = this.game.width - 10 - (BasicGame.PLAYER_EXTRA_LIVES * 30);
    for (var i = 0; i < BasicGame.PLAYER_EXTRA_LIVES; i++) {
      var life = this.lives.create(firstLifeIconX + (30 * i), 30, 'player');
      life.scale.setTo(0.5, 0.5);
      life.anchor.setTo(0.5, 0.5);
    }
*/  },

  setupText: function () {
    this.instructions = this.add.text( 
      this.game.width / 2,
      this.game.height - 100,
      'Use Arrow Keys to Move\n' +
      'Avoid the patrol boats.',
      { font: '20px monospace', fill: '#fff', align: 'center'}
      );
    this.instructions.anchor.setTo(0.5, 0.5);
    this.instExpire = this.time.now + BasicGame.INSTRUCTION_EXPIRE;
},

   /* this.score = 0;
    this.scoreText = this.add.text(
      this.game.width / 2 , 30, '' + this.score,
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.scoreText.anchor.setTo(0.5, 0.5);
  },*/

  setupAudio: function () {
      this.explosionSFX = this.add.audio('explosion');
      this.playerExplosionSFX = this.add.audio('playerExplosion');
      this.enemyFireSFX = this.add.audio('enemyFire');
      this.playerFireSFX = this.add.audio('playerFire');
      this.powerUpSFX = this.add.audio('powerUp');
    },

  


  checkCollisions: function () {
  
      this.physics.arcade.overlap(
        this.player, this.enemyPool, this.playerHit, null, this
        );
    },

   spawnEnemies: function () {
      if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0){
      this.nextEnemyAt = this.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      var side = (Math.floor(Math.random() * 2) == 0);
        if (side) {
          var s = 0;
        } else {
          var s = 1200;
        }

      enemy.reset(
        s, this.rnd.integerInRange(0, this.game.height),
        BasicGame.ENEMY_HEALTH
      );
     // enemy.body.velocity.x = this.rnd.integerInRange(BasicGame.ENEMY_MIN_X_VELOCITY, BasicGame.ENEMY_MAX_X_VELOCITY);
      
      

    var target = this.rnd.integerInRange(20, this.game.height - 20);

      enemy.rotation = this.physics.arcade.moveToXY(
        enemy, target, this.game.height,
        this.rnd.integerInRange(
          BasicGame.ENEMY_MIN_X_VELOCITY,  BasicGame.ENEMY_MAX_X_VELOCITY
        )
      ) + 360  ;
}

  },

processPlayerInput: function () {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.left.isDown) {
      this.player.body.angularVelocity = -130;
      } else if (this.cursors.right.isDown) {
      this.player.body.angularVelocity = +130;
      } else {
        this.player.body.angularVelocity = 0;
      }

    if (this.cursors.up.isDown) {
      this.game.physics.arcade.accelerationFromRotation(this.player.rotation + 80, 5000, this.player.body.acceleration);
      }

    if(this.input.activePointer.isDown &&
       this.physics.arcade.distanceToPointer(this.player) > 15) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
      }

    if (this.input.keyboard.isDown(Phaser.Keyboard.UP) ||
        this.input.activePointer.isDown) {
      if (this.returnText && this.returnText.exists) {
        this.quitGame();
      } 
    }
  },

processDelayedEffects: function (){
      if (this.instructions.exists && this.time.now > this.instExpire) {
        this.instructions.destroy();
      }

      if (this.ghostUntil && this.ghostUntil < this.time.now) {
        this.ghostUntil = null;
        this.player.play('fly');
      }  

      if(this.showReturn && this.time.now > this.showReturn) {
        this.returnText = this.add.text(
          this.game.width / 2, this.game.height / 2 +20,
          'Press Z or Tap Game to go back to Main Menu',
          { font: '16px sans-serif', fill: '#fff'}
        );
        this.returnText.anchor.setTo( 0.5, 0.5);
        this.showReturn = false;
      }

      if (this.bossApproaching && this.boss.y > 80) {
        this.bossApproaching = false;
        this.boss.nextShotAt = 0;

        this.boss.body.velocity.y = 0;
        this.boss.body.velocity.x = BasicGame.BOSS_X_VELOCITY;
        // allow bouncing off world bounds
        this.boss.body.bounce.x = 1;
        this.boss.body.collideWorldBounds = true;
      }
    },

  enemyHit: function (bullet, enemy)  {
    bullet.kill();
    this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE);
  },

  playerHit: function (player, enemy) {
   

    this.playerExplosionSFX.play();

    
     
      
      this.explode(player);
      player.kill();
      this.displayEnd(false);
    
  },
  


  damageEnemy: function (enemy, damage) {
    enemy.damage(damage);
    if (enemy.alive) {
      enemy.play('hit');
      } else {
      this.explode(enemy);
      this.explosionSFX.play();
      //this.spawnPowerUp(enemy);
      //this.addToScore(enemy.reward);
      if (enemy.key === 'boss') {
        this.enemyPool.destroy();
        this.shooterPool.destroy();
        this.bossPool.destroy();
        this.enemyBulletPool.destroy();
        this.displayEnd(true);
      }
    }
  },



   /* addToScore: function (score) {
      this.score += score;
      this.scoreText.text = this.score;
      //this approach prevents the boss from spawning again upon winning
      if (this.score >= 12000 && this.bossPool.countDead() == 1) {
        this.spawnBoss();
      }
    },*/

  playerPowerUp: function (player, powerUp) {
    this.addToScore(powerUp.reward);
    powerUp.kill();
    this.powerUpSFX.play();
    if (this.weaponLevel < 5) {
      this.weaponLevel++;
    }
  },

  displayEnd: function (win) {
    if (this.endText && this.endText.exists){
      return;
    }

    var msg = win ? 'You Win!' : 'Game Over!';
    this.endText = this.add.text(
      this.game.width / 2, this.game.height / 2 - 60, msg,
      { font: '72px serif', fill: '#fff'}
    );
    this.endText.anchor.setTo(0.5, 0);

    this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
  },


explode: function (sprite) {
  if (this.explosionPool.countDead() === 0) {
    return;
  }
  var explosion = this.explosionPool.getFirstExists(false);
  explosion.reset(sprite.x, sprite.y);
  explosion.play('boom', 15, false, true);
  // add the original sprite's velocity to the explosion
  explosion.body.velocity.x = sprite.body.velocity.x;
  explosion.body.velocity.y = sprite.body.velocity.y;
},

spawnPowerUp: function (enemy) {
  if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) { 
    return;
  }

  if (this.rnd.frac() < enemy.dropRate) {
       var powerUp = this.powerUpPool.getFirstExists(false);
       powerUp.reset(enemy.x, enemy.y);
       powerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY;
     }
   },

spawnBoss: function () {
  this.bossApproaching = true;
  this.boss.reset(this.game.width / 2, 0, BasicGame.BOSS_HEALTH);
  this.physics.enable(this.boss, Phaser.Physics.ARCADE);
  this.boss.body.velocity.y = BasicGame.BOSS_Y_VELOCITY;
  this.boss.play('fly');
},



quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.sea.destroy();
    this.player.destroy();
    this.enemyPool.destroy();
 
    this.explosionPool.destroy();
    //this.shooterPool.destroy();
    //this.enemyBulletPool.destroy();
    //this.powerUpPool.destroy();
    //this.bossPool.destroy();
    this.instructions.destroy();
    //this.scoreText.destroy();
    this.endText.destroy();
    this.returnText.destroy();
    //  Then let's go back to the main menu.
    this.state.start('MainMenu');
  
  }

};