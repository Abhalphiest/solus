"use strict";

var solus = solus || {};

// --------------------------------
//
// renderer.js contains the renderer, which uses the pixi.js graphics library
//
// ---------------------------------

solus.renderer = (function(){

    var obj = {}; 

    // shared rendering resources
    var pixiRenderer;
    var pixiResources;
    var pixiLoader; 
    var displayStage;


    var playerSprite;
    var playerEmitter;
    var playerEmitterContainer;
    var playerContainer;
    
    var background;
    var basicEnemy = {};
    var bullet = {};

    var debugRenderer;

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
        playerContainer.zIndex = 2;
        playerEmitterContainer = new PIXI.Container();
        playerEmitterContainer.zIndex = 1;
        background = new PIXI.Container();

        debugRenderer = new PIXI.Graphics();
        debugRenderer.zIndex = 2;
        displayStage.addChild(debugRenderer);

        solus.loader.loadJSON("assets/sprites.json", setUpSprites);
        
        // make particle trail for player
        playerEmitter = new PIXI.particles.Emitter(

            // The PIXI.Container to put the emitter in
            // if using blend modes, it's important to put this
            // on top of a bitmap, and not use the root stage Container
            playerEmitterContainer,
          
            // The collection of particle images to use
            [PIXI.Texture.fromImage('assets/sprites/particletrail.png')],
          
            // Emitter configuration, edit this to change the look
            // of the emitter
            {
                alpha: {
                    start: .9,
                    end: 0
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
                    min: .5,
                    max: 1.5
                },
                blendMode: "normal",
                frequency: 0.01,
                emitterLifetime: -1,
                maxParticles: 1000,
                pos: {
                    x: 0,
                    y: 0
                },
                addAtBack: false,
                spawnType: "circle",
                spawnCircle: {
                    x: -35,
                    y: 0,
                    r: 1
                }
            }
        );

        playerEmitter.emit = false;

        displayStage.updateLayersOrder = function () {
             this.children.sort(function(a,b) {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return a.zIndex - b.zIndex;
            });
             // console.log(this.children);
        };

        displayStage.addChild(playerEmitterContainer);
        displayStage.updateLayersOrder();
    }
    addOnLoadEvent(init);

    

    // TODO: make dt function, will want it elsewhere anyways
    var elapsed = Date.now();
    obj.updatePlayerSprite = function(x,y,rotation, emit){
        if(playerSprite){
            playerContainer.position.set(x,y);
            playerContainer.rotation = rotation;
        }
        var now = Date.now();
        if(playerEmitter){
            if(!emit && playerEmitter.emit){
                playerEmitterContainer.alpha *= .9;
                if(playerEmitterContainer.alpha <= 0){
                    playerEmitterContainer.alpha = 0;
                    playerEmitter.cleanup();
                    playerEmitter.emit = false;
                }
            }
            else if(emit){
                playerEmitter.emit = true;
                playerEmitter.resetPositionTracking()
                playerEmitterContainer.alpha = 1;
            }
            playerEmitter.updateSpawnPos(x,y);
            playerEmitter.rotation = rotation;
            var offsetVector = getUnitVectorFromAngle(rotation+Math.PI).setLength(35);
            playerEmitter.spawnCircle.x = offsetVector.x;
            playerEmitter.spawnCircle.y = offsetVector.y;
            playerEmitter.update((now - elapsed) * 0.001);
            
        }
        elapsed = now;
    };

    obj.createBullet = function(){
        var bulletSprite = new PIXI.Sprite(bullet.texture);
        bulletSprite.zIndex = 1;
        bulletSprite.width = bullet.width;
        bulletSprite.height = bullet.height;
        bulletSprite.rotation = Math.random()*Math.PI*2;
        bulletSprite.collider = bullet.collider.slice();
        displayStage.addChild(bulletSprite);
        displayStage.updateLayersOrder();
        return bulletSprite;
    };

    obj.updateBullet = function(bullet, position){
        bullet.position.set(position.x, position.y);
    };

    obj.createLaser = function(){
        var line = new PIXI.Graphics();
        line.zIndex = 1;
        line.collider = {
            center:{x:0,y:0},
            width:1,
            height:0
        };
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
        var sprite = new PIXI.Sprite(basicEnemy.texture);
        sprite.zIndex = 2;
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        sprite.height = basicEnemy.height;
        sprite.width = basicEnemy.width;
        sprite.collider = basicEnemy.collider.slice();
        displayStage.addChild(sprite);
        displayStage.updateLayersOrder();
        return sprite;
    };

    obj.updateObject = function(object, position, angle){
        object.position.set(position.x, position.y);
        object.rotation = angle;

        
        // var rotCollider = rotatePolygon(object.collider, angle);
        // debugRenderer.beginFill().moveTo(rotCollider[0].x + position.x, rotCollider[0].y+position.y);
        // for(var i = 1; i < rotCollider.length; i++)
        //     debugRenderer.lineTo(rotCollider[i].x + position.x, rotCollider[i].y+position.y);
        // debugRenderer.lineTo(rotCollider[0].x + position.x, rotCollider[0].y+position.y).endFill();
    }

    obj.renderPolygon = function(polygon){
        debugRenderer.beginFill().moveTo(polygon[0].x, polygon[0].y);
        for(var i = 1; i < polygon.length; i++)
            debugRenderer.lineTo(polygon[i].x, polygon[i].y);
        debugRenderer.lineTo(polygon[0].x, polygon[0].y).endFill();
    }

    obj.drawLine = function(p1, p2){
        debugRenderer.lineStyle(2, 0xFF0000, 1).moveTo(p1.x, p1.y).lineTo(p2.x,p2.y);
    }



    obj.render = function(){
        if(pixiRenderer){
            pixiRenderer.render(displayStage);
        }
        debugRenderer.clear();
    };

    var setUpSprites= function(assets){
        // load the sprites
        PIXI.loader
            .add(assets.spritePath + assets.player.sprite)
            .add(assets.spritePath + assets.basicEnemy.sprite)
            .add("assets/environments/galaxy2.jpg")
            .add(assets.spritePath + assets.bullet.sprite)
            .pre(solus.loader.loadAsset)
            .on("progress", solus.loader.finalizeAsset)
            .load(spriteSetup);

        function spriteSetup(){
            basicEnemy.texture = pixiResources[assets.spritePath + assets.basicEnemy.sprite].texture;
            basicEnemy.width = assets.basicEnemy.width;
            basicEnemy.height = assets.basicEnemy.height;
            basicEnemy.collider = assets.basicEnemy.collider;

            bullet.texture = pixiResources[assets.spritePath + assets.bullet.sprite].texture;
            bullet.width = assets.bullet.width;
            bullet.height = assets.bullet.height;
            bullet.collider = assets.bullet.collider;

            playerSprite = new PIXI.Sprite(pixiResources[assets.spritePath + assets.player.sprite].texture);
            playerSprite.width = assets.player.width;
            playerSprite.height = assets.player.height;
            playerSprite.anchor.x = 0.5;
            playerSprite.anchor.y = 0.5;
            playerSprite.zIndex = 2;
            playerSprite.collider = assets.player.collider;
            playerContainer.addChild(playerSprite);
            displayStage.addChild(playerContainer);
            displayStage.updateLayersOrder();

            var backgroundSprite = new PIXI.Sprite(pixiResources["assets/environments/galaxy2.jpg"].texture);
            background.addChild(backgroundSprite);
            background.zIndex = -1;
            displayStage.addChild(background);
            displayStage.updateLayersOrder();
            console.log('assets loaded');

        }
    };

    return obj;

}());