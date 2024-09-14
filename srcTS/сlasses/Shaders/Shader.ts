abstract class Shader {
    lightSource: Vector3;
    lightDirection: Vector3;
    constructor(light: Light) {
        this.lightSource = light.lightSource;
        this.lightDirection = light.lightDirection;
    }

    setLightSource(lightSource: Vector3) {
        this.lightSource = lightSource;
    }

    setLightDirection(lightDirection: Vector3) {
        this.lightDirection = lightDirection;
    }

    getLightSource() {
        return this.lightSource;
    }

    getLightDirection() {
        return this.lightDirection;
    }
}

