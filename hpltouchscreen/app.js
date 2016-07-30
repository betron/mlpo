/**


*
*/
var DemoClass = (function () {
    function DemoClass() {
        var _this = this;

        var gameProperties = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            padding: 10,
        };

        var bulletProperties = {
            speed: 500,
            interval: 100,
            lifeSpan: 2000,
            maxCount: 30,
        };

        this.preload = function () {
            // We need multiple inputs because an asteroids game will require four, one for each button
            // This demo I only include two rotate buttons and one thrust button.  
            _this.game.input.maxPointers = 4;
            // Load the ship demo sprieAtlas.  This contains the ship and the three buttons
            _this.game.load.atlas('spriteAtlas', 'assets/spriteAtlas3.png', 'assets/spriteAtlas3.json');
        };

       

        this.create = function () {
            // typical mobile scaling code
            _this.game.stage.disableVisibilityChange = false;
            //_this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //_this.game.scale.setMinMax(288, 384, 768, 1024);
            _this.game.scale.pageAlignHorizontally = true;
            _this.game.scale.pageAlignVertically = true;
            // The cursor keys are for desktop control
            _this.cursors = _this.game.input.keyboard.createCursorKeys();
            // This is a quick Virtual controls sprite class. 
            // All it does is group three buttons as a child to a parent sprite class.
            // Init the class and add it to the screen
            var s = new Controls(_this.game, 0, 0);
            // add the ship to the game
            _this.game.add.existing(s);
            // I move the control up a little bit so they are not hugging the bottom of the screen on mobile
            s.position.y = -25;
            // Scoping issue.  Need to store 'this' in a local 'var xThis' and use 'xThis' in the virtual function()
            var xThis = _this;
            // Here we assign the input up and down event to a virtual function that will then set the appropriate.
            // This is a meat of the virtual controls.  It's what makes it work.
            // variables that will control the ship to rotote left
            s.btnMoveLeft.onInputDown.add(function () {
                xThis.virtualLeftButtonDown = true;
            });
            s.btnMoveLeft.onInputUp.add(function () {
                xThis.virtualLeftButtonDown = false;
            });
            // Here we assign the input up and down event to a virtual function that will then set the appropriate
            // variables that will control the ship to rotote left
            s.btnMoveRight.onInputDown.add(function () {
                xThis.virtualRightButtonDown = true;
            });
            s.btnMoveRight.onInputUp.add(function () {
                xThis.virtualRightButtonDown = false;
            });
            // Here we assign the input up and down event to a virtual function that will then set the appropriate
            // variables that will control the thurst of the ship
            s.btnThrust.onInputDown.add(function () {
                xThis.virtualThrustButtonDown = true;
            });
            s.btnThrust.onInputUp.add(function () {
                xThis.virtualThrustButtonDown = false;
            });

            // The fire button

            s.btnFire.onInputDown.add(function () {
                xThis.virtualFireButtonDown = true;
            });
            s.btnFire.onInputUp.add(function () {
                xThis.virtualFireButtonDown = false;
            });

            // Init the ship class.  It will add the ship to the position we pass it.
            _this.ship = new Ship(_this.game, _this.game.world.centerX, _this.game.world.centerY, 'spriteAtlas', 'ship.png');
            // A drag rate of 1.0 means there is no drag and the ship keeps going.  Default to .99 or set to another number and experiment
            _this.ship.dragRate = 1.0;

            _this.bulletGroup = _this.game.add.group();
            _this.bulletGroup.enableBody = true;
            _this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
            _this.bulletGroup.createMultiple(30, 'spriteAtlas', 'bullet.png');
            _this.bulletGroup.setAll('anchor.x', 0.5);
            _this.bulletGroup.setAll('anchor.y', 0.5);
            _this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);
            


        };

_this.bulletInterval  = 5;

this.fire = function (){
      //  if (_this.ship.alive) {
      //      return;

        //}
        
       

        if (_this.game.time.now > _this.bulletInterval) {   
           // this.sndFire.play();
   // console.log(_this.bulletInterval);

            var bullet = _this.bulletGroup.getFirstExists(false);
            
            if (bullet) {
                var length = this.ship.width * 0.5;
                var x = this.ship.x + (Math.cos(this.ship.rotation) * length);
                var y = this.ship.y + (Math.sin(this.ship.rotation) * length);
                
                bullet.reset(x, y);
                bullet.lifespan = bulletProperties.lifeSpan;
                bullet.rotation = this.ship.rotation;
                
                _this.game.physics.arcade.velocityFromRotation(this.ship.rotation, bulletProperties.speed, bullet.body.velocity);
                _this.bulletInterval = _this.game.time.now + 200;
            }
        }
    },






        this.update = function () {
            // Check for either the up arrow key or the virtual button state we assing thrust to and move the ship
            if ((_this.cursors.up.isDown) || (_this.virtualThrustButtonDown)) {
                // Move the ship
                _this.ship.thrust();
            }
            else {
                // If the up arrow key or the virtual thurst button s not pressed the ship should start to 
                // slow down if drag is less and 1.0
                _this.ship.drag();
            }

            if ( (_this.cursors.fire.isDown) || (_this.virtualFireButtonDown)) {
                // Fire
                _this.fire();
            }


            // Check for the left arroow ket or the virtual button state that controls left rotation
            if ((_this.cursors.left.isDown) || (_this.virtualLeftButtonDown)) {
                _this.ship.rotate(-3);
            }
            else if ((_this.cursors.right.isDown) || (_this.virtualRightButtonDown)) {
                _this.ship.rotate(3);
            }


           this.checkBoundaries = function (sprite) {
                 if (sprite.x + gameProperties.padding < 0) {
                    sprite.x = _this.game.width + gameProperties.padding;
                } else if (sprite.x - gameProperties.padding > gameProperties.screenWidth) {
                    sprite.x = -gameProperties.padding;
                } 
         
                if (sprite.y + gameProperties.padding < 0) {
                    sprite.y = _this.game.height + gameProperties.padding;
                } else if (sprite.y - gameProperties.padding > gameProperties.screenHeight) {
                    sprite.y = -gameProperties.padding;
                }
            }

            _this.bulletGroup.forEachExists(this.checkBoundaries, this);



        };







        this.game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.CANVAS, 'stage', { preload: this.preload, create: this.create, update: this.update });
    }
    return DemoClass;
})();
window.onload = function () {
    // Start the demo on window load
    var game = new DemoClass();
};
