class Environment {
  primitives: Primitive[] = [];
  camera: Camera;
  zbuffer: Map<string, number> = new Map();

  light: Light;
  shader: Shader;

  constructor(
    camera: Camera,
    light: Light,
    shaderType: "GuroShader" | "FongShader" | "ShadowMapShader" | "NoShader"
  ) {
    this.camera = camera;
    this.light = light;

    switch (shaderType) {
      case "GuroShader":
        this.shader = new GuroShader(this.light);
        break;
      case "FongShader":
        this.shader = new FongShader(this.light);
        break;
      case "ShadowMapShader":
        this.shader = new ShadowMapShader(this.light);
        break;
      default:
        this.shader = new NoShader(this.light);
    }
  }

  addPrimitive(primitive: Primitive) {
    this.primitives.push(primitive);
  }

  fillPixel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  StringToHexColor(number: number) {
    let hexColor = number.toString(16);
    hexColor = hexColor.padStart(6, "0");
    hexColor = hexColor.slice(0, 6);
    return `#${hexColor}`;
  }

  drawLineBrezenkhem(
    start: Vector2,
    end: Vector2,
    ctx: CanvasRenderingContext2D,
    color: string
  ) {
    // Не Алгоритм Брезенхема, я слегка изменил

    let x1 = Math.floor(Math.min(start.x, end.x));
    let x2 = Math.floor(Math.max(start.x, end.x));
    let y1 = x1 === start.x ? start.y : end.y;
    let y2 = x1 === start.x ? end.y : start.y;

    // Вертикальная линия
    if (x1 == x2) {
      for (let y = Math.floor(start.y); y <= Math.floor(end.y); y++) {
        this.fillPixel(ctx, x1, y, color);
      }
      return;
    }

    // коэф наклона
    let d = (y2 - y1) / (x2 - x1);

    // y текущий
    let y = y1;

    for (let x = x1; x <= x2; x++) {
      // y, который будет в x + 1
      let nextY = y1 + d * (x - x1);

      let minY = Math.floor(Math.min(y, nextY));
      let maxY = Math.floor(Math.max(y, nextY));

      // заполняем столбец
      for (let pixelY = minY; pixelY <= maxY; pixelY++) {
        this.fillPixel(ctx, x, pixelY, color);
      }

      // смещаем y
      y = nextY;
    }
  }

  drawPointByScreenCoords(
    point: Vector2,
    ctx: CanvasRenderingContext2D,
    color: string,
    width: number
  ) {
    // рисуем
    ctx.strokeStyle = color;
    ctx.fillRect(point.x - width / 2, point.y - width / 2, width, width);
  }

  drawPolygon(
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
    ctx: CanvasRenderingContext2D,
    color: string
  ) {
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
    this.drawLineBrezenkhem(p1, p2, ctx, color);
    this.drawLineBrezenkhem(p2, p3, ctx, color);
    this.drawLineBrezenkhem(p3, p1, ctx, color);

    // рисуем вершины
    this.drawPointByScreenCoords(p1, ctx, "#000000", 2);
    this.drawPointByScreenCoords(p2, ctx, "#000000", 2);
    this.drawPointByScreenCoords(p3, ctx, "#000000", 2);
  }

  calcZ(
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
    l1: number,
    l2: number,
    l3: number
  ): number {
    // Расчет z для точки, между v1, v2, v3 с барицентрическими координатами l1, l2, l3
    let interpolatedPoint = new Vector3(
      l1 * v1.x + l2 * v2.x + l3 * v3.x,
      l1 * v1.y + l2 * v2.y + l3 * v3.y,
      l1 * v1.z + l2 * v2.z + l3 * v3.z
    );
    // расстояние от точки до центра камеры
    let z = Vector3.distance(
      this.camera.getPivot().getCenter(),
      interpolatedPoint
    );
    return z;
  }

  computePolygon(
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
    ctx: CanvasRenderingContext2D,
    color: string,
    HSLhue?: number,
    n1?: Vector3,
    n2?: Vector3,
    n3?: Vector3
  ) {
    // проекции вершин
    let p1 = this.camera.ScreenProjection(v1);
    let p2 = this.camera.ScreenProjection(v2);
    let p3 = this.camera.ScreenProjection(v3);

    // сортировка по x проекций
    if (p1.x > p2.x) {
      [p1, p2] = [p2, p1];
      [v1, v2, n1, n2] = [v2, v1, n2, n1];
    }
    if (p2.x > p3.x) {
      [p2, p3] = [p3, p2];
      [v2, v3, n2, n3] = [v3, v2, n3, n2];
    }
    if (p1.x > p2.x) {
      [p1, p2] = [p2, p1];
      [v1, v2, n1, n2] = [v2, v1, n2, n1];
    }

    if (
      Math.floor(p1.x) == Math.floor(p2.x) &&
      Math.floor(p1.x) == Math.floor(p3.x)
    )
      return;

    // коэффициенты наклона прямых, соединящих вершины
    let d13 = (p3.y - p1.y) / (p3.x - p1.x);
    let d12 = (p2.y - p1.y) / (p2.x - p1.x);
    let d23 = (p3.y - p2.y) / (p3.x - p2.x);

    // площадь проекции полигона
    let totalArea =
      (1 / 2) *
      Math.abs(Matrix3x3.det(p1.x, p1.y, 1, p2.x, p2.y, 1, p3.x, p3.y, 1));

    // Левая половина
    // Начальные у-ки сторон 1-3 и 1-2
    let y13 = p1.y;
    let y12 = p1.y;

    // движемся по иксу
    for (let x = p1.x; x <= p2.x; x++) {
      let pixelX = Math.floor(x);

      // определяем нижнюю и верхнюю границу
      let lowY = Math.min(y13, y12);
      let highY = Math.max(y13, y12);

      // заполняем пиксели сверху вниз
      for (let y = lowY; y <= highY; y++) {
        let pixelY = Math.floor(y);

        // для каждого пикселя вычисляем барицентрические координаты
        let l1 =
          ((1 / 2) * Matrix3x3.det(x, y, 1, p2.x, p2.y, 1, p3.x, p3.y, 1)) /
          totalArea;
        let l2 =
          ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, x, y, 1, p3.x, p3.y, 1)) /
          totalArea;
        let l3 =
          ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, p2.x, p2.y, 1, x, y, 1)) /
          totalArea;

        l1 = Math.abs(l1);
        l2 = Math.abs(l2);
        l3 = Math.abs(l3);

        // вычисляем z и z буфера
        let z = this.calcZ(v1, v2, v3, l1, l2, l3);
        let zBuf = this.zbuffer.has(`${pixelX},${pixelY}`)
          ? this.zbuffer.get(`${pixelX},${pixelY}`)!
          : Number.MAX_SAFE_INTEGER;
        // если z буфера больше z пикселя, то заполняем пиксель цветом и записываем в буфер
        if (z < zBuf) {
          // если шейдер Фонга, то вычислим цвет
          if (this.shader instanceof FongShader) {
            color = this.shader.calculateColor(
              HSLhue!,
              n1!,
              n2!,
              n3!,
              l1,
              l2,
              l3
            );
          }
          this.fillPixel(ctx, pixelX, pixelY, color);
          this.zbuffer.set(`${pixelX},${pixelY}`, z);
        }
      }
      // находим y-ки сторон 1-2 и 1-3 в следующей точке dy = tan*dx | dx=1, tan = d12
      y13 += d13;
      y12 += d12;
    }

    // правая сторона аналгично
    y13 = y13;
    let y23 = p2.y;
    for (let x = p2.x; x <= p3.x; x++) {
      let pixelX = Math.floor(x);

      let lowY = Math.min(y13, y23);
      let highY = Math.max(y13, y23);

      for (let y = lowY; y <= highY; y++) {
        let pixelY = Math.floor(y);

        let l1 =
          ((1 / 2) * Matrix3x3.det(x, y, 1, p2.x, p2.y, 1, p3.x, p3.y, 1)) /
          totalArea;
        let l2 =
          ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, x, y, 1, p3.x, p3.y, 1)) /
          totalArea;
        let l3 =
          ((1 / 2) * Matrix3x3.det(p1.x, p1.y, 1, p2.x, p2.y, 1, x, y, 1)) /
          totalArea;

        l1 = Math.abs(l1);
        l2 = Math.abs(l2);
        l3 = Math.abs(l3);

        let z = this.calcZ(v1, v2, v3, l1, l2, l3);
        let zBuf = this.zbuffer.has(`${pixelX},${pixelY}`)
          ? this.zbuffer.get(`${pixelX},${pixelY}`)!
          : Number.MAX_SAFE_INTEGER;

        if (z < zBuf) {
          if (this.shader instanceof FongShader) {
            //console.log(color)
            color = this.shader.calculateColor(
              HSLhue!,
              n1!,
              n2!,
              n3!,
              l1,
              l2,
              l3
            );
          }
          this.fillPixel(ctx, pixelX, pixelY, color);
          this.zbuffer.set(`${pixelX},${pixelY}`, z);
        }
      }
      y13 += d13;
      y23 += d23;
    }
  }

  drawObject(primitive: Primitive | Model, ctx: CanvasRenderingContext2D) {
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
      let HSLhue = 40;
      let color = `hsl(${HSLhue}, 100%, 50%)`;
      // Если шейдер Гуро, то определение цвета для всего полигона
      if (this.shader instanceof GuroShader) {
        if (normals && normalIndexes) {
          // индексы нормайлей вершин
          let in1 = normalIndexes[i];
          let in2 = normalIndexes[i + 1];
          let in3 = normalIndexes[i + 2];

          // Нормали вершин
          let n1 = normals[in1 - 1];
          let n2 = normals[in2 - 1];
          let n3 = normals[in3 - 1];

          color = this.shader.calculateColor(HSLhue, n1, n2, n3);
        } else {
          throw new Error("Нормали для шейдера Гуро не найдены");
        }
      }

      // уникальный цвет для полингона
      // color = this.StringToHexColor((i1+ 234)*i2 + 234);

      // Просто цвет
      // color = "black"

      // отрисовка с z-buffer с заливкой полигона
      if (this.shader instanceof FongShader) {
        if (normals && normalIndexes) {
          // индексы нормайлей вершин
          let in1 = normalIndexes[i];
          let in2 = normalIndexes[i + 1];
          let in3 = normalIndexes[i + 2];

          // Нормали вершин
          let n1 = normals[in1 - 1];
          let n2 = normals[in2 - 1];
          let n3 = normals[in3 - 1];

          // отрисовываем полигон с параметрами для вычисления цвета по ФОнгуЫ
          this.computePolygon(v1, v2, v3, ctx, color, HSLhue, n1, n2, n3);
        } else {
          throw new Error("Нормали для шейдера Фонга не найдены");
        }
      } else {
        this.computePolygon(v1, v2, v3, ctx, color);
      }

      // Отрисовка проволочная
      //this.drawPolygon(v1, v2, v3, ctx, color);
    }
  }

  drawAll(ctx: CanvasRenderingContext2D) {
    // Очистка канваса
    ctx.clearRect(0, 0, 600, 600);

    // Отрисовка каждого объекта
    for (const primitive of this.primitives) {
      this.drawObject(primitive, ctx);
    }

    // Очистка Z-buffer
    this.zbuffer = new Map();
  }
}
