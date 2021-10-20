export const TableAvgResponse = (function () {
  class TableAvgResponse {
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

    insertRow(name, raf, tEsp) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdRaf = document.createElement("td");
      const tdEsp = document.createElement("td");
      const tdTRProc = document.createElement("td");

      const avg = raf + tEsp;

      tdName.textContent = name;
      tdRaf.textContent = raf;
      tdEsp.textContent = tEsp;
      tdTRProc.textContent = avg;

      tr.appendChild(tdName);
      tr.appendChild(tdRaf);
      tr.appendChild(tdEsp);
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

  return new TableAvgResponse();
})();
