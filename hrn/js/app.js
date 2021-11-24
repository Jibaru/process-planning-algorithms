import { Proccess } from "../../js/structures/proccess.js";
import { TableAvgResponse } from "../../js/tables/table_average_response.js";
import { TableAvgWaitTime } from "../../js/tables/table_average_wait_time.js";
import { TableGant } from "../../js/tables/table_gant.js";
import { TableProccesses } from "../../js/tables/table_proccesses.js";
import { InputParser } from "../../js/utils/parser.js";
import { InputValidator } from "../../js/utils/validator.js";
import { HRNGenerator } from "../../js/structures/hrn_generator.js";

const HrnForm = {
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
        const proccesses = this.getProccesses(e);
        this.results.style.display = "block";
        this.fillTables(proccesses);
      } else {
        this.results.style.display = "none";
        alert(InputValidator.MESSAGE);
      }
    });
  },

  validInput(e) {
    const input = e.target[0].value;
    return new InputValidator(input).isValid();
  },

  getProccesses(e) {
    return new InputParser(e.target[0].value).parse().map((arr) => {
      return new Proccess(...arr);
    });
  },

  fillTables(proccesses) {
    const generator = new HRNGenerator(proccesses);

    let currentReturnTime = generator.timeExcceeded;
    while (!generator.isEmpty()) {
      const proccess = generator.pop();

      TableProccesses.insertRow(proccess.name, proccess.tll, proccess.raf);
      TableGant.insertRow(proccess.name, currentReturnTime);
      TableAvgWaitTime.insertRow(
        proccess.name,
        proccess.tll,
        currentReturnTime
      );
      TableAvgResponse.insertRow(
        proccess.name,
        generator.timeExcceeded,
        proccess.tll
      );

      currentReturnTime = generator.timeExcceeded;
    }

    TableGant.insertRow("-", currentReturnTime);
  },

  clearTables() {
    TableProccesses.clear();
    TableGant.clear(), TableAvgWaitTime.clear();
    TableAvgResponse.clear();
  },
};

HrnForm.init();
