"use strict";
class Environment {
    constructor(camera) {
        this.primitives = [];
        this.camera = camera;
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
    drawPointByScreenCoords(point, ctx, color, width, i) {
        color = color ? color : '#000000';
        ctx.strokeStyle = color;
        width = width ? width : 5;
        // рисуем
        ctx.fillRect(point.x - width / 2, point.y - width / 2, width, width);
        if (i) {
            ctx.fillStyle = '#000000';
            ctx.font = '12px serif';
            ctx.fillText(i.toString(), point.x + 10, point.y + 10);
        }
    }
    drawPolygon(v1, v2, v3, ctx, pointwidth, color, i1, i2, i3) {
        color = color ? color : Math.floor(Math.random() * 16777215).toString(16);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        // проекции вершин 
        let p1 = this.camera.ScreenProjection(v1);
        let p2 = this.camera.ScreenProjection(v2);
        let p3 = this.camera.ScreenProjection(v3);
        // рисуем линии
        ctx.beginPath();
        this.drawLineByScreenCoords(p1, p2, ctx);
        this.drawLineByScreenCoords(p2, p3, ctx);
        this.drawLineByScreenCoords(p3, p1, ctx);
        ctx.fill();
        ctx.stroke();
        // рисуем вершины
        this.drawPointByScreenCoords(p1, ctx, '#000000', pointwidth, i1);
        this.drawPointByScreenCoords(p2, ctx, '#000000', pointwidth, i2);
        this.drawPointByScreenCoords(p3, ctx, '#000000', pointwidth, i3);
    }
    drawObject(primitive, ctx, pointwidth, showIndexes = false, color) {
        //color = color? color : `#${Math.floor(Math.random()*16777215).toString(16)}`;
        let indexes = primitive.getIndexes();
        let vertices = primitive.getGlobalVertices();
        for (let i = 0; i < indexes.length; i += 3) {
            // индексы вершин полгона
            let i1 = indexes[i];
            let i2 = indexes[i + 1];
            let i3 = indexes[i + 2];
            // вершины полгона
            let v1 = vertices[i1 - 1];
            let v2 = vertices[i2 - 1];
            let v3 = vertices[i3 - 1];
            if (showIndexes) {
                this.drawPolygon(v1, v2, v3, ctx, pointwidth, color, i1, i2, i3);
            }
            else {
                this.drawPolygon(v1, v2, v3, ctx, pointwidth, color);
            }
        }
    }
    drawAll(ctx, linewidth, pointwidth, showIndexes) {
        // dafault
        ctx.lineWidth = linewidth ? linewidth : 1;
        pointwidth = pointwidth ? pointwidth : 5;
        showIndexes = showIndexes ? showIndexes : false;
        ctx.clearRect(0, 0, 600, 600);
        ctx.fillStyle = "black";
        for (const primitive of this.primitives) {
            this.drawObject(primitive, ctx, pointwidth, showIndexes);
        }
    }
}
