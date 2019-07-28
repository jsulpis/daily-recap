import RecapBuilder from "../../src/domain/use-case/recap-builder";
import WeatherService from "../../src/domain/interfaces/weather.service";
import CalendarService from "../../src/domain/interfaces/calendar.service";
import TodoService from "../../src/domain/interfaces/todo.service";

describe("RecapBuilder", () => {
    it("should add a translated text to the recap", async () => {
        const builder = new RecapBuilder();
        builder.translatorService = {
            init: () => {},
            setLocale: () => {},
            getTranslation: (locale, key) => "Hello Julien."
        };

        const recap = await builder.sayHello("Julien").build();
        expect(recap).toBe("Hello Julien.");
    })

    it("should set the name", async () => {
        let recap = await new RecapBuilder().sayHello("World").build();
        expect(recap).toBe("Hello World.");
        recap = await new RecapBuilder().sayHello("Julien").build();
        expect(recap).toBe("Hello Julien.");
    });

    it("should set the date", async () => {
        const DATE_TEST = new Date("2019-06-02T14:30");
        Date.now = jest.fn(() => DATE_TEST.getTime());

        const recap = await new RecapBuilder().sayCurrentDate().build();
        expect(recap).toBe("It's 2:30 pm, Sunday, June 2.");
    });

    it("should set the current weather", async () => {
        const mockWeatherService: WeatherService = {
            getCurrentWeather: () =>
                Promise.resolve({ description: "cloudy", temperature: 20 })
        };

        const recap = await new RecapBuilder()
            .sayCurrentWeather("Lyon", "fr", mockWeatherService)
            .build();
        expect(recap).toBe(
            "The weather in Lyon is currently cloudy with a temperature of 20 degrees."
        );
    });

    it("should say the name of the agenda if one is provided", async () => {
        const mockCalendarService: CalendarService = {
            getEventsOfTheDay: () => Promise.resolve([]),
            getCalendarName: () => "personnal"
        };

        const recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();
        expect(recap).toBe(
            "You don't have any event on your personnal agenda today."
        );
    });

    it("should print a consistant sentence if no agenda name is provided", async () => {
        let mockCalendarService: CalendarService = {
            getEventsOfTheDay: () => Promise.resolve([]),
            getCalendarName: () => ""
        };

        let recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();
        expect(recap).toBe("You don't have any event on your agenda today.");

        mockCalendarService = {
            getCalendarName: () => "",
            getEventsOfTheDay: () =>
                Promise.resolve([
                    {
                        title: "Lunch with Bob",
                        time: new Date("2019-06-16T12:30")
                    }
                ])
        };

        recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();
        expect(recap).toBe(
            "You have 1 event on your agenda today: Lunch with Bob at 12:30 pm."
        );
    });

    it("should print one event on the calendar today", async () => {
        const mockCalendarService: CalendarService = {
            getCalendarName: () => "personnal",
            getEventsOfTheDay: () =>
                Promise.resolve([
                    {
                        title: "Lunch with Bob",
                        time: new Date("2019-06-16T12:30")
                    }
                ])
        };

        const recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();
        expect(recap).toBe(
            "You have 1 event on your personnal agenda today: Lunch with Bob at 12:30 pm."
        );
    });

    it("should print several events on the calendar today", async () => {
        const mockCalendarService: CalendarService = {
            getCalendarName: () => "personnal",
            getEventsOfTheDay: () =>
                Promise.resolve([
                    {
                        title: "Lunch with Bob",
                        time: new Date("2019-06-16T12:30")
                    },
                    {
                        title: "Cello lesson",
                        time: new Date("2019-06-16T18:30")
                    }
                ])
        };

        const recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();
        expect(recap).toBe(
            "You have 2 events on your personnal agenda today: Lunch with Bob at 12:30 pm and Cello lesson at 6:30 pm."
        );
    });

    it("should not print the time if the event lasts all day", async () => {
        const mockCalendarService: CalendarService = {
            getCalendarName: () => "personnal",
            getEventsOfTheDay: () =>
                Promise.resolve([
                    {
                        title: "Ride in the mountain",
                        time: null,
                        allDay: true
                    }
                ])
        };

        const recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();
        expect(recap).toBe(
            "You have 1 event on your personnal agenda today: Ride in the mountain."
        );
    });

    it("should print a custom message if there is no event", async () => {
        const mockCalendarService: CalendarService = {
            getEventsOfTheDay: () => Promise.resolve([]),
            getCalendarName: () => "personnal"
        };

        const recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();
        expect(recap).toBe(
            "You don't have any event on your personnal agenda today."
        );
    });

    it("should catch any error returned by the calendarAgent", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        const ERROR = new Error("Error in the calendar Agent");
        const mockCalendarService: CalendarService = {
            getEventsOfTheDay: () => Promise.reject(ERROR),
            getCalendarName: () => ""
        };

        const recap = await new RecapBuilder()
            .listEventsOfTheDay(mockCalendarService)
            .build();

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toBeCalledWith(ERROR);
        expect(recap).toBe("");
    });

    it("should list one item of a todo list", async () => {
        const MOCK_TODO = { title: "Finish the Voice Assistant project" };
        const mockTodoService: TodoService = {
            getTodos: () => Promise.resolve([MOCK_TODO]),
            getListName: () => "Weekly"
        };

        const recap = await new RecapBuilder()
            .listTodos(mockTodoService)
            .build();

        expect(recap).toBe(
            `You have 1 task on your Weekly list: ${MOCK_TODO.title}.`
        );
    });

    it("should list multiple items of a todo list", async () => {
        const MOCK_TODO_1 = { title: "Finish the Voice Assistant project" };
        const MOCK_TODO_2 = { title: "Install the Voice Assistant at home" };
        const mockTodoService: TodoService = {
            getTodos: () => Promise.resolve([MOCK_TODO_1, MOCK_TODO_2]),
            getListName: () => "Weekly"
        };

        const recap = await new RecapBuilder()
            .listTodos(mockTodoService)
            .build();

        expect(recap).toBe(
            `You have 2 tasks on your Weekly list: ${MOCK_TODO_1.title} and ${
                MOCK_TODO_2.title
            }.`
        );
    });

    it("should have a custom message when there is no task on the todo list", async () => {
        const mockTodoService: TodoService = {
            getTodos: () => Promise.resolve([]),
            getListName: () => "Weekly"
        };

        const recap = await new RecapBuilder()
            .listTodos(mockTodoService)
            .build();

        expect(recap).toBe("You don't have any task on your Weekly list.");
    });
});
