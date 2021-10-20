import { Proccess } from "./proccess.js";
import { TableAvgResponse } from "./table_average_response.js";
import { TableAvgWaitTime } from "./table_average_wait_time.js";
import { TableGant } from "./table_gant.js";
import { TableProccesses } from "./table_proccesses.js";

import { SJFQueue } from "./sjf_queue.js";

const FifoForm = {
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
      const proccesses = this.getProccesses(e);

      if (proccesses) {
        this.results.style.display = "block";
        this.fillTables(proccesses);
      }
    });
  },

  getProccesses(e) {
    const proccesses = e.target[0].value.split("\n").map((text) => {
      const [name, tll, raf] = text.split(",");
      return new Proccess(name, parseInt(tll), parseInt(raf));
    });

    return proccesses;
  },

  fillTables(proccesses) {
    const queue = new SJFQueue();
    proccesses.forEach((proccess) => queue.push(proccess));

    let currentReturnTime = 0;
    while (!queue.isEmpty()) {
      const proccess = queue.pop();
      const execTime = currentReturnTime;

      TableProccesses.insertRow(proccess.name, proccess.tll, proccess.raf);
      TableGant.insertRow(proccess.name, execTime);
      TableAvgWaitTime.insertRow(proccess.name, proccess.tll, execTime);
      TableAvgResponse.insertRow(proccess.name, proccess.raf, execTime);

      currentReturnTime += proccess.raf;
    }

    TableGant.insertRow("-", currentReturnTime);
  },

  clearTables() {
    TableProccesses.clear();
    TableGant.clear(), TableAvgWaitTime.clear();
    TableAvgResponse.clear();
  },
};

FifoForm.init();
