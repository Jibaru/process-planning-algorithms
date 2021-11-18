import { IndexedProccess } from "../../js/structures/indexed_proccess.js";
import { TableAvgResponseRoundRobin } from "../../js/tables/table_average_response_round_robin.js";
import { TableAvgWaitTimeRoundRobin } from "../../js/tables/table_average_wait_time_round_robin.js";
import { TableGant } from "../../js/tables/table_gant.js";
import { TableProccesses } from "../../js/tables/table_proccesses.js";
import { InputParser } from "../../js/utils/parser.js";
import { InputValidator } from "../../js/utils/validator.js";
import { RoundRobinGenerator } from "../../js/structures/round_robin_generator.js";

const RoundRobinForm = {
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

      if (this.validProccessesInput(e) && this.validQInput(e)) {
        const proccesses = this.getProccesses(e);
        const q = this.getQ(e);
        this.results.style.display = "block";
        this.fillTables(proccesses, q);
      } else {
        this.results.style.display = "none";
        alert(InputValidator.MESSAGE);
      }
    });
  },

  validProccessesInput(e) {
    const input = e.target[0].value;
    return new InputValidator(input).isValid();
  },

  validQInput(e) {
    const input = e.target[1].value;
    return !isNaN(parseFloat(input.trim()));
  },

  getProccesses(e) {
    return new InputParser(e.target[0].value).parse().map((arr, i) => {
      return new IndexedProccess(i, ...arr);
    });
  },

  getQ(e) {
    return parseFloat(e.target[1].value);
  },

  fillTables(processes, q) {
    const generator = new RoundRobinGenerator(q, processes);

    generator.execute();

    processes.sort((a, b) => a.name > b.name);

    while (processes.length != 0) {
      const process = processes.shift();

      const initialTimeExecution = generator.initialTimeExecutionByProccessName(
        process.name
      );
      const lastInitialTimeExecutionLastFinalTimeList =
        generator.lastInitialTimeExecutionLastFinalTimeListByName(process.name);
      const lastFinalTime = generator.lastFinalTimeByName(process.name);

      TableProccesses.insertRow(process.name, process.tll, process.raf);
      TableAvgWaitTimeRoundRobin.insertRow(
        process.name,
        initialTimeExecution,
        lastInitialTimeExecutionLastFinalTimeList
      );
      TableAvgResponseRoundRobin.insertRow(process.name, lastFinalTime);
    }

    let lastTime = 0;
    while (!generator.gantItemListIsEmpty()) {
      const gantItem = generator.popGantItem();
      TableGant.insertRow(gantItem.proccess.name, gantItem.initialTime);
      lastTime = gantItem.finalTime;
    }
    TableGant.insertRow("-", lastTime);
  },

  clearTables() {
    TableProccesses.clear();
    TableGant.clear();
    TableAvgWaitTimeRoundRobin.clear();
    TableAvgResponseRoundRobin.clear();
  },
};

RoundRobinForm.init();
