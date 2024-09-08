class Pivot {
  // точка центра
  center: Vector3;
  // векторы лонального базиса - локальные координатные оси
  XAxis: Vector3;
  YAxis: Vector3;
  ZAxis: Vector3;

  constructor(center: Vector3, XAxis: Vector3, YAxis: Vector3, ZAxis: Vector3) {
    this.center = center;
    this.XAxis = XAxis;
    this.YAxis = YAxis;
    this.ZAxis = ZAxis;
  }

  public getCenter() {
    return this.center;
  }

  public getXAxis() {
    return this.XAxis;
  }

  public getYAxis() {
    return this.YAxis;
  }

  public getZAxis() {
    return this.ZAxis;
  }

  // матрица перевода в локальные координаты
  public LocalCoordsMatrix() {
    return new Matrix3x3(
      this.XAxis.x, this.YAxis.x, this.ZAxis.x,
      this.XAxis.y, this.YAxis.y, this.ZAxis.y,
      this.XAxis.z, this.YAxis.z, this.ZAxis.z
    );
  }

  // матрица перевода в глобальные координаты
  public GlobalCoordsMatrix(): Matrix3x3 {
    return new Matrix3x3(
      this.XAxis.x, this.XAxis.y, this.XAxis.z,
      this.YAxis.x, this.YAxis.y, this.YAxis.z,
      this.ZAxis.x, this.ZAxis.y, this.ZAxis.z
    );
  }

  public ToLocalCoords(global: Vector3): Vector3 {
    return this.LocalCoordsMatrix().MultiplyByVector3(Vector3.Sub(global, this.center));
  }

  public ToGlobalCoords(local: Vector3): Vector3 {
    return Vector3.Add(this.GlobalCoordsMatrix().MultiplyByVector3(local), this.center);
  }

  public Move(v: Vector3): void {
    this.center = Vector3.Add(this.center, v);
  }

  public Rotate(angle: number, axis: Axis): void {
    this.XAxis.Rotate(angle, axis);
    this.YAxis.Rotate(angle, axis);
    this.ZAxis.Rotate(angle, axis);
  }

  public static basePivot(center: Vector3) {
    return new Pivot(center, Vector3.i(), Vector3.j(), Vector3.k());
  }
}
