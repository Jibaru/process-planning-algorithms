export class HRNGenerator {
  constructor(proccesses) {
    this._proccessQueue = [];
    this._index = 0;
    this._timeExcceeded = 0;
    this._tllMin = Math.min(...proccesses.map((p) => p.tll));
    proccesses.forEach((p) => this.push(p));
  }
  get timeExcceeded() {
    return this._timeExcceeded;
  }
  push(proccess) {
    this._index++;
    this._proccessQueue.push({
      proccess,
      index: this._index,
    });
  }
  pop() {
    const proccessesFinded = this._proccessQueue.filter(
      (p) =>
        p.proccess.tll == this._tllMin || p.proccess.tll <= this._timeExcceeded
    );
    if (proccessesFinded.length == 1) {
      this._timeExcceeded += proccessesFinded[0].proccess.raf;
      const i = this._proccessQueue.findIndex(
        (p) => p.index == proccessesFinded[0].index
      );
      this._proccessQueue.splice(i, 1);
      return proccessesFinded[0].proccess;
    }
    const priorityProccesses = proccessesFinded.map((p) => {
      return {
        indexedProccess: p,
        priority: this.priority(p.proccess),
      };
    });

    const maxPriority = Math.max(
      ...priorityProccesses.map((priorityProcess) => priorityProcess.priority)
    );

    const processesWithMaxPriority = priorityProccesses.filter(
      (priorityProcess) => priorityProcess.priority === maxPriority
    );

    const minIndex = Math.min(
      ...processesWithMaxPriority.map(
        (priorityProcess) => priorityProcess.indexedProccess.index
      )
    );

    const proccessMaxPriority = processesWithMaxPriority.find(
      (priorityProcess) => priorityProcess.indexedProccess.index === minIndex
    );

    this._timeExcceeded += proccessMaxPriority.indexedProccess.proccess.raf;
    const i = this._proccessQueue.findIndex(
      (p) => p.index == proccessMaxPriority.indexedProccess.index
    );
    this._proccessQueue.splice(i, 1);
    return proccessMaxPriority.indexedProccess.proccess;
  }
  isEmpty() {
    return this._proccessQueue.length == 0;
  }
  priority(p) {
    return (this._timeExcceeded - p.tll + p.raf) / p.raf;
  }
}
