"use strict";
class Camera {
    constructor(center, screendistance, observerRange, screenWidth, screenHeight) {
        this.pivot = Pivot.basePivot(center);
        this.screenDistance = screendistance;
        this.observerRange = observerRange;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }
    getPivot() {
        return this.pivot;
    }
    getScreenDistance() {
        return this.screenDistance;
    }
    getObserverRange() {
        return this.observerRange;
    }
    getScreenWidth() {
        return this.screenWidth;
    }
    getScreenHeight() {
        return this.screenHeight;
    }
    setPivot(pivot) {
        this.pivot = pivot;
    }
    setScreenDistance(screendistance) {
        this.screenDistance = screendistance;
    }
    setObserverRange(observerRange) {
        this.observerRange = observerRange;
    }
    setScreenWidth(screenWidth) {
        this.screenWidth = screenWidth;
    }
    setScreenHeight(screenHeight) {
        this.screenHeight = screenHeight;
    }
    getScale() {
        return this.screenWidth / (2 * this.screenDistance * Math.tan(this.observerRange / 2));
    }
    Move(v) {
        this.pivot.Move(v);
    }
    Rotate(angle, axis) {
        this.pivot.Rotate(angle, axis);
    }
    ScreenProjection(v) {
        let local = this.pivot.ToLocalCoords(v);
        // точки сзади камеры
        if (local.z < 0) {
            return new Vector2(NaN, NaN);
        }
        // проекция через подобные треугольники
        let delta = this.screenDistance / local.z * this.getScale();
        let projection = new Vector2(local.x * delta, local.y * delta);
        // перевод в экранную систему координат
        projection.x += this.screenWidth / 2;
        projection.y = this.screenHeight / 2 - projection.y;
        //если точка принадлежит экранной области - вернем ее
        if (projection.x >= 0 &&
            projection.x <= this.screenWidth &&
            projection.y >= 0 &&
            projection.y <= this.screenHeight) {
            return projection;
        }
        return new Vector2(NaN, NaN);
    }
}
