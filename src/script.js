"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const height = 600;
const width = 600;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width;
canvas.height = height;
const camera = new Camera(new Vector3(0, 0, 0), 5, 100, width, height);
const lightDirection = Vector3.Normalize(new Vector3(-30, -80, 10));
const light = new Light(new Vector3(10, 20, 30), lightDirection, "#ffffff");
const environment = new Environment(camera, light, "FongShader");
// Настройки сцены
const scale = 0.2;
const initialPosition = new Vector3(0, 2.5, 10);
const initialRoatateXYZ = [Math.PI, 0.2, 0];
const animate = false;
const fps = 30;
// Разные сцены
startModelScene("./models/Lee.obj", scale, initialPosition, initialRoatateXYZ, animate);
//startIcosahedronScene();
//startCubesScene();
//startTriangleScene();
function startTriangleScene() {
    // передний треугольник
    const triangle = new Triangle(Pivot.basePivot(new Vector3(0, 0, 30)), [
        new Vector3(20, 0, 0),
        new Vector3(0, 0, 10),
        new Vector3(0, 20, 0),
    ]);
    triangle.Rotate(Math.PI / 3, new Axis("x"));
    triangle.Rotate(Math.PI / 5, new Axis("z"));
    triangle.Rotate(Math.PI / 7, new Axis("y"));
    triangle.Move(new Vector3(0, 0, 40));
    environment.addPrimitive(triangle);
    // задний треугольник
    const triangle2 = new Triangle(Pivot.basePivot(new Vector3(0, 0, 40)), [
        new Vector3(20, 0, 0),
        new Vector3(0, 0, 10),
        new Vector3(0, 20, 0),
    ]);
    triangle2.Rotate(Math.PI / 4, new Axis("x"));
    triangle2.Rotate(Math.PI / 5, new Axis("z"));
    triangle2.Move(new Vector3(0, 0, 60));
    environment.addPrimitive(triangle2);
    environment.drawAll(ctx);
}
function startCubesScene() {
    const cube = new Cube(Pivot.basePivot(new Vector3(0, 0, 40)), Vector3.Zero(), 10);
    cube.Rotate(Math.PI / 3, new Axis("x"));
    cube.Rotate(Math.PI / 5, new Axis("z"));
    cube.Rotate(Math.PI / 7, new Axis("y"));
    environment.addPrimitive(cube);
    environment.drawAll(ctx);
    let turns = 200;
    let back = true;
    if (animate) {
        setInterval(() => {
            if (turns == 0) {
                back = !back;
                turns = 200;
            }
            if (back) {
                cube.Move(new Vector3(0, 0, 0.2));
                turns--;
            }
            else {
                cube.Move(new Vector3(0, 0, -0.2));
                turns--;
            }
            cube.Rotate(0.005, new Axis("x"));
            cube.Rotate(0.006, new Axis("z"));
            environment.drawAll(ctx);
        }, 1000 / fps);
    }
}
function startIcosahedronScene() {
    const icosahedron1 = new Icosahedron(Pivot.basePivot(new Vector3(5, 5, 60)), Vector3.Zero(), 10);
    const icosahedron2 = new Icosahedron(Pivot.basePivot(new Vector3(-10, -10, 100)), Vector3.Zero(), 10);
    environment.addPrimitive(icosahedron1);
    environment.addPrimitive(icosahedron2);
    environment.drawAll(ctx);
    let i = 0;
    setInterval(() => {
        i++;
        if (i == 1000) {
            i = 0;
        }
        let x = ((Math.PI * 2) / 1000) * i;
        icosahedron1.Rotate(0.001, new Axis("y"));
        icosahedron1.Rotate(0.003, new Axis("x"));
        icosahedron2.Rotate(0.01, new Axis("y"));
        icosahedron2.Rotate(0.02, new Axis("z"));
        icosahedron2.Move(new Vector3(Math.cos(x) / 10, Math.sin(x) / 10, 0));
        environment.drawAll(ctx);
    }, 1000 / fps);
}
function startModelScene(path, scale, position, rotation, animate = true) {
    let MyModel = null;
    Parser.ParseOBJ(path).then((model) => {
        // начальное расположение модели
        model.Move(position);
        // Начальный поворот модели
        model.Rotate(rotation[0], new Axis("x"));
        model.Rotate(rotation[1], new Axis("y"));
        model.Rotate(rotation[2], new Axis("z"));
        //Скалирование модели
        model.Scale(scale);
        MyModel = model;
        // добавление модели и отриовка
        environment.addPrimitive(model);
        environment.drawAll(ctx);
    });
    // анимация если анимирование включено
    if (animate) {
        setInterval(() => {
            if (MyModel) {
                MyModel.Rotate(0.01, new Axis("y"));
            }
            environment.drawAll(ctx);
        }, 1000 / fps);
    }
}
