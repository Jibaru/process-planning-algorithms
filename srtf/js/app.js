import { IndexedProccess } from "../../js/structures/indexed_proccess.js";
import { TableAvgResponseSRTF } from "../../js/tables/table_average_response_srtf.js";
import { TableAvgWaitTimeSRTF } from "../../js/tables/table_average_wait_time_srtf.js";
import { TableGant } from "../../js/tables/table_gant.js";
import { TableProccesses } from "../../js/tables/table_proccesses.js";
import { InputParser } from "../../js/utils/parser.js";
import { InputValidator } from "../../js/utils/validator.js";
import { SRTFGenerator } from "../../js/structures/srtf_generator.js";

const SRTFForm = {
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
    return new InputParser(e.target[0].value).parse().map((arr, index) => {
      return new IndexedProccess(index, ...arr);
    });
  },

  fillTables(proccesses) {
    const generator = new SRTFGenerator(proccesses);

    generator.execute();

    proccesses.sort((a, b) => a.name > b.name);

    while (proccesses.length != 0) {
      const process = proccesses.shift();

      const teuTea =
        generator.lastInitialTimeExecutionLastFinalTimeListOrNumberByName(
          process.name
        );
      const tlleg = generator.tLlegListOrNumberByName(process.name);
      const tfu = generator.lastFinalTimeListOrNumberByName(process.name);
      const tllegResp = generator.tllegResponseListOrNumberByProccessName(
        process.name
      );

      TableProccesses.insertRow(process.name, process.tll, process.raf);
      TableAvgWaitTimeSRTF.insertRow(process.name, teuTea, tlleg);
      TableAvgResponseSRTF.insertRow(process.name, tfu, tllegResp);
    }

    let finalTime = null;
    while (!generator.gantItemListIsEmpty()) {
      const gantItem = generator.popGantItem();
      finalTime = gantItem.finalTime;
      TableGant.insertRow(gantItem.proccess.name, gantItem.initialTime);
    }
    TableGant.insertRow("-", finalTime);
  },

  clearTables() {
    TableProccesses.clear();
    TableGant.clear();
    TableAvgWaitTimeSRTF.clear();
    TableAvgResponseSRTF.clear();
  },
};

SRTFForm.init();
