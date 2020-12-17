import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { filter, map, mergeAll, take, takeLast, toArray, catchError } from 'rxjs/operators';
import { Todo } from './todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  result: string = "no data";
  msgError: string = "";
  showError: boolean = false;

  constructor(private delegate: HttpClient) { }

  retriveAndFilter() {
    this.showError = false;
    //retrive collection of data
    this.delegate.get<Todo[]>("http://jsonplaceholder.typicode.com/todos")
      .pipe(
        //flat array
        mergeAll(),
        //take only last 10
        takeLast(10),
        //get only 2 fields, transfrom it in uppercase and return new object
        map(({ title, completed }) => {
          return { title: String(title).toUpperCase(), completed: completed }
        }),
        //filter by field
        filter(({ completed }) => completed == false),
        //recompose to array of type
        toArray(),
      )
      .subscribe(
        data => this.result = JSON.stringify(data, null, 4),
      );
  }

  postTodo() {
    this.showError = false;
    this.delegate.post<Todo>("http://jsonplaceholder.typicode.com/todos",
      {
        title: 'Hello world',
        completed: false
      }
    )
      .subscribe(
        result => this.result = JSON.stringify(result, null, 4),
        err => {
          this.showError = true;
          this.msgError = err.message;
        }
      );
  }

  patchTodo() {
    this.showError = false;
    this.delegate.patch<Todo>("http://jsonplaceholder.typicode.com/todos/2",
      {
        title: "hello patch"
      }
    )
      .subscribe(
        result => this.result = JSON.stringify(result, null, 4),
        err => {
          this.showError = true;
          this.msgError = err.message;
        }
      );
  }

  putTodo() {
    this.showError = false;
    this.delegate.put<Todo>("http://jsonplaceholder.typicode.com/todos/2",
      new Todo(2, 100, "ciao", true)
    )
      .subscribe(
        result => this.result = JSON.stringify(result, null, 4),
        err => {
          this.showError = true;
          this.msgError = err.message;
        }
      );
  }

  deleteTodo() {
    this.showError = false;
    this.delegate.delete("http://jsonplaceholder.typicode.com/todos/1")
      .subscribe(
        result => this.result = JSON.stringify(result, null, 4),
        err => {
          this.showError = true;
          this.msgError = err.message;
        }
      )
  }
}


