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

const matrixSize = 4;
// const matrix = generateMatrix(matrixSize);
// const symmetricMatrix = generateSymmetricMatrix(matrixSize);
const matrix = [
    [25, 15, -5],
    [15, 18,  0],
    [-5,  0, 11]
  ];

// Calculate the inverse of the matrix
// // LU分解
// const result = math.lup(matrix);
// console.log('L matrix:', result.L);
// console.log('U matrix:', result.U);
// printMatrix(result.L);
// printMatrix(result.U);

// // 计算逆矩阵
// const inverse = math.inv(result.U);
// console.log('Inverse matrix:', inverse);
// printMatrix(inverse);

// Cholesky分解
// const cholesky = math.cholesky(matrix);
// console.log('Cholesky matrix:', cholesky);
// printMatrix(cholesky);
// printMatrix(matrix);
// const cholesky = choleskyDecomposition(matrix);
// printMatrix(cholesky);
// } catch (error) {
//   console.error('Error calculating the inverse:', error.message);
// }


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
                // 移除开始和结束环境标签
                const contentWithoutEnv = matrixContent
                    .replace(`\\begin{${env}}`, '')
                    .replace(`\\end{${env}}`, '')
                    .trim();
                // 移除行间距命令
                const cleanedContent = contentWithoutEnv.replace(/\\\\\[\d*\.?\d*em\]/g, '\\\\');
                // 分割行和列
                const rows = cleanedContent.split('\\\\').map(row => 
                    row.trim().split('&').map(element => {
                        const cleanedElement = element.trim();
                        const num = parseFloat(cleanedElement);
                        return isNaN(num) ? cleanedElement : num;
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
    
        return new Matrix(matrixArray);
    }

    getLatexString() {
        const rows = this.matrix.toArray();
        const rowStrings = rows.map(row => row.join(' & '));
        const latexRows = rowStrings.join(' \\\\ ');
        return `\\begin{bmatrix} ${latexRows} \\end{bmatrix}`;
    }
  
    luDecomposition() {
      try {
        const result = math.lup(this.matrix);
        var L_matrix = new Matrix(result.L.toArray());
        var U_matrix = new Matrix(result.U.toArray());
        var P_matrix;
        if (result.P) {
            P_matrix = new Matrix(result.P.toArray());
          } else {
            P_matrix = new Matrix(math.eye(matrixSize).toArray());  // Elementary matrix
          }
        return { L: L_matrix, U: U_matrix, P: P_matrix };
      } catch (error) {
        console.error('Error calculating the LU decomposition:', error);
      }
    }
  
    choleskyDecomposition() {
        console.log('matrix:', this.matrix.toArray()[0].length);
        if (this.matrix.toArray().length === 0 || this.matrix.toArray().length !== this.matrix.toArray()[0].length) {
            throw new Error("Matrix must be square.");
        }

        const matrix = this.matrix.toArray();
        
        let L = [];
        for (let i = 0; i < matrix.length; i++) {
            L[i] = new Array(matrix.length).fill(0);
        }

        try {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j <= i; j++) {
                    let sum = 0;
    
                    if (j === i) { // Diagonal elements
                        for (let k = 0; k < j; k++) {
                            sum += L[j][k] * L[j][k];
                        }
                        L[j][j] = Math.sqrt(matrix[j][j] - sum);
                    } else {
                        for (let k = 0; k < j; k++) {
                            sum += L[i][k] * L[j][k];
                        }
                        L[i][j] = (1 / L[j][j]) * (matrix[i][j] - sum);
                    }
                }
            }
            console.log('Cholesky matrix:', L);
            return new Matrix(L);
        } catch (error) {
            throw new Error('Error calculating the Cholesky decomposition: ' + error.message);
        }
    }
  
    inverse() {
      try {
        const inv = math.inv(this.matrix);
        console.log('Inverse matrix:', inv);
        return new Matrix(inv);
      } catch (error) {
        console.error('Error calculating the inverse:', error);
      }
    }
  
    multiply(other) {
      try {
        const product = math.multiply(this.matrix, other.matrix);
        return new Matrix(product);
      } catch (error) {
        console.error('Error multiplying matrices:', error);
      }
    }
  
    add(other) {
      try {
        const sum = math.add(this.matrix, other.matrix);
        return new Matrix(sum);
      } catch (error) {
        console.error('Error adding matrices:', error);
      }
    }
  
    subtract(other) {
      try {
        const difference = math.subtract(this.matrix, other.matrix);
        return new Matrix(difference);
      } catch (error) {
        console.error('Error subtracting matrices:', error);
      }
    }
}

window.Matrix = Matrix;

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
