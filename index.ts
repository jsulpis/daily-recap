import RecapBuilder from "./src/domain/use-case/recap-builder";
import OpenWeatherMapAgent from "./src/infrastructure/open-weather-map-agent";
import GoogleCalendarAgent from "./src/infrastructure/google-calendar-agent";
import TrelloAgent from "./src/infrastructure/trello-agent";

require("dotenv").config();
const say = require("say");

getRecap().then(recap => {
  console.log("recap:", recap);
  say.speak(recap, "Victoria", 1.3);
});

async function getRecap() {
  return await new RecapBuilder()
    .sayHello("Julien")
    .sayCurrentDate()
    .sayCurrentWeather("Lyon", "fr", new OpenWeatherMapAgent())
    .listEventsOfTheDay(new GoogleCalendarAgent("personal"))
    .listEventsOfTheDay(new GoogleCalendarAgent("Zenika"))
    .listTodos(new TrelloAgent("Daily", process.env.TRELLO_DAIlY_LIST_ID))
    .listTodos(new TrelloAgent("Weekly", process.env.TRELLO_WEEKLY_LIST_ID))
    .build();
}
