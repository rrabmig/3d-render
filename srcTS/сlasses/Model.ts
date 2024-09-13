class Model extends Primitive {
    normals: Vector3[] = [];
    normalIndexes: number[] = [];

    constructor(pivot: Pivot, vertices: Vector3[], indexes: number[], normals: Vector3[], normalIndexes: number[]) {
        super(pivot, vertices, indexes);
        this.normals = normals;
        this.normalIndexes = normalIndexes;
    }

    getNormals(): Vector3[] {
        return this.normals;
    }

    getNormalIndexes(): number[] {
        return this.normalIndexes;
    }

    public Rotate(angle: number, axis: Axis): void {
        this.pivot.Rotate(angle, axis);
        this.globalVertices = this.localVertices.map(v => this.pivot.ToGlobalCoords(v));
        this.normals = this.normals.map(n => n.Rotate(angle, axis));
    }
}