

class Cube extends Primitive {
    constructor(pivot: Pivot, center: Vector3, sideLength: number) {
        const d = sideLength / 2;
        
        let vertices = [
            new Vector3(center.x + d, center.y + d, center.z + d),
            new Vector3(center.x + d, center.y + d, center.z - d),
            new Vector3(center.x + d, center.y - d, center.z + d),
            new Vector3(center.x + d, center.y - d, center.z - d),

            new Vector3(center.x - d, center.y - d, center.z - d),
            new Vector3(center.x - d, center.y - d, center.z + d),
            new Vector3(center.x - d, center.y + d, center.z - d),
            new Vector3(center.x - d, center.y + d, center.z + d),
        ];
        const indexes = [
            1, 2, 3,
            2, 3, 4,
            1, 3, 6,
            1, 6, 8,
            5, 6, 7,
            6, 7, 8,
            3, 4, 5,
            4, 2, 7
        ]
        
        super(pivot, vertices, indexes);
    }
}