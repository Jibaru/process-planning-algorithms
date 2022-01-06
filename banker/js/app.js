import { BankerTableGenerator } from "./banker_table_generator.js";
import { VectorTableGenerator } from "./vector_table_generator.js";
import { BankerGenerator } from "../../js/structures/banker_generator.js";

const BankerForm = {
  formInput: null,
  results: null,
  init() {
    this.formInput = document.getElementById("form-input");
    this.results = document.getElementById("results");
    this.results.style.display = "none";
    this.initListeners();
  },

  initListeners() {
    this.formInput.addEventListener("submit", (e) => {
      e.preventDefault();
      this.clearTables();

      if (this.validInput(e)) {
        const maxMatrix = this.parseMatrix(e.target[0].value);
        const allocationMatrix = this.parseMatrix(e.target[1].value);
        const resourcesVector = this.parseVector(e.target[2].value);

        this.results.style.display = "block";
        this.fillTables(maxMatrix, allocationMatrix, resourcesVector);
      } else {
        this.results.style.display = "none";
        alert("Input inválido");
      }
    });
  },

  validInput(e) {
    const maxMatrixInput = e.target[0].value;
    const allocationMatrixInput = e.target[1].value;
    const resourcesVectorInput = e.target[2].value;

    if (
      !this.validMatrix(maxMatrixInput) ||
      !this.validMatrix(allocationMatrixInput)
    ) {
      return false;
    }

    const [processesSize, resourcesSize] =
      this.getMatrixProcessesResourcesSize(maxMatrixInput);

    return (
      this.validMatrixSize(
        allocationMatrixInput,
        processesSize,
        resourcesSize
      ) && this.validVectorSize(resourcesVectorInput, resourcesSize)
    );
  },

  validMatrix(matrixString) {
    const isString = (obj) =>
      Object.prototype.toString.call(obj) === "[object String]";

    const isNum = (val) => {
      var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
      if (!floatRegex.test(val)) return false;

      val = parseFloat(val);
      if (isNaN(val)) return false;
      return true;
    };

    if (!isString(matrixString)) {
      return false;
    }

    const parts = matrixString.trim().split("\n");

    if (parts.length <= 1) {
      return false;
    }

    const totalResources = parts[0].split(",").length - 1;

    for (const part of parts) {
      const processResources = part.split(",");

      if (processResources.length <= 1) {
        return false;
      }

      processResources.splice(0, 1);

      if (processResources.length !== totalResources) {
        return false;
      }

      for (const processResource of processResources) {
        if (!isNum(processResource)) {
          return false;
        }
      }
    }

    return true;
  },

  validVector(vectorString) {
    const isString = (obj) =>
      Object.prototype.toString.call(obj) === "[object String]";

    const isNum = (val) => {
      var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
      if (!floatRegex.test(val)) return false;

      val = parseFloat(val);
      if (isNaN(val)) return false;
      return true;
    };

    if (!isString(vectorString)) {
      return false;
    }

    const parts = vectorString.trim().split(",");

    for (const part of parts) {
      if (!isNum(part)) {
        return false;
      }
    }

    return true;
  },

  getMatrixProcessesResourcesSize(matrixString) {
    const parts = matrixString.trim().split("\n");
    const totalResources = parts[0].split(",").length - 1;
    return [parts.length, totalResources];
  },

  validMatrixSize(matrixString, processesSize, resourcesSize) {
    if (!this.validMatrix(matrixString)) {
      return false;
    }

    const parts = matrixString.trim().split("\n");
    const totalResources = parts[0].split(",").length - 1;

    return parts.length === processesSize && totalResources === resourcesSize;
  },

  validVectorSize(vectorString, size) {
    if (!this.validVector(vectorString)) {
      return false;
    }

    const resources = vectorString.trim().split(",");

    return resources.length === size;
  },

  parseVector(vectorString) {
    return vectorString.trim().split(",").map(parseFloat);
  },

  parseMatrix(matrixString) {
    return matrixString
      .trim()
      .split("\n")
      .map((text) => {
        const parts = text.split(",");

        const name = parts[0];
        parts.splice(0, 1);
        const resources = parts.map(parseFloat);

        return [name, ...resources];
      });
  },

  fillTables(maxMatrix, allocationMatrix, resourcesVector) {
    const bankerGenerator = new BankerGenerator(
      maxMatrix,
      allocationMatrix,
      resourcesVector
    );

    let tableCounter = 1;
    while (!bankerGenerator.isEnded()) {
      if (tableCounter == 1) {
        const maxMatrixTable = new BankerTableGenerator({
          name: `Tabla ${tableCounter}. Matriz Demanda`,
          matrix: bankerGenerator.maxMatrix,
        });
        maxMatrixTable.appendTo(this.results);
        tableCounter++;
      } else {
        const h3 = document.createElement("h3");
        h3.textContent = `Se toma el proceso: ${bankerGenerator.currentProcessLabel}`;
        this.results.appendChild(h3);
      }

      const allocationMatrixTable = new BankerTableGenerator({
        name: `Tabla ${tableCounter}. Matriz Asignación`,
        matrix: bankerGenerator.allocationMatrix,
      });
      tableCounter++;
      allocationMatrixTable.appendTo(this.results);

      const neededMatrixTable = new BankerTableGenerator({
        name: `Tabla ${tableCounter}. Matriz Necesidad`,
        matrix: bankerGenerator.neededMatrix,
      });
      tableCounter++;
      neededMatrixTable.appendTo(this.results);

      if (tableCounter == 4) {
        const resourcesVectorTable = new VectorTableGenerator({
          name: `Tabla ${tableCounter}. Vector de recursos`,
          vector: bankerGenerator.resourcesVector,
        });
        tableCounter++;
        resourcesVectorTable.appendTo(this.results);
      }

      const avaliableVectorTable = new VectorTableGenerator({
        name: `Tabla ${tableCounter}. Vector disponible`,
        vector: bankerGenerator.avaliableVector,
      });
      tableCounter++;
      avaliableVectorTable.appendTo(this.results);

      this.results.appendChild(document.createElement("hr"));

      const accepted = bankerGenerator.executeOne();

      if (!accepted && !bankerGenerator.isEnded()) {
        const h3 = document.createElement("h3");
        h3.textContent = "Sistema No seguro. Interbloqueo";

        const vector = new VectorTableGenerator({
          name: `Tabla ${tableCounter}. Vector disponible`,
          vector: bankerGenerator.avaliableVector,
        });
        tableCounter++;
        this.results.appendChild(h3);
        vector.appendTo(this.results);

        break;
      }

      if (bankerGenerator.isEnded()) {
        const h3 = document.createElement("h3");
        h3.textContent = "Sistema seguro. No hubo Interbloqueo";
        this.results.appendChild(h3);
      }
    }
  },

  clearTables() {
    while (this.results.firstChild) {
      this.results.removeChild(this.results.lastChild);
    }
  },
};

BankerForm.init();
