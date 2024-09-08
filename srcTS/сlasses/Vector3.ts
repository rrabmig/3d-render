class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public Rotate(angle: number, axis: Axis): void {
        // TODO
    }

    public MultiplyByNumber(n: number) {
        return new Vector3(this.x * n, this.y * n, this.z * n);
    }

    static Zero() {
        return new Vector3(0, 0, 0);
    }

    static One() {
        return new Vector3(1, 1, 1);
    }

    static Add(a: Vector3, b: Vector3) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static Sub(a: Vector3, b: Vector3) {
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


}