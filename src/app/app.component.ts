import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { filter, map, mergeAll, take, takeLast, toArray, catchError, tap } from 'rxjs/operators';
import { Todo } from './todo.model';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  result: string = "no data";
  msgError: string = "";
  showError: boolean = false;

  baseServiceUrl: string = "http://jsonplaceholder.typicode.com/todos";

  constructor(private delegate: HttpClient) { }

  retriveAndFilter() {
    this.showError = false;
    //retrive collection of data
    this.delegate.get<Todo[]>(this.baseServiceUrl)
      .pipe(
        //flat array
        mergeAll(),
        //take only last 10
        takeLast(10),
        //get only 2 fields, transfrom it in uppercase and return new object
        map(({ title, completed }) => {
          return { title: String(title).toUpperCase(), completed: completed };
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

  retriveFiltedByParams() {
    this.showError = false;
    var filterParams: HttpParams = new HttpParams().set("userId", "5");
    this.delegate.get<Todo[]>(this.baseServiceUrl, { params: filterParams })
      .pipe(
        mergeAll(),
        take(5),
        toArray()
      )
      .subscribe(
        data => this.result = JSON.stringify(data, null, 5)
      );
  }

  postTodo() {
    this.showError = false;
    //setting header
    let postHeaders: HttpHeaders = new HttpHeaders();
    //append return new header
    postHeaders = postHeaders.append("Content-type", "application/json;chartset utf-8;");

    this.delegate.post<Todo>(this.baseServiceUrl,
      {
        title: 'Hello world',
        completed: false
      },
      {
        //add header as options
        headers: postHeaders,
        //change way to fetch result: response is complete of body (data), headers, status, ecc...
        observe: "response"
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
    this.delegate.patch<Todo>(this.baseServiceUrl + "/2",
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
    this.delegate.put<Todo>(this.baseServiceUrl + "/2",
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
    this.delegate.delete(this.baseServiceUrl + "/1",
      //to observe phases of request/response
      { observe: "events" }).
      pipe(
        tap(event => {
          if (event.type === HttpEventType.Sent) {
            console.log("just sent delete request");
          }
          else if (event.type === HttpEventType.Response) {
            console.log("just recive response");
          }
        })
      )
      .subscribe(
        result => this.result = JSON.stringify(result, null, 4),
        err => {
          this.showError = true;
          this.msgError = err.message;
        }
      );
  }

  getUser(){
    this.delegate.get<User[]>("https://jsonplaceholder.typicode.com/users")
    .pipe(
      mergeAll(),
      take(1),
      toArray(),
    )
    .subscribe(
    (result) => {
        this.result = JSON.stringify(result, null, 4);
      },
        err => {
          this.showError = true;
          this.msgError = err.message;
        }
    );
  }
}


