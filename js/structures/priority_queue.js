export class PriorityQueue {
  constructor(evaluate = (a) => a) {
    this._heap = [];
    this._evaluate = evaluate;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  push(value) {
    const priority = this._evaluate(value);
    let i = 0;
    while (i < this.size()) {
      if (this._evaluate(this._heap[i]) > priority) {
        break;
      }
      i++;
    }

    if (i == 0) {
      this._heap.push(value);
    } else {
      this._heap.splice(i, 0, value);
    }

    return this.size();
  }
  pop() {
    return this._heap.shift();
  }
}
