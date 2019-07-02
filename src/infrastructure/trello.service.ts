import TodoService from "../domain/interfaces/todo.service";
import Task from "../domain/model/task";
import Axios from "axios";

export default class TrelloService implements TodoService {
    static readonly API_URL = "https://api.trello.com/1";

    constructor(private listName: string, private listId) {}

    getTodos(): Promise<Task[]> {
        const queryUrl = `${TrelloService.API_URL}/lists/${
            this.listId
        }/cards?key=${process.env.TRELLO_API_KEY}&token=${
            process.env.TRELLO_TOKEN
        }`;

        return Axios.get(queryUrl).then(res =>
            res.data.map(this.mapCardToTask)
        );
    }

    private mapCardToTask(card: { name: string }): Task {
        return { title: card.name };
    }

    getListName(): string {
        return this.listName;
    }
}