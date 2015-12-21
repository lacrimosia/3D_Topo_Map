var mountain = mountain || {};

// get the default values
mountain.elevateMoutain = function(ground){
  this.ground = ground;
  this.radius = 8.0;
  this.invertDirection = 1.0;
  this.heightMin = 0;
  this.heightMax = 30.0;
};

mountain.elevateMoutain.prototype.elevateDirection = 1;

mountain.elevateMoutain.attachControl = function(canvas){
  var currentPosition;
  var that = this;
  var pickInfo = ground.getScene().pick(currentPosition.x, currentPosition.y);
      if (!pickInfo.hit)
          return;
      if (pickInfo.pickedMesh != ground)
          return;
      that.elevateFaces(pickInfo, that.radius, 0.2);

      var currentPosition;
      var that = this;

      this.onBeforeRender = function () {
          if (!currentPosition) {
              return;
          }

          var pickInfo = that._ground.getScene().pick(currentPosition.x, currentPosition.y);

          if (!pickInfo.hit)
              return;

          if (pickInfo.pickedMesh != that.ground)
              return;

        //  that._particleSystem.emitter = pickInfo.pickedPoint.add(new BABYLON.Vector3(0, 3, 0));
      //    that._particleSystem.manualEmitCount += 400;

          that._elevateFaces(pickInfo, that.radius, 0.2);
      };


      this.onPointerDown = function (evt) {
          evt.preventDefault();

          currentPosition = {
              x: evt.clientX,
              y: evt.clientY
          };

          console.log('current', currentPosition.x);
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

          that._invertDirection = evt.button == 2 ? -1 : 1;

          currentPosition = {
              x: evt.clientX,
              y: evt.clientY
          };
      };

      this.onLostFocus = function () {
          currentPosition = null;
      };

      canvas.addEventListener("pointerdown", this.onPointerDown, true);
      canvas.addEventListener("pointerup", this.onPointerUp, true);
      canvas.addEventListener("pointerout", this.onPointerUp, true);
      canvas.addEventListener("pointermove", this.onPointerMove, true);
      window.addEventListener("blur", this.onLostFocus, true);

      this.ground.getScene().registerBeforeRender(this.onBeforeRender);
};

mountain.elevateMoutain.prototype.detachControl = function (canvas) {
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointerout", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("blur", this.onLostFocus);

    this.ground.getScene().unregisterBeforeRender(this.onBeforeRender);
};


mountain.elevateMoutain.prototype.dataElevation = function () {
    if (this.facesOfVertices == null) {
        this.facesOfVertices = [];

        this.groundVerticesPositions = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.groundVerticesNormals = this.ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        this.groundIndices = this.ground.getIndices();

        this.groundPositions = [];
        var index;
        for (index = 0; index < this.groundVerticesPositions.length; index += 3) {
            this.groundPositions.push(new BABYLON.Vector3(this.groundVerticesPositions[index], this.groundVerticesPositions[index + 1], this.groundVerticesPositions[index + 2]));
        }

        this.groundFacesNormals = [];
        for (index = 0; index < this.ground.getTotalIndices() / 3; index++) {
            this.computeFaceNormal(index);
        }

        this.getFacesOfVertices();
    }
};

mountain.elevateMoutain.prototype.getFaceVerticesIndex = function (faceID) {
    return {
        v1: this.groundIndices[faceID * 3],
        v2: this.groundIndices[faceID * 3 + 1],
        v3: this.groundIndices[faceID * 3 + 2]
    };
};

mountain.elevateMoutain.prototype.computeFaceNormal = function (face) {
    var faceInfo = this.getFaceVerticesIndex(face);

    var v1v2 = this.groundPositions[faceInfo.v1].subtract(this.groundPositions[faceInfo.v2]);
    var v3v2 = this.groundPositions[faceInfo.v3].subtract(this.groundPositions[faceInfo.v2]);

    this.groundFacesNormals[face] = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(v1v2, v3v2));
};


mountain.elevateMoutain.prototype.getFacesOfVertices = function () {
    this.facesOfVertices = [];
    this.subdivisionsOfVertices = [];
    var index;

    for (index = 0; index < this.groundPositions.length; index++) {
        this.facesOfVertices[index] = [];
        this.subdivisionsOfVertices[index] = [];
    }

    for (index = 0; index <  this.groundIndices.length; index++) {
        this.facesOfVertices[groundIndices[index]].push((index / 3) | 0);
    }

    for (var subIndex = 0; subIndex < this.ground.subMeshes.length; subIndex++) {
        var subMesh = ground.subMeshes[subIndex];
        for (index = subMesh.verticesStart; index < subMesh.verticesStart + subMesh.verticesCount; index++) {
            this.subdivisionsOfVertices[index].push(subMesh);
        }
    }
};

mountain.elevateMoutain.prototype.isBoxSphereIntersected = function(box, sphereCenter, sphereRadius) {
    var vector = BABYLON.Vector3.Clamp(sphereCenter, box.minimumWorld, box.maximumWorld);
    var num = BABYLON.Vector3.DistanceSquared(sphereCenter, vector);
    return (num <= (sphereRadius * sphereRadius));
};

mountain.elevateMoutain.prototype.elevateFaces = function (pickInfo, radius, height) {
    this.dataElevation();
    this.selectedVertices = [];

    // Impact zone
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
    for (var selectedVertice in thisselectedVertices) {
        var position = this.groundPositions[selectedVertice];
        var distance = this.selectedVertices[selectedVertice];

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

mountain.elevateMoutain.prototype.reComputeNormals = function () {
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

mountain.elevateMoutain.prototype.computeNormal = function(vertexIndex) {
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

mountain.elevateMoutain.prototype.updateSubdivisions = function (vertexIndex) {
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
