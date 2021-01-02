export class Todo {
    constructor(id, userId = -1, title, completed) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.completed = completed;
    }
}
