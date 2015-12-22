// modified js -- from http://babylonjs.com/Scenes/Worldmonger/index.html

// var mountain = mountain || {};

// get the default values
var elevateMountain = function(ground){
  var ground = ground;          // mountain plane
  var radius = 15.0;           // selection radius
  var invertDirection = 1.0;   // direction for inversion
  var heightMin = -20.0;       // height min
  var heightMax = 60.0;       // max heigh of moutain
};

// elevate area direction
var elevateDirection = 1;

// attach control for user
var attachControl = function (canvas) {
    var currentPosition;    // get current position
  //  var that = this;

};


var onBeforeRender = function () {
        if (!currentPosition) {
            return;
        }

        // get current position of mouse
        var pickInfo = that.ground.getScene().pick(currentPosition.x, currentPosition.y);

        if (!pickInfo.hit)
            return;

        if (pickInfo.pickedMesh != that.ground)
            return;

      onPointerDown(evt);
      onPointerUp();
      onPointerMove(evt);
      onLostFocus();

    // elevate faces on user control
        elevateFaces(pickInfo, that.radius, 0.3);
    };

// get current position from client
    var onPointerDown = function (evt) {
        evt.preventDefault();

        currentPosition = {
            x: evt.clientX,
            y: evt.clientY
        };
    };

    var onPointerUp = function (evt) {
        evt.preventDefault();

        currentPosition = null;
    };

    var onPointerMove = function (evt) {
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

    var onLostFocus = function () {
        currentPosition = null;
    };

// add events to canvas.
    canvas.addEventListener("pointerdown", onPointerDown(), true);
    canvas.addEventListener("pointerup", onPointerUp(evt), true);
    canvas.addEventListener("pointerout", onPointerUp(), true);
    canvas.addEventListener("pointermove", onPointerMove(evt), true);
    window.addEventListener("blur", onLostFocus(), true);

     registerBeforeRender(onBeforeRender());

// detach control when user clicks the camera button
var detachControl = function (canvas) {
    canvas.removeEventListener("pointerdown", onPointerDown());
    canvas.removeEventListener("pointerup", onPointerUp(evt));
    canvas.removeEventListener("pointerout", onPointerUp(evt));
    canvas.removeEventListener("pointermove", onPointerMove(evt));
    window.removeEventListener("blur", onLostFocus());

    ground.getScene().unregisterBeforeRender(onBeforeRender());
};

// elevate mountain selections
var dataElevation = function () {
  // get faces
    if (facesOfVertices == null) {
        facesOfVertices = [];

// get vertices positions, Normals, and Indices
      var  groundVerticesPositions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      var  groundVerticesNormals = ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);
      var  groundIndices = ground.getIndices();

// store the current ground positions in ground array
        var groundPositions = [];
        var index;
        for (index = 0; index < groundVerticesPositions.length; index += 3) {
            groundPositions.push(new BABYLON.Vector3(groundVerticesPositions[index], groundVerticesPositions[index + 1], groundVerticesPositions[index + 2]));
        }

// get Face Normals
        groundFacesNormals = [];
        for (index = 0; index < ground.getTotalIndices() / 3; index++) {
            computeFaceNormal(index);
        }
// get Face vertices
        getFacesOfVertices();
    }
};




// Get Face ID Index
var getFaceVerticesIndex = function (faceID) {
    return {
        v1: groundIndices[faceID * 3],
        v2: groundIndices[faceID * 3 + 1],
        v3: groundIndices[faceID * 3 + 2]
    };
};

// Get Face Normal
var computeFaceNormal = function (face) {
    var faceInfo = getFaceVerticesIndex(face);

    var v1v2 = groundPositions[faceInfo.v1].subtract(groundPositions[faceInfo.v2]);
    var v3v2 = groundPositions[faceInfo.v3].subtract(groundPositions[faceInfo.v2]);

    var groundFacesNormals[face] = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(v1v2, v3v2));
};

// get the faces of vertices and push values into array
mountain.elevateMoutain.prototype.getFacesOfVertices = function () {
    facesOfVertices = [];
    subdivisionsOfVertices = [];
    var index;

    for (index = 0; index < groundPositions.length; index++) {
        facesOfVertices[index] = [];
        subdivisionsOfVertices[index] = [];
    }

    for (index = 0; index <  groundIndices.length; index++) {
        facesOfVertices[groundIndices[index]].push((index / 3) | 0);
    }

    for (var subIndex = 0; subIndex < ground.subMeshes.length; subIndex++) {
        var subMesh = ground.subMeshes[subIndex];
        for (index = subMesh.verticesStart; index < subMesh.verticesStart + subMesh.verticesCount; index++) {
            subdivisionsOfVertices[index].push(subMesh);
        }
    }
};

// get Sphere radius
var isBoxSphereIntersected = function(box, sphereCenter, sphereRadius) {
    var vector = BABYLON.Vector3.Clamp(sphereCenter, box.minimumWorld, box.maximumWorld);
    var num = BABYLON.Vector3.DistanceSquared(sphereCenter, vector);
    return (num <= (sphereRadius * sphereRadius));
};

// Elevate the mountain
var elevateFaces = function (pickInfo, radius, height) {
    dataElevation();
    selectedVertices = [];


    // Impact Area
    var sphereCenter = pickInfo.pickedPoint;
    sphereCenter.y = 0;
    var index;

    // Determine list of vertices
    for (var subIndex = 0; subIndex < ground.subMeshes.length; subIndex++) {
        var subMesh = ground.subMeshes[subIndex];

        if (!isBoxSphereIntersected(subMesh.getBoundingInfo().boundingBox, sphereCenter, radius)) {
            continue;
        }

        for (index = subMesh.verticesStart; index < subMesh.verticesStart + subMesh.verticesCount; index++) {
            var position = groundPositions[index];
            sphereCenter.y = position.y;

            var distance = BABYLON.Vector3.Distance(position, sphereCenter);

            if (distance < radius) {
                selectedVertices[index] = distance;
            }
        }
    }

    // Elevate vertices
    for (var selectedVertice in selectedVertices) {
        var position = groundPositions[selectedVertice];
        var distance = selectedVertices[selectedVertice];


        var fullHeight = height * direction * invertDirection;
        if (distance < radius * 0.3) {
            position.y += fullHeight;
        } else {
            position.y += fullHeight * (1.0 - (distance - radius * 0.3) / (radius * 0.7));
        }

        if (position.y > heightMax)
            position.y = heightMax;
        else if (position.y < heightMin)
            position.y = heightMin;

        groundVerticesPositions[selectedVertice * 3 + 1] = position.y;

        updateSubdivisions(selectedVertice);
    }

    // Normals
    reComputeNormals();

    // Update vertex buffer
    ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, groundVerticesPositions);
    ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind,groundVerticesNormals);
};

var reComputeNormals = function () {
    var faces = [];
    var face;

    for (var selectedVertice in selectedVertices) {
        var faceOfVertices = facesOfVertices[selectedVertice];
        for (var index = 0; index < faceOfVertices.length; index++) {
            faces[faceOfVertices[index]] = true;
        }
    }

    for (face in faces) {
        computeFaceNormal(face);
    }

    for (face in faces) {
        var faceInfo = getFaceVerticesIndex(face);
        computeNormal(faceInfo.v1);
        computeNormal(faceInfo.v2);
        computeNormal(faceInfo.v3);
    }
};

var computeNormal = function(vertexIndex) {
    var faces = facesOfVertices[vertexIndex];

    var normal = BABYLON.Vector3.Zero();
    for (var index = 0; index < faces.length; index++) {
        normal = normal.add(groundFacesNormals[faces[index]]);
    }

    normal = BABYLON.Vector3.Normalize(normal.scale(1.0 / faces.length));

    groundVerticesNormals[vertexIndex * 3] = normal.x;
    groundVerticesNormals[vertexIndex * 3 + 1] = normal.y;
    groundVerticesNormals[vertexIndex * 3 + 2] = normal.z;
};

var updateSubdivisions = function (vertexIndex) {
    for (var index = 0; index < subdivisionsOfVertices[vertexIndex].length; index++) {
        var sub = subdivisionsOfVertices[vertexIndex][index];
        var boundingBox = sub.getBoundingInfo().boundingBox;
        var boundingSphere = sub.getBoundingInfo().boundingSphere;

        if (groundPositions[vertexIndex].y < boundingBox.minimum.y) {
            boundingSphere.radius += Math.abs(groundPositions[vertexIndex].y - boundingBox.minimum.y);
            boundingBox.minimum.y = groundPositions[vertexIndex].y;
        } else if (groundPositions[vertexIndex].y > boundingBox.maximum.y) {
            boundingBox.maximum.y = groundPositions[vertexIndex].y;
        }
    }

    var boundingBox = ground.getBoundingInfo().boundingBox;
    var boundingSphere = ground.getBoundingInfo().boundingSphere;
    if (groundPositions[vertexIndex].y < boundingBox.minimum.y) {
        boundingSphere.Radius += Math.abs(groundPositions[vertexIndex].y - boundingBox.minimum.y);
        boundingBox.minimum.y = groundPositions[vertexIndex].y;
    } else if (groundPositions[vertexIndex].y > boundingBox.maximum.y) {
        boundingBox.maximum.y = groundPositions[vertexIndex].y;
    }
};
