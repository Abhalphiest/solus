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


    var BACKGROUND_WIDTH = 1920;
    var background = {
        index: 2,
        transitioning: false,
        transitionIndex: -1,
        transitionTexture: "",
    }
    var backgroundPanels = [];
    var lightEnemy = {};
    var midEnemy = {};
    var heavyEnemy = {};
    var bullet = {};

    var debugRenderer;

    function init(){

        // create a renderer that fills the entire screen and 
        // resizes with the browser window
        PIXI.utils._saidHello = true;
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

        debugRenderer = new PIXI.Graphics();
        debugRenderer.zIndex = 2;
        displayStage.addChild(debugRenderer);

        solus.loader.loadJSON("assets/sprites.json", setUpSprites);

        // TODO: make particle systems also loaded JSON
        
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
                    start: .7,
                    end: 0
                },
                scale: {
                    start: 0.11,
                    end: 0.05,
                    minimumScaleMultiplier: .5
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
                noRotation: false,
                rotationSpeed: {
                    min: 0,
                    max: 0
                },
                lifetime: {
                    min: .25,
                    max: .35
                },
                blendMode: "normal",
                frequency: 0.001,
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
                    r: 6
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

    obj.getPlayerSprite = function(){return playerSprite;};

    // TODO: make dt function, will want it elsewhere anyways, probably? If I ever get around to variable timestep physics?
    var elapsed = Date.now();
    obj.updatePlayerSprite = function(x,y,rotation, emit){

        playerContainer.position.set(x,y);
        playerContainer.rotation = rotation;
        displayStage.pivot.x = x;
        displayStage.pivot.y = y;
        displayStage.position.x = pixiRenderer.width/2;
        displayStage.position.y = pixiRenderer.height/2;
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

    obj.createLightEnemy = function(){
        var sprite = new PIXI.Sprite(lightEnemy.texture);
        sprite.zIndex = 2;
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        sprite.height = lightEnemy.height;
        sprite.width = lightEnemy.width;
        sprite.collider = lightEnemy.collider.slice();
        displayStage.addChild(sprite);
        displayStage.updateLayersOrder();
        return sprite;
    };

    obj.createMidEnemy = function(){
        var sprite = new PIXI.Sprite(midEnemy.texture);
        sprite.zIndex = 2;
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        sprite.height = midEnemy.height;
        sprite.width = midEnemy.width;
        sprite.collider = midEnemy.collider.slice();
        displayStage.addChild(sprite);
        displayStage.updateLayersOrder();
        return sprite;

    };

    obj.createHeavyEnemy = function(){
        var sprite = new PIXI.Sprite(heavyEnemy.texture);
        sprite.zIndex = 2;
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        sprite.height = heavyEnemy.height;
        sprite.width = heavyEnemy.width;
        sprite.collider = heavyEnemy.collider.slice();
        displayStage.addChild(sprite);
        displayStage.updateLayersOrder();
        return sprite;
    };

    obj.updateObject = function(object, position, angle){
        object.position.set(position.x, position.y);
        object.rotation = angle;

        
    }


    // debug renderer functions (for debugging, in case that wasn't obvious)
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
        // update the background
        if(displayStage.pivot.x - backgroundPanels[background.index].position.x >= BACKGROUND_WIDTH){
            background.index++;
            background.index = background.index%backgroundPanels.length;


            var refreshIndex = (background.index + Math.floor(backgroundPanels.length/2))%backgroundPanels.length;
            backgroundPanels[refreshIndex].position.x += backgroundPanels.length*BACKGROUND_WIDTH;
            if(background.transitioning){
                //console.log('changing background');
                backgroundPanels[(background.index+1)%backgroundPanels.length].texture = background.transitionTexture;
                if((background.index+1)%backgroundPanels.length === background.transitionIndex){
                    //console.log('end transition');
                    background.transitioning = false;
                }
            }
        }

        if(pixiRenderer){
            pixiRenderer.render(displayStage);
        }
        debugRenderer.clear();
    };

    var setUpSprites= function(assets){
        // load the sprites
        PIXI.loader
            .add(assets.spritePath + assets.player.sprite)
            .add(assets.spritePath + assets.lightEnemy.sprite)
            .add(assets.spritePath + assets.midEnemy.sprite)
            .add(assets.spritePath + assets.heavyEnemy.sprite)
            .add("assets/environments/background2.jpg")
            .add("assets/environments/background1.jpg")
            .add("assets/environments/backgroundtransition12.jpg")
            .add(assets.spritePath + assets.bullet.sprite)
            .pre(solus.loader.loadAsset)
            .on("progress", solus.loader.finalizeAsset)
            .load(spriteSetup);

        function spriteSetup(){
            lightEnemy.texture = pixiResources[assets.spritePath + assets.lightEnemy.sprite].texture;
            lightEnemy.width = assets.lightEnemy.width;
            lightEnemy.height = assets.lightEnemy.height;
            lightEnemy.collider = assets.lightEnemy.collider;

            midEnemy.texture = pixiResources[assets.spritePath + assets.midEnemy.sprite].texture;
            midEnemy.width = assets.midEnemy.width;
            midEnemy.height = assets.midEnemy.height;
            midEnemy.collider = assets.midEnemy.collider;

            heavyEnemy.texture = pixiResources[assets.spritePath + assets.heavyEnemy.sprite].texture;
            heavyEnemy.width = assets.heavyEnemy.width;
            heavyEnemy.height = assets.heavyEnemy.height;
            heavyEnemy.collider = assets.heavyEnemy.collider;

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

            backgroundPanels[0] = new PIXI.extras.TilingSprite(pixiResources["assets/environments/background1.jpg"].texture, BACKGROUND_WIDTH , 100000);
            backgroundPanels[0].zIndex = -1;
            backgroundPanels[0].pivot.x = .5;
            backgroundPanels[0].pivot.y = .5;
            backgroundPanels[0].position.set(-5*BACKGROUND_WIDTH/2,-50000);
            displayStage.addChild(backgroundPanels[0]);
            backgroundPanels[1] = new PIXI.extras.TilingSprite(pixiResources["assets/environments/background1.jpg"].texture, BACKGROUND_WIDTH , 100000);
            backgroundPanels[1].zIndex = -1;
            backgroundPanels[1].pivot.x = .5;
            backgroundPanels[1].pivot.y = .5;
            backgroundPanels[1].position.set(-3*BACKGROUND_WIDTH/2,-50000);
            displayStage.addChild(backgroundPanels[1]);
            backgroundPanels[2] = new PIXI.extras.TilingSprite(pixiResources["assets/environments/background1.jpg"].texture, BACKGROUND_WIDTH , 100000);
            backgroundPanels[2].zIndex = -1;
            backgroundPanels[2].pivot.x = .5;
            backgroundPanels[2].pivot.y = .5;
            backgroundPanels[2].position.set(-BACKGROUND_WIDTH/2,-50000);
            displayStage.addChild(backgroundPanels[2]);
            backgroundPanels[3] = new PIXI.extras.TilingSprite(pixiResources["assets/environments/background1.jpg"].texture, BACKGROUND_WIDTH , 100000);
            backgroundPanels[3].zIndex = -1;
            backgroundPanels[3].pivot.x = .5;
            backgroundPanels[3].pivot.y = .5;
            backgroundPanels[3].position.set(BACKGROUND_WIDTH/2,-50000);
            displayStage.addChild(backgroundPanels[3]);
            backgroundPanels[4] = new PIXI.extras.TilingSprite(pixiResources["assets/environments/background1.jpg"].texture, BACKGROUND_WIDTH , 100000);
            backgroundPanels[4].zIndex = -1;
            backgroundPanels[4].pivot.x = .5;
            backgroundPanels[4].pivot.y = .5;
            backgroundPanels[4].position.set(3*BACKGROUND_WIDTH/2,-50000);
            displayStage.addChild(backgroundPanels[4]);
            displayStage.updateLayersOrder();

        }
    };


    obj.changeBackground = function(index){
        background.transitioning = true;
        background.transitionIndex = (background.index+1)%backgroundPanels.length;
        background.transitionTexture = pixiResources["assets/environments/background"+index+".jpg"].texture;
        backgroundPanels[background.transitionIndex].texture = pixiResources["assets/environments/backgroundtransition1"+index+".jpg"].texture;
    };

    return obj;

}());