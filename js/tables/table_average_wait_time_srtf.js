export const TableAvgWaitTimeSRTF = (function () {
  class TableAvgWaitTimeSRTF {
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

    insertRow(name, TEuTFaListOrNum, TLlegListOrNum) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdTEuTFa = document.createElement("td");
      const tdTlleg = document.createElement("td");
      const tdEPProc = document.createElement("td");

      let avg = 0;

      tdName.textContent = name;

      if (typeof TEuTFaListOrNum === "number") {
        tdTEuTFa.textContent = TEuTFaListOrNum;
        avg += TEuTFaListOrNum;
      } else {
        for (const data of TEuTFaListOrNum) {
          avg += data.lastFinalTime - data.initialTimeExecution;
          tdTEuTFa.textContent += `+(${data.lastFinalTime} - ${data.initialTimeExecution})`;
        }
        tdTEuTFa.textContent = tdTEuTFa.textContent.substring(1);
      }

      if (typeof TLlegListOrNum === "number") {
        tdTlleg.textContent = TLlegListOrNum;
        avg -= TLlegListOrNum;
      } else {
        for (const data of TLlegListOrNum) {
          avg += data.initialTimeExecution - data.lastFinalTime;
          tdTlleg.textContent += `+(${data.initialTimeExecution} - ${data.lastFinalTime})`;
        }
        tdTlleg.textContent = tdTlleg.textContent.substring(1);
      }

      tdEPProc.textContent = avg;

      tr.appendChild(tdName);
      tr.appendChild(tdTEuTFa);
      tr.appendChild(tdTlleg);
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

  return new TableAvgWaitTimeSRTF();
})();
