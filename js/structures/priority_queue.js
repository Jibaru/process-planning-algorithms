export class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  push(value) {
    /* 
      Most eficient algorithm, but doesn't work properly
    let i = 0;
    while (i < this.size()) {
      if (this._comparator(this._heap[i], value)) {
        break;
      }
      i++;
    }

    if (i == 0) {
      this._heap.push(value);
    } else {
      this._heap.splice(i, 0, value);
    } 
    */

    this._heap.push(value);
    // LOL method
    this._heap.sort((a, b) => {
      const isGreaterThan = this._comparator(a, b);
      return isGreaterThan ? 1 : -1;
    });

    return this.size();
  }
  pop() {
    return this._heap.shift();
  }
}
