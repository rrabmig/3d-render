"use strict";
class Primitive {
    constructor(pivot, localVertices, indexes) {
        this.pivot = pivot;
        this.localVertices = localVertices;
        this.globalVertices = localVertices.map(v => pivot.ToGlobalCoords(v));
        this.indexes = indexes;
    }
    getPivot() {
        return this.pivot;
    }
    getLocalVertices() {
        return this.localVertices;
    }
    getGlobalVertices() {
        return this.globalVertices;
    }
    getIndexes() {
        return this.indexes;
    }
    setLocalVertices(vertices) {
        this.localVertices = vertices;
        this.globalVertices = vertices.map(v => this.pivot.ToGlobalCoords(v));
    }
    setGlobalVertices(vertices) {
        this.globalVertices = vertices;
        this.localVertices = vertices.map(v => this.pivot.ToLocalCoords(v));
    }
    setIndexes(indexes) {
        this.indexes = indexes;
    }
    Move(v) {
        this.pivot.Move(v);
        for (let i = 0; i < this.localVertices.length; i++) {
            this.globalVertices[i] = this.pivot.ToGlobalCoords(this.localVertices[i]);
        }
    }
    Rotate(angle, axis) {
        this.pivot.Rotate(angle, axis);
        this.globalVertices = this.localVertices.map(v => this.pivot.ToGlobalCoords(v));
    }
    Scale(k) {
        for (let i = 0; i < this.localVertices.length; i++) {
            this.localVertices[i].MultiplyByNumber(k);
        }
        this.globalVertices = this.localVertices.map(v => this.pivot.ToGlobalCoords(v));
    }
}
