class FloatSubstractor {
  constructor(numberA, numberB) {
    this._numberA = numberA;
    this._numberB = numberB;
  }

  result() {
    const sizeDecimals = Math.max(
      ...[this._numberA, this._numberB]
        .filter((num) => !Number.isInteger(num))
        .map((num) => `${num}`.split(".")[1].length)
    );

    if (sizeDecimals === -Infinity) {
      return this._numberA - this._numberB;
    }

    return Number((this._numberA - this._numberB).toFixed(sizeDecimals));
  }
}

class FloatAdder {
  constructor(numberA, numberB) {
    this._numberA = numberA;
    this._numberB = numberB;
  }

  result() {
    let sizeDecimals = Math.max(
      ...[this._numberA, this._numberB]
        .filter((num) => !Number.isInteger(num))
        .map((num) => `${num}`.split(".")[1].length)
    );

    if (sizeDecimals === -Infinity) {
      return this._numberA + this._numberB;
    }

    return Number((this._numberA + this._numberB).toFixed(sizeDecimals));
  }
}

export { FloatSubstractor, FloatAdder };
