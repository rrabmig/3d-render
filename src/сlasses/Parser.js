"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Parser {
    static ParseOBJ(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let vertices = [];
            let indexes = [];
            let consoled = false;
            function logNtimes(n) {
                n = n;
                return function (text) {
                    if (n > 0) {
                        console.log(text);
                        n--;
                    }
                };
            }
            const log = logNtimes(10);
            function readVertex(row) {
                const vertice = row
                    .split(" ")
                    .filter((x) => x !== "")
                    .map((x) => x.replace("\r", "")).slice(1);
                switch (row[1]) {
                    case 't':
                        // texture
                        break;
                    case 'n':
                        // normal
                        break;
                    default:
                        vertices.push(new Vector3(Number(vertice[0]), Number(vertice[1]), Number(vertice[2])));
                }
            }
            function readPolygon(row) {
                row = row.slice(1);
                const indexRow = row.split(" ").filter((x) => x !== "" && x !== "\r");
                //console.log("start poly")
                //console.log(row)
                const splitted = indexRow.map((x) => x.split("/"));
                //console.log(splitted)
                for (let i = 1; i < splitted.length - 1; i++) {
                    //console.log(Number(splitted[0][0]), Number(splitted[i][1]), Number(splitted[i + 1][2]))
                    indexes.push(Number(splitted[0][0]));
                    indexes.push(Number(splitted[i][0]));
                    indexes.push(Number(splitted[i + 1][0]));
                }
            }
            return yield fetch(path)
                .then((response) => response.text())
                .then((data) => {
                let objects = data.split("# object");
                for (let object of objects) {
                    let rows = object.split("\n");
                    for (let row of rows) {
                        switch (row[0]) {
                            case "v":
                                readVertex(row);
                                break;
                            case "f":
                                readPolygon(row);
                                break;
                        }
                    }
                }
                return new Model(Pivot.basePivot(Vector3.Zero()), vertices, indexes);
            });
        });
    }
}
