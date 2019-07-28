import DateTimeFormatter from "./date-time-formatter";
import WeatherService from "../interfaces/weather.service";
import CalendarService from "../interfaces/calendar.service";
import TodoService from "../interfaces/todo.service";
import I18nService from "../../infrastructure/i18n.service";
import TranslatorService from "../interfaces/translator.service";

export default class RecapBuilder {
    private recap = "";

    private dateTimeFormatter: DateTimeFormatter;
    private weatherService: WeatherService;
    private calendarProviders: CalendarService[] = [];
    private todoProviders: TodoService[] = [];
    translatorService: TranslatorService;

    private cityName: string;
    private countryCode: string;

    constructor() {
        this.dateTimeFormatter = new DateTimeFormatter();
        this.translatorService = new I18nService();
        this.translatorService.init("en", "./locales");
    }

    setLocale(locale: string) {
        this.translatorService.setLocale(locale);
        return this;
    }

    sayHello(name: string): RecapBuilder {
        this.addTranslationToRecap("hello", { name });
        return this;
    }

    addTranslationToRecap(key: string, payload?: Object): void {
        this.recap = this.recap.concat(
            this.translatorService.getTranslation(key, payload)
        );
    }

    sayCurrentDate(): RecapBuilder {
        const date = this.dateTimeFormatter.formatDate(new Date(Date.now()));
        const time = this.dateTimeFormatter.formatTime(new Date(Date.now()));
        this.recap = this.recap.concat(` It's ${time}, ${date}.`);
        return this;
    }

    sayCurrentWeather(
        cityName: string,
        countryCode: string,
        weatherAgent: WeatherService
    ): RecapBuilder {
        this.weatherService = weatherAgent;
        this.cityName = cityName;
        this.countryCode = countryCode;
        return this;
    }

    listEventsOfTheDay(calendarAgent: CalendarService): RecapBuilder {
        this.calendarProviders.push(calendarAgent);
        return this;
    }

    listTodos(todoProvider: TodoService) {
        this.todoProviders.push(todoProvider);
        return this;
    }

    async build(): Promise<string> {
        if (!!this.weatherService) {
            await this.buildWeather();
        }
        for (const agent of this.calendarProviders) {
            await this.buildEvents(agent);
        }
        for (const todoProvider of this.todoProviders) {
            await this.buildTodos(todoProvider);
        }

        return this.recap.trim();
    }

    private async buildWeather(): Promise<void> {
        const currentWeather = await this.weatherService.getCurrentWeather(
            this.cityName,
            this.countryCode
        );
        this.recap = this.recap.concat(
            ` The weather in ${this.cityName} is currently ${
                currentWeather.description
            } with a temperature of ${currentWeather.temperature} degrees.`
        );
    }

    private async buildEvents(calendarAgent: CalendarService): Promise<void> {
        let events;
        try {
            events = await calendarAgent.getEventsOfTheDay();
        } catch (err) {
            return console.error(err);
        }

        if (events.length === 0) {
            this.recap = this.recap.concat(
                ` You don't have any event on your ${calendarAgent.getCalendarName()} agenda today.`.replace(
                    /  /,
                    " "
                )
            );
            return;
        }

        const multipleEvents = events.length > 1;
        this.recap = this.recap.concat(
            ` You have ${events.length} event${
                multipleEvents ? "s" : ""
            } on your ${calendarAgent.getCalendarName()} agenda today: `.replace(
                /  /,
                " "
            )
        );
        events.forEach(event => {
            this.recap = this.recap.concat(event.title);
            if (!event.allDay) {
                const time = this.dateTimeFormatter.formatTime(event.time);
                this.recap = this.recap.concat(` at ${time}`);
            }
            this.recap = this.recap.concat(" and ");
        });
        this.recap = this.recap.replace(/ and $/, ".");
    }

    private async buildTodos(todoProvider: TodoService): Promise<void> {
        const todos = await todoProvider.getTodos();

        if (todos.length === 0) {
            this.recap = this.recap.concat(
                ` You don't have any task on your ${todoProvider.getListName()} list.`.replace(
                    /  /,
                    " "
                )
            );
            return;
        }

        const multipleTasks = todos.length > 1;
        this.recap = this.recap.concat(
            ` You have ${todos.length} task${
                multipleTasks ? "s" : ""
            } on your ${todoProvider.getListName()} list: `.replace(/  /, " ")
        );
        todos.forEach(task => {
            this.recap = this.recap.concat(task.title);
            this.recap = this.recap.concat(" and ");
        });
        this.recap = this.recap.replace(/ and $/, ".");
    }
}
