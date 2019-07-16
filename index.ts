import RecapBuilder from "./src/domain/use-case/recap-builder";
import OpenWeatherMapService from "./src/infrastructure/open-weather-map.service";
import GoogleCalendarService from "./src/infrastructure/google-calendar.service";
import TrelloService from "./src/infrastructure/trello.service";
import SpeakerService from "./src/domain/interfaces/speaker.service";
import GoogleTtsService from "./src/infrastructure/google-tts.service";

require("dotenv").config();

const speaker: SpeakerService = new GoogleTtsService();

getRecap().then(recap => {
  console.log(recap);
  speaker.say(recap);
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
