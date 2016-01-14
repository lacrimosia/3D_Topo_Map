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
  var camera = new BABYLON.ArcRotateCamera("Camera", 350.8, 0.97, -5.0, new BABYLON.Vector3(168, 150, -200), scene);
  camera.attachControl(canvas);

  var sun = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 300, -200), scene);
  sun.diffuse = new BABYLON.Color3(1, 1, 1);
  sun.specular = new BABYLON.Color3(1, 1, 1);
  sun.intensity = 0.8;


  var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
  // skybox.infiniteDistance = true;
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  /*skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
  // disable picking of object
  skybox.isPickable = false;*/
scene.clearColor = new BABYLON.Color3(1,1,1);

  // Grounds
  // var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/red_rock.jpg", 300, 300, 300, 0, 100, scene, true);
  var ground = BABYLON.Mesh.CreateGround("extraGround", 300, 300, 300, scene, true);
  var groundMaterial = new mountain.GroundMaterial("ground", scene, sun);
  groundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
  groundMaterial.bumpTexture = new BABYLON.Texture("images/island_orig.jpg", scene);
  ground.material = groundMaterial;
  // ground.position = new BABYLON.Vector3(-150,0,-150);
  ground.position.x = 0.0;
  ground.position.y = 0.0;
  ground.position.z = 0.0;
  ground.wireframe = true;

/*var Positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);

var thePositions = [];
    var index;
    for (index = 0; index < Positions.length; index+= 3) {
  //  thePositions.push(new BABYLON.Vector3(thePositions[index], thePositions[index + 1], thePositions[index + 2]));
  thePositions.push({
    'y': Positions[index + 1]
  });
    //   console.log("the pos", thePositions);
  }*/



  // sand on the ground
/*var extraGround = BABYLON.Mesh.CreateGround("extraGround", 300, 300, 1, scene, false);
  var extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene);
  extraGroundMaterial.diffuseTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
  extraGroundMaterial.diffuseTexture.uScale = 40;
  extraGroundMaterial.diffuseTexture.vScale = 40;
  extraGround.position.y = -2.05;
  extraGround.material = extraGroundMaterial;*/

  // Water
//  var water = BABYLON.Mesh.CreateGround("water", 1400, 1400, 1, scene, false);
var water = BABYLON.Mesh.CreateGround("water", 300, 300, 1, scene, false);
//  water.position.y = -1.0;
water.position = new BABYLON.Vector3(0.0,-1.0,0.0);
  var waterMaterial = new mountain.WaterMaterial("water", scene, sun);
  waterMaterial.refractionTexture.renderList.push(ground);
//  waterMaterial.refractionTexture.renderList.push(extraGround);

  waterMaterial.reflectionTexture.renderList.push(ground);
  waterMaterial.reflectionTexture.renderList.push(skybox);

  water.isPickable = false;
  water.material = waterMaterial;



  // render text for grid
  for(var d=0; d<7; d++){
      var feet = (d + 1)*1500;
      var meters = Math.round((feet/3.2808));
    var textPlane = BABYLON.Mesh.CreatePlane("outputplane", 100, scene, false);
    // textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  	textPlane.material = new BABYLON.StandardMaterial("outputplane", scene);
  	textPlane.position = new BABYLON.Vector3(150, d*13, 150);
  //  textPlane.rotation.y = Math.PI/2;
  	textPlane.scaling.y = 0.4;

  	var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 1000, scene, true);
  	textPlane.material.diffuseTexture = textPlaneTexture;
    textPlaneTexture.hasAlpha = true;
  	textPlane.material.specularColor = new BABYLON.Color3(1, 1, 1);
    textPlane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  	textPlane.material.backFaceCulling = false;

  // text, x, y, text settings, color, transparency
  	textPlaneTexture.drawText(feet+" ft.", 0, 100, "bold 140px verdana", "black", "transparent");
  //  textPlaneTexture.drawText(" ("+meters+" m.)", 600, 300, "140px verdana", "blue", "transparent");
  }


// render text for grid 2
 for(var d=0; d<7; d++){
    var feet = (d + 1)*1500;
    var meters = Math.round((feet/3.2808));
  var textPlane2 = BABYLON.Mesh.CreatePlane("outputplane", 100, scene, false);
  // textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  textPlane2.material = new BABYLON.StandardMaterial("outputplane", scene);
  textPlane2.position = new BABYLON.Vector3(-150, d*13, -100);
  textPlane2.rotation.y = Math.PI/-2;
  textPlane2.scaling.y = 0.4;

  var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 1000, scene, true);
  textPlane2.material.diffuseTexture = textPlaneTexture;
  textPlaneTexture.hasAlpha = true;
  textPlane2.material.specularColor = new BABYLON.Color3(1, 1, 1);
  textPlane2.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  textPlane2.material.backFaceCulling = false;

// text, x, y, text settings, color, transparency
  textPlaneTexture.drawText(feet+" ft.", 0, 100, "bold 140px verdana", "black", "transparent");
//  textPlaneTexture.drawText(" ("+meters+" m.)", 600, 300, "140px verdana", "blue", "transparent");
 }



// horizontal grid lines
  for (var i = 0; i < 8; i++) {
    var lines = BABYLON.Mesh.CreateLines("lines", [
  new BABYLON.Vector3(300, 0, 0),
  new BABYLON.Vector3(300, 0, 0),
  new BABYLON.Vector3(0, 0, 0),
  new BABYLON.Vector3(0, 0, -300)
], scene);
          lines.material = groundMaterial;
          lines.position = new BABYLON.Vector3(-150, i*13, 150);
          lines.color = new BABYLON.Color3(0, 0.2, 0.3);
}

// vertical grid lines  ---- positive

 for (var a = 0; a < 10; a++) {
    var lines = BABYLON.Mesh.CreateLines("lines", [
      new BABYLON.Vector3(0, 91, 0),
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0, 0, 0)
], scene);
          lines.material = groundMaterial;
          lines.position.x = a*15;
          lines.position.y = 0;
          lines.position.z = 150;
          lines.color = new BABYLON.Color3(0, 0.2, 0.3);
        //  lines.rotation.x = Math.PI;
}

for (var b = 0; b < 10; b++) {
   var lines = BABYLON.Mesh.CreateLines("lines", [
     new BABYLON.Vector3(0, 91, 0),
     new BABYLON.Vector3(0, 0, 0),
     new BABYLON.Vector3(0, 0, 0),
     new BABYLON.Vector3(0, 0, 0)
], scene);
         lines.material = groundMaterial;
      //   lines.rotation.y = Math.PI;
         lines.position.x = -150;
         lines.position.y = 0;
         lines.position.z = b*15;
         lines.color = new BABYLON.Color3(0, 0.2, 0.3);
       //  lines.rotation.x = Math.PI;
}

// vertical grid lines ------ negative
for (var a = 0; a < 11; a++) {
   var lines = BABYLON.Mesh.CreateLines("lines", [
     new BABYLON.Vector3(0, 91, 0),
     new BABYLON.Vector3(0, 0, 0),
     new BABYLON.Vector3(0, 0, 0),
     new BABYLON.Vector3(0, 0, 0)
], scene);
         lines.material = groundMaterial;
         lines.position.x = a*-15;
         lines.position.y = 0;
         lines.position.z = 150;
         lines.color = new BABYLON.Color3(0, 0.2, 0.3);
       //  lines.rotation.x = Math.PI;
}

for (var b = 0; b < 10; b++) {
   var lines = BABYLON.Mesh.CreateLines("lines", [
     new BABYLON.Vector3(0, 91, 0),
     new BABYLON.Vector3(0, 0, 0),
     new BABYLON.Vector3(0, 0, 0),
     new BABYLON.Vector3(0, 0, 0)
], scene);
         lines.material = groundMaterial;
      //   lines.rotation.y = Math.PI;
         lines.position.x = -150;
         lines.position.y = 0;
         lines.position.z = b*-15;
         lines.color = new BABYLON.Color3(0, 0.2, 0.3);
       //  lines.rotation.x = Math.PI;
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

  // high threshold light
 /*var postProcess0 = new BABYLON.PassPostProcess("Scene copy", 1.0, camera);
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
        effect.setFloat("glowIntensity", 0.3);
        effect.setFloat("highlightIntensity", 0.5);
    };*/

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
