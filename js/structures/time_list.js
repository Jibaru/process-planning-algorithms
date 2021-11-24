import { FloatSubstractor } from "../utils/float_operators.js";

export class TimeList {
  constructor(indexedProcesses) {
    this._indexedProcesses = indexedProcesses.map((indexedProcess) => ({
      ...indexedProcess,
    }));
    this._maxTimeExecution = indexedProcesses
      .map((indexedProcesses) => indexedProcesses.raf)
      .reduce((prev, curr) => prev + curr, 0.0);

    this._minTime = Math.min(
      ...indexedProcesses.map((indexedProcess) => indexedProcess.tll)
    );

    this._increment = 1;
    this._calculateIncrement();
  }

  _calculateIncrement() {
    const rafs = this._indexedProcesses.map((indexProcess) => indexProcess.raf);
    const rafsAreIntegers =
      rafs.filter((raf) => Number.isInteger(raf)).length ===
      this._indexedProcesses.length;

    if (rafsAreIntegers) {
      this._increment = 1;
    } else {
      const sizeDecimals = Math.max(
        rafs
          .filter((num) => !Number.isInteger(num))
          .map((num) => `${num}`.split(".")[1].length)
      );
      this._increment = parseFloat("0." + "1".padStart(sizeDecimals - 1, "0"));
    }
  }

  getMaxTimeExecution() {
    return this._maxTimeExecution;
  }

  getMinTime() {
    return this._minTime;
  }

  getIncrement() {
    return this._increment;
  }

  isEmpty() {
    return this._indexedProcesses.length === 0;
  }

  filterByTll(tll) {
    return this._indexedProcesses.filter(
      (indexedProcess) => indexedProcess.tll === tll
    );
  }

  caseMinTime(time) {
    // Se buscan todos los procesos que tengan tll == tiempo.
    let processes = this.filterByTll(time);

    // Si existe uno, se devuelve ese.
    if (processes.length === 1) {
      return processes[0];
    }
    // Sino, se toma el que tenga menor raf.
    const minRaf = Math.min(...processes.map((process) => process.raf));
    processes = processes.filter((process) => process.raf === minRaf);
    // Si existe uno, se devuelve ese.
    if (processes.length === 1) {
      return processes[0];
    }

    // Sino, se toma el que tenga menor index.
    const minIndex = Math.min(...processes.map((process) => process.index));
    const process = processes.find((process) => process.index === minIndex);

    return process;
  }

  caseCurrentIndexProcessEnded(time) {
    // Se buscan los procesos que tengan tll <= time
    let processes = this._indexedProcesses.filter(
      (process) => process.tll < time
    );

    // Si no existen, se devuleve el que tenga el que tenga menor tll
    if (processes.length === 0) {
      const minTll = Math.min(
        ...this._indexedProcesses.map((process) => process.tll)
      );
      processes = this._indexedProcesses.filter(
        (process) => process.tll === minTll
      );

      if (processes.length === 1) {
        return processes[0];
      }

      const minIndex = Math.min(
        ...this._indexedProcesses.map((processes) => processes.index)
      );
      return this._indexedProcesses.find(
        (process) => process.index === minIndex
      );
    }

    // Si existe uno, se devuelve ese
    if (processes.length === 1) {
      return processes[0];
    }

    // Sino, se busca los procesos por el que tenga menor ráfaga
    const minRaf = Math.min(...processes.map((process) => process.raf));
    processes = this._indexedProcesses.filter(
      (process) => process.raf === minRaf
    );

    // Si existe uno, se devuelve ese
    if (processes.length === 1) {
      return processes[0];
    }
    // Se filtran los procesos por el que tenga la menor index
    const minIndex = Math.min(...processes.map((processes) => processes.index));
    const process = processes.find((process) => process.index === minIndex);

    return process;
  }

  otherCases(time, currentIndexedProcess) {
    // Se buscan todos los procesos que tengan tll == tiempo.
    let processes = this.filterByTll(time);

    // Si no existe ninguno, se devuelve el actual
    if (processes.length === 0) {
      return currentIndexedProcess;
    }

    // Sobre esa búsqueda, se filtran los procesos
    // que tengan raf < actual.raf
    processes = processes.filter(
      (process) => process.raf < currentIndexedProcess.raf
    );

    // Si no existe ninguno, se devuelve el actual
    if (processes.length === 0) {
      return currentIndexedProcess;
    }

    // Si existe uno, se devuelve ese.
    if (processes.length === 1) {
      return processes[0];
    }

    // Si existe más de uno, buscar el que tiene menor raf
    const minRaf = Math.min(...processes.map((process) => process.raf));
    processes = processes.filter((process) => process.raf === minRaf);

    // Si existe uno, se devuelve ese
    if (processes.length === 1) {
      return processes[0];
    }

    // Si existe más de uno, buscar el que tiene menor index
    const minIndex = Math.min(...processes.map((process) => process.index));
    const process = processes.find((process) => process.index === minIndex);

    return process;
  }

  getAtTime(time, currentIndexedProcess) {
    if (time === this.getMinTime()) {
      return this.caseMinTime(time);
    }

    if (currentIndexedProcess === null) {
      return this.caseCurrentIndexProcessEnded(time);
    }

    return this.otherCases(time, currentIndexedProcess);
  }

  decreaseRafByIndex(index) {
    const listIndex = this._indexedProcesses.findIndex(
      (indexedProcess) => indexedProcess.index === index
    );

    if (listIndex != -1) {
      const substraction = new FloatSubstractor(
        this._indexedProcesses[listIndex].raf,
        this.getIncrement()
      ).result();
      this._indexedProcesses[listIndex].raf = substraction;

      if (this._indexedProcesses[listIndex].raf <= 0) {
        this._indexedProcesses.splice(listIndex, 1);
        console.log("Process removed");
        return -1;
      }
    } else {
      console.log("Can't decrease, process not found");
    }
  }
}
