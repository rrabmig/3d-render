class NoShader extends Shader {
    constructor(light: Light) {
        super(light);
    }

    calculateColor(HSLhue: number) {
        let color = `hsl(${HSLhue}, 0%, 50%)`;
        return color
    }
}