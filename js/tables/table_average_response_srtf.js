export const TableAvgResponseSRTF = (function () {
  class TableAvgResponseSRTF {
    constructor() {
      this._tBodyElement = document.getElementById("tbody-avg-response");
      this._trAverage = document.createElement("tr");
      this._sum = 0;
      this._counter = 0;

      const tdName = document.createElement("td");
      this._tdAvg = document.createElement("td");

      tdName.textContent = "Tiempo respuesta promedio";
      tdName.colSpan = "3";

      this._trAverage.appendChild(tdName);
      this._trAverage.appendChild(this._tdAvg);
    }

    _addToAverage(value) {
      this._counter++;
      this._sum += value;
      this._tdAvg.textContent = this._sum / this._counter;
    }

    _appendTR(tr) {
      if (this._tBodyElement.children.length == 0) {
        this._tBodyElement.appendChild(tr);
      } else {
        this._tBodyElement.appendChild(tr);
      }

      this._tBodyElement.appendChild(this._trAverage);
    }

    insertRow(name, TFuListOrNumber, tllListOrNumber) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdTFu = document.createElement("td");
      const tdTll = document.createElement("td");
      const tdTRProc = document.createElement("td");

      let avg = 0;

      tdName.textContent = name;

      if (typeof TFuListOrNumber === "number") {
        tdTFu.textContent = TFuListOrNumber;
        avg += TFuListOrNumber;
      } else {
        let rest = TFuListOrNumber[0];
        tdTFu.textContent += `-${TFuListOrNumber[0]}`;
        for (let i = 1; i < TFuListOrNumber.length; i++) {
          rest -= TFuListOrNumber[i];
          tdTFu.textContent += `-${TFuListOrNumber[i]}`;
        }
        tdTFu.textContent = tdTFu.textContent.substring(1);
        avg += rest;
      }

      if (typeof tllListOrNumber === "number") {
        tdTll.textContent = tllListOrNumber;
        avg -= tllListOrNumber;
      } else {
        let rest = tllListOrNumber[0];
        tdTll.textContent += `-${tllListOrNumber[0]}`;
        for (let i = 1; i < tllListOrNumber.length; i++) {
          rest -= tllListOrNumber[i];
          tdTll.textContent += `-${tllListOrNumber[i]}`;
        }
        tdTll.textContent = tdTll.textContent.substring(1);
        avg += rest;
      }

      tdTRProc.textContent = avg;

      tr.appendChild(tdName);
      tr.appendChild(tdTFu);
      tr.appendChild(tdTll);
      tr.appendChild(tdTRProc);

      this._addToAverage(avg);
      this._appendTR(tr);
    }

    clear() {
      this._sum = 0;
      this._counter = 0;
      while (this._tBodyElement.firstChild) {
        this._tBodyElement.removeChild(this._tBodyElement.firstChild);
      }
    }
  }

  return new TableAvgResponseSRTF();
})();
