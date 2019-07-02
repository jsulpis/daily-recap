import TrelloAgent from "../../src/infrastructure/trello-agent";
import axios from "axios";

describe("TrelloAgent", () => {
  const mockedAxiosCall = jest.spyOn(axios, "get");

  const apiKey = "trelloApiKey";
  const token = "trelloToken";
  const listId = "trelloWeeklyListId";

  beforeEach(() => {
    process.env.TRELLO_API_KEY = apiKey;
    process.env.TRELLO_TOKEN = token;
    process.env.TRELLO_WEEKLY_LIST_ID = listId;
  });

  it("should call the Trello API to list the cards of a list", async () => {
    const trelloAgent = new TrelloAgent(
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
      TrelloAgent.API_URL
    }/lists/${listId}/cards?key=${apiKey}&token=${token}`;

    expect(tasks).toEqual([
      { title: "My first task" },
      { title: "My second task" }
    ]);
    expect(mockedAxiosCall).toHaveBeenCalledTimes(1);
    expect(mockedAxiosCall).toHaveBeenCalledWith(expectedUrl);
  });

  it("should give the name of the list", () => {
    expect(new TrelloAgent("listName", "blabla").getListName()).toBe(
      "listName"
    );
  });
});
