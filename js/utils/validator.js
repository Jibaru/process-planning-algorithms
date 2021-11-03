export class InputValidator {
  static MESSAGE = "Input inválido";

  constructor(input) {
    this._input = input;
  }

  isValid() {
    const isString = (obj) =>
      Object.prototype.toString.call(obj) === "[object String]";
    const isNum = (val) => {
      var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
      if (!floatRegex.test(val)) return false;

      val = parseFloat(val);
      if (isNaN(val)) return false;
      return true;
    };

    if (!isString(this._input)) {
      return false;
    }

    let isInvalid = false;

    const splittedParts = this._input
      .trim()
      .split("\n")
      .map((text) => {
        if (isInvalid) return;

        const parts = text.split(",");

        if (parts.length != 3) {
          isInvalid = true;
        }

        const [name, tll, raf] = parts;

        if (!isNum(tll) || !isNum(raf)) {
          isInvalid = true;
        }

        return { name, tll: parseInt(tll), raf: parseFloat(raf) };
      });

    if (splittedParts.length == 0 || isInvalid) {
      return false;
    }

    for (const part of splittedParts) {
      if (part.name == undefined || isNaN(part.tll) || isNaN(part.raf)) {
        return false;
      }
    }

    return true;
  }
}
