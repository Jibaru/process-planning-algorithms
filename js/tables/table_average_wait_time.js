export const TableAvgWaitTime = (function () {
  class TableAvgWaitTime {
    constructor() {
      this._tBodyElement = document.getElementById("tbody-avg-wait-time");
      this._trAverage = document.createElement("tr");
      this._sum = 0;
      this._counter = 0;

      const tdName = document.createElement("td");
      this._tdAvg = document.createElement("td");

      tdName.textContent = "Tiempo espera promedio";
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

    insertRow(name, tll, tEje) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdTEje = document.createElement("td");
      const tdTll = document.createElement("td");
      const tdEPProc = document.createElement("td");

      const avg = tEje - tll;

      tdName.textContent = name;
      tdTll.textContent = tll;
      tdTEje.textContent = tEje;
      tdEPProc.textContent = avg;

      tr.appendChild(tdName);
      tr.appendChild(tdTEje);
      tr.appendChild(tdTll);
      tr.appendChild(tdEPProc);

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

  return new TableAvgWaitTime();
})();
