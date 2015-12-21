var launch = function () {
    var canvas = document.getElementById("renderCanvas");
    var divFps = document.getElementById("fps");
    var mode = "CAMERA";

    if (!BABYLON.Engine.isSupported()) {
        document.getElementById("notSupported").className = "";
        return;
    }

    // Babylon
    BABYLON.Engine.ShadersRepository = "Shaders/";
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    var sun = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 100, 2), scene);

    camera.setPosition(new BABYLON.Vector3(20, 40, 20));
    camera.attachControl(canvas);

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 4000.0, scene);
    //  skybox.infiniteDistance = true;
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    // disable picking of object
    skybox.isPickable = false;

    // Grounds
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/worldHeightMap.jpg", 1400, 1400, 300, 0, 100, scene, true);
    var groundMaterial = new BABYLON.StandardMaterial("mountain", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/mountain.jpg", scene);
    ground.material = groundMaterial;
    ground.position.y = -2.0;

  //  var extraGround = BABYLON.Mesh.CreateGround("extraGround", 1000, 1000, 1, scene, false);
  /*  var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
    extraGroundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
    extraGroundMaterial.diffuseTexture.uScale = 60;
    extraGroundMaterial.diffuseTexture.vScale = 60;
    extraGround.position.y = -2.05;
    extraGround.material = extraGroundMaterial;*/

    // Water
  //  var water = BABYLON.Mesh.CreateGround("water", 1000, 1000, 1, scene, false);
  //  var waterMaterial = new WORLDMONGER.WaterMaterial("water", scene, sun);
  //  waterMaterial.refractionTexture.renderList.push(ground);
//    waterMaterial.refractionTexture.renderList.push(extraGround);

//    waterMaterial.reflectionTexture.renderList.push(ground);
  //  waterMaterial.reflectionTexture.renderList.push(skybox);

  //  water.isPickable = false;
  //  water.material = waterMaterial;

    // Elevation
    var elevationControl = new mountain.elevateMoutain(ground);

    // Bloom
    var blurWidth = 2.0;

  /*  var postProcess0 = new BABYLON.PassPostProcess("Scene copy", 1.0, camera);
    var postProcess1 = new BABYLON.PostProcess("Down sample", "./postprocesses/downsample", ["screenSize", "highlightThreshold"], null, 0.5, camera, BABYLON.Texture.DEFAULT_SAMPLINGMODE);
    postProcess1.onApply = function (effect) {
        effect.setFloat2("screenSize", postProcess1.width, postProcess1.height);
        effect.setFloat("highlightThreshold", 0.85);
    };
    var postProcess2 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), blurWidth, 0.5, camera, BABYLON.Texture.DEFAULT_SAMPLINGMODE);
    var postProcess3 = new BABYLON.BlurPostProcess("Vertical blur", new BABYLON.Vector2(0, 1.0), blurWidth, 0.5, camera, BABYLON.Texture.DEFAULT_SAMPLINGMODE);
    var postProcess4 = new BABYLON.PostProcess("Final compose", "./postprocesses/compose", ["sceneIntensity", "glowIntensity", "highlightIntensity"], ["sceneSampler"], 1, camera);
    postProcess4.onApply = function (effect) {
        effect.setTextureFromPostProcess("sceneSampler", postProcess0);
        effect.setFloat("sceneIntensity", 0.8);
        effect.setFloat("glowIntensity", 0.6);
        effect.setFloat("highlightIntensity", 1.5);
    };*/

    // Render loop
    var renderFunction = function () {
        if (ground.isReady && ground.subMeshes.length == 1) {
            ground.subdivide(20);    // Subdivide to optimize picking
        }

        // Camera
        if (camera.beta < 0.1)
            camera.beta = 0.1;
        else if (camera.beta > (Math.PI / 2) * 0.92)
            camera.beta = (Math.PI / 2) * 0.92;

        if (camera.radius > 70)
            camera.radius = 70;

        if (camera.radius < 5)
            camera.radius = 5;

        // Fps
        divFps.innerHTML = engine.getFps().toFixed() + " fps";

        // Render scene
        scene.render();

        // Animations
        skybox.rotation.y += 0.0001 * scene.getAnimationRatio();
    };

    // Launch render loop
    scene.executeWhenReady(function() {
        engine.runRenderLoop(renderFunction);
    });

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // UI
    var cameraButton = document.getElementById("cameraButton");
    var elevationButton = document.getElementById("elevationButton");
    var digButton = document.getElementById("digButton");
    var help01 = document.getElementById("help01");
    var help02 = document.getElementById("help02");

    scene.onPointerDown = function (evt, pickResult) {
            // if the click hits the ground object, we change the impact position
            if (pickResult.hit) {
                var x = pickResult.pickedPoint.x;
                var y = pickResult.pickedPoint.y;
                console.log('positions', x);
                console.log('positions y', y);
            }

        };



    window.oncontextmenu = function () {
        return false;
    };



};
