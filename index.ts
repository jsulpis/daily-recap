import RecapBuilder from "./src/domain/use-case/recap-builder";
import OpenWeatherMapService from "./src/infrastructure/open-weather-map.service";
import GoogleCalendarService from "./src/infrastructure/google-calendar.service";
import TrelloService from "./src/infrastructure/trello.service";
import SpeakerService from "./src/domain/interfaces/speaker.service";
import GoogleTtsService from "./src/infrastructure/google-tts.service";
import SayService from "./src/infrastructure/say.service";

require("dotenv").config();

// const locale = "fr";
const locale = "en";

const speaker: SpeakerService = new GoogleTtsService();
// const speaker: SpeakerService = new SayService();

getRecap().then(recap => {
  console.log(recap);
  speaker.say(recap, locale);
});

async function getRecap() {
  return await new RecapBuilder()
    .setLocale(locale)
    .sayHello("Julien")
    .sayCurrentDate()
    .sayCurrentWeather("Lyon", "fr", new OpenWeatherMapService())
    .listEventsOfTheDay(new GoogleCalendarService("personal"))
    .listEventsOfTheDay(new GoogleCalendarService("Zenika"))
    .listTodos(new TrelloService("Daily", process.env.TRELLO_DAIlY_LIST_ID))
    .listTodos(new TrelloService("Weekly", process.env.TRELLO_WEEKLY_LIST_ID))
    .build();
}
