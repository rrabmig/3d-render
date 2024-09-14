class Icosahedron extends Primitive {
    constructor(pivot: Pivot, center: Vector3, sideLength: number) {
        const phi = (1.0 + Math.sqrt(5.0)) / 2.0;
        const multipliyer = sideLength / 2;

        let vertices = [
            new Vector3(center.x, center.y + multipliyer, center.z + multipliyer*phi),
            new Vector3(center.x, center.y + multipliyer, center.z - multipliyer*phi),
            new Vector3(center.x, center.y - multipliyer, center.z + multipliyer*phi),
            new Vector3(center.x, center.y - multipliyer, center.z - multipliyer*phi),

            new Vector3(center.x + multipliyer, center.y + multipliyer*phi, center.z),
            new Vector3(center.x + multipliyer, center.y - multipliyer*phi, center.z),
            new Vector3(center.x - multipliyer, center.y + multipliyer*phi, center.z),
            new Vector3(center.x - multipliyer, center.y - multipliyer*phi, center.z),

            new Vector3(center.x + multipliyer*phi, center.y, center.z + multipliyer),
            new Vector3(center.x - multipliyer*phi, center.y, center.z + multipliyer),
            new Vector3(center.x + multipliyer*phi, center.y, center.z - multipliyer),
            new Vector3(center.x - multipliyer*phi, center.y, center.z - multipliyer)
        ];
        const indexes = [
            11, 9, 6,
            11, 9, 5,
            11, 6, 4,
            11, 5, 2,
            11, 4, 2,
            9, 6, 3,
            6, 8, 3,
            5, 7, 2,
            4, 12, 2,
            5, 1, 9,
            6, 8, 4,
            10, 3, 1,
            10, 8, 3,
            10, 7, 1,
            10, 12, 7,
            10, 12, 8,
        ]
        
        super(pivot, vertices, indexes);
    }
}