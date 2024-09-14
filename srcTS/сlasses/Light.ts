class Light {
    lightSource: Vector3;
    lightDirection: Vector3;
    lightColor: string;
    
    constructor(lightSource: Vector3, lightDirection: Vector3, lightColor: string) {
        this.lightSource = lightSource;
        this.lightDirection = lightDirection;
        this.lightColor = lightColor;
    }
    
}