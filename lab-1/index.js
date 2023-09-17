/**
 * V-9
 *
 * n = 5 - rows
 * m = 2 - cols
 * C1 = -4 - from
 * C2 = 5 - up to
 */

// 1. Have more than one saddle point
/* let matrix = [
  [5, 5],
  [0, 1],
  [2, 3],
  [4, 2],
  [-4, -4],
]; */

// 2. Have one saddle point
/* let matrix = [
  [5, 1],
  [-4, 0],
  [-3, 0],
  [-2, 0],
  [-1, 0],
]; */

// 3. Do not have saddle points
let matrix = [
  [5, 3],
  [-4, 5],
  [-3, 1],
  [-2, -4],
  [-1, 0],
];

let matrixTransposed = transpose(matrix);

let maxmin = Math.max(...matrix.map((row) => Math.min(...row)));
let minmax = Math.min(...matrixTransposed.map((row) => Math.max(...row)));

if (maxmin == minmax) {
  const indexArray = [];

  matrix.forEach((row, rowIndex) =>
    row.forEach((elem, colIndex) => {
      if (elem == maxmin) indexArray.push([rowIndex + 1, colIndex + 1]);
    }),
  );

  console.log('minmax: ', minmax);
  console.log('maxmin: ', maxmin);
  console.log('result: ', indexArray);
} else {
  console.log('minmax: ', minmax);
  console.log('maxmin: ', maxmin);
  console.log('no saddle points');
}

/**
 * Helper function to transpose(change rows into columns, or columns to rows) matrix
 * @param {number[][]} matrix - two dimensional array
 * @returns {number[][]}
 */
function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
