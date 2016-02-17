// modified js -- from http://babylonjs.com/Scenes/mountain/index.html

var mountain = mountain || {};

// get the default values
mountain.elevateMountain = function(ground){
  this.ground = ground;          // mountain plane
  this.radius = 20.0;           // selection radius
  this.invertDirection = 1.0;   // direction for inversion
  this.heightMin = 0.0;       // height min
  this.heightMax = 60.0;       // max heigh of mountain
  this.groundPositions = [];

    var scene = ground.getScene();
  //  var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
  /*  var particleSystem = new BABYLON.ParticleSystem("particles", 4000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("textures/Flare.png", scene);
    particleSystem.minAngularSpeed = -4.5;
    particleSystem.maxAngularSpeed = 4.5;
    particleSystem.minSize = 0.5;
    particleSystem.maxSize = 4.0;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 2.0;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1.0;
    particleSystem.emitRate = 400;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(0, 1, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 1, 0);
    particleSystem.color1 = new BABYLON.Color4(0, 0, 1, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 1);
    particleSystem.gravity = new BABYLON.Vector3(0, 5, 0);
    particleSystem.manualEmitCount = 0;
    particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
    particleSystem.start();

    this._particleSystem = particleSystem;*/

     var ABox = BABYLON.Mesh.CreateBox("theBox2", 1.0, scene, true, BABYLON.Mesh.DEFAULTSIDE);
      var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
      particleSystem.particleTexture = new BABYLON.Texture("textures/Flare.png", scene);
    particleSystem.emitter = ABox;
    particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
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


      this.particles = particleSystem;


      // water particles
      var waterDrops = new BABYLON.ParticleSystem("waterParticles", 2000, scene);
      waterDrops.particleTexture = new BABYLON.Texture("textures/Flare.png", scene);
    //  particleSystem.emitter = ABox;
    waterDrops.emitter = new BABYLON.Vector3(-50, 50, 0);
      waterDrops.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
      waterDrops.maxEmitBox = new BABYLON.Vector3(30, 150, 30); // To...

      waterDrops.color1 = new BABYLON.Color4(0, 0.75, 1.0, 0.9);
      waterDrops.color2 = new BABYLON.Color4(0, 0.43, 0.88, 1.0);
      waterDrops.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

      waterDrops.minSize = 2.3;
      waterDrops.maxSize = 6.5;
      waterDrops.minLifeTime = 0.9;
      waterDrops.maxLifeTime = 1.5;
      waterDrops.emitRate = 10500;

      waterDrops.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
      waterDrops.gravity = new BABYLON.Vector3(0, -35, 0);
      waterDrops.direction1 = new BABYLON.Vector3(-7, -8, 3);
      waterDrops.direction2 = new BABYLON.Vector3(7, -8, -3);

      waterDrops.minAngularSpeed = 0;
      waterDrops.maxAngularSpeed = Math.PI/4;
      waterDrops.minEmitPower = 1;
      waterDrops.maxEmitPower = 3;
      waterDrops.updateSpeed = 0.015;

      waterDrops.stop();

      this.rainDrops = waterDrops;
};

// Raindrop area
mountain.elevateMountain.prototype.waterDrop = false;     // used for rain drops

// volcanic fireButton
mountain.elevateMountain.prototype.volcano = false;       // toggle fire

// elevate area direction
mountain.elevateMountain.prototype.elevateDirection = 1;

// attach control for user
mountain.elevateMountain.prototype.attachControl = function (canvas) {
    var currentPosition;    // get current position
    var that = this;

    this.onBeforeRender = function () {
        if (!currentPosition) {
            return;
        }

        // get current position of mouse
        var pickInfo = that.ground.getScene().pick(currentPosition.x, currentPosition.y);

        if (!pickInfo.hit)
            return;

        if (pickInfo.pickedMesh != that.ground)
            return;
        that.picked = pickInfo.pickedPoint;
      //  console.log("pickedMesh",that.picked);

      // add particle systems to rising mountain
      //  that._particleSystem.emitter = pickInfo.pickedPoint.add(new BABYLON.Vector3(0, 3, 0));
    //    that._particleSystem.manualEmitCount += 400;

    //  that._particleSystem.emitter = pickInfo.pickedPoint.add(new BABYLON.Vector3(0, 3, 0));
    //   that._particleSystem.manualEmitCount += 400;
    // start the raindrops
    if(that.waterDrop == true){
      console.log("I am TRUE");
        that.rainDrops.emitter = pickInfo.pickedPoint;
        that.rainDrops.start();
   }
   // stop the raindrops
   if(that.waterDrop == false){
     that.rainDrops.stop();
   }

   if(that.volcano == true){
    that.particles.emitter = pickInfo.pickedPoint;
     that.particles.start();
   }

   if(that.volcano == false){
     that.particles.stop();
   }

    // elevate faces on user control
      that.elevateFaces(pickInfo, that.radius, 0.3);
  //    that.particles.emitter = pickInfo.pickedPoint;
    };

// get current position from client
    this.onPointerDown = function (evt) {
        evt.preventDefault();

        currentPosition = {
            x: evt.clientX,
            y: evt.clientY
        };
    };

    this.onPointerUp = function (evt) {
        evt.preventDefault();

        currentPosition = null;
    };

    this.onPointerMove = function (evt) {
        evt.preventDefault();

        if (!currentPosition) {
            return;
        }

        that.invertDirection = evt.button == 2 ? -1 : 1;

        currentPosition = {
            x: evt.clientX,
            y: evt.clientY
        };
    };

    this.onLostFocus = function () {
        currentPosition = null;
    };

// add events to canvas.
    canvas.addEventListener("pointerdown", this.onPointerDown, true);
    canvas.addEventListener("pointerup", this.onPointerUp, true);
    canvas.addEventListener("pointerout", this.onPointerUp, true);
    canvas.addEventListener("pointermove", this.onPointerMove, true);
    window.addEventListener("blur", this.onLostFocus, true);

    this.ground.getScene().registerBeforeRender(this.onBeforeRender);
};

// detach control when user clicks the camera button
mountain.elevateMountain.prototype.detachControl = function (canvas) {
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointerout", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("blur", this.onLostFocus);
    this.rainDrops.stop();
    this.ground.getScene().unregisterBeforeRender(this.onBeforeRender);
};


// elevate mountain selections
mountain.elevateMountain.prototype.dataElevation = function () {
  var scene = this.ground.getScene();
  // get faces
if (this.facesOfVertices == null) {
        this.facesOfVertices = [];

// get vertices positions, Normals, and Indices
        this.groundVerticesPositions = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.groundVerticesNormals = this.ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        this.groundIndices = this.ground.getIndices();


// store the current ground position in ground array
    this.groundPositions = [];
        var index;
        for (index = 0; index < this.groundVerticesPositions.length; index += 3) {
           this.groundPositions.push(new BABYLON.Vector3(this.groundVerticesPositions[index], this.groundVerticesPositions[index + 1], this.groundVerticesPositions[index + 2]));
        //  $("#text").html(this.groundPositions +"<br/>");
        }

// get Face Normals
        this.groundFacesNormals = [];
        for (index = 0; index < this.ground.getTotalIndices() / 3; index++) {
            this.computeFaceNormal(index);
        }
// get Face vertices
        this.getFacesOfVertices();
}
};

// Get Face ID Index
mountain.elevateMountain.prototype.getFaceVerticesIndex = function (faceID) {
    return {
        v1: this.groundIndices[faceID * 3],
        v2: this.groundIndices[faceID * 3 + 1],
        v3: this.groundIndices[faceID * 3 + 2]
    };
};

// Get Face Normal
mountain.elevateMountain.prototype.computeFaceNormal = function (face) {
    var faceInfo = this.getFaceVerticesIndex(face);

    var v1v2 = this.groundPositions[faceInfo.v1].subtract(this.groundPositions[faceInfo.v2]);
    var v3v2 = this.groundPositions[faceInfo.v3].subtract(this.groundPositions[faceInfo.v2]);

    this.groundFacesNormals[face] = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(v1v2, v3v2));

  //  console.log("ground Normals", this.groundFacesNormals[face]);
};

// get the faces of vertices and push values into array
mountain.elevateMountain.prototype.getFacesOfVertices = function () {
    this.facesOfVertices = [];
    this.subdivisionsOfVertices = [];
    var index;

    for (index = 0; index < this.groundPositions.length; index++) {
        this.facesOfVertices[index] = [];
        this.subdivisionsOfVertices[index] = [];
    }

    for (index = 0; index <  this.groundIndices.length; index++) {
        this.facesOfVertices[this.groundIndices[index]].push((index / 3) | 0);
    }

    for (var subIndex = 0; subIndex < this.ground.subMeshes.length; subIndex++) {
        var subMesh = this.ground.subMeshes[subIndex];
        for (index = subMesh.verticesStart; index < subMesh.verticesStart + subMesh.verticesCount; index++) {
            this.subdivisionsOfVertices[index].push(subMesh);
        }
    }

    return this.subdivisionsOfVertices[index];
};

// get Sphere radius
mountain.elevateMountain.prototype.isBoxSphereIntersected = function(box, sphereCenter, sphereRadius) {
    var vector = BABYLON.Vector3.Clamp(sphereCenter, box.minimumWorld, box.maximumWorld);
    var num = BABYLON.Vector3.DistanceSquared(sphereCenter, vector);
    return (num <= (sphereRadius * sphereRadius));
};

// Elevate the mountain
mountain.elevateMountain.prototype.elevateFaces = function (pickInfo, radius, height) {
    this.dataElevation();
    this.selectedVertices = [];


    // Impact Area
    var sphereCenter = pickInfo.pickedPoint;
    sphereCenter.y = 0;
    var index;

    // Determine list of vertices
    for (var subIndex = 0; subIndex < this.ground.subMeshes.length; subIndex++) {
        var subMesh = this.ground.subMeshes[subIndex];

        if (!this.isBoxSphereIntersected(subMesh.getBoundingInfo().boundingBox, sphereCenter, radius)) {
            continue;
        }

        for (index = subMesh.verticesStart; index < subMesh.verticesStart + subMesh.verticesCount; index++) {
            var position = this.groundPositions[index];
            sphereCenter.y = position.y;

            var distance = BABYLON.Vector3.Distance(position, sphereCenter);

            if (distance < radius) {
                this.selectedVertices[index] = distance;
            }
        }
    }

    // Elevate vertices
    for (var selectedVertice in this.selectedVertices) {
        var position = this.groundPositions[selectedVertice];
        var distance = this.selectedVertices[selectedVertice];

    //    console.log("position", position);

        var fullHeight = height * this.direction * this.invertDirection;
        if (distance < radius * 0.3) {
            position.y += fullHeight;
        } else {
            position.y += fullHeight * (1.0 - (distance - radius * 0.3) / (radius * 0.7));
        }

        if (position.y > this.heightMax)
            position.y = this.heightMax;
        else if (position.y < this.heightMin)
            position.y = this.heightMin;

        this.groundVerticesPositions[selectedVertice * 3 + 1] = position.y;

        this.updateSubdivisions(selectedVertice);
    }

    // Normals
    this.reComputeNormals();

    // Update vertex buffer
    this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.groundVerticesPositions);
    this.ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind,this.groundVerticesNormals);
};

mountain.elevateMountain.prototype.reComputeNormals = function () {
    var faces = [];
    var face;

    for (var selectedVertice in this.selectedVertices) {
        var faceOfVertices = this.facesOfVertices[selectedVertice];
        for (var index = 0; index < faceOfVertices.length; index++) {
            faces[faceOfVertices[index]] = true;
        }
    }

    for (face in faces) {
        this.computeFaceNormal(face);
    }

    for (face in faces) {
        var faceInfo = this.getFaceVerticesIndex(face);
        this.computeNormal(faceInfo.v1);
        this.computeNormal(faceInfo.v2);
        this.computeNormal(faceInfo.v3);
    }
};

mountain.elevateMountain.prototype.computeNormal = function(vertexIndex) {
    var faces = this.facesOfVertices[vertexIndex];

    var normal = BABYLON.Vector3.Zero();
    for (var index = 0; index < faces.length; index++) {
        normal = normal.add(this.groundFacesNormals[faces[index]]);
    }

    normal = BABYLON.Vector3.Normalize(normal.scale(1.0 / faces.length));

    this.groundVerticesNormals[vertexIndex * 3] = normal.x;
    this.groundVerticesNormals[vertexIndex * 3 + 1] = normal.y;
    this.groundVerticesNormals[vertexIndex * 3 + 2] = normal.z;
};

mountain.elevateMountain.prototype.updateSubdivisions = function (vertexIndex) {
    for (var index = 0; index < this.subdivisionsOfVertices[vertexIndex].length; index++) {
        var sub = this.subdivisionsOfVertices[vertexIndex][index];
        var boundingBox = sub.getBoundingInfo().boundingBox;
        var boundingSphere = sub.getBoundingInfo().boundingSphere;

        if (this.groundPositions[vertexIndex].y < boundingBox.minimum.y) {
            boundingSphere.radius += Math.abs(this.groundPositions[vertexIndex].y - boundingBox.minimum.y);
            boundingBox.minimum.y = this.groundPositions[vertexIndex].y;
        } else if (this.groundPositions[vertexIndex].y > boundingBox.maximum.y) {
            boundingBox.maximum.y = this.groundPositions[vertexIndex].y;
        }
    }

    var boundingBox = this.ground.getBoundingInfo().boundingBox;
    var boundingSphere = this.ground.getBoundingInfo().boundingSphere;
    if (this.groundPositions[vertexIndex].y < boundingBox.minimum.y) {
        boundingSphere.Radius += Math.abs(this.groundPositions[vertexIndex].y - boundingBox.minimum.y);
        boundingBox.minimum.y = this.groundPositions[vertexIndex].y;
    } else if (this.groundPositions[vertexIndex].y > boundingBox.maximum.y) {
        boundingBox.maximum.y = this.groundPositions[vertexIndex].y;
    }
};
