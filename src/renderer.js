"use strict";

var solus = solus || {};

// --------------------------------
//
// renderer.js contains the renderer, which uses the pixi.js graphics library
//
// ---------------------------------

solus.renderer = (function(){

    var obj = {}; 
    var pixiRenderer;
    var pixiResources;
    var pixiLoader; 
    var playerSprite;
    var displayStage;

    function init(){

        // create a renderer that fills the entire screen and 
        // resizes with the browser window
        pixiRenderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight);
        pixiLoader = PIXI.loader;
        pixiResources = PIXI.loader.resources;

        pixiRenderer.autoResize = true;
        pixiRenderer.view.style.position = "absolute";
        pixiRenderer.view.style.display = "block";
        document.body.appendChild(pixiRenderer.view);
        window.onresize = function(){
            pixiRenderer.resize(window.innerWidth, window.innerHeight);
        };

        // the root container for the entire display
        displayStage = new PIXI.Container();
        

        // load the sprites
        PIXI.loader
            .add("assets/sprites/playerShip.png")
            .load(spriteSetup);

        function spriteSetup(){
            playerSprite = new PIXI.Sprite(pixiResources["assets/sprites/playerShip.png"].texture);
            playerSprite.anchor.x = 0.5;
            playerSprite.anchor.y = 0.5;
            displayStage.addChild(playerSprite);
        }
        console.log("renderer initialized");
    }
    addOnLoadEvent(init);

    obj.updatePlayerSprite = function(x,y,rotation){
        if(playerSprite){
            playerSprite.position.set(x,y);
            playerSprite.rotation = rotation;
        }
    };

    obj.createBullet = function(){
        var circle = new PIXI.Graphics();
        circle.beginFill(0xFFFFFF);
        circle.drawCircle(0,0,2);
        displayStage.addChild(circle);
        return circle;
    }

    obj.updateBullet = function(bullet, position){
        bullet.position.set(position.x, position.y);
    }

    obj.render = function(){
        if(pixiRenderer)
            pixiRenderer.render(displayStage);
    }

    return obj;

}());