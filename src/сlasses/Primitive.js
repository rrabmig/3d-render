"use strict";
class Primitive {
    constructor(vertices, indexes) {
        this.vertices = vertices;
        this.indexes = indexes;
    }
    getVertices() {
        return this.vertices;
    }
    getIndexes() {
        return this.indexes;
    }
    setVertices(vertices) {
        this.vertices = vertices;
    }
    setIndexes(indexes) {
        this.indexes = indexes;
    }
}
