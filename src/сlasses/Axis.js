"use strict";
class Axis {
    constructor(axis) {
        this.axis = axis;
    }
    getAxis() {
        return this.axis;
    }
    RotateVector3(v, angle) {
        let matrix;
        switch (this.axis) {
            case 'x':
                matrix = new Matrix3x3(1, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle));
                v = matrix.MultiplyByVector3(v);
                break;
            case 'y':
                matrix = new Matrix3x3(Math.cos(angle), 0, Math.sin(angle), 0, 1, 0, -Math.sin(angle), 0, Math.cos(angle));
                v = matrix.MultiplyByVector3(v);
                break;
            case 'z':
                matrix = new Matrix3x3(Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
                v = matrix.MultiplyByVector3(v);
                break;
        }
        return v;
    }
}
