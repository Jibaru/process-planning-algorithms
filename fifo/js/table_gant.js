export const TableGant = (function () {
  class TableGant {
    constructor() {
      this._tBodyElement = document.getElementById("tbody-gant");
    }

    insertRow(name, execTime) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdExecTime = document.createElement("td");

      tdName.textContent = name;
      tdExecTime.textContent = execTime;

      tr.appendChild(tdName);
      tr.appendChild(tdExecTime);
      this._tBodyElement.appendChild(tr);
    }

    clear() {
      while (this._tBodyElement.firstChild) {
        this._tBodyElement.removeChild(this._tBodyElement.firstChild);
      }
    }
  }

  return new TableGant();
})();
