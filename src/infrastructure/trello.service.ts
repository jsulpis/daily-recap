import Axios from "axios";
import TodoService from "../domain/interfaces/todo.service";
import Task from "../domain/model/task";

export default class TrelloService implements TodoService {
    public static readonly API_URL = "https://api.trello.com/1";

    constructor(private listName: string, private listId) {}

    public getTodos(): Promise<Task[]> {
        const queryUrl = `${TrelloService.API_URL}/lists/${this.listId}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;

        return Axios.get(queryUrl).then(res =>
            res.data.map(this.mapCardToTask)
        );
    }

    public getListName(): string {
        return this.listName;
    }

    private mapCardToTask(card: { name: string }): Task {
        return { title: card.name };
    }
}
