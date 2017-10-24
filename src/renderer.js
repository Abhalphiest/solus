var solus = solus || {};

solus.renderer = (function(){

    var obj = {}; 
    var pixiRenderer;
    var pixiResources;
    var pixiLoader;  
    function init(){

        // create a renderer that fills the entire screen and 
        // resizes with the browser window
        var pixiRenderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight);
        var pixiLoader = PIXI.loader;
        var pixiResources = PIXI.loader.resources;

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
            .add(spriteSheets.playerSheet)
            .load(spriteSetup);

        function spriteSetup(){
            let sprite = new PIXI.Sprite(pixiResources[spriteSheets.playerSheet].texture);
            displayStage.addChild(sprite);
            pixiRenderer.render(displayStage);
        }
        console.log("renderer initialized");
    }
    addOnLoadEvent(init);

}());