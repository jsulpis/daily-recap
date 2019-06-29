import RecapBuilder from "./src/domain/use-case/recap-builder";
import OpenWeatherMapAgent from "./src/infrastructure/open-weather-map-agent";
import GoogleCalendarAgent from "./src/infrastructure/google-calendar-agent";

require("dotenv").config();
const say = require("say");

getRecap().then(recap => {
  console.log("recap:", recap);
  say.speak(recap, "Victoria", 1.3);
});

async function getRecap() {
  return await new RecapBuilder()
    .setName("Julien")
    .printCurrentDate()
    .printCurrentWeather("Lyon", "fr", new OpenWeatherMapAgent())
    .printEventsOfTheDay(new GoogleCalendarAgent("personnal"))
    .printEventsOfTheDay(new GoogleCalendarAgent("Zenika"))
    .build();
}
