var launch = function() {
  var canvas = document.getElementById("renderCanvas");
  var divFps = document.getElementById("fps");
  var mode = "CAMERA";
  var clicked = false;
  // hide on init
  $('.loader').hide();
  // $('.menu').css('display', 'none');
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
    $('.loadsText').text(this.loadingUIText);
    $('.menu').hide();
  };
  MyLoadingScreen.prototype.hideLoadingUI = function(fadeTime) {
    $('.loader').fadeOut(fadeTime);
    $('#renderCanvas').fadeIn(fadeTime);
    $('.menu').fadeIn(fadeTime);
  };
  // loading instance
  var loads = new MyLoadingScreen("Loading the Interactive...");
  loads.displayLoadingUI();

  // Babylon
  BABYLON.Engine.ShadersRepository = "Shaders/";
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", 350.8, 0.97, -5.0, new BABYLON.Vector3(168, 0.5, -156), scene);
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


  // Grounds
  // var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/red_rock.jpg", 800, 800, 300, 0, 100, scene, true);
var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/red_rock2.jpg", 600, 600, 150, 0, 150, scene, true);
//  var ground = BABYLON.Mesh.CreateGround("extraGround", 300, 300, 300, scene, true);

  var groundMaterial = new mountain.GroundMaterial("ground", scene, sun);
  groundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
//  groundMaterial.bumpTexture = new BABYLON.Texture("images/island_orig.jpg", scene);
  ground.material = groundMaterial;
  // ground.position = new BABYLON.Vector3(-150,0,-150);
  ground.position.x = 0.0;
  ground.position.y = -25.0;
  ground.position.z = 0.0;
  ground.wireframe = true;


  var extraGround = BABYLON.Mesh.CreateGround("extraGround", 600, 600, 1, scene, false);
  var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
  extraGroundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/thesand.jpg", scene);
  extraGroundMaterial.diffuseTexture.uScale = 10;
  extraGroundMaterial.diffuseTexture.vScale = 10;
  extraGround.position.y = -10.05;
  extraGround.material = extraGroundMaterial;

  // Water
  //  var water = BABYLON.Mesh.CreateGround("water", 1400, 1400, 1, scene, false);
  var water = BABYLON.Mesh.CreateGround("water", 600, 600, 1, scene, false);
  water.position = new BABYLON.Vector3(0.0, -9.0, 0.0);

  var waterMaterial = new mountain.WaterMaterial("water", scene, sun);
  waterMaterial.refractionTexture.renderList.push(ground);
  waterMaterial.refractionTexture.renderList.push(extraGround);

  waterMaterial.reflectionTexture.renderList.push(ground);
  waterMaterial.reflectionTexture.renderList.push(skybox);

  water.isPickable = false;
  water.material = waterMaterial;

  // text grid for mountain heights
  // params: start, end, x, y, z, feet, rotation, text Size
//  textGrid(0, 7, 150, 7, 150, 300, null, 50);
  // text grid 2 -- left text
//  textGrid(0, 7, -150, 7, -100, 300, Math.PI / -2, 50);
  // loading horizontal lines
  var one = [300, 0, 0];
  var two = [300, 0, 0];
  var three = [0, 0, 0];
  var four = [0, 0, -300];
//  horizontalGridLines(0, 8, one, two, three, four, -150, 5, 150, 0, 0, 0);
  // vertical lines
  // params: start, end, y pos, positions(x,y,z), colors(r,g,b)
//  verticalXGridLines(0, 31, 29, 5, 0, 150, 0, 0, 0);
//  verticalXGridLines(0, 31, 29, -5, 0, 150, 0, 0, 0);
//  verticalYGridLines(0, 31, 29, -150, 0, 5, 0, 0, 0);
//  verticalYGridLines(0, 31, 29, -150, 0, -5, 0, 0, 0);


  // the text grid function
  function textGrid(start, end, x, y, z, feets, rotation, textSize) {
    // render text for grid
    for (var d = start; d < end; d++) {
      var feet = Math.abs((d + 1) * feets);
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
      textPlaneTexture.drawText(feet + " ft.", 0, 100, "bold "+textSize+"px verdana", "black", "transparent");
      //  textPlaneTexture.drawText(" ("+meters+" m.)", 600, 300, "140px verdana", "blue", "transparent");
    }
  }

showClouds();
function showClouds(){
  var cloudMaterial = new BABYLON.ShaderMaterial("cloud", scene, {
      vertexElement: "Clouds/clouds",
      fragmentElement: "Clouds/clouds",
  },
  {
      needAlphaBlending: true,
      attributes: ["position", "uv"],
      uniforms: ["worldViewProjection"],
      samplers: ["textureSampler"]
  });
  cloudMaterial.setTexture("textureSampler", new BABYLON.Texture("Shaders/Clouds/cloud.png", scene));
  cloudMaterial.setFloat("fogNear", -100);
  cloudMaterial.setFloat("fogFar", 3000);
  cloudMaterial.setColor3("fogColor", BABYLON.Color3.FromInts(69, 132, 180));

  size = 128;
  var count = 8000;

  var globalVertexData = new BABYLON.VertexData();

  for (var i = 0; i < count; i++) {
    // clouds size
    // default is 128
      var planeVertexData = BABYLON.VertexData.CreatePlane(90);
      delete planeVertexData.normals; // We do not need normals

      // Transform
      var randomScaling = Math.random() * Math.random() * 1.5 + 0.5;
      var transformMatrix = BABYLON.Matrix.Scaling(randomScaling, randomScaling, 1.0);
      //default Math.random() * Math.PI
      transformMatrix = transformMatrix.multiply(BABYLON.Matrix.RotationZ(Math.random() * Math.PI));
      transformMatrix = transformMatrix.multiply(BABYLON.Matrix.RotationX(Math.PI));
      transformMatrix = transformMatrix.multiply(BABYLON.Matrix.RotationY(Math.PI));

      // default
    //  transformMatrix = transformMatrix.multiply(BABYLON.Matrix.Translation(Math.random() * 1000 - 500, -Math.random() * Math.random() * 100, count - i));
      transformMatrix = transformMatrix.multiply(BABYLON.Matrix.Translation(Math.random() * 800 - 500, -Math.random() * Math.random() * 10, count - i));

      planeVertexData.transform(transformMatrix);

      // Merge
      globalVertexData.merge(planeVertexData);
  }

  var clouds = new BABYLON.Mesh("Clouds", scene);
  globalVertexData.applyToMesh(clouds);
  clouds.rotation.y += 0.0505 * scene.getAnimationRatio();
  clouds.material = cloudMaterial;

  var clouds2 = clouds.clone();
//  clouds2.position.z = -300;
  clouds2.position = new BABYLON.Vector3(0, 100, -500);
  clouds.position = new BABYLON.Vector3(0, 100, -500);

//  clouds.rotation.y += 0.0001 * scene.getAnimationRatio();
}

  function mountainHeight(feet, textSize){
    var textPlane = BABYLON.Mesh.CreatePlane("outputplane", 100, scene, false);
    var mHeight = feet;
  textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
    textPlane.material = new BABYLON.StandardMaterial("outputplane", scene);
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    textPlane.position.x = pickResult.pickedPoint.x;
    textPlane.position.y = pickResult.pickedPoint.y;
  //  textPlane.rotation.y = rotation;
    //  textPlane.rotation.y = Math.PI/2;
    textPlane.scaling.y = 0.4;

    var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 1000, scene, true);
    textPlane.material.diffuseTexture = textPlaneTexture;
    textPlaneTexture.hasAlpha = true;
    textPlane.material.specularColor = new BABYLON.Color3(1, 1, 1);
    textPlane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    textPlane.material.backFaceCulling = false;

    // text, x, y, text settings, color, transparency
    textPlaneTexture.drawText(feet + " ft.", 0, 100, "bold "+textSize+"px verdana", "black", "transparent");
  }

  function getMHeight(ypos){
    var mount = 100;
    if(ypos >= 10){
      return mount*2;
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
    loads.hideLoadingUI(2000);
  });

  // Resize
  window.addEventListener("resize", function() {
    engine.resize();
  });

  // UI
  var cameraButton = document.getElementById("cameraButton");
  var elevationButton = document.getElementById("elevationButton");
  var digButton = document.getElementById("digButton");
  var fireButton = document.getElementById("volcanoButton");

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
    sun.specular = new BABYLON.Color3(1, 1, 1);
    elevationControl.waterDrop = false;
    cameraButton.className = "buttons selected";
    digButton.className = "buttons";
    fireButton.className = "buttons";
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
    elevationControl.waterDrop = false;
    addBannerText('Mountain Mode','fa-arrow-up');
    elevationButton.className = "buttons selected";
    cameraButton.className = "buttons";
    digButton.className = "buttons";
    fireButton.className = "buttons";
  });

// volcano Button
fireButton.addEventListener("pointerdown", function(){
    if (mode == "FIRE")
      return;

    if (mode == "CAMERA") {
      camera.detachControl(canvas);
      elevationControl.attachControl(canvas);
    }

      elevationControl.volcano = true;
      addBannerText('Volcano Mode','fa-star');
      fireButton.className = "buttons selected";
      elevationButton.className = "buttons";
      cameraButton.className = "buttons";
      digButton.className = "buttons";
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
    sun.specular = new BABYLON.Color3(0.5, 0.3, 0.7);
    elevationControl.direction = -1;
    elevationControl.waterDrop = true;
    addBannerText('Dig Mode','fa-arrow-down');
    digButton.className = "buttons selected";
    elevationButton.className = "buttons";
    cameraButton.className = "buttons";
    fireButton.className = "buttons";
  });

    // detect camera Mode
    function addBannerText(text, icon){
      $('.bannerText').hide().fadeIn(200);
        $('.bannerText').html("<h2><i class='fa "+icon+"'></i> "+text+"</h2>");
    }

};
