var launch = function() {
  var canvas = document.getElementById("renderCanvas");
  var divFps = document.getElementById("fps");
  var mode = "CAMERA";
  var clicked = false;

  if (!BABYLON.Engine.isSupported()) {
    document.getElementById("notSupported").className = "";
    return;
  }

  // Babylon
  BABYLON.Engine.ShadersRepository = "Shaders/";
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", 3.8, 0.97, 10, new BABYLON.Vector3(30, 150, 20), scene);
  camera.attachControl(canvas);

  var sun = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 50, 2), scene);
  sun.diffuse = new BABYLON.Color3(1, 1, 1);
  sun.specular = new BABYLON.Color3(1, 1, 1);
  sun.intensity = 0.8;


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
  var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/mountains2.png", 1400, 1400, 300, 0, 100, scene, true);
  var groundMaterial = new mountain.GroundMaterial("ground", scene, sun);
  groundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
  ground.material = groundMaterial;
  ground.position.y = -2.0;

  // sand on the ground
  var extraGround = BABYLON.Mesh.CreateGround("extraGround", 1400, 1400, 1, scene, false);
  var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
  extraGroundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
  extraGroundMaterial.diffuseTexture.uScale = 40;
  extraGroundMaterial.diffuseTexture.vScale = 40;
  extraGround.position.y = -2.05;
  extraGround.material = extraGroundMaterial;

  // Water
  var water = BABYLON.Mesh.CreateGround("water", 1400, 1400, 1, scene, false);
  water.position.y = 3.0;
  var waterMaterial = new mountain.WaterMaterial("water", scene, sun);
  waterMaterial.refractionTexture.renderList.push(ground);
  waterMaterial.refractionTexture.renderList.push(extraGround);

  waterMaterial.reflectionTexture.renderList.push(ground);
  waterMaterial.reflectionTexture.renderList.push(skybox);

  water.isPickable = false;
  water.material = waterMaterial;


  // Shadows
/*  var shadowGenerator = new BABYLON.ShadowGenerator(1024, sun);
  shadowGenerator.getShadowMap().renderList.push(ground);
 ground.receiveShadows = true;
  shadowGenerator.useVarianceShadowMap = true;
  shadowGenerator.usePoissonSampling = true;*/


  // Elevation
  var elevationControl = new mountain.elevateMountain(ground);
  // Bloom
  var blurWidth = 2.0;

  // high threshold light
 var postProcess0 = new BABYLON.PassPostProcess("Scene copy", 1.0, camera);
    var postProcess1 = new BABYLON.PostProcess("Down sample", "./postprocesses/downsample", ["screenSize", "highlightThreshold"], null, 0.2, camera, BABYLON.Texture.DEFAULT_SAMPLINGMODE);
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
    };

  // Render loop
  var renderFunction = function() {
    if (ground.isReady && ground.subMeshes.length == 1) {
      ground.subdivide(20); // Subdivide to optimize picking
    }

    // Prevents camer from underground rotation
    if (camera.beta < 0.1)
      camera.beta = 0.1;
    else if (camera.beta > (Math.PI / 2) * 0.92)
      camera.beta = (Math.PI / 2) * 0.92;

    if (camera.radius > 70)
      camera.radius = 70;

    if (camera.radius < 5)
      camera.radius = 5;

    // Fps
    // divFps.innerHTML = engine.getFps().toFixed() + " fps";

    // Render scene
    scene.render();

    // Animations
  //  skybox.rotation.y += 0.0001 * scene.getAnimationRatio();
  };

  // Launch render loop
  scene.executeWhenReady(function() {
    engine.runRenderLoop(renderFunction);

  });

  // Resize
  window.addEventListener("resize", function() {
    engine.resize();
  });

  // UI
  var cameraButton = document.getElementById("cameraButton");
  var elevationButton = document.getElementById("elevationButton");
  var digButton = document.getElementById("digButton");
//  var fireButton = document.getElementById("volcanoButton");

  window.oncontextmenu = function() {
    return false;
  };

  // Camera Mode
  cameraButton.addEventListener("pointerdown", function() {
    if (mode == "CAMERA")
      return;
    camera.attachControl(canvas);
    elevationControl.detachControl(canvas);

    mode = "CAMERA";
    cameraButton.className = "buttons selected";
    digButton.className = "buttons";
  //  fireButton.className = "buttons";
    elevationButton.className = "buttons";
  });

  // Mountain Mode
  elevationButton.addEventListener("pointerdown", function() {
    if (mode == "ELEVATION")
      return;

    if (mode == "CAMERA") {
      camera.detachControl(canvas);
      elevationControl.attachControl(canvas);
    }

    mode = "ELEVATION";
    elevationControl.direction = 1;

    elevationButton.className = "buttons selected";
    cameraButton.className = "buttons";
    digButton.className = "buttons";
  //  fireButton.className = "buttons";
  });

  // Water Mode
  digButton.addEventListener("pointerdown", function() {
    if (mode == "DIG")
        return;

    if (mode == "CAMERA") {
        camera.detachControl(canvas);
        elevationControl.attachControl(canvas);
    }

    mode = "DIG";
    elevationControl.direction = -1;

    digButton.className = "buttons selected";
    elevationButton.className = "buttons";
    cameraButton.className = "buttons";
  //  fireButton.className = "buttons";
  });

  // Fire Particle System
/*  var ABox = BABYLON.Mesh.CreateBox("theBox2", 1.0, scene, true, BABYLON.Mesh.DEFAULTSIDE);
  var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
  particleSystem.particleTexture = new BABYLON.Texture("textures/Flare.png", scene);
  particleSystem.emitter = ABox;
  particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

  particleSystem.color1 = new BABYLON.Color4(0.8, 0.1, 0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

  particleSystem.minSize = 5;
  particleSystem.maxSize = 10;
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 1.5;
  particleSystem.emitRate = 2500;

  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  particleSystem.gravity = new BABYLON.Vector3(0, 35, 0);
  particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
  particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 3;
  particleSystem.updateSpeed = 0.005;

  particleSystem.start();*/

};
