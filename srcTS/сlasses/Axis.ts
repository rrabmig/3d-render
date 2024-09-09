class Axis {
    axis: 'x' | 'y' | 'z'
    constructor(axis: 'x' | 'y' | 'z') {
        this.axis = axis
    }

    public getAxis() {
        return this.axis
    }

    public RotateVector3(v: Vector3, angle: number): Vector3 {
        
        let matrix: Matrix3x3
        switch (this.axis) {
            case 'x':
                matrix = new Matrix3x3(1, 0, 0,
                     0, Math.cos(angle), -Math.sin(angle),
                      0, Math.sin(angle), Math.cos(angle)
                );
                v = matrix.MultiplyByVector3(v);
                break;
            case 'y':
                matrix = new Matrix3x3(Math.cos(angle), 0, Math.sin(angle),
                     0, 1, 0,
                     -Math.sin(angle), 0, Math.cos(angle)
                );
                v = matrix.MultiplyByVector3(v);
                break;
            case 'z':
                matrix = new Matrix3x3(Math.cos(angle), -Math.sin(angle), 0,
                     Math.sin(angle), Math.cos(angle), 0,
                     0, 0, 1
                );
                v = matrix.MultiplyByVector3(v);
                break;
        }
        return v
    }
}