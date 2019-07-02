import Task from "../model/task";

export default interface TodoProvider {
    getTodos(): Promise<Task[]>;
    getListName(): string;
}
