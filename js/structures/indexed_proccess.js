import { Proccess } from "./proccess.js";

export class IndexedProccess extends Proccess {
  constructor(index, name, tll, raf) {
    super(name, tll, raf);
    this.index = index;
  }
}
