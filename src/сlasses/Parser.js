"use strict";
class Parser {
    static async ParseOBJ(path) {
        let vertices = [];
        let indexes = [];
        let normalIndexes = [];
        let normals = [];
        function readVertex(row) {
            const vertice = row
                .split(" ")
                .filter((x) => x !== "")
                .map((x) => x.replace("\r", ""))
                .slice(1);
            switch (row[1]) {
                case "t":
                    // texture
                    break;
                case "n":
                    normals.push(Vector3.Normalize(new Vector3(Number(vertice[0]), Number(vertice[1]), Number(vertice[2]))));
                    break;
                default:
                    vertices.push(new Vector3(Number(vertice[0]), Number(vertice[1]), Number(vertice[2])));
            }
        }
        function readPolygon(row) {
            row = row.slice(1);
            //console.log(row);
            const indexRow = row.split(" ").filter((x) => x !== "" && x !== "\r");
            const splitted = indexRow.map((x) => x.split("/").filter((x) => x !== ""));
            for (let i = 1; i < splitted.length - 1; i++) {
                indexes.push(Number(splitted[0][0]));
                indexes.push(Number(splitted[i][0]));
                indexes.push(Number(splitted[i + 1][0]));
                if (row.includes("//")) {
                    // v//n
                    normalIndexes.push(Number(splitted[0][1]));
                    normalIndexes.push(Number(splitted[i][1]));
                    normalIndexes.push(Number(splitted[i + 1][1]));
                }
                else if (splitted[0].length === 3) {
                    // v/vt/vn
                    normalIndexes.push(Number(splitted[0][2]));
                    normalIndexes.push(Number(splitted[i][2]));
                    normalIndexes.push(Number(splitted[i + 1][2]));
                }
            }
        }
        return await fetch(path)
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
            return new Model(Pivot.basePivot(Vector3.Zero()), vertices, indexes, normals, normalIndexes);
        });
    }
}
