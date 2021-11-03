import { Proccess } from "../../js/structures/proccess.js";
import { TableAvgResponse } from "../../js/tables/table_average_response.js";
import { TableAvgWaitTime } from "../../js/tables/table_average_wait_time.js";
import { TableGant } from "../../js/tables/table_gant.js";
import { TableProccesses } from "../../js/tables/table_proccesses.js";

import { PriorityQueue } from "../../js/structures/priority_queue.js";

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
    const queue = new PriorityQueue((a, b) => a.tll > b.tll);
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
