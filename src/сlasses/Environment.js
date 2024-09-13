"use strict";
class Environment {
    constructor(camera, light) {
        this.primitives = [];
        this.zbuffer = new Map();
        this.camera = camera;
        this.light = light
            ? light
            : new Vector3(Math.sqrt(0.33), Math.sqrt(0.33), Math.sqrt(0.33));
    }
    fillPixel(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }
    StringToHexColor(number) {
        let hexColor = number.toString(16);
        hexColor = hexColor.padStart(6, "0");
        hexColor = hexColor.slice(0, 6);
        return `#${hexColor}`;
    }
    drawLineBrezenkhem(start, end, ctx, color) {
        // Не Алгоритм Брезенхема, я модифицировал
        color = color ? color : "#000000";
        let x1;
        let x2;
        let y1;
        let y2;
        if (start.x >= end.x) {
            x1 = Math.floor(end.x);
            y1 = Math.floor(end.y);
            x2 = Math.floor(start.x);
            y2 = Math.floor(start.y);
        }
        else {
            x1 = Math.floor(start.x);
            y1 = Math.floor(start.y);
            x2 = Math.floor(end.x);
            y2 = Math.floor(end.y);
        }
        // vertical line
        if (x1 == x2) {
            for (let y = Math.floor(start.y); y <= Math.floor(end.y); y++) {
                this.fillPixel(ctx, x1, y, color);
            }
            return;
        }
        let d = (y2 - y1) / (x2 - x1);
        let y = y1;
        for (let x = x1; x <= x2; x++) {
            let nextY = y1 + d * (x - x1);
            if (d > 0) {
                for (let pixelY = Math.floor(y); pixelY <= Math.floor(nextY); pixelY++) {
                    this.fillPixel(ctx, x, pixelY, color);
                }
            }
            else {
                for (let pixelY = Math.floor(y); pixelY >= Math.floor(nextY); pixelY--) {
                    this.fillPixel(ctx, x, pixelY, color);
                }
            }
            y = nextY;
        }
    }
    addPrimitive(primitive) {
        this.primitives.push(primitive);
    }
    drawLineByScreenCoords(start, end, ctx, color) {
        color = color ? color : Math.floor(Math.random() * 16777215).toString(16);
        ctx.strokeStyle = color;
        // рисуем
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        //ctx.stroke();
    }
    drawPointByScreenCoords(point, ctx, color, width) {
        // рисуем
        ctx.strokeStyle = color;
        ctx.fillRect(point.x - width / 2, point.y - width / 2, width, width);
    }
    drawPolygon(v1, v2, v3, ctx, pointwidth, color, i1, i2, i3) {
        color = color ? color : Math.floor(Math.random() * 16777215).toString(16);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        // проекции вершин
        let p1 = this.camera.ScreenProjection(v1);
        let p2 = this.camera.ScreenProjection(v2);
        let p3 = this.camera.ScreenProjection(v3);
        // сортировка по x
        [p1, p2, p3] = [p1, p2, p3].sort((a, b) => a.x - b.x);
        // рисуем линии
        color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        this.drawLineBrezenkhem(p1, p2, ctx, color);
        this.drawLineBrezenkhem(p2, p3, ctx, color);
        this.drawLineBrezenkhem(p3, p1, ctx, color);
        // рисуем вершины
        this.drawPointByScreenCoords(p1, ctx, "#000000", pointwidth);
        this.drawPointByScreenCoords(p2, ctx, "#000000", pointwidth);
        this.drawPointByScreenCoords(p3, ctx, "#000000", pointwidth);
    }
    calcZ(v1, v2, v3, l1, l2, l3) {
        // Расчет z для точки, между v1, v2, v3 с барицентрическими координатами l1, l2, l3
        let interpolatedPoint = new Vector3(l1 * v1.x + l2 * v2.x + l3 * v3.x, l1 * v1.y + l2 * v2.y + l3 * v3.y, l1 * v1.z + l2 * v2.z + l3 * v3.z);
        // расстояние от точки до центра камеры
        let z = Vector3.distance(this.camera.getPivot().getCenter(), interpolatedPoint);
        return z;
    }
    computePolygon(v1, v2, v3, ctx, color) {
        // проекции вершин
        let p1 = this.camera.ScreenProjection(v1);
        let p2 = this.camera.ScreenProjection(v2);
        let p3 = this.camera.ScreenProjection(v3);
        // сортировка по x проекций
        if (p1.x > p2.x)
            [p1, p2] = [p2, p1];
        [v1, v2] = [v2, v1];
        if (p2.x > p3.x)
            [p2, p3] = [p3, p2];
        [v2, v3] = [v3, v2];
        if (p1.x > p2.x)
            [p1, p2] = [p2, p1];
        [v1, v2] = [v2, v1];
        // коэффициенты наклона прямых, соединящих вершины
        let d13 = (p3.y - p1.y) / (p3.x - p1.x);
        let d12 = (p2.y - p1.y) / (p2.x - p1.x);
        let d23 = (p3.y - p2.y) / (p3.x - p2.x);
        // площадь проекции полигона
        let totalArea = (1 / 2) *
            Math.abs(Matrix3x3.det(p1.x, p1.y, 1, p2.x, p2.y, 1, p3.x, p3.y, 1));
        // левая сторона
        let y13 = p1.y;
        let y12 = p1.y;
        for (let x = p1.x; x <= p2.x; x++) {
            let pixelX = Math.floor(x);
            let lowY = Math.min(y13, y12);
            let highY = Math.max(y13, y12);
            for (let y = lowY; y <= highY; y++) {
                let pixelY = Math.floor(y);
                let l1 = ((1 / 2) * Matrix3x3.det(x, y, 1, p2.x, p2.y, 1, p3.x, p3.y, 1)) /
                    totalArea;
                let l2 = ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, x, y, 1, p3.x, p3.y, 1)) /
                    totalArea;
                let l3 = ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, p2.x, p2.y, 1, x, y, 1)) /
                    totalArea;
                let z = this.calcZ(v1, v2, v3, l1, l2, l3);
                if (this.zbuffer.has(`${pixelX},${pixelY}`)) {
                    let zBuf = this.zbuffer.get(`${pixelX},${pixelY}`);
                    if (z < zBuf) {
                        this.fillPixel(ctx, pixelX, pixelY, color);
                        this.zbuffer.set(`${pixelX},${pixelY}`, z);
                    }
                }
                else {
                    this.zbuffer.set(`${pixelX},${pixelY}`, z);
                    this.fillPixel(ctx, pixelX, pixelY, color);
                }
            }
            y13 += d13;
            y12 += d12;
        }
        // правая сторона
        y13 = y13;
        let y23 = p2.y;
        for (let x = p2.x; x <= p3.x; x++) {
            let pixelX = Math.floor(x);
            let lowY = Math.min(y13, y23);
            let highY = Math.max(y13, y23);
            for (let y = lowY; y <= highY; y++) {
                let pixelY = Math.floor(y);
                let l1 = ((1 / 2) * Matrix3x3.det(x, y, 1, p2.x, p2.y, 1, p3.x, p3.y, 1)) /
                    totalArea;
                let l2 = ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, x, y, 1, p3.x, p3.y, 1)) /
                    totalArea;
                let l3 = ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, p2.x, p2.y, 1, x, y, 1)) /
                    totalArea;
                let z = this.calcZ(v1, v2, v3, l1, l2, l3);
                if (this.zbuffer.has(`${pixelX},${pixelY}`)) {
                    let zBuf = this.zbuffer.get(`${pixelX},${pixelY}`);
                    if (z < zBuf) {
                        this.fillPixel(ctx, pixelX, pixelY, color);
                        this.zbuffer.set(`${pixelX},${pixelY}`, z);
                    }
                }
                else {
                    this.zbuffer.set(`${pixelX},${pixelY}`, z);
                    this.fillPixel(ctx, pixelX, pixelY, color);
                }
            }
            y13 += d13;
            y23 += d23;
        }
    }
    drawObject(primitive, ctx, pointwidth, showIndexes = false, color) {
        // Получаем индексы и вершины полгона
        let indexes = primitive.getIndexes();
        let vertices = primitive.getGlobalVertices();
        // Если это модель (из .obj), то получаем нормали
        let normals;
        let normalIndexes;
        if (primitive instanceof Model) {
            normals = primitive.getNormals();
            normalIndexes = primitive.getNormalIndexes();
        }
        // Обрабатываем каждый полгон
        for (let i = 0; i < indexes.length; i += 3) {
            // индексы вершин полгона
            let i1 = indexes[i];
            let i2 = indexes[i + 1];
            let i3 = indexes[i + 2];
            // вершины полгона
            let v1 = vertices[i1 - 1];
            let v2 = vertices[i2 - 1];
            let v3 = vertices[i3 - 1];
            // определение цвета
            let HSLhue = 30;
            if (normals && normalIndexes) {
                // индексы нормайлей вершин
                let in1 = normalIndexes[i];
                let in2 = normalIndexes[i + 1];
                let in3 = normalIndexes[i + 2];
                // Нормали вершин
                let n1 = normals[in1 - 1];
                let n2 = normals[in2 - 1];
                let n3 = normals[in3 - 1];
                // интерполяция нормалей вершин
                let interpolatedNormal = Vector3.interpolate3D(n1, n2, n3);
                // скалярное произведение направления светового луча и нормали
                let dot = Vector3.Dot(interpolatedNormal, this.light);
                let HSLlightness = Math.round((0.5 + 0.5 * dot) * 100);
                color = `hsl(${HSLhue}, 0%, ${HSLlightness}%)`;
            }
            else {
                color = "black";
            }
            // уникальный цвет для полингона
            // color = this.StringToHexColor((i1+ 234)*i2 + 234);
            // Просто цвет
            // color = "black"
            // отрисовка с z-buffer с заливкой полигона
            this.computePolygon(v1, v2, v3, ctx, color);
            // Отрисовка проволочная
            // this.drawPolygon(v1, v2, v3, ctx, pointwidth, color, i1, i2, i3);
        }
    }
    drawAll(ctx, linewidth, pointwidth, showIndexes) {
        // dafault
        ctx.lineWidth = linewidth ? linewidth : 1;
        pointwidth = pointwidth ? pointwidth : 5;
        showIndexes = showIndexes ? showIndexes : false;
        ctx.clearRect(0, 0, 600, 600);
        for (const primitive of this.primitives) {
            this.drawObject(primitive, ctx, pointwidth, showIndexes);
        }
        // Очистка Z-buffer
        this.zbuffer = new Map();
    }
}
