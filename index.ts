import RecapBuilder from "./src/domain/use-case/recap-builder";
import OpenWeatherMapService from "./src/infrastructure/open-weather-map.service";
import GoogleCalendarService from "./src/infrastructure/google-calendar.service";
import TrelloService from "./src/infrastructure/trello.service";

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
    .sayCurrentWeather("Lyon", "fr", new OpenWeatherMapService())
    .listEventsOfTheDay(new GoogleCalendarService("personal"))
    .listEventsOfTheDay(new GoogleCalendarService("Zenika"))
    .listTodos(new TrelloService("Daily", process.env.TRELLO_DAIlY_LIST_ID))
    .listTodos(new TrelloService("Weekly", process.env.TRELLO_WEEKLY_LIST_ID))
    .build();
}
