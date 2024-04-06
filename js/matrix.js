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

function removeBracketsContent(str) {
  // 使用正则表达式匹配中括号及其内部的内容（包含嵌套的情况）
  // \[ 匹配左中括号
  // [^\[\]]* 匹配不包含中括号的任意字符，*表示匹配0次或多次
  // \] 匹配右中括号
  return str.replace(/\[[^\[\]]*\]/g, '');
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
      if (i > j) {
        matrix[i][j] = matrix[j][i];
      } else if (i == j) {
        matrix[i][j] = Math.floor(Math.random() * 10); // Random numbers between 0 and 9
      } else {
        matrix[i][j] = Math.floor(Math.random() * 10);
      }
    }
  }
  return matrix;
}

function elementToTex(element) {
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
    var res = element.s > 0 ? '\\frac{' + (element.n) + '}{' + element.d + '}' : '-' + '\\frac{' + element.n + '}{' + element.d + '}';
    return res;
  }
  return element;
}

function parseElement(element) {
  if (element.match(/\\frac{([^}]+)}{([^}]+)}/)) {
    // 尝试解析分子和分母
    let numerator = match[1].trim();
    let denominator = match[2].trim();

    // 将分子和分母转换为数字
    numerator = parseLaTeXNumber(numerator);
    denominator = parseLaTeXNumber(denominator);

    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator; // 直接返回分数的计算结果
    } else {
      return element; // 如果解析失败，返回原始字符串
    }
  } else if (element.match(/\\sqrt{([^}]+)}/)) {
    // 尝试解析平方根
    let match = element.match(/\\sqrt{([^}]+)}/);
    let radicand = match[1].trim();
    radicand = parseLaTeXNumber(radicand);
    if (!isNaN(radicand)) {
      return Math.sqrt(radicand); // 返回平方根的计算结果
    } else {
      return element; // 如果解析失败，返回原始字符串
    }
  }
  else {
    const num = parseLaTeXNumber(element);
    return isNaN(num) ? element : num; // 尝试将元素解析为浮点数或返回原始字符串
  }
}

function parseLaTeXNumber(input) {
  // 处理一些简单的LaTeX数学表达式，例如 "\frac12" 可以拓展这个函数来处理更复杂的情况
  if (input.match(/^\d+$/)) { // 纯数字
    return parseFloat(input);
  } else if (input.match(/\\sqrt{([^}]+)}/)) {
    let underRoot = parseLaTeXNumber(match[1].trim());
    if (!isNaN(underRoot)) {
      return Math.sqrt(underRoot);
    }
  } else if (input.match(/\\frac{([^}]+)}{([^}]+)}/)) {
    let numerator = parseLaTeXNumber(match[1].trim());
    let denominator = parseLaTeXNumber(match[2].trim());
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  } else if (input.match(/^\\frac\d+$/)) { // 例如 "\frac12"
    let parts = input.replace('\\frac', '').split('');
    return parseLaTeXNumber(parts[0]) / parseLaTeXNumber(parts[1]);
  } else if (input.match(/^\\sqrt\d+$/)) { // 例如 "\sqrt2"
    let num = input.replace('\\sqrt', '');
    return math.sqrt(parseLaTeXNumber(num));
  }
  // 可以在这里添加更多的解析逻辑来处理其他LaTeX数学表达式
  return NaN; // 默认返回NaN
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

  isSquareMatrix() {
    const matrix = this.matrix.toDemicalArray();
    if (!Array.isArray(matrix) || matrix.length === 0) return false;
    const length = matrix[0].length;
    return matrix.every(row => Array.isArray(row) && row.length === length);
  }

  toDemicalArray() {
    const arrayData = this.matrix.toArray();
    for (let i = 0; i < arrayData.length; i++) {
      for (let j = 0; j < arrayData[i].length; j++) {
        arrayData[i][j] = arrayData[i][j].s * arrayData[i][j].n / arrayData[i][j].d;
      }
    }
    return arrayData;
  }

  static parseFromLatex(latexString) {
    const matrixEnvironments = ['matrix', 'bmatrix', 'pmatrix', 'vmatrix', 'Bmatrix', 'array'];
    let environmentFound = false;
    let matrixArray = [];

    latexString = removeBracketsContent(latexString);


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
      throw new Error('无效LaTex环境或内容为空');
    }

    const isWellFormed = matrixArray.every(row => row.length === matrixArray[0].length);
    if (!isWellFormed) {
      throw new Error('矩阵排列不正确');
    }
    try {
      return new Matrix(math.fraction(matrixArray)); // Make sure you have a Matrix constructor or replace with appropriate handling
    } catch (error) {
      return new Matrix(matrixArray);
    }
  }

  getLatexString(number_type = 'fractional') {
    if (number_type === 'fractional') {
      const rows = this.matrix.toArray();
      // const rowStrings = rows.map(row => row.join(' & '));
      const rowStrings = rows.map(row => row.map(element => elementToTex(element)).join(' & '));
      const latexRows = rowStrings.join(' \\\\ ');
      return `\\begin{bmatrix} ${latexRows} \\end{bmatrix}`;
    } else {
      // if not fraction format
      const rows = this.matrix.toArray();
      const rowStrings = rows.map(row => row.join(' & '));
      const latexRows = rowStrings.join(' \\\\ ');
      return `\\begin{bmatrix} ${latexRows} \\end{bmatrix}`;
    }
  }

  getSimpleString() {
    const rows = this.matrix.toArray();
    const rowStrings = rows.map(row => row.join(' '));
    return rowStrings.join('\n');
  }

  getAugmentedLatexString() {
    const rows = this.matrix.toArray();
    const numRows = rows.length;
    const numCols = rows[0].length;

    // 为增广矩阵生成列格式字符串，最后一列前加入竖线
    let colFormat = Array(numCols - 1).fill('c').join(' ') + ' | c';
    // const rowStrings = rows.map(row => row.join(' & '));
    const rowStrings = rows.map(row => row.map(element => elementToTex(element)).join(' & '));
    const latexRows = rowStrings.join(' \\\\ ');
    return `\\left[\\begin{array}{${colFormat}} ${latexRows} \\end{array}\\right]`;
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

    // 给出对应U

    let U = new Array(size);
    for (let i = 0; i < size; i++) {
      U[i] = new Array(size).fill(0);
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        U[i][j] = L[j][i];
      }
    }

    console.log('Cholesky matrix, L:', L);
    console.log('Cholesky matrix, U:', U);
    // 根据你的需求返回L
    return {
      "L": new Matrix(math.fraction(L)),
      "U": new Matrix(math.fraction(U))
    }
    // return (new Matrix(math.fraction(L))); // 如果你使用mathjs的Matrix类型
  }
  svd() {
    try {
      const copy = math.clone(this.matrix).toArray();
      console.log('SVD:', copy);
      const result = SVDJS.SVD(copy);
      // const U_matrix = new Matrix(math.fraction(result.U.toArray()));
      console.log('Result:', result);
      // convert q to elementary matrix
      var q = [];
      for (let i = 0; i < result.q.length; i++) {

        q.push([]);
      }
      for (let i = 0; i < result.q.length; i++) {
        for (let j = 0; j < result.q.length; j++) {
          if (i === j) {
            q[i][j] = result.q[i];
          } else {
            q[i][j] = 0;
          }
        }
      }
      console.log('Q:', q);
      const U_matrix = new Matrix(math.fraction(result.u));
      const S_matrix = new Matrix(math.fraction(q));
      const V_matrix = new Matrix(math.fraction(result.v));
      // const S_matrix = new Matrix(math.fraction(math.matrix(result.S).toArray()));
      // const V_matrix = new Matrix(math.fraction(math.matrix(result.V).toArray()));
      return { U: U_matrix, S: S_matrix, V: V_matrix };
    } catch (error) {
      console.error('Error calculating the singular value decomposition:', error);
      throw new Error(error.message);
    }
  }
  qr() {
    try {
      const result = math.qr(this.matrix);
      const Q_matrix = new Matrix(math.fraction(result.Q.toArray()));
      const R_matrix = new Matrix(math.fraction(result.R.toArray()));
      return { Q: Q_matrix, R: R_matrix };
    } catch (error) {
      console.error('Error calculating the QR decomposition:', error);
      throw new Error(error.message);
    }
  }
  rank() {
    try {
      const rref = this.rref().toDemicalArray();
      console.log("RREF:", rref);
      let r = 0;
      for (let i = 0; i < rref.length; i++) {
        let allZeroes = true;
        for (let j = 0; j < rref[i].length; j++) {
          if (rref[i][j] !== 0) {
            allZeroes = false;
            break;
          }
        }
        if (!allZeroes) {
          r++;
        }
      }
      console.log('rank:', r);
      return r;
    } catch (error) {
      console.error('Error calculating the rank:', error);
      throw new Error(error.message);
    }
  }
  determinant() {
    try {
      const det = math.det(this.matrix);
      console.log('Determinant:', det);
      return det;
    } catch (error) {
      console.error('Error calculating the determinant:', error);
      throw new Error(error.message);
    }
  }
  norm() {
    try {
      const norm = math.norm(this.matrix);
      console.log('Norm:', norm);
      return norm;
    } catch (error) {
      console.error('Error calculating the norm:', error);
      throw new Error(error.message);
    }
  }
  rref() {
    try {
      var copy = math.clone(this.matrix);
      var rowCount = copy.size()[0];
      var colCount = copy.size()[1]; // 增广矩阵的列数

      for (let i = 0; i < rowCount; i++) { // 修复点1：使用rowCount
        // 选主元
        var max = 0;
        var maxIndex = i;
        for (let j = i; j < rowCount; j++) { // 修复点1：使用rowCount
          if (Math.abs(copy._data[j][i]) > max) {
            max = Math.abs(copy._data[j][i]);
            maxIndex = j;
          }
        }
        // 交换行
        if (maxIndex !== i) {
          [copy._data[i], copy._data[maxIndex]] = [copy._data[maxIndex], copy._data[i]];
        }
        var divisor = copy._data[i][i];
        if (divisor !== 0) { // 避免除以0
          for (let j = 0; j < colCount; j++) {
            copy._data[i][j] /= divisor;
          }
        }

        for (let j = 0; j < rowCount; j++) { // 修复点1：使用rowCount
          if (j !== i) {
            if (copy._data[i][i] !== 0) {
              var rate = copy._data[j][i] / copy._data[i][i];
              for (let k = 0; k < colCount; k++) {
                copy._data[j][k] -= rate * copy._data[i][k];
              }
            }
          }
        }
      }
      console.log('Row reduced echelon form:', copy);
      return new Matrix(math.fraction(copy));
    } catch (error) {
      console.error('Error calculating the row reduced echelon form:', error);
      throw new Error(error.message);
    }
  }

  solve() {
    try {
      var copy = math.clone(this.matrix);
      var rowCount = copy.size()[0];
      var colCount = copy.size()[1]; // 增广矩阵的列数

      for (let i = 0; i < rowCount; i++) { // 修复点1：使用rowCount
        // 选主元
        var max = 0;
        var maxIndex = i;
        for (let j = i; j < rowCount; j++) { // 修复点1：使用rowCount
          if (Math.abs(copy._data[j][i]) > max) {
            max = Math.abs(copy._data[j][i]);
            maxIndex = j;
          }
        }
        // 交换行
        if (maxIndex !== i) {
          [copy._data[i], copy._data[maxIndex]] = [copy._data[maxIndex], copy._data[i]];
        }
        var divisor = copy._data[i][i];
        if (divisor !== 0) { // 避免除以0
          for (let j = 0; j < colCount; j++) {
            copy._data[i][j] /= divisor;
          }
        }


        for (let j = 0; j < rowCount; j++) { // 修复点1：使用rowCount
          if (j !== i) {
            if (copy._data[i][i] !== 0) {
              var rate = copy._data[j][i] / copy._data[i][i];
              for (let k = 0; k < colCount; k++) {
                copy._data[j][k] -= rate * copy._data[i][k];
              }
            }
          }
        }
      }

      // 解析RREF形式的矩阵以求解线性方程组
      // 检查是否有解
      for (let i = 0; i < rowCount; i++) {
        let allZeroes = true;
        for (let j = 0; j < colCount - 1; j++) { // 忽略最后一列（增广列）
          if (copy._data[i][j] !== 0) {
            allZeroes = false;
            break;
          }
        }
        if (allZeroes && copy._data[i][colCount - 1] !== 0) {
          // 如果一行除了最后一列全为0，且最后一列不为0，则系统无解
          throw new Error("System has no solution.");
        }
      }

      // 解析RREF形式的矩阵以求解线性方程组
      var solution = [];
      for (let i = 0; i < colCount - 1; i++) { // 仅对未知数进行迭代
        // 这里假设方程组有唯一解，并且每个未知数至少对应一行
        if (i < rowCount) {
          solution.push(copy._data[i][colCount - 1]); // 将增广列的值作为解
        } else {
          // 如果未知数多于行数（即方程数），可能需要额外的逻辑来处理这种情况
          solution.push(0); // 或其他适当的默认值/逻辑
        }
      }

      console.log('Solution:', solution);
      solution = solution.map(element => elementToTex(math.fraction(element)));

      return solution;
    } catch (error) {
      console.error('Error solving the linear equation system:', error);
      throw new Error(error.message);
    }
  }

  eigenvectors() {
    // 将Matrix对象转换为二维数组以便于计算
    const array = this.matrix.toArray();
    const demical_array = new Matrix(this.matrix).toDemicalArray();
    console.log('Decimal array:', demical_array);

    // 使用numeric.js库计算特征值和特征向量
    const ev = numeric.eig(demical_array);

    // 特征值为ev.lambda.x，特征向量为列向量形式的ev.E.x
    const eigenvalues = ev.lambda.x;
    const eigenvectorArray = ev.E.x;

    // 转换特征向量格式，以匹配Matrix类的要求
    const eigenvectors = new Matrix(math.fraction(eigenvectorArray));
    // 返回特征值和特征向量的Matrix对象
    return { eigenvalues, eigenvectors };
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
      console.log('This:', this.matrix, other.matrix);
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