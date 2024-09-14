abstract class Parser {
  // Parser - должен парсить файл и возвращать содержащуюся в нем модель в Model

  static async ParseOBJ(path: string) {
    // Пустые массиивы для получения данных из .obj файла
    let vertices: Vector3[] = [];
    let indexes: number[] = [];

    let normals: Vector3[] = [];
    let normalIndexes: number[] = [];

    // Считывание вершины из строки вида "v..."
    function readVertex(row: string): void {
      const vertice = row
        .split(" ")
        .filter((x) => x !== "")
        .map((x) => x.replace("\r", ""))
        .slice(1);

      // Смотрим на вторую литеру
      switch (row[1]) {
        // t - texture vertex
        case "t":
          // todo
          break;
        // n - vertex normal
        case "n":
          normals.push(
            Vector3.Normalize(
              new Vector3(
                Number(vertice[0]),
                Number(vertice[1]),
                Number(vertice[2])
              )
            )
          );
          break;

        // просто v - vertex
        default:
          vertices.push(
            new Vector3(
              Number(vertice[0]),
              Number(vertice[1]),
              Number(vertice[2])
            )
          );
      }
    }

    function readPolygon(row: string): void {
      // Функция для считывания полигона из строки вида "f..."

      // убираем первую букву
      row = row.slice(1);

      // два раза сплитим и фильтруем
      const indexRow = row.split(" ").filter((x) => x !== "" && x !== "\r");
      const splitted = indexRow.map((x) =>
        x.split("/").filter((x) => x !== "")
      );

      // Разбиваем полигон на треугольники и по одному добавляем в массив информациб о них
      for (let i = 1; i < splitted.length - 1; i++) {
        // первые элементы - вершины
        indexes.push(Number(splitted[0][0]));
        indexes.push(Number(splitted[i][0]));
        indexes.push(Number(splitted[i + 1][0]));

        // вторые элементы - текстурные вершины (могут быть пропущены)
        if (row.includes("//")) {
          // если пропущены
          // v//n
          normalIndexes.push(Number(splitted[0][1]));
          normalIndexes.push(Number(splitted[i][1]));
          normalIndexes.push(Number(splitted[i + 1][1]));
        } else if (splitted[0].length === 3) {
          // если не пропущены
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
        // обрабатываем текст из файла по объектам
        let objects = data.split("# object");
        for (let object of objects) {
          // обрабатываем каждую строку
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

        // Можно и не разбивать по объектам, но так, почему-то медленнее
        // let rows = data.split("\n");
        // data = ''
        //   for (let row of rows) {
        //     switch (row[0]) {
        //       case "v":
        //         readVertex(row);
        //         break;
        //       case "f":
        //         readPolygon(row);
        //         break;
        //     }
        //   }

        return new Model(
          Pivot.basePivot(Vector3.Zero()),
          vertices,
          indexes,
          normals,
          normalIndexes
        );
      });
  }
}
