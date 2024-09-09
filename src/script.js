"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const height = 600;
const width = 600;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width;
canvas.height = height;
const camera = new Camera(new Vector3(0, 0, 0), 10, 100, 600, 600);
const cube = new Cube(Pivot.basePivot(new Vector3(0, 0, 40)), Vector3.Zero(), 10);
const cube2 = new Cube(Pivot.basePivot(new Vector3(100, 100, 500)), Vector3.Zero(), 20);
const environment = new Environment(camera);
environment.addPrimitive(cube);
environment.addPrimitive(cube2);
environment.drawAll(ctx);
let turns = 20;
let back = true;
setInterval(() => {
    //console.log('frame');
    // if (turns == 0) {
    //     back = !back
    //     turns = 20
    // }
    // if (back) {
    //     cube.Move(new Vector3(0, 0, 1));
    //     turns--
    // } else {
    //     cube.Move(new Vector3(0, 0, -1));
    //     turns--
    // }
    cube.Rotate(0.03, new Axis('x'));
    cube.Rotate(0.02, new Axis('z'));
    cube2.Rotate(0.01, new Axis('y'));
    environment.drawAll(ctx);
}, 1000 / 30);
