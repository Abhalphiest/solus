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
    var playerEmitter;
    var playerContainer;
    var displayStage;
    var background;
    var basicEnemyTexture;

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
        playerContainer = new PIXI.Container();
        playerContainer.zIndex = 1;
        background = new PIXI.Container();
        

        // load the sprites
        PIXI.loader
            .add("assets/sprites/playerShip.png")
            .add("assets/sprites/basicEnemy.png")
            .add("assets/environments/galaxy2.jpg")
            .load(spriteSetup);

        function spriteSetup(){
            basicEnemyTexture = pixiResources["assets/sprites/basicEnemy.png"].texture;
            playerSprite = new PIXI.Sprite(pixiResources["assets/sprites/playerShip.png"].texture);
            playerSprite.anchor.x = 0.5;
            playerSprite.anchor.y = 0.5;
            playerSprite.zIndex = 2;
            playerContainer.addChild(playerSprite);
            displayStage.addChild(playerContainer);
            displayStage.updateLayersOrder();

            var backgroundSprite = new PIXI.Sprite(pixiResources["assets/environments/galaxy2.jpg"].texture);
            background.addChild(backgroundSprite);
            background.zIndex = -1;
            displayStage.addChild(background);
            displayStage.updateLayersOrder();

            obj.initialized = true;
        }

        // make particle trail for player
        playerEmitter = new PIXI.particles.Emitter(

            // The PIXI.Container to put the emitter in
            // if using blend modes, it's important to put this
            // on top of a bitmap, and not use the root stage Container
            playerContainer,
          
            // The collection of particle images to use
            [PIXI.Texture.fromImage('assets/sprites/particletrail.png')],
          
            // Emitter configuration, edit this to change the look
            // of the emitter
            {
                alpha: {
                    start: 0,
                    end: .5
                },
                scale: {
                    start: 0.49,
                    end: 0.08,
                    minimumScaleMultiplier: 1
                },
                color: {
                    start: "#f06b28",
                    end: "#fff93d"
                },
                speed: {
                    start: 208,
                    end: 100,
                    minimumSpeedMultiplier: 1.28
                },
                acceleration: {
                    x: 24,
                    y: 7
                },
                maxSpeed: 10,
                startRotation: {
                    min: 0,
                    max: 360
                },
                noRotation: true,
                rotationSpeed: {
                    min: 0,
                    max: 0
                },
                lifetime: {
                    min: 1,
                    max: 1.5
                },
                blendMode: "normal",
                frequency: 0.001,
                emitterLifetime: -1,
                maxParticles: 1000,
                pos: {
                    x: 0,
                    y: 0
                },
                addAtBack: true,
                spawnType: "circle",
                spawnCircle: {
                    x: 0,
                    y: 0,
                    r: 2
                }
            }
        );




        

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

    // TODO: make dt function, will want it elsewhere anyways
    var elapsed = Date.now();
    obj.updatePlayerSprite = function(x,y,rotation){
        if(playerSprite){
            playerSprite.position.set(x,y);
            playerSprite.rotation = rotation;
        }
        var now = Date.now();
        if(playerEmitter){
            playerEmitter.updateSpawnPos(playerSprite.position.x, playerSprite.position.y);
            playerEmitter.update((now - elapsed) * 0.001);
        }
        elapsed = now;
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

    obj.createBasicEnemy = function(){
        var sprite = new PIXI.Sprite(basicEnemyTexture);
        sprite.zIndex = 2;
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        sprite.height = 96;
        sprite.width = 64;
        displayStage.addChild(sprite);
        displayStage.updateLayersOrder();
        return sprite;
    };

    obj.updateObject = function(object, position, angle){
        object.position.set(position.x, position.y);
        object.rotation = angle;
    }



    obj.render = function(){
        if(pixiRenderer){
            pixiRenderer.render(displayStage);
        }
    };

    return obj;

}());