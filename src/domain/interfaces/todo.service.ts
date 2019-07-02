import Task from "../model/task";

export default interface TodoService {
    getTodos(): Promise<Task[]>;
    getListName(): string;
}
