export class NumberMatrix {
  // Row label always appears at start (j = 0)
  constructor(matrix, hasRowLabel = false) {
    this._rows = matrix.length;
    this._cols = matrix[0].length;
    this._hasRowLabel = hasRowLabel;
    this._copyMatrix(matrix);
  }

  static empty(rows, cols) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = 0;
      }
    }

    return new NumberMatrix(matrix, false);
  }

  get matrix() {
    return this._matrix;
  }

  _jStartValue() {
    return this._hasRowLabel ? 1 : 0;
  }

  _copyMatrix(matrix) {
    this._matrix = [];
    for (let i = 0; i < this._rows; i++) {
      this._matrix[i] = [];

      for (let j = 0; j < this._cols; j++) {
        this._matrix[i][j] = matrix[i][j];
      }
    }
  }

  getAt(i, j) {
    return this._matrix[i][j];
  }

  getLabelAt(i) {
    if (!this._hasRowLabel) {
      return "No label";
    }

    return this._matrix[i][0];
  }

  getRowVectorAt(i) {
    let vector = {};

    for (let j = this._jStartValue(); j < this._cols; j++) {
      vector[j] = this._matrix[i][j];
    }

    return Object.keys(vector).map((key) => vector[key]);
  }

  add(numberMatrix) {
    for (let i = 0; i < this._rows; i++) {
      for (let j = this._jStartValue(); j < this._cols; j++) {
        this._matrix[i][j] += numberMatrix.getAt(i, j);
      }
    }
  }

  substract(numberMatrix) {
    for (let i = 0; i < this._rows; i++) {
      for (let j = this._jStartValue(); j < this._cols; j++) {
        this._matrix[i][j] -= numberMatrix.getAt(i, j);
      }
    }
  }

  rowsSums() {
    const rowsSum = {};
    for (let i = 0; i < this._rows; i++) {
      if (!rowsSum[i]) {
        rowsSum[i] = 0;
      }

      for (let j = this._jStartValue(); j < this._cols; j++) {
        rowsSum[i] += this._matrix[i][j];
      }
    }

    return Object.keys(rowsSum).map((key) => rowsSum[key]);
  }

  colsSums(removeLabels = false) {
    const colsSum = {};
    for (let i = 0; i < this._rows; i++) {
      for (let j = this._jStartValue(); j < this._cols; j++) {
        if (!colsSum[j]) {
          colsSum[j] = 0;
        }
        colsSum[j] += this._matrix[i][j];
      }
    }

    if (removeLabels) {
      return Object.keys(colsSum).map((key) => colsSum[key]);
    }

    return colsSum;
  }

  setRowZero(i) {
    for (let j = this._jStartValue(); j < this._cols; j++) {
      this._matrix[i][j] = 0;
    }
  }
}
