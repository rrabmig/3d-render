"use strict";
class GuroShader extends Shader {
    constructor(light) {
        super(light);
    }
    calculateColor(HSLhue, n1, n2, n3) {
        // По модели фонга - для всей грани один цвет
        // интерполяция нормалей вершин
        let interpolatedNormal = Vector3.interpolate3D(n1, n2, n3);
        // скалярное произведение направления светового луча и нормали
        let dot = Vector3.Dot(interpolatedNormal, this.lightDirection);
        let HSLlightness = Math.round((0.5 + 0.5 * dot) * 100);
        let color = `hsl(${HSLhue}, 0%, ${HSLlightness}%)`;
        return color;
    }
}
