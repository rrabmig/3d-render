"use strict";
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    setThis(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }
    Rotate(angle, axis) {
        let matrix;
        switch (axis.axis) {
            case "x":
                matrix = new Matrix3x3(1, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle));
                this.setThis(matrix.MultiplyByVector3(this));
                break;
            case "y":
                matrix = new Matrix3x3(Math.cos(angle), 0, Math.sin(angle), 0, 1, 0, -Math.sin(angle), 0, Math.cos(angle));
                this.setThis(matrix.MultiplyByVector3(this));
                break;
            case "z":
                matrix = new Matrix3x3(Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
                this.setThis(matrix.MultiplyByVector3(this));
                break;
        }
        return this;
    }
    MultiplyByNumber(n) {
        return new Vector3(this.x * n, this.y * n, this.z * n);
    }
    static Zero() {
        return new Vector3(0, 0, 0);
    }
    static One() {
        return new Vector3(1, 1, 1);
    }
    static Add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static Sub(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static i() {
        return new Vector3(1, 0, 0);
    }
    static j() {
        return new Vector3(0, 1, 0);
    }
    static k() {
        return new Vector3(0, 0, 1);
    }
    static distance(v1, v2) {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) +
            Math.pow(v1.y - v2.y, 2) +
            Math.pow(v1.z - v2.z, 2));
    }
    static Normalize(v) {
        return new Vector3(v.x / Vector3.distance(Vector3.Zero(), v), v.y / Vector3.distance(Vector3.Zero(), v), v.z / Vector3.distance(Vector3.Zero(), v));
    }
    static Dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    static interpolate3D(a, b, c) {
        return Vector3.Add(Vector3.Add(a, b), c).MultiplyByNumber(1 / 3);
    }
}
