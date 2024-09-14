"use strict";
class Pivot {
    constructor(center, XAxis, YAxis, ZAxis) {
        this.center = center;
        this.XAxis = XAxis;
        this.YAxis = YAxis;
        this.ZAxis = ZAxis;
    }
    getCenter() {
        return this.center;
    }
    getXAxis() {
        return this.XAxis;
    }
    getYAxis() {
        return this.YAxis;
    }
    getZAxis() {
        return this.ZAxis;
    }
    // матрица перевода в локальные координаты
    LocalCoordsMatrix() {
        return new Matrix3x3(this.XAxis.x, this.YAxis.x, this.ZAxis.x, this.XAxis.y, this.YAxis.y, this.ZAxis.y, this.XAxis.z, this.YAxis.z, this.ZAxis.z);
    }
    // матрица перевода в глобальные координаты
    GlobalCoordsMatrix() {
        return new Matrix3x3(this.XAxis.x, this.XAxis.y, this.XAxis.z, this.YAxis.x, this.YAxis.y, this.YAxis.z, this.ZAxis.x, this.ZAxis.y, this.ZAxis.z);
    }
    ToLocalCoords(global) {
        return this.LocalCoordsMatrix().MultiplyByVector3(Vector3.Sub(global, this.center));
    }
    ToGlobalCoords(local) {
        return Vector3.Add(this.GlobalCoordsMatrix().MultiplyByVector3(local), this.center);
    }
    Move(v) {
        this.center = Vector3.Add(this.center, v);
    }
    Rotate(angle, axis) {
        this.XAxis = this.XAxis.Rotate(angle, axis);
        this.YAxis = this.YAxis.Rotate(angle, axis);
        this.ZAxis = this.ZAxis.Rotate(angle, axis);
    }
    static basePivot(center) {
        return new Pivot(center, Vector3.i(), Vector3.j(), Vector3.k());
    }
}
