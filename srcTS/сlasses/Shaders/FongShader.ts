class FongShader extends Shader {
    constructor(light: Light) {
        super(light);
    }

    calculateColor(HSLhue: number, n1: Vector3, n2: Vector3, n3: Vector3, l1: number, l2: number, l3: number) {
        // По модели фонга - для каждой точки отдельный цвет

        

        // Вклад каждой нормали в нормаль данной точки с данными барицентр. координатами
        let R = Vector3.Dot(n1.MultiplyByNumber(l1), this.lightDirection);
        let G = Vector3.Dot(n2.MultiplyByNumber(l2), this.lightDirection);
        let B = Vector3.Dot(n3.MultiplyByNumber(l3), this.lightDirection);

        return `rgb(${Math.floor(R*255)}, ${Math.floor(G*255)}, ${Math.floor(B*255)})`
        
        // Суммарная нормаль
        // let n = Vector3.Add(Vector3.Add(l1n1, l2n2), l3n3);
        // n = Vector3.Normalize(n);

        // // скалярное произведение направления светового луча и нормали
        // let dot = Vector3.Dot(n, this.lightDirection);

        // let HSLlightness = Math.round((0.5 + 0.5 * dot) * 100);
        // let color = `hsl(${HSLhue}, 0%, ${HSLlightness}%)`;
        // return color
    }
}