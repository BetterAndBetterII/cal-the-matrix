// import math from 'math'
// const math = require('math');

math.eye = function (size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i][j] = i === j ? 1 : 0;
      }
    }
    return math.matrix(matrix);
  };

math.cholesky = function (matrix) {
    const cholesky = math.cholesky(matrix);
    return cholesky;
  }


// Generate a random 50x50 matrix
const generateMatrix = (size) => {
  let matrix = [];
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      matrix[i][j] = Math.floor(Math.random() * 10); // Random numbers between 0 and 9
    }
  }
  return matrix;
};

const generateSymmetricMatrix = (size) => {
    let matrix = [];
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            if (i>j){
                matrix[i][j] = matrix[j][i];
            }else if(i==j){
                matrix[i][j] = Math.floor(Math.random() * 10); // Random numbers between 0 and 9
            }else{
                matrix[i][j] = Math.floor(Math.random() * 10);
            }
        }
    }
    return matrix;
}

function elementToTex(element) {
  console.log(element);
  if (typeof element === 'object') {
      // fraction
      // if it can be parsed as a number
      if (element.n === 0) {
          return '0';
      } 
      if (element.n === element.d) {
          return element.s;
      }
      if (element.n % element.d === 0) {
          return ((element.n / element.d) * element.s);
      }
      if (element.d === 1) {
          return (element.n * element.s);
      }
      var res = '\\frac{' + (element.n * element.s) + '}{' + element.d + '}';
      return res;
  }
  return element;
}

function parseElement(element) {
  // Match LaTeX fractions
  const fracRegex = /\\frac{([^}]+)}{([^}]+)}/;
  const match = element.match(fracRegex);
  if (match) {
      const numerator = parseFloat(match[1]);
      const denominator = parseFloat(match[2]);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return math.fraction(numerator, denominator); // Return the fraction as a mathjs fraction
          // return numerator / denominator; // Return the fraction as a division
      } else {
          return element; // Return the original string if parsing fails
      }
  } else {
      const num = parseFloat(element);
      return isNaN(num) ? element : num; // Parse as a float or return the original string
  }
}

class Matrix {
    constructor(matrix) {
      this.matrix = math.matrix(matrix);
    }
  
    printMatrix(matrix) {
      if (matrix) {
        console.log(matrix.toString());
      } else {
        console.log(this.matrix.toString());
      }
    }

    static parseFromLatex(latexString) {
      const matrixEnvironments = ['matrix', 'bmatrix', 'pmatrix', 'vmatrix', 'Bmatrix'];
      let environmentFound = false;
      let matrixArray = [];

      matrixEnvironments.forEach(env => {
          const regex = new RegExp(`\\\\begin{${env}}(.*?)\\\\end{${env}}`, 'gs');
          const match = latexString.match(regex);
          if (match) {
              environmentFound = true;
              const matrixContent = match[0];
              const contentWithoutEnv = matrixContent
                  .replace(`\\begin{${env}}`, '')
                  .replace(`\\end{${env}}`, '')
                  .trim();
              const cleanedContent = contentWithoutEnv.replace(/\\\\\[\d*\.?\d*em\]/g, '\\\\');
              
              const rows = cleanedContent.split('\\\\').map(row =>
                  row.trim().split('&').map(element => {
                      return parseElement(element.trim());
                  })
              );

              if (rows.length > 0 && rows[0].length > 0) {
                  matrixArray = rows;
              }
          }
      });

      if (!environmentFound || matrixArray.length === 0) {
          throw new Error('No valid LaTeX matrix environment found or matrix is empty.');
      }

      const isWellFormed = matrixArray.every(row => row.length === matrixArray[0].length);
      if (!isWellFormed) {
          throw new Error('The LaTeX matrix is not well-formed.');
      }

      return new Matrix(matrixArray); // Make sure you have a Matrix constructor or replace with appropriate handling
  }

    getLatexString() {
        // if fraction format
        if (this.matrix.toArray().every(row => row.every(element => typeof element === 'object'))) {
            // every element is a fraction
            const rows = this.matrix.toArray();
            const rowStrings = rows.map(row => row.map(element => elementToTex(element)).join(' & '));
            const latexRows = rowStrings.join(' \\\\ ');
            return `\\begin{bmatrix} ${latexRows} \\end{bmatrix}`;
        }

        // not fraction format
        const rows = this.matrix.toArray();
        const rowStrings = rows.map(row => row.join(' & '));
        const latexRows = rowStrings.join(' \\\\ ');
        return `\\begin{bmatrix} ${latexRows} \\end{bmatrix}`;
    }
  
    luDecomposition() {
      try {
        const result = math.lup(this.matrix);
        var L_matrix = new Matrix(math.fraction(result.L.toArray()));
        var U_matrix = new Matrix(math.fraction(result.U.toArray()));
        var P_matrix;
        const matrixSize = this.matrix.toArray().length;
        console.log('P:', result);
        if (result.p) {
            // convert p to elementary matrix
            var p = [];
            for (let i = 0; i < matrixSize; i++) {
                p.push([]);
            }
            // 原始矩阵的第一行（索引0）移动到了新矩阵的第三行（P[2]指向索引1）。
            // 原始矩阵的第二行（索引1）移动到了新矩阵的第一行（P[0]指向索引2）。
            // 原始矩阵的第三行（索引2）移动到了新矩阵的第二行（P[1]指向索引0）。
            for (let i = 0; i < result.p.length; i++) {
                for (let j = 0; j < result.p.length; j++) {
                    if (result.p[i] === j) {
                        p[i][j] = 1;
                    } else {
                        p[i][j] = 0;
                    }
                }
            }
            P_matrix = new Matrix(math.fraction(p));
          } else {
            P_matrix = new Matrix(math.eye(matrixSize).toArray());  // Elementary matrix
          }
        return { L: L_matrix, U: U_matrix, P: P_matrix };
      } catch (error) {
        console.error('Error calculating the LU decomposition:', error);
        throw new Error(error.message);
      }
    }
  
    choleskyDecomposition() {
      let matrixArray = this.matrix.toArray();
      
      if (matrixArray.length === 0 || matrixArray.length !== matrixArray[0].length) {
          throw new Error("Matrix must be square.");
      }

      // 判断是否为正定矩阵
      for (let i = 0; i < matrixArray.length; i++) {
          for (let j = 0; j < i; j++) {
              if (matrixArray[i][j] !== matrixArray[j][i]) {
                  throw new Error("Matrix must be symmetric.");
              }
          }
      }
      // det > 0
      if (math.det(this.matrix) <= 0) {
          throw new Error("Matrix must be positive definite.");
      }

      const size = matrixArray.length;

      let L = new Array(size);
      for (let i = 0; i < size; i++) {
          L[i] = new Array(size).fill(0);
      }

      for (let i = 0; i < size; i++) {
          for (let j = 0; j <= i; j++) {
              let sum = 0;

              if (j === i) { // 对角元素
                  for (let k = 0; k < j; k++) {
                      sum += L[j][k] * L[j][k];
                  }
                  L[j][j] = Math.sqrt(matrixArray[j][j] - sum);
              } else {
                  for (let k = 0; k < j; k++) {
                      sum += L[i][k] * L[j][k];
                  }
                  L[i][j] = (matrixArray[i][j] - sum) / L[j][j];
              }
          }
      }

      console.log('Cholesky matrix:', L);
      // 根据你的需求返回L
      return (new Matrix(math.fraction(L))); // 如果你使用mathjs的Matrix类型
  }
  
    inverse() {
      try {
        const inv = math.inv(this.matrix);
        console.log('Inverse matrix:', math.fraction(inv));
        return new Matrix(math.fraction(inv));
      } catch (error) {
        console.error('Error calculating the inverse:', error);
        throw new Error(error.message);
      }
    }
  
    multiply(other) {
      try {
        const product = math.multiply(this.matrix, other.matrix);
        return new Matrix(math.fraction(product));
      } catch (error) {
        console.error('Error multiplying matrices:', error);
        throw new Error(error.message);
      }
    }
  
    add(other) {
      try {
        const sum = math.add(this.matrix, other.matrix);
        return new Matrix(math.fraction(sum));
      } catch (error) {
        console.error('Error adding matrices:', error);
        throw new Error(error.message);
      }
    }
  
    subtract(other) {
      try {
        const difference = math.subtract(this.matrix, other.matrix);
        return new Matrix(math.fraction(difference));
      } catch (error) {
        console.error('Error subtracting matrices:', error);
        throw new Error(error.message);
      }
    }
}

window.Matrix = Matrix;

const matrixSize = 3;

// Usage
const matrix1 = generateMatrix(matrixSize);
const matrix2 = generateMatrix(matrixSize);

const m1 = new Matrix(matrix1);
const m2 = new Matrix(matrix2);

const sumMatrix = m1.add(m2);
sumMatrix.printMatrix();

const productMatrix = m1.multiply(m2);
productMatrix.printMatrix();

const inverseMatrix = m1.inverse();
if (inverseMatrix) {
  inverseMatrix.printMatrix();
}

const luDecomp = m1.luDecomposition();
if (luDecomp) {
  luDecomp.L.printMatrix();
  luDecomp.U.printMatrix();
}

const choleskyDecomp = m1.choleskyDecomposition();
if (choleskyDecomp) {
  choleskyDecomp.printMatrix();
}

// Example usage:
try {
    const latexStr = `
        \\begin{bmatrix}
            1 & 2 & 3 \\\\
            4 & 5 & 6 \\\\
            7 & 8 & 9
        \\end{bmatrix}
    `;

    const matrixFromLatex = Matrix.parseFromLatex(latexStr);
    console.log(matrixFromLatex); // Output the Matrix object
} catch (e) {
    console.error(e.message);
}
