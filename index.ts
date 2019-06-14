import RecapBuilder from "./src/domain/recap-builder";
import MomentDateAgent from "./src/infrastructure/moment-date-agent";
import OpenWeatherMapAgent from "./src/infrastructure/open-weather-map-agent";

require("dotenv").config();
const say = require("say");

new RecapBuilder(new MomentDateAgent(), new OpenWeatherMapAgent())
  .setName("Julien")
  .printCurrentDate()
  .printCurrentWeather("Lyon", "fr")
  .then(builder => {
    const recap = builder.build();
    console.log(recap);
    say.speak(recap, "Victoria", 1.3);
  });
