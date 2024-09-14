"use strict";
class NoShader extends Shader {
    constructor(light) {
        super(light);
    }
    calculateColor(HSLhue) {
        let color = `hsl(${HSLhue}, 0%, 50%)`;
        return color;
    }
}
