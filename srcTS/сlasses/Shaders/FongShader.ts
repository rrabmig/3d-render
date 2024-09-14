class FongShader extends Shader {
    constructor(light: Light) {
        super(light);
    }

    calculateColor(HSLhue: number, n1: Vector3, n2: Vector3, n3: Vector3, l1: number, l2: number, l3: number) {
        // По модели фонга - для каждой точки отдельный цвет

        

        // Вклад каждой нормали в нормаль данной точки с данными барицентр. координатами
        n1 = n1.MultiplyByNumber(l1)
        n2 = n2.MultiplyByNumber(l2)
        n3 = n3.MultiplyByNumber(l3)

        // результрующая нормаль
        let n = Vector3.Add(Vector3.Add(n1, n2), n3)

        // нормализация
        n = Vector3.Normalize(n)

        // скалярное произведение направления светового луча и нормали
        let dot = Vector3.Dot(n, this.lightDirection);

        // диффузная часть 
        let HSLlightness = Math.round((0.5 + 0.5 * dot) * 100);
        let color = `hsl(${HSLhue}, 50%, ${HSLlightness}%)`;
        return color
    }
}