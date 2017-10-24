var solus = solus || {};

solus.renderer = (function(){

    var sprites = [];
    var obj = {};    
    function init(){

        // create a renderer that fills the entire screen and 
        // resizes with the browser window
        var pixiRenderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight);
        pixiRenderer.autoResize = true;
        pixiRenderer.view.style.position = "absolute";
        pixiRenderer.view.style.display = "block";
        document.body.appendChild(pixiRenderer.view);
        window.onresize = function(){
            pixiRenderer.resize(window.innerWidth, window.innerHeight);
        };

        // the root container for the entire display
        var displayStage = new PIXI.Container();
        

        // load the sprites
        PIXI.loader
            .add(getSpriteSources())
            .load(spriteSetup);

        function spriteSetup(){
            getSpriteSources().forEach(function(spritepath){
                let sprite = new PIXI.Sprite(PIXI.loader.resources[spritepath].texture);
                sprites.push(sprite);
                displayStage.addChild(sprite);
            });
            pixiRenderer.render(displayStage);
        }
        console.log("renderer initialized");
    }
    addOnLoadEvent(init);

}());