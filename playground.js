import "dotenv/config";
import "./config/database";
import { Consultant } from "./models";

const x = await Consultant.find({ manager: "00000018dc142d798009c8eb" });
console.log(x);