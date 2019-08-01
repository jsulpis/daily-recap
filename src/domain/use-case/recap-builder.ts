import I18nService from "../../infrastructure/i18n.service";
import CalendarService from "../interfaces/calendar.service";
import TodoService from "../interfaces/todo.service";
import TranslatorService from "../interfaces/translator.service";
import WeatherService from "../interfaces/weather.service";
import DateTimeFormatter from "./date-time-formatter";

export default class RecapBuilder {
    public translatorService: TranslatorService;
    public locale = "en";
    private recap = "";

    private dateTimeFormatter: DateTimeFormatter;
    private weatherService: WeatherService;
    private calendarProviders: CalendarService[] = [];
    private todoProviders: TodoService[] = [];

    private city: string;
    private countryCode: string;

    constructor() {
        this.dateTimeFormatter = new DateTimeFormatter();
        this.translatorService = new I18nService();
        this.translatorService.init(this.locale, "./locales");
    }

    public setLocale(locale: string) {
        this.locale = locale;
        this.translatorService.setLocale(this.locale);
        return this;
    }

    public sayHello(name: string): RecapBuilder {
        this.addTranslationToRecap("hello", { name });
        return this;
    }

    public addTranslationToRecap(key: string, payload?: object): void {
        let newSentence = this.translatorService.getTranslation(key, payload);
        newSentence = (" " + newSentence).replace(/  /, " "); // add a space at the beginning and delete double space if any
        this.recap = this.recap.concat(newSentence);
    }

    public sayCurrentDate(): RecapBuilder {
        const date = this.dateTimeFormatter.formatDate(
            new Date(Date.now()),
            this.locale
        );
        const time = this.dateTimeFormatter.formatTime(
            new Date(Date.now()),
            this.locale
        );
        this.addTranslationToRecap("dateTime", { date, time });
        return this;
    }

    public sayCurrentWeather(
        cityName: string,
        countryCode: string,
        weatherService: WeatherService
    ): RecapBuilder {
        this.weatherService = weatherService;
        this.city = cityName;
        this.countryCode = countryCode;
        return this;
    }

    public listEventsOfTheDay(calendarService: CalendarService): RecapBuilder {
        this.calendarProviders.push(calendarService);
        return this;
    }

    public listTodos(todoProvider: TodoService) {
        this.todoProviders.push(todoProvider);
        return this;
    }

    public async build(): Promise<string> {
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
            this.city,
            this.countryCode,
            this.locale
        );
        this.addTranslationToRecap("weather", {
            city: this.city,
            description: currentWeather.description,
            temperature: currentWeather.temperature
        });
    }

    private async buildEvents(calendarAgent: CalendarService): Promise<void> {
        let events;
        try {
            events = await calendarAgent.getEventsOfTheDay();
        } catch (err) {
            return console.error(err);
        }

        const calendarName = calendarAgent.getCalendarName()
            ? " " + calendarAgent.getCalendarName()
            : "";

        if (events.length === 0) {
            this.addTranslationToRecap("calendar.empty", { calendarName });
            return;
        }

        const multipleEvents = events.length > 1;
        const calendarTranslationKey = multipleEvents
            ? "calendar.multipleEvents"
            : "calendar.oneEvent";
        this.addTranslationToRecap(calendarTranslationKey, {
            calendarName,
            numberOfEvents: events.length
        });

        events.forEach(event => {
            this.recap = this.recap.concat(event.title);
            if (!event.allDay) {
                const time = this.dateTimeFormatter.formatTime(
                    event.time,
                    this.locale
                );
                this.addTranslationToRecap("calendar.eventTime", { time });
            }
            this.addTranslationToRecap("and");
        });
        // remove the final "and" and put a full stop.
        this.recap = this.recap.replace(/ [a-z]* $/, ".");
    }

    private async buildTodos(todoProvider: TodoService): Promise<void> {
        const todos = await todoProvider.getTodos();

        if (todos.length === 0) {
            this.addTranslationToRecap("todo.empty", {
                listName: todoProvider.getListName()
            });
            return;
        }

        const multipleTasks = todos.length > 1;
        const todoTranslationKey = multipleTasks
            ? "todo.multipleTasks"
            : "todo.oneTask";
        this.addTranslationToRecap(todoTranslationKey, {
            listName: todoProvider.getListName(),
            numberOfTasks: todos.length
        });

        todos.forEach(task => {
            this.recap = this.recap.concat(task.title);
            this.addTranslationToRecap("and");
        });
        // remove the final "and" and put a full stop.
        this.recap = this.recap.replace(/ [a-z]* $/, ".");
    }
}
