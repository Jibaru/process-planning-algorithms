export class InputParser {
  constructor(input) {
    this._input = input;
  }

  parse() {
    return this._input
      .trim()
      .split("\n")
      .map((text) => {
        const [name, tll, raf] = text.split(",");
        return [name, parseInt(tll), parseInt(raf)];
      });
  }
}
