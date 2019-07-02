import TrelloService from "../../src/infrastructure/trello.service";
import Axios from "axios";

describe("TrelloService", () => {
  const mockedAxiosCall = jest.spyOn(Axios, "get");

  const apiKey = "trelloApiKey";
  const token = "trelloToken";
  const listId = "trelloWeeklyListId";

  beforeEach(() => {
    process.env.TRELLO_API_KEY = apiKey;
    process.env.TRELLO_TOKEN = token;
    process.env.TRELLO_WEEKLY_LIST_ID = listId;
  });

  it("should call the Trello API to list the cards of a list", async () => {
    const trelloAgent = new TrelloService(
      "Weekly",
      process.env.TRELLO_WEEKLY_LIST_ID
    );

    mockedAxiosCall.mockResolvedValue({
      data: [
        {
          id: "blabla",
          closed: false,
          name: "My first task"
        },
        {
          id: "blablabla",
          closed: true,
          name: "My second task"
        }
      ]
    });

    const tasks = await trelloAgent.getTodos();

    const expectedUrl = `${
      TrelloService.API_URL
    }/lists/${listId}/cards?key=${apiKey}&token=${token}`;

    expect(tasks).toEqual([
      { title: "My first task" },
      { title: "My second task" }
    ]);
    expect(mockedAxiosCall).toHaveBeenCalledTimes(1);
    expect(mockedAxiosCall).toHaveBeenCalledWith(expectedUrl);
  });

  it("should give the name of the list", () => {
    expect(new TrelloService("listName", "blabla").getListName()).toBe(
      "listName"
    );
  });
});
