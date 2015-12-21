var launch = function() {
  var canvas = document.querySelector("#renderCanvas");
  var divFps = document.getElementById("fps");
  var mode = "CAMERA";

  if (!BABYLON.Engine.isSupported()) {
      document.getElementById("notSupported").className = "";
      return;
  }


    // This creates and positions a free camera
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 10, 40, 40, new BABYLON.Vector3(250, 15, 800), scene);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9;
    camera.lowerRadiusLimit = 50;
    camera.upperRadiusLimit = 300;
    camera.attachControl(canvas);
    var mode = "CAMERA";


    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(1, 1, 1);


    // Elevation
    var elevationControl = new WORLDMONGER.ElevationControl(ground);

    // Bloom
    var blurWidth = 2.0;

    // fog --- darker sky environment
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogStart = 20.0;
    scene.fogEnd = 60.0;
    scene.fogDensity = 0.0004;
    scene.fogColor = new BABYLON.Color3(0, 0, 0);

    // Dim the light a small amount
    light.intensity = 1;

    // ground material
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/ground.jpg", scene);

    // wireframe material
    var wire = new BABYLON.StandardMaterial("wires", scene);
    wire.diffuseColor = new BABYLON.Color3(0, 0, 0);
    wire.wireframe = true;

    // silk material
    var silk = new BABYLON.StandardMaterial("silk1", scene);
    silk.diffuseTexture = new BABYLON.Texture("images/silk.jpg", scene);

    // laser material
    var laser = new BABYLON.StandardMaterial("laser", scene);
    laser.diffuseTexture = new BABYLON.Texture("images/smoke.jpg", scene);

    // brick material
    var brick = new BABYLON.StandardMaterial("laser", scene);
    brick.diffuseTexture = new BABYLON.Texture("images/brick.jpg", scene);

    // world material
    var world = new BABYLON.StandardMaterial("worldMap", scene);
    world.diffuseTexture = new BABYLON.Texture("images/14-1-test.png", scene);
    //  console.log("world texture", world.diffuseTexture);

    // mountain material
    var mountain = new BABYLON.StandardMaterial("mountain", scene);
    mountain.diffuseTexture = new BABYLON.Texture("images/mountain.jpg", scene);

    // water material
    var waterMaterial = new BABYLON.StandardMaterial("waterMaterial", scene);
    // waterMaterial.diffuseTexture =  new BABYLON.Texture("images/water.jpg", scene);
    waterMaterial.diffuseColor = new BABYLON.Color3(0, 0.4, 0.8);

    // Heightmap ground
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/worldHeightMap.jpg", 1400, 1400, 300, 0, 100, scene, true);
    ground.position = new BABYLON.Vector3(600, 0, 710);

    //  groundPlane.material = mountain;

    // ground lines
  //  var groundLines = BABYLON.Mesh.CreateGroundFromHeightMap("groundLines", "images/worldHeightMap.jpg", 1400, 1400, 300, 0, 100, scene, true);
  //  groundLines.position = new BABYLON.Vector3(600, 0.11, 710);
  //  groundLines.material = wire;
//    groundLines.isPickable = false;
    // ground mesh
    //  var groundPlane = BABYLON.Mesh.CreateGround("ground1", 1400, 1400, 2, scene);

    // water
    var waterArea = BABYLON.Mesh.CreateCylinder("waterArea", 100, 100, 100, 6, 1, scene);
    waterArea.position = new BABYLON.Vector3(175, -45, 700);
    waterArea.material = waterMaterial;

    // volcanic fire area
    for (a = 0; a < 25; a++) {
      var theBox2 = BABYLON.Mesh.CreateBox("theBox2" + a, 20.0, scene, true, BABYLON.Mesh.DEFAULTSIDE);
      var randomNumber1 = Math.floor((Math.random() * 790) + 20);
      var randomNumber2 = Math.floor((Math.random() * 790) + 20);
      theBox2.position = new BABYLON.Vector3(randomNumber1, -9, randomNumber2);
      theBox2.material = mountain;

      // Fire Particle System
      // Create a particle system
      var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

      //Texture of each particle
      particleSystem.particleTexture = new BABYLON.Texture("textures/Flare.png", scene);

      // Where the particles come from
      //  particleSystem.emitter = fountain; // the starting object, the emitter
      particleSystem.emitter = theBox2;
      particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
      particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

      // Colors of all particles
      particleSystem.color1 = new BABYLON.Color4(0.8, 0.1, 0, 1.0);
      particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
      particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

      // Size of each particle (random between...
      particleSystem.minSize = 5;
      particleSystem.maxSize = 10;

      // Life time of each particle (random between...
      particleSystem.minLifeTime = 0.3;
      particleSystem.maxLifeTime = 1.5;

      // Emission rate
      particleSystem.emitRate = 2500;

      // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
      particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

      // Set the gravity of all particles
      particleSystem.gravity = new BABYLON.Vector3(0, 35, 0);

      // Direction of each particle after it has been emitted
      particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
      particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

      // Angular speed, in radians
      particleSystem.minAngularSpeed = 0;
      particleSystem.maxAngularSpeed = Math.PI;

      // Speed
      particleSystem.minEmitPower = 1;
      particleSystem.maxEmitPower = 3;
      particleSystem.updateSpeed = 0.005;

      // Start the particle system
      particleSystem.start();
    }



    //  add box  for rain experiment
    var rainBox = BABYLON.Mesh.CreateTorus("torus", 5, 7, 9, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    rainBox.position = new BABYLON.Vector3(175, -2, 700);
    rainBox.material = mountain;

    var rainSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    rainSystem.particleTexture = new BABYLON.Texture("textures/glow.png", scene);

    // Where the particles come from
    //  particleSystem.emitter = fountain; // the starting object, the emitter
    rainSystem.emitter = rainBox;
    //  rainSystem.emitter = waterArea;
    rainSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    rainSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    rainSystem.color1 = new BABYLON.Color4(0.2, 0.4, 1, 1.0);
    rainSystem.color2 = new BABYLON.Color4(0.2, 0.1, 0.7, 1.0);
    rainSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    // Size of each particle (random between...
    rainSystem.minSize = 3;
    rainSystem.maxSize = 8;

    // Life time of each particle (random between...
    rainSystem.minLifeTime = 1.5;
    rainSystem.maxLifeTime = 9.5;

    // Emission rate
    rainSystem.emitRate = 5000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    rainSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    rainSystem.gravity = new BABYLON.Vector3(0, -70, 0);

    // Direction of each particle after it has been emitted
    rainSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
    rainSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

    // Angular speed, in radians
    rainSystem.minAngularSpeed = 0;
    rainSystem.maxAngularSpeed = Math.PI;

    // Speed
    rainSystem.minEmitPower = 4;
    rainSystem.maxEmitPower = 6;
    rainSystem.updateSpeed = 0.008;

    // Start the particle system
    rainSystem.start();


    // Skybox --- sky images
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
  //  var help01 = document.getElementById("help01");
  //  var help02 = document.getElementById("help02");

    window.oncontextmenu = function () {
        return false;
    };

    cameraButton.addEventListener("pointerdown", function () {
        if (mode == "CAMERA")
            return;
        camera.attachControl(canvas);
        elevationControl.detachControl(canvas);

        mode = "CAMERA";
        cameraButton.className = "controlButton selected";
        digButton.className = "controlButton";
        elevationButton.className = "controlButton";
    });

    elevationButton.addEventListener("pointerdown", function () {
        //help01.className = "help";
      //  help02.className = "help";

        if (mode == "ELEVATION")
            return;

        if (mode == "CAMERA") {
            camera.detachControl(canvas);
           elevationControl.attachControl(canvas);
        }

        mode = "ELEVATION";
        elevationControl.direction = 1;

        elevationButton.className = "controlButton selected";
        digButton.className = "controlButton";
        cameraButton.className = "controlButton";
    });

    digButton.addEventListener("pointerdown", function () {
      //  help01.className = "help";
    //    help02.className = "help";

        if (mode == "DIG")
            return;

        if (mode == "CAMERA") {
            camera.detachControl(canvas);
            elevationControl.attachControl(canvas);
        }

        mode = "DIG";
        elevationControl.direction = -1;

        digButton.className = "controlButton selected";
        elevationButton.className = "controlButton";
        cameraButton.className = "controlButton";
    });

    // Sliders
    /*
    $("#slider-vertical").slider({
        orientation: "vertical",
        range: "min",
        min: 2,
        max: 15,
        value: 5,
        slide: function (event, ui) {
            elevationControl.radius = ui.value;
        }
    });

    $("#slider-range").slider({
        orientation: "vertical",
        range: true,
        min: 0,
        max: 12,
        values: [0, 11],
        slide: function (event, ui) {
            elevationControl.heightMin = ui.values[0];
            elevationControl.heightMax = ui.values[1];
        }
    });

    $("#qualitySlider").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 3,
        value: 3,
        slide: function (event, ui) {
            switch (ui.value) {
                case 3:
                    waterMaterial.refractionTexture.resize(512, true);
                    waterMaterial.reflectionTexture.resize(512, true);
                    scene.getEngine().setHardwareScalingLevel(1);
                    scene.particlesEnabled = true;
                    scene.postProcessesEnabled = true;
                    break;
                case 2:
                    waterMaterial.refractionTexture.resize(256, true);
                    waterMaterial.reflectionTexture.resize(256, true);
                    scene.getEngine().setHardwareScalingLevel(1);
                    scene.particlesEnabled = false;
                    scene.postProcessesEnabled = false;
                    break;
                case 1:
                    waterMaterial.refractionTexture.resize(256, true);
                    waterMaterial.reflectionTexture.resize(256, true);
                    scene.getEngine().setHardwareScalingLevel(2);
                    scene.particlesEnabled = false;
                    scene.postProcessesEnabled = false;
                    break;
                case 0:
                    waterMaterial.refractionTexture.resize(256, true);
                    waterMaterial.reflectionTexture.resize(256, true);
                    scene.getEngine().setHardwareScalingLevel(3);
                    scene.particlesEnabled = false;
                    scene.postProcessesEnabled = false;
                    break;
            }
        }
    });*/
}
