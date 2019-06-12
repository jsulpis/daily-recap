import RecapBuilder from "./src/domain/recap-builder";
import MomentDateAgent from "./src/infrastructure/moment-date-agent";

require("dotenv").config();
const say = require("say");

const dailyRecap = new RecapBuilder(new MomentDateAgent())
  .setName("Julien")
  .printCurrentDate()
  .build();

say.speak(dailyRecap, 'Victoria', 1.3);
