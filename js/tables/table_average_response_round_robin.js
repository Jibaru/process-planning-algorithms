export const TableAvgResponseRoundRobin = (function () {
  class TableAvgResponseRoundRobin {
    constructor() {
      this._tBodyElement = document.getElementById("tbody-avg-response");
      this._trAverage = document.createElement("tr");
      this._sum = 0;
      this._counter = 0;

      const tdName = document.createElement("td");
      this._tdAvg = document.createElement("td");

      tdName.textContent = "Tiempo respuesta promedio";

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

    insertRow(name, TFu) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdTFu = document.createElement("td");

      tdName.textContent = name;
      tdTFu.textContent = TFu;

      tr.appendChild(tdName);
      tr.appendChild(tdTFu);

      this._addToAverage(TFu);
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

  return new TableAvgResponseRoundRobin();
})();
