import { CronJob } from "cron";
import { emitter } from "../helpers/events.js";

const scheduleCRARequired = () => {
  new CronJob(
    "0 10 26 * *", // 26th on every month at 10AM
    function () {
      emitter.emit("cra-required");
    },
    null,
    true
  ).start();
};

scheduleCRARequired();
