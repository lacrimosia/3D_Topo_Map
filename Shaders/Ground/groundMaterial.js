﻿var mountain = mountain || {};

(function () {
    mountain.GroundMaterial = function (name, scene, light) {
        BABYLON.Material.call(this, name, scene);
        this.light = light;

        // dark blue
      this.groundTexture = new BABYLON.Texture("Shaders/Ground/ground.jpg", scene);
      this.groundTexture.uScale = 5.0;
      this.groundTexture.vScale = 5.0;

        // green
        this.grassTexture = new BABYLON.Texture("Shaders/Ground/grass.jpg", scene);
        this.grassTexture.uScale = 5.0;
        this.grassTexture.vScale = 5.0;

        // orange
        this.snowTexture = new BABYLON.Texture("Shaders/Ground/snow.jpg", scene);
        this.snowTexture.uScale = 5.0;
        this.snowTexture.vScale = 5.0;

        // really dark blue
        this.sandTexture = new BABYLON.Texture("Shaders/Ground/sand.jpg", scene);
        this.sandTexture.uScale = 1.0;
        this.sandTexture.vScale = 1.0;

        // yellow
        this.rockTexture = new BABYLON.Texture("Shaders/Ground/rock.jpg", scene);
        this.rockTexture.uScale = 5.0;
        this.rockTexture.vScale = 5.0;

        this.blendTexture = new BABYLON.Texture("Shaders/Ground/blend.png", scene);
        this.blendTexture.uOffset = Math.random();
        this.blendTexture.vOffset = Math.random();
        this.blendTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
        this.blendTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;
        
        this.sandLimit = 20;
        this.grassLimit = 40;
        this.rockLimit = 50;
        this.snowLimit = 15;
    };

    mountain.GroundMaterial.prototype = Object.create(BABYLON.Material.prototype);

    // Properties
    mountain.GroundMaterial.prototype.needAlphaBlending = function () {
        return false;
    };

    mountain.GroundMaterial.prototype.needAlphaTesting = function () {
        return false;
    };

    // Methods
    mountain.GroundMaterial.prototype.isReady = function (mesh) {
        var engine = this._scene.getEngine();

        if (!this.groundTexture.isReady)
            return false;
        if (!this.snowTexture.isReady)
            return false;
        if (!this.sandTexture.isReady)
            return false;
        if (!this.rockTexture.isReady)
            return false;
        if (!this.grassTexture.isReady)
            return false;

        var defines = [];
        if (this._scene.clipPlane) {
            defines.push("#define CLIPPLANE");
        }

        var join = defines.join("\n");
        if (this._cachedDefines != join) {
            this._cachedDefines = join;

            this._effect = engine.createEffect("./Shaders/Ground/ground",
                ["position", "normal", "uv"],
                ["worldViewProjection", "groundMatrix", "sandMatrix", "rockMatrix", "snowMatrix", "grassMatrix", "blendMatrix", "world", "vLightPosition", "vLimits", "vClipPlane"],
                ["groundSampler", "sandSampler", "rockSampler", "snowSampler", "grassSampler", "blendSampler"],
                join);
        }

        if (!this._effect.isReady()) {
            return false;
        }

        return true;
    };

    mountain.GroundMaterial.prototype.bind = function (world, mesh) {
        this._effect.setMatrix("world", world);
        this._effect.setMatrix("worldViewProjection", world.multiply(this._scene.getTransformMatrix()));
        this._effect.setVector3("vLightPosition", this.light.position);

        // Textures
        if (this.groundTexture) {
            this._effect.setTexture("groundSampler", this.groundTexture);
            this._effect.setMatrix("groundMatrix", this.groundTexture.getTextureMatrix());
        }

        if (this.sandTexture) {
            this._effect.setTexture("sandSampler", this.sandTexture);
            this._effect.setMatrix("sandMatrix", this.sandTexture.getTextureMatrix());
        }

        if (this.rockTexture) {
            this._effect.setTexture("rockSampler", this.rockTexture);
            this._effect.setMatrix("rockMatrix", this.rockTexture.getTextureMatrix());
        }

        if (this.snowTexture) {
            this._effect.setTexture("snowSampler", this.snowTexture);
            this._effect.setMatrix("snowMatrix", this.snowTexture.getTextureMatrix());
        }

        if (this.grassTexture) {
            this._effect.setTexture("grassSampler", this.grassTexture);
            this._effect.setMatrix("grassMatrix", this.grassTexture.getTextureMatrix());
        }

        if (this.blendTexture) {
            this._effect.setTexture("blendSampler", this.blendTexture);
            this._effect.setMatrix("blendMatrix", this.blendTexture.getTextureMatrix());
        }
        this._effect.setFloat3("vLimits", this.sandLimit, this.grassLimit, this.rockLimit, this.snowLimit);

        if (this._scene.clipPlane) {
            var clipPlane = this._scene.clipPlane;
            this._effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
        }
    };

    mountain.GroundMaterial.prototype.dispose = function () {
        if (this.grassTexture) {
            this.grassTexture.dispose();
        }

        if (this.groundTexture) {
            this.groundTexture.dispose();
        }

        if (this.snowTexture) {
            this.snowTexture.dispose();
        }

        if (this.sandTexture) {
            this.sandTexture.dispose();
        }

        if (this.rockTexture) {
            this.rockTexture.dispose();
        }

        BABYLON.Material.dispose(this);
    };
})();
