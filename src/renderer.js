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
    var background;

    function init(){

        // create a renderer that fills the entire screen and 
        // resizes with the browser window
        pixiRenderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, {antialias: false, transparent: true, resolution: 1});
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
        background = new PIXI.Container();
        

        // load the sprites
        PIXI.loader
            .add("assets/sprites/playerShip.png")
            .load(spriteSetup);

        function spriteSetup(){
            playerSprite = new PIXI.Sprite(pixiResources["assets/sprites/playerShip.png"].texture);
            playerSprite.anchor.x = 0.5;
            playerSprite.anchor.y = 0.5;
            playerSprite.zIndex = 2;
            displayStage.addChild(playerSprite);
            displayStage.updateLayersOrder();
        }

        // load the background
        PIXI.loader
            .add("assets/environments/galaxy2.jpg")
            .load(backgroundSetup);

        function backgroundSetup(){
            var backgroundSprite = new PIXI.Sprite(pixiResources["assets/environments/galaxy2.jpg"].texture);
            background.addChild(backgroundSprite);
            background.zIndex = 0;
            displayStage.addChild(background);
            displayStage.updateLayersOrder();
        }

        

        displayStage.updateLayersOrder = function () {
             this.children.sort(function(a,b) {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return a.zIndex - b.zIndex;
            });
             // console.log(this.children);
        };

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
        circle.zIndex = 1;
        displayStage.addChild(circle);
        displayStage.updateLayersOrder();
        return circle;
    };

    obj.updateBullet = function(bullet, position){
        bullet.position.set(position.x, position.y);
    };

    obj.createLaser = function(){
        var line = new PIXI.Graphics();
        line.zIndex = 1;
        displayStage.addChild(line);
        displayStage.updateLayersOrder();
        return line;

    };

    obj.updateLaser = function(laser, origin, endpoint){
        laser.clear();
        laser.lineStyle(2, 0xFF0000, 1);
        laser.moveTo(origin.x,origin.y);
        laser.lineTo(endpoint.x,endpoint.y);
    }

    obj.render = function(){
        if(pixiRenderer){
            pixiRenderer.render(displayStage);
        }
    };

    return obj;

}());