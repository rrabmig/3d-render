class Camera {
  pivot: Pivot;
  screenDistance: number;
  observerRange: number;
  screenWidth: number;
  screenHeight: number;

  constructor(
    center: Vector3,
    screendistance: number,
    observerRange: number,
    screenWidth: number,
    screenHeight: number
  ) {
    this.pivot = Pivot.basePivot(center);
    this.screenDistance = screendistance;
    this.observerRange = observerRange;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }

  public getPivot() {
    return this.pivot;
  }

  public getScreenDistance() {
    return this.screenDistance;
  }

  public getObserverRange() {
    return this.observerRange;
  }

  public getScreenWidth() {
    return this.screenWidth;
  }

  public getScreenHeight() {
    return this.screenHeight;
  }

  private setPivot(pivot: Pivot) {
    this.pivot = pivot;
  }

  private setScreenDistance(screendistance: number) {
    this.screenDistance = screendistance;
  }

  private setObserverRange(observerRange: number) {
    this.observerRange = observerRange;
  }

  public setScreenWidth(screenWidth: number) {
    this.screenWidth = screenWidth;
  }

  public setScreenHeight(screenHeight: number) {
    this.screenHeight = screenHeight;
  }

  public getScale(): number {
    return this.screenWidth/(2*this.screenDistance * Math.tan(this.observerRange/2));
  }

  public Move(v: Vector3): void {
    this.pivot.Move(v);
  }

  public Rotate(angle: number, axis: Axis): void {
    this.pivot.Rotate(angle, axis);
  }

  public ScreenProjection(v: Vector3): Vector2 {
    //console.log('-start-')
    //console.log(v);
    let local = this.pivot.ToLocalCoords(v);
    //console.log(local);

    // точки сзади камеры
    if (local.z < 0) {
      return new Vector2(NaN, NaN);
    }
    // проекция через подобные треугольники
    let delta = this.screenDistance / local.z * this.getScale();
    let projection = new Vector2(local.x * delta, local.y * delta);
    //console.log('В экранной плоскости', projection);
    // перевод в экранную систему координат
    projection.x += this.screenWidth / 2;
    projection.y = this.screenHeight / 2 - projection.y;
    //console.log('В экранной системе координат', projection);
    //если точка принадлежит экранной области - вернем ее
    if (
      projection.x >= 0 &&
      projection.x <= this.screenWidth &&
      projection.y >= 0 &&
      projection.y <= this.screenHeight
    ) {
      return projection;
    }
    return new Vector2(NaN, NaN);
  }
}
