import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { title } from 'process';
import { filter, map, mergeAll, take, takeLast, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  result: string = "no data";

  constructor(private delegate: HttpClient) { }

  submitCall() {
    //retrive collection of data
    this.delegate.get("http://jsonplaceholder.typicode.com/todos")
      .pipe(
        //flat array
        mergeAll(),
        //take only last 10
        takeLast(10),
        //get only 2 fields and transfrom it abd return new object
        map(({ title, completed }) => {
          return { title: String(title).toUpperCase(), completed: completed }
        }),
        //filter by field
        filter(({ completed }) => completed == false),
        //recompose to array of type
        toArray(),
      )
      .subscribe(
        data => this.result = JSON.stringify(data, null, 4)
      );
  }

}


