import { GantItem } from "./gant_item.js";
import { TimeList } from "./time_list.js";
import { IndexedProccess } from "./indexed_proccess.js";
import { FloatAdder } from "../utils/float_substractor.js";

export class SRTFGenerator {
  constructor(indexedProccesses) {
    this._gantItemList = [];
    this._timeList = new TimeList(indexedProccesses);
  }

  _lastGantItem() {
    return this._gantItemList[this._gantItemList.length - 1];
  }

  gantItemListIsEmpty() {
    return this._gantItemList.length <= 0;
  }

  execute() {
    let currentProcess = null;
    let gantItem = null;
    let currentTime = this._timeList.getMinTime();
    for (
      ;
      !this._timeList.isEmpty() &&
      currentTime <= this._timeList.getMaxTimeExecution();
      currentTime = new FloatAdder(
        currentTime,
        this._timeList.getIncrement()
      ).result()
    ) {
      currentProcess = this._timeList.getAtTime(currentTime, currentProcess);

      if (gantItem != null) {
        if (gantItem.proccess.index !== currentProcess.index) {
          gantItem.finalTime = currentTime;
          this._gantItemList.push(gantItem);
          gantItem = new GantItem({ ...currentProcess }, currentTime, null);
        }
      } else {
        gantItem = new GantItem({ ...currentProcess }, currentTime, null);
      }

      if (
        !!currentProcess &&
        this._timeList.decreaseRafByIndex(currentProcess.index) === -1
      ) {
        if (gantItem === null) {
          gantItem = new GantItem(
            { ...currentProcess },
            currentTime,
            currentTime
          );
        } else {
          gantItem.finalTime = currentTime;
        }

        this._gantItemList.push(gantItem);
        gantItem = null;
        currentProcess = null;
      }
    }

    this._gantItemList[this._gantItemList.length - 1].finalTime =
      this._timeList.getMaxTimeExecution();

    /*if (gantItem != null) {
      gantItem.finalTime = this._timeList.getMaxTimeExecution();
      this._gantItemList.push(gantItem);
    }*/
  }

  popGantItem() {
    return this._gantItemList.shift();
  }

  lastInitialTimeExecutionLastFinalTimeListOrNumberByName(name) {
    const list = [];

    const gantItems = this._gantItemList.filter(
      (gantItem) => gantItem.proccess.name == name
    );

    if (gantItems.length === 1) {
      return gantItems[0].initialTime;
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

  tLlegListOrNumberByName(name) {
    const list = [];

    const gantItems = this._gantItemList.filter(
      (gantItem) => gantItem.proccess.name == name
    );

    const currentData = {
      initialTimeExecution: null,
      lastFinalTime: null,
    };

    if (gantItems.length === 1) {
      return gantItems[0].proccess.tll;
    }

    //Si hay mas de una ocurrencia
    // Coger el primero
    const gantItem = gantItems[0];
    currentData.initialTimeExecution = gantItem.initialTime;
    currentData.lastFinalTime = gantItem.proccess.tll;
    list.push(currentData);
    return list;
  }

  // For response average time
  lastFinalTimeListOrNumberByName(name) {
    const gantItems = this._gantItemList.filter(
      (gantItem) => gantItem.proccess.name == name
    );

    if (gantItems.length === 1) {
      let finalTime = gantItems[0].finalTime;
      if (
        this._gantItemList.findIndex(
          (gantItem) => gantItem.proccess.name === name
        ) !==
        this._gantItemList.length - 1
      ) {
        finalTime += this._timeList.getIncrement();
      }
      return finalTime;
    }

    const list = gantItems.map((gantItem) => gantItem.finalTime).reverse();
    list[0] += this._timeList.getIncrement();
    return list;
  }

  tllegResponseListOrNumberByProccessName(name) {
    const gantItems = this._gantItemList.filter(
      (gantItem) => gantItem.proccess.name == name
    );

    if (gantItems.length === 1) {
      return gantItems[0].proccess.tll;
    }

    return [gantItems[0].finalTime, gantItems[0].proccess.tll];
  }
}
