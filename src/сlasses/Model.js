"use strict";
class Model extends Primitive {
    constructor(pivot, vertices, indexes, normals, normalIndexes) {
        super(pivot, vertices, indexes);
        this.normals = [];
        this.normalIndexes = [];
        this.normals = normals;
        this.normalIndexes = normalIndexes;
    }
    getNormals() {
        return this.normals;
    }
    getNormalIndexes() {
        return this.normalIndexes;
    }
    Rotate(angle, axis) {
        this.pivot.Rotate(angle, axis);
        this.globalVertices = this.localVertices.map(v => this.pivot.ToGlobalCoords(v));
        this.normals = this.normals.map(n => n.Rotate(angle, axis));
    }
}
