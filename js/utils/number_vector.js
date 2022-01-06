export class NumberVector {
  // Row label always appears at start (j = 0)
  constructor(vector) {
    this._size = vector.length;
    this._copyVector(vector);
  }

  static empty(size) {
    let vector = [];
    for (let i = 0; i < size; i++) {
      vector[i] = 0;
    }
    return new NumberVector(vector);
  }

  get vector() {
    return this._vector;
  }

  _copyVector(vector) {
    this._vector = [];
    for (let i = 0; i < this._size; i++) {
      this._vector[i] = vector[i];
    }
  }

  getAt(i) {
    return this._vector[i];
  }

  add(vector) {
    for (let i = 0; i < this._size; i++) {
      this._vector[i] += vector.getAt(i);
    }
  }

  substract(vector) {
    for (let i = 0; i < this._size; i++) {
      this._vector[i] -= vector.getAt(i);
    }
  }

  hasNegativeValues() {
    for (let i = 0; i < this._size; i++) {
      if (this._vector[i] < 0) {
        return true;
      }
    }
    return false;
  }
}
