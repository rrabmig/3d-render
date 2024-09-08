

abstract class Primitive {
    // локальнй базис объекта
    pivot: Pivot;
    // локальные координаты вершин
    localVertices: Vector3[];
    // глобальные координаты вершин
    globalVertices: Vector3[];
    // индексы вершин
    indexes: number[];

    constructor(pivot: Pivot, localVertices: Vector3[], indexes: number[]) {
        this.pivot = pivot;
        this.localVertices = localVertices;
        this.globalVertices = localVertices.map(v => pivot.ToGlobalCoords(v));
        this.indexes = indexes;
    }

    public getPivot() {
        return this.pivot;
    }

    public getLocalVertices() {
        return this.localVertices;
    }

    public getGlobalVertices() {
        return this.globalVertices;
    }

    public getIndexes() {
        return this.indexes;
    }

    protected setLocalVertices(vertices: Vector3[]) {
        this.localVertices = vertices;
        this.globalVertices = vertices.map(v => this.pivot.ToGlobalCoords(v));
    }

    protected setGlobalVertices(vertices: Vector3[]) {
        this.globalVertices = vertices;
        this.localVertices = vertices.map(v => this.pivot.ToLocalCoords(v));
    }

    protected setIndexes(indexes: number[]) {
        this.indexes = indexes;
    }

    public Move(v: Vector3): void {
        this.pivot.Move(v);
        for (let i = 0; i < this.localVertices.length; i++) {
            this.localVertices[i] = Vector3.Add(this.localVertices[i], v);
        }
    }

    public Rotate(angle: number, axis: Axis): void {
        this.pivot.Rotate(angle, axis);
        this.globalVertices = this.localVertices.map(v => this.pivot.ToGlobalCoords(v));
    }

    public Scale(k: number): void {
        for (let i = 0; i < this.localVertices.length; i++) {
            this.localVertices[i].MultiplyByNumber(k);
        }
        this.globalVertices = this.localVertices.map(v => this.pivot.ToGlobalCoords(v));
    }


}