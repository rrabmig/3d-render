"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const height = 600;
const width = 600;
const fps = 30;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width;
canvas.height = height;
const camera = new Camera(new Vector3(0, 0, 0), 5, 100, width, height);
const environment = new Environment(camera);
// TEST CODE 1
const cube = new Cube(Pivot.basePivot(new Vector3(0, 0, 40)), Vector3.Zero(), 10);
const cube2 = new Cube(Pivot.basePivot(new Vector3(100, 100, 500)), Vector3.Zero(), 20);
environment.addPrimitive(cube);
environment.addPrimitive(cube2);
let turns = 200;
let back = true;
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
    cube.Rotate(0.005, new Axis('x'));
    cube.Rotate(0.006, new Axis('z'));
    cube2.Rotate(0.1, new Axis('y'));
    cube2.Rotate(0.05, new Axis('x'));
    environment.drawAll(ctx);
}, 1000 / fps);
// //TEST 2
// const icosahedron1 = new Icosahedron(
//     Pivot.basePivot(new Vector3(5, 5, 60)),
//     Vector3.Zero(),
//     10
// )
// const icosahedron2 = new Icosahedron(
//     Pivot.basePivot(new Vector3(-10, -10, 100)),
//     Vector3.Zero(),
//     10
// )
// environment.addPrimitive(icosahedron1);
// environment.addPrimitive(icosahedron2);
// environment.drawAll(ctx);
// let i = 0
// setInterval(() => {
//     i++
//     if (i == 1000) {
//         i = 0
//     }
//     let x = Math.PI*2 / 1000 * i
//     icosahedron1.Rotate(0.001, new Axis('y'));
//     icosahedron1.Rotate(0.003, new Axis('x'));
//     icosahedron2.Rotate(0.01, new Axis('y'));
//     icosahedron2.Rotate(0.02, new Axis('z'));
//     icosahedron2.Move(new Vector3(Math.cos(x)/10, Math.sin(x)/10, 0));
//     environment.drawAll(ctx);
// }, 1000 / fps);
// TEST 3
// let model: Model | null = null
// Parser.ParseOBJ("./models/Cyborg_Weapon.obj")
// .then(model => {
//     model.Move(new Vector3(0, 0, 200));
//     model.Rotate(Math.PI, new Axis('x'));
//     model.Rotate(Math.PI/2, new Axis('y'));
//     model.Scale(50)
//     environment.addPrimitive(model);
//     environment.drawAll(ctx, 2, 2, false);
// })
// setInterval(() => {
//     if (chairModel) {
//         chairModel.Rotate(0.01, new Axis('y'));
//     }
//     environment.drawAll(ctx, 2, 2, false);
// }, 1000 / fps);
