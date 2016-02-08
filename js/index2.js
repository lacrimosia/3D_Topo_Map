var launch = function() {
  var canvas = document.getElementById("renderCanvas");
  var divFps = document.getElementById("fps");
  var mode = "CAMERA";
  var clicked = false;
  // hide on init
  $('.loader').hide();
  if (!BABYLON.Engine.isSupported()) {
    document.getElementById("notSupported").className = "";
    return;
  }


  // Loading everything
  // loader class
  function MyLoadingScreen(text) {
    //Loading Text
    this.loadingUIText = text;
  }
  MyLoadingScreen.prototype.displayLoadingUI = function() {
    $('.loader').show();
    $('.loadsText').text("Loading Interactive...");
    $('.menu').hide();
  };
  MyLoadingScreen.prototype.hideLoadingUI = function() {
    $('.loader').fadeOut(2000);
    $('#renderCanvas').fadeIn(3000);
    $('.menu').fadeIn(3000);
  };
  // loading instance
  var loads = new MyLoadingScreen("Loading");
  loads.displayLoadingUI();

  // Babylon
  BABYLON.Engine.ShadersRepository = "Shaders/";
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", 350.8, 0.97, -5.0, new BABYLON.Vector3(168, 150, -200), scene);
  camera.attachControl(canvas);

  var sun = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 300, -200), scene);
  sun.diffuse = new BABYLON.Color3(1, 1, 1);
  sun.specular = new BABYLON.Color3(1, 1, 1);
  sun.intensity = 0.8;


  var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
  // skybox.infiniteDistance = true;
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
  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  skybox.isPickable = false;
  scene.clearColor = new BABYLON.Color3(1, 1, 1);

  // Grounds
  // var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/red_rock.jpg", 800, 800, 300, 0, 100, scene, true);
  var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/red_rock2.jpg", 300, 300, 100, 0, 100, scene, true);
  //  var ground = BABYLON.Mesh.CreateGround("extraGround", 300, 300, 300, scene, true);
  var groundMaterial = new mountain.GroundMaterial("ground", scene, sun);
  groundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
  groundMaterial.bumpTexture = new BABYLON.Texture("images/island_orig.jpg", scene);
  ground.material = groundMaterial;
  // ground.position = new BABYLON.Vector3(-150,0,-150);
  ground.position.x = 0.0;
  ground.position.y = -10.0;
  ground.position.z = 0.0;
  ground.wireframe = true;

  // Water
  //  var water = BABYLON.Mesh.CreateGround("water", 1400, 1400, 1, scene, false);
  var water = BABYLON.Mesh.CreateGround("water", 300, 300, 1, scene, false);
  water.position = new BABYLON.Vector3(0.0, -1.0, 0.0);
  var waterMaterial = new mountain.WaterMaterial("water", scene, sun);
  waterMaterial.refractionTexture.renderList.push(ground);
  //  waterMaterial.refractionTexture.renderList.push(extraGround);

  waterMaterial.reflectionTexture.renderList.push(ground);
  waterMaterial.reflectionTexture.renderList.push(skybox);

  water.isPickable = false;
  water.material = waterMaterial;

  // text grid for mountain heights
  // params: start, end, x, y, z, feet, rotation
  textGrid(0, 7, 150, 13, 150, 1500, null);
  // text grid 2 -- left text
  textGrid(0, 7, -150, 13, -100, 1500, Math.PI / -2);
  // loading horizontal lines
  var one = [300, 0, 0];
  var two = [300, 0, 0];
  var three = [0, 0, 0];
  var four = [0, 0, -300];
  horizontalGridLines(0, 8, one, two, three, four, -150, 13, 150, 0, 0.2, 0.3);
  // vertical lines
  // params: start, end, y pos, positions(x,y,z), colors(r,g,b)
  verticalXGridLines(0, 10, 91, 15, 0, 150, 0, 0.2, 0.3);
  verticalXGridLines(0, 11, 91, -15, 0, 150, 0, 0.2, 0.3);
  verticalYGridLines(0, 10, 91, -150, 0, 15, 0, 0.2, 0.3);
  verticalYGridLines(0, 10, 91, -150, 0, -15, 0, 0.2, 0.3);


  // the text grid function
  function textGrid(start, end, x, y, z, feets, rotation) {
    // render text for grid
    for (var d = start; d < end; d++) {
      var feet = (d + 1) * feets;
      var meters = Math.round((feet / 3.2808));
      var textPlane = BABYLON.Mesh.CreatePlane("outputplane", 100, scene, false);
      // textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
      textPlane.material = new BABYLON.StandardMaterial("outputplane", scene);
      textPlane.position = new BABYLON.Vector3(x, d * y, z);
      textPlane.rotation.y = rotation;
      //  textPlane.rotation.y = Math.PI/2;
      textPlane.scaling.y = 0.4;

      var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 1000, scene, true);
      textPlane.material.diffuseTexture = textPlaneTexture;
      textPlaneTexture.hasAlpha = true;
      textPlane.material.specularColor = new BABYLON.Color3(1, 1, 1);
      textPlane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
      textPlane.material.backFaceCulling = false;

      // text, x, y, text settings, color, transparency
      textPlaneTexture.drawText(feet + " ft.", 0, 100, "bold 140px verdana", "black", "transparent");
      //  textPlaneTexture.drawText(" ("+meters+" m.)", 600, 300, "140px verdana", "blue", "transparent");
    }
  }

  // Prints out the grid lines around the mountains
  // params: start, end, array vectorsLines 1-4 positions, Vectors positions (x,y,z), colors(r,g,b)
  function horizontalGridLines(start, end, linesA, linesB, linesC, linesD, x, y, z, r, g, b) {
    for (var i = start; i < end; i++) {
      var lines = BABYLON.Mesh.CreateLines("lines", [
        new BABYLON.Vector3(linesA[0], linesA[1], linesA[2]),
        new BABYLON.Vector3(linesB[0], linesB[1], linesB[2]),
        new BABYLON.Vector3(linesC[0], linesC[1], linesC[2]),
        new BABYLON.Vector3(linesD[0], linesD[1], linesD[2])
      ], scene);
      lines.material = groundMaterial;
      lines.position = new BABYLON.Vector3(x, i * y, z);
      lines.color = new BABYLON.Color3(r, g, b);
    }
  }

  // vertical lines function
  // params: start, end, y pos, positions(x,y,z), colors(r,g,b)
  function verticalXGridLines(start, end, pos, x, y, z, r, g, b) {
    for (var a = start; a < end; a++) {
      var lines = BABYLON.Mesh.CreateLines("lines", [
        new BABYLON.Vector3(0, pos, 0),
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, 0)
      ], scene);
      lines.material = groundMaterial;
      lines.position.x = a * x;
      lines.position.y = y;
      lines.position.z = z;
      lines.color = new BABYLON.Color3(r, g, b);
      //  lines.rotation.x = Math.PI;
    }
  }

  // vertical lines function
  // params: start, end, y pos, positions(x,y,z), colors(r,g,b)
  function verticalYGridLines(start, end, pos, x, y, z, r, g, b) {
    for (var b = start; b < end; b++) {
      var lines = BABYLON.Mesh.CreateLines("lines", [
        new BABYLON.Vector3(0, pos, 0),
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, 0)
      ], scene);
      lines.material = groundMaterial;
      //   lines.rotation.y = Math.PI;
      lines.position.x = x;
      lines.position.y = y;
      lines.position.z = b * z;
      lines.color = new BABYLON.Color3(r, g, b);
      //  lines.rotation.x = Math.PI;
    }
  }

  // Shadows
  /*  var shadowGenerator = new BABYLON.ShadowGenerator(1024, sun);
    shadowGenerator.getShadowMap().renderList.push(ground);
   ground.receiveShadows = true;
    shadowGenerator.useVarianceShadowMap = true;
    shadowGenerator.usePoissonSampling = true;*/

  //var posVertices = ground.getIndices();
  //  console.log("ground Positions", posVertices);


  // Elevation
  var elevationControl = new mountain.elevateMountain(ground);

  // Bloom
  var blurWidth = 2.0;

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
    skybox.rotation.y += 0.0001 * scene.getAnimationRatio();
  };

  // Launch render loop
  scene.executeWhenReady(function() {
    engine.runRenderLoop(renderFunction);
    loads.hideLoadingUI();
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

  //camera init
  addBannerText('Camera Mode','fa-camera');

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
    addBannerText('Camera Mode','fa-camera');
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

    addBannerText('Mountain Mode','fa-arrow-up');
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
    addBannerText('Dig Mode','fa-arrow-down');
    digButton.className = "buttons selected";
    elevationButton.className = "buttons";
    cameraButton.className = "buttons";
    //  fireButton.className = "buttons";
  });

    // detect camera Mode
    function addBannerText(text, icon){
        $('.bannerText').html("<h2><i class='fa "+icon+"'></i> "+text+"</h2>");
    }

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
