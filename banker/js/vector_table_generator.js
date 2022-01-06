export class VectorTableGenerator {
  constructor({ name, vector }) {
    this._makeTable(name);
    this._fillHead(vector);
    this._fillBody(vector);
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

  _fillHead(vector) {
    const size = vector.length;

    for (let i = 1; i <= size; i++) {
      const th = document.createElement("th");
      th.textContent = `R${i}`;
      this._tHeadElement.appendChild(th);
    }
  }

  _fillBody(vector) {
    const tr = document.createElement("tr");
    for (let i = 0; i < vector.length; i++) {
      const td = document.createElement("td");
      td.textContent = vector[i];
      tr.appendChild(td);
    }
    this._tBodyElement.appendChild(tr);
  }

  appendTo(parent) {
    if (parent != null) {
      parent.appendChild(this._tableElement);
    }
  }
}
