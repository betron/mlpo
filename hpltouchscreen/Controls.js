/// <reference path="phaser.d.ts"/>
/// <reference path="pixi.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Controls = (function (_super) {
    __extends(Controls, _super);
    function Controls(lgame, lx, ly) {
        _super.call(this, lgame, 0, 0, null);
        this.setUpButtons();
        return this;
    }
    // This function is meant for mobile games.  
    Controls.prototype.setUpButtons = function () {
        // Should only be called if on a mobile device or if you want virtual controls for some other reason.
        //
        // The buttons only have one visual state for this demo.  That's why you see something like 'btnFire.png', 'btnFire.png', 'btnFire.png'
        // You could add a down and hover state in your code if you decide to do so.
        //
        // add the thrust button at the bottom of the screen.  I set the position to the width and height of the game because
        // we make the anchor set to 1,1 which means it sets the anchor to the the bottom right of the sprite
        // I use the sprite atlas 'spriteAtlas' 
        // the null parameter is in place of a button callback.  Since we don't use the callback we need to set it to null.
        // We still keep the 'this' parameter.
        this.btnThrust = new Phaser.Button(this.game, this.game.width, this.game.height, 'spriteAtlas', null, this, 'btnFire.png', 'btnFire.png', 'btnFire.png');
        // Add the button as a child of this class
        this.addChild(this.btnThrust);
        // Set the anchor to the far right and bottom of the sprite
        this.btnThrust.anchor.setTo(1, 1);
        // add the shot button at the bottom of the screen.  I set the position to the width and height of the game because
        // we make the anchor set to 0,1 which means it sets the anchor to the the bottom left of the sprite
        // I use the sprite atlas 'spriteAtlas' 
        // the null parameter is in place of a button callback.  Since we don't use the callback we need to set it to null.
        // We still keep the this parameter.
        this.btnMoveLeft = new Phaser.Button(this.game, 0, this.game.height, 'spriteAtlas', null, this, 'btnLeft.png', 'btnLeft.png', 'btnLeft.png');
        // Add the button as a child of this class
        this.addChild(this.btnMoveLeft);
        // Set the anchor to the far left and bottom of the sprite
        this.btnMoveLeft.anchor.setTo(0, 1);
        //
        // add the shot button at the bottom of the screen.  I set the position to the width and height of the game because
        // we make the anchor set to 0,1 which means it sets the anchor to the the bottom left of the sprite
        // I use the sprite atlas 'spriteAtlas' 
        // the null parameter is in place of a button callback.  Since we don't use the callback we need to set it to null.
        // We still keep the 'this' parameter..
        this.btnMoveRight = new Phaser.Button(this.game, this.btnMoveLeft.width + 10, this.game.height, 'spriteAtlas', null, this, 'btnRight.png', 'btnRight.png', 'btnRight.png');
        // Add the button as a child of this class
        this.addChild(this.btnMoveRight);
        // Set the anchor to the far left and bottom of the sprite
        this.btnMoveRight.anchor.setTo(0, 1);
    };
    return Controls;
})(Phaser.Sprite);
//# sourceMappingURL=Controls.js.map