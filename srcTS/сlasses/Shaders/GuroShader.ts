class GuroShader extends Shader {
    constructor(light: Light) {
        super(light);
    }

    calculateColor(HSLhue: number, n1: Vector3, n2: Vector3, n3: Vector3) {
        // По модели фонга - для всей грани один цвет

        // интерполяция нормалей вершин
        let interpolatedNormal = Vector3.interpolate3D(n1, n2, n3);

        // скалярное произведение направления светового луча и нормали
        let dot = Vector3.Dot(interpolatedNormal, this.lightDirection);

        let HSLlightness = Math.round((0.5 + 0.5 * dot) * 100);

        let color = `hsl(${HSLhue}, 50%, ${HSLlightness}%)`;

        return color
    }
}