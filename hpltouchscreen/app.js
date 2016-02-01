/**

* More Typescript tips and code at http://updatestage.com
*
* You must add the following files to the project for it to compile.
*
*               Phaser.d.ts
*               phaser.js
*               pixi.d.ts
*
* These files are part of the Phaser repository.  You can download the
* latest from https://github.com/photonstorm/phaser
*
* Phaser is copyright 2014 Photon Storm Ltd.
*
*/
var DemoClass = (function () {
    function DemoClass() {
        var _this = this;
        this.preload = function () {
            // We need multiple inputs because an asteroids game will require four, one for each button
            // This demo I only include two rotate buttons and one thrust button.  
            _this.game.input.maxPointers = 3;
            // Load the ship demo sprieAtlas.  This contains the ship and the three buttons
            _this.game.load.atlas('spriteAtlas', 'assets/spriteAtlas3.png', 'assets/spriteAtlas3.json');
        };
        this.create = function () {
            // typical mobile scaling code
            _this.game.stage.disableVisibilityChange = false;
            _this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            _this.game.scale.setMinMax(288, 384, 768 * 2, 1024 * 2);
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
            // Init the ship class.  It will add the ship to the position we pass it.
            _this.ship = new Ship(_this.game, _this.game.world.centerX, _this.game.world.centerY, 'spriteAtlas', 'ship.png');
            // A drag rate of 1.0 means there is no drag and the ship keeps going.  Default to .99 or set to another number and experiment
            _this.ship.dragRate = 1.0;
        };
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
            // Check for the left arroow ket or the virtual button state that controls left rotation
            if ((_this.cursors.left.isDown) || (_this.virtualLeftButtonDown)) {
                _this.ship.rotate(-2.5);
            }
            else if ((_this.cursors.right.isDown) || (_this.virtualRightButtonDown)) {
                _this.ship.rotate(2.5);
            }
        };
        this.game = new Phaser.Game(480, 640, Phaser.CANVAS, 'stage', { preload: this.preload, create: this.create, update: this.update });
    }
    return DemoClass;
})();
window.onload = function () {
    // Start the demo on window load
    var game = new DemoClass();
};
//# sourceMappingURL=app.js.map