class Axis {
  axis: "x" | "y" | "z";
  constructor(axis: "x" | "y" | "z") {
    this.axis = axis;
  }

  public getAxis() {
    return this.axis;
  }
}
