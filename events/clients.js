import { emitter } from "../helpers/events";

emitter.on("client-created", (x) => {
  console.log(x);
});