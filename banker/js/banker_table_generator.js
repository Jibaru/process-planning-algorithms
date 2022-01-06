export class BankerTableGenerator {
  constructor({ name, matrix }) {
    this._makeTable(name);
    this._fillHead(matrix);
    this._fillBody(matrix);
  }

  _makeTable(name) {
    this._tableElement = document.createElement("table");
    this._captionElement = document.createElement("caption");
    this._tHeadElement = document.createElement("thead");
    this._tBodyElement = document.createElement("tbody");

    this._captionElement.textContent = name;

    this._tableElement.appendChild(this._captionElement);
    this._tableElement.appendChild(this._tHeadElement);
    this._tableElement.appendChild(this._tBodyElement);
  }

  _fillHead(matrix) {
    const resourcesSize = matrix[0].length - 1; // total of resources - name of process

    const thName = document.createElement("th");
    thName.textContent = "Proceso";
    this._tHeadElement.appendChild(thName);

    for (let i = 1; i <= resourcesSize; i++) {
      const th = document.createElement("th");
      th.textContent = `R${i}`;
      this._tHeadElement.appendChild(th);
    }
  }

  _fillBody(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < matrix[0].length; j++) {
        const td = document.createElement("td");
        td.textContent = matrix[i][j];
        tr.appendChild(td);
      }
      this._tBodyElement.appendChild(tr);
    }
  }

  appendTo(parent) {
    if (parent != null) {
      parent.appendChild(this._tableElement);
    }
  }
}
