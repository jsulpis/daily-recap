import RecapBuilder from "./src/domain/recap-builder";
import MomentDateAgent from "./src/infrastructure/moment-date-agent";
import OpenWeatherMapAgent from "./src/infrastructure/open-weather-map-agent";
import GoogleCalendarAgent from "./tests/infrastructure/google-calendar-agent";

require("dotenv").config();
const say = require("say");

getRecap().then(recap => {
  console.log(recap);
  say.speak(recap, "Victoria", 1.3);
});

async function getRecap() {
  return await new RecapBuilder()
    .setName("Julien")
    .printCurrentDate(new MomentDateAgent())
    .printCurrentWeather("Lyon", "fr", new OpenWeatherMapAgent())
    .printEventsOfTheDay(new GoogleCalendarAgent())
    .build();
}
