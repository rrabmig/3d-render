

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
            1,2,4 ,
            1,3,4 ,
            1,2,6 ,
            1,5,6 ,
            5,6,8 ,
            5,7,8 ,
            8,4,3 ,
            8,7,3 ,
            4,2,8 ,
            2,8,6 ,
            3,1,7 ,
            1,7,5
        ];
        
        super(pivot, vertices, indexes);
    }
}