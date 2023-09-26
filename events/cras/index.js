import { emitter } from "../../helpers/events";
import { send } from "../../helpers/messaging";

emitter.on("cra-submitted", (payload) => {});

emitter.on("cra-rejected", (n) => {
  try {
    send(n);
  } catch (error) {
    console.log(error);
  }
});

emitter.on("cra-approved", (payload) => {});
