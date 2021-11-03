export const TableProccesses = (function () {
  class TableProccesses {
    constructor() {
      this._tBodyElement = document.getElementById("tbody-process");
    }

    insertRow(name, tll, raf) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdTll = document.createElement("td");
      const tdRaf = document.createElement("td");

      tdName.textContent = name;
      tdTll.textContent = tll;
      tdRaf.textContent = raf;

      tr.appendChild(tdName);
      tr.appendChild(tdTll);
      tr.appendChild(tdRaf);
      this._tBodyElement.appendChild(tr);
    }

    clear() {
      while (this._tBodyElement.firstChild) {
        this._tBodyElement.removeChild(this._tBodyElement.firstChild);
      }
    }
  }

  return new TableProccesses();
})();
