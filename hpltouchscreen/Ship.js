/// <reference path="phaser.d.ts"/>
/// <reference path="pixi.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Ship = (function (_super) {
    __extends(Ship, _super);
    // Main constructor for the Ship Class
    // **************************************************************************************************************
    function Ship(lgame, lx, ly, texAtlas, tex) {
        _super.call(this, lgame, lx, ly, texAtlas, tex); // super init
        // This will dictate how fast the vector should be.  It's used in the function thrust()
        // I found .09 to give the ship a smooth fuild control.  Experiment with this number to change
        // how the ship feels
        this.accelerationLength = .09;
        // drag rate
        // 1.0  no drag
        // lower than 1.0 the faster ship stops.
        this.dragRate = .99;
        // This controls the maximum speed of the ship.  
        //Increae this variable if you want a faster top speed.
        //Lower this variable if you want a slower top speed
        this.speed_limit = 12;
        // Use a look up table (LUT) for faster code exicution.  When you use a look up table you avoid calling
        // the Math.cos() and Math.sin() functions every frame.  This can slow down the game especially in mobile
        // Look at the comments in initLUT() for more information
        this.useLUT = false;
        // set the anchor to the middle of the sprite
        this.anchor.set(0.5);
        // Init the velocity to zeros
        this.velocity = new Phaser.Point(0, 0);
        // Init the Look up table for faster game execution
        this.initLUT();
        // Add this sprite to the game
        lgame.add.existing(this);
        return this;
    }
    //
    // Main movement control of the ship
    // **************************************************************************************************************
    //
    Ship.prototype.thrust = function () {
        if (this.useLUT) {
            // ge the angle of the ship sprite.  We need to make sure it's not a fraction for use with the LUT
            var a = Math.floor(this.angle);
            // Because the Phaser angle can be  bewteen -180 and -1 we need to normalize it for use with the LUT
            if (a < 0)
                a = this.angle + 360;
        }
        // Store the updated velocity x & y in local variables
        var dx, dy;
        if (this.useLUT) {
            // Here we use the LUT table to get the velocity quickly from the arrays
            // Multiply the vaule in the array by accelerationLength to normalize the value
            dx = this.velocity.x + this.cosine[a] * this.accelerationLength;
            dy = this.velocity.y + this.sine[a] * this.accelerationLength;
        }
        else {
            // Here we use the Math.sin and Math.cos function to get the velocity.
            // This is perfectly fine to use on modern PCs IMO although I'd rather use a LUT 
            // Multiply the vaule in the array by accelerationLength to normalize the value
            dx = this.velocity.x + Math.cos(this.rotation) * this.accelerationLength;
            dy = this.velocity.y + Math.sin(this.rotation) * this.accelerationLength;
        }
        // Check the speed of the vector
        var speed = Math.sqrt(dx * dx + dy * dy);
        //If the speed is less than the speed limit we can update the velocity otherwise we just leave it
        if (speed < this.speed_limit) {
            if (this.useLUT) {
                // Here we increase the speed of the vector using the LUT arrays and normalizing the value with accelerationLength
                this.velocity.x = this.velocity.x + this.cosine[a] * this.accelerationLength;
                this.velocity.y = this.velocity.y + this.sine[a] * this.accelerationLength;
            }
            else {
                // Here we increase the speed of the vector using the MAth sin() and cos() function
                // and normalizing the value with accelerationLength
                this.velocity.x = this.velocity.x + Math.cos(this.rotation) * this.accelerationLength;
                this.velocity.y = this.velocity.y + Math.sin(this.rotation) * this.accelerationLength;
            }
        }
    };
    //
    // drag()
    // **************************************************************************************************************
    //
    Ship.prototype.drag = function () {
        // This is called when the thrust button is NOT being held down.  This will gradually slow down
        // the ship based on the value in dragRate.  If dragRate = 1 it will not slow down
        this.velocity.x = this.velocity.x * this.dragRate; // slows things down in ratio
        this.velocity.y = this.velocity.y * this.dragRate; // slows things down in ratio
    };
    //
    // rotate()
    // **************************************************************************************************************
    //
    Ship.prototype.rotate = function (dir) {
        // SImply rotate the ship based on the direction. 
        // You can chagne the speed of the rotation where you call this function by passing 
        // in a larger number
        this.angle += dir;
    };
    //
    // update()
    // **************************************************************************************************************
    //
    Ship.prototype.update = function () {
        // This is constally called by the Phaser engine.
        //Add the calculated elocity to this sprite x and y position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // IF the ship hits any screen edge we wrap it ot the other side
        this.screenWrap(this);
    };
    //
    // screenWarp()
    // **************************************************************************************************************
    //
    Ship.prototype.screenWrap = function (sprite) {
        // warp the ship from left to right of screen
        if (this.x < 0) {
            this.x = this.game.width;
        }
        else if (this.x > this.game.width) {
            this.x = 0;
        }
        // warp the ship from top to bottom of screen
        if (this.y < 0) {
            this.y = this.game.height;
        }
        else if (this.y > this.game.height) {
            this.y = 0;
        }
    };
    //
    // Lookuptable for faster cos and sin math
    // **************************************************************************************************************
    //
    Ship.prototype.initLUT = function () {
        // var used for the for loop
        var temp_ang;
        // init the sine array to hold 360 values
        this.sine = new Array(360);
        // init the cosine array to hold 360 values
        this.cosine = new Array(360);
        for (temp_ang = 0; temp_ang <= 360; temp_ang++) {
            // We calculate all 360 degrees for sine
            this.sine[temp_ang] = Math.sin(Math.PI * (temp_ang + 1) / 180.0);
            // We calculate all 360 degrees for cosine
            this.cosine[temp_ang] = Math.cos(Math.PI * (temp_ang + 1) / 180.0);
        }
    };
    return Ship;
})(Phaser.Sprite); //end class
//# sourceMappingURL=Ship.js.map