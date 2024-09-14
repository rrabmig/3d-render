"use strict";
class Matrix3x3 {
    constructor(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
        this.elements = [a11, a12, a13, a21, a22, a23, a31, a32, a33];
    }
    MultiplyByNumber(n) {
        return new Matrix3x3(this.elements[0] * n, this.elements[1] * n, this.elements[2] * n, this.elements[3] * n, this.elements[4] * n, this.elements[5] * n, this.elements[6] * n, this.elements[7] * n, this.elements[8] * n);
    }
    MultiplyByVector3(v) {
        return new Vector3(this.elements[0] * v.x + this.elements[1] * v.y + this.elements[2] * v.z, this.elements[3] * v.x + this.elements[4] * v.y + this.elements[5] * v.z, this.elements[6] * v.x + this.elements[7] * v.y + this.elements[8] * v.z);
    }
    static det(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
        return a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 - a13 * a22 * a31 - a12 * a21 * a33 - a11 * a23 * a32;
    }
}
