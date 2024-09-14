class Vector3 {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setThis(v: Vector3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }

  public Rotate(angle: number, axis: Axis): Vector3 {
    let matrix: Matrix3x3;
    switch (axis.axis) {
      case "x":
        matrix = new Matrix3x3(
          1,
          0,
          0,
          0,
          Math.cos(angle),
          -Math.sin(angle),
          0,
          Math.sin(angle),
          Math.cos(angle)
        );
        this.setThis(matrix.MultiplyByVector3(this));
        break;
      case "y":
        matrix = new Matrix3x3(
          Math.cos(angle),
          0,
          Math.sin(angle),
          0,
          1,
          0,
          -Math.sin(angle),
          0,
          Math.cos(angle)
        );
        this.setThis(matrix.MultiplyByVector3(this));
        break;
      case "z":
        matrix = new Matrix3x3(
          Math.cos(angle),
          -Math.sin(angle),
          0,
          Math.sin(angle),
          Math.cos(angle),
          0,
          0,
          0,
          1
        );
        this.setThis(matrix.MultiplyByVector3(this));
        break;
    }
    return this;
  }

  public MultiplyByNumber(n: number) {
    return new Vector3(this.x * n, this.y * n, this.z * n);
  }

  public getMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
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

  static distance(v1: Vector3, v2: Vector3) {
    return Math.sqrt(
      Math.pow(v1.x - v2.x, 2) +
        Math.pow(v1.y - v2.y, 2) +
        Math.pow(v1.z - v2.z, 2)
    );
  }

  static Normalize(v: Vector3) {
    return new Vector3(
      v.x / Vector3.distance(Vector3.Zero(), v),
      v.y / Vector3.distance(Vector3.Zero(), v),
      v.z / Vector3.distance(Vector3.Zero(), v)
    );
  }

  static Dot(a: Vector3, b: Vector3) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  static interpolate3D(a: Vector3, b: Vector3, c: Vector3) {
    return Vector3.Add(Vector3.Add(a, b), c).MultiplyByNumber(1 / 3);
  }
}
