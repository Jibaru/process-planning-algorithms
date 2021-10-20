import { PriorityQueue } from "../../js/structures/priority_queue.js";

export class SJFQueue {
  constructor() {
    this._minProcess = null;
    this._jobQueue = new PriorityQueue((a, b) => {
      if (a.raf > b.raf) return true;
      if (a.raf == b.raf) {
        return a.tll > b.tll;
      }
      return false;
    });
  }

  hasMinProccess() {
    return this._minProcess != null;
  }

  size() {
    const first = this.hasMinProccess() ? 1 : 0;
    return this._jobQueue.size() + first;
  }

  isEmpty() {
    return !this.hasMinProccess() && this._jobQueue.isEmpty();
  }

  push(process) {
    if (this.isEmpty()) {
      this._minProcess = process;
      return this.size();
    }

    if (process.tll < this._minProcess.tll) {
      this._jobQueue.push(this._minProcess);
      this._minProcess = process;
    } else {
      this._jobQueue.push(process);
    }

    return this.size();
  }

  pop() {
    if (this.isEmpty()) {
      return;
    }

    if (this.hasMinProccess() && this._jobQueue.isEmpty()) {
      const minProcess = this._minProcess;
      this._minProcess = null;
      return minProcess;
    }

    const minProcess = this._minProcess;
    this._minProcess = this._jobQueue.pop();

    return minProcess;
  }

  toString() {
    if (this.hasMinProccess()) {
      return this._minProcess.toString() + "," + this._jobQueue.toString();
    }
    return this._jobQueue.toString();
  }
}
