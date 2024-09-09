class Environment {
    primitives: Primitive[] = []
    camera: Camera

    constructor(camera: Camera) {
        this.camera = camera;
    }

    addPrimitive(primitive: Primitive) {
        this.primitives.push(primitive);
    }

    

    drawLineByScreenCoords(start: Vector2, end: Vector2, ctx: CanvasRenderingContext2D, color?: string) {
        color = color? color : Math.floor(Math.random()*16777215).toString(16);
        ctx.strokeStyle = color
        // рисуем
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    drawPointByScreenCoords(point: Vector2, ctx: CanvasRenderingContext2D, color?: string, width?: number) {
        color = color? color : Math.floor(Math.random()*16777215).toString(16);
        ctx.strokeStyle = color
        width = width? width : 5;
        // рисуем
        ctx.fillRect(point.x - width/2, point.y - width/2, width, width);
    }

    drawPolygon(v1: Vector3, v2: Vector3, v3: Vector3, ctx: CanvasRenderingContext2D, color?: string) {
        color = color? color : Math.floor(Math.random()*16777215).toString(16);
        ctx.strokeStyle = color
        // проекции вершин 
        let p1 = this.camera.ScreenProjection(v1);
        let p2 = this.camera.ScreenProjection(v2);
        let p3 = this.camera.ScreenProjection(v3);

        // рисуем линии
        this.drawLineByScreenCoords(p1, p2, ctx);
        this.drawLineByScreenCoords(p2, p3, ctx);
        this.drawLineByScreenCoords(p3, p1, ctx);

        // рисуем вершины
        this.drawPointByScreenCoords(p1, ctx);
        this.drawPointByScreenCoords(p2, ctx);
        this.drawPointByScreenCoords(p3, ctx);

        ctx.stroke();
    }

    drawObject(primitive: Primitive, ctx: CanvasRenderingContext2D, color?: string) {
        color = color? color : Math.floor(Math.random()*16777215).toString(16);
        let indexes = primitive.getIndexes();
        let vertices = primitive.getGlobalVertices();
        for (let i = 0; i < indexes.length; i+=3) {
            // индексы вершин полгона
            let i1 = indexes[i];
            let i2 = indexes[i + 1];
            let i3 = indexes[i + 2];
            // вершины полгона
            let v1 = vertices[i1 - 1];
            let v2 = vertices[i2 - 1];
            let v3 = vertices[i3 - 1];

            this.drawPolygon(v1, v2, v3, ctx, color);


        }
    }
    
    drawAll(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, 600, 600);
        // ctx.fillRect(100, 100, 10, 10);
        ctx.fillStyle = "black";
        for (const primitive of this.primitives) {
            this.drawObject(primitive, ctx);
        }
    }
    
}