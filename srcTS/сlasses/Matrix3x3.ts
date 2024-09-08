class Matrix3x3 {
    elements: [number, number, number, number, number, number, number, number, number];
    constructor(a11: number, a12: number, a13: number, a21: number, a22: number, a23: number, a31: number, a32: number, a33: number) {
        this.elements = [a11, a12, a13, a21, a22, a23, a31, a32, a33];
    }

    public MultiplyByNumber(n: number) {
        return new Matrix3x3(
            this.elements[0] * n, this.elements[1] * n, this.elements[2] * n,
            this.elements[3] * n, this.elements[4] * n, this.elements[5] * n,
            this.elements[6] * n, this.elements[7] * n, this.elements[8] * n
        );
    }

    public MultiplyByVector3(v: Vector3) {
        return new Vector3(
            this.elements[0] * v.x + this.elements[1] * v.y + this.elements[2] * v.z,
            this.elements[3] * v.x + this.elements[4] * v.y + this.elements[5] * v.z,
            this.elements[6] * v.x + this.elements[7] * v.y + this.elements[8] * v.z
        );
    }
    
}