import { GantItem } from "./gant_item.js";
import { PriorityQueue } from "./priority_queue.js";
import { Proccess } from "./proccess.js";

export class RoundRobinGenerator {
  constructor(q, indexedProccesses) {
    this._q = q;
    this._proccessList = [];
    this._gantItemList = [];
    this._fillProccessesList(indexedProccesses);
  }

  _fillProccessesList(indexedProccesses) {
    const queue = new PriorityQueue((a, b) => {
      if (a.tll == b.tll) {
        return a.index > b.index;
      }
      return a.tll > b.tll;
    });

    indexedProccesses.forEach((proccess) => queue.push({ ...proccess }));

    while (!queue.isEmpty()) {
      this._proccessList.push(queue.pop());
    }
  }

  _lastGantItem() {
    return this._gantItemList[this._gantItemList.length - 1];
  }

  gantItemListIsEmpty() {
    return this._gantItemList.length <= 0;
  }

  isEmpty() {
    return this._proccessList.length <= 0;
  }

  pop() {
    const indexedProccess = this._proccessList.shift();
    let initialTime = 0;

    if (!this.gantItemListIsEmpty()) {
      initialTime = this._lastGantItem().finalTime;
    }
    let finalTime = initialTime;
    const currentQ = indexedProccess.raf - this._q;

    if (currentQ <= 0) {
      finalTime += indexedProccess.raf;
    } else {
      finalTime += this._q;
      indexedProccess.raf = indexedProccess.raf - this._q;
      this._proccessList.push(indexedProccess);
    }

    const gantItem = new GantItem(
      { ...indexedProccess },
      initialTime,
      finalTime
    );

    this._gantItemList.push(gantItem);

    return new Proccess(
      indexedProccess.name,
      indexedProccess.tll,
      indexedProccess.raf
    );
  }

  execute() {
    while (!this.isEmpty()) {
      this.pop();
    }
  }

  popGantItem() {
    return this._gantItemList.shift();
  }

  initialTimeExecutionByProccessName(name) {
    const gantItem = this._gantItemList.find(
      (gantItem) => gantItem.proccess.name == name
    );
    if (gantItem) return gantItem.initialTime;
    return null;
  }

  lastInitialTimeExecutionLastFinalTimeListByName(name) {
    const list = [];

    const gantItems = this._gantItemList.filter(
      (gantItem) => gantItem.proccess.name == name
    );

    if (gantItems.length <= 1) {
      return list;
    }

    const currentData = {
      initialTimeExecution: null,
      lastFinalTime: null,
    };

    for (let i = 0; i < gantItems.length; ) {
      if (currentData.initialTimeExecution == null) {
        currentData.initialTimeExecution = gantItems[i].finalTime;
        i++;
      } else {
        currentData.lastFinalTime = gantItems[i].initialTime;
        list.push({ ...currentData });
        currentData.initialTimeExecution = null;
        currentData.lastFinalTime = null;
      }
    }

    return list;
  }

  lastFinalTimeByName(name) {
    const finalTimes = this._gantItemList
      .filter((gantItem) => gantItem.proccess.name == name)
      .map((gantItem) => gantItem.finalTime);

    return Math.max(...finalTimes);
  }
}
