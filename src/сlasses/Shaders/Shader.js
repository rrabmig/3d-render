"use strict";
class Shader {
    constructor(light) {
        this.lightSource = light.lightSource;
        this.lightDirection = light.lightDirection;
    }
    setLightSource(lightSource) {
        this.lightSource = lightSource;
    }
    setLightDirection(lightDirection) {
        this.lightDirection = lightDirection;
    }
    getLightSource() {
        return this.lightSource;
    }
    getLightDirection() {
        return this.lightDirection;
    }
}
