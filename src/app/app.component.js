var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { filter, map, mergeAll, takeLast, toArray } from 'rxjs/operators';
import { Todo } from './todo.model';
let AppComponent = class AppComponent {
    constructor(delegate) {
        this.delegate = delegate;
        this.result = "no data";
        this.msgError = "";
        this.showError = false;
    }
    retriveAndFilter() {
        this.showError = false;
        //retrive collection of data
        this.delegate.get("http://jsonplaceholder.typicode.com/todos")
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
        toArray())
            .subscribe(data => this.result = JSON.stringify(data, null, 4));
    }
    postTodo() {
        this.showError = false;
        this.delegate.post("http://jsonplaceholder.typicode.com/todos", {
            title: 'Hello world',
            completed: false
        })
            .subscribe(result => this.result = JSON.stringify(result, null, 4), err => {
            this.showError = true;
            this.msgError = err.message;
        });
    }
    patchTodo() {
        this.showError = false;
        this.delegate.patch("http://jsonplaceholder.typicode.com/todos/2", {
            title: "hello patch"
        })
            .subscribe(result => this.result = JSON.stringify(result, null, 4), err => {
            this.showError = true;
            this.msgError = err.message;
        });
    }
    putTodo() {
        this.showError = false;
        this.delegate.put("http://jsonplaceholder.typicode.com/todos/2", new Todo(2, 100, "ciao", true))
            .subscribe(result => this.result = JSON.stringify(result, null, 4), err => {
            this.showError = true;
            this.msgError = err.message;
        });
    }
    deleteTodo() {
        this.showError = false;
        this.delegate.delete("http://jsonplaceholder.typicode.com/todos/1")
            .subscribe(result => this.result = JSON.stringify(result, null, 4), err => {
            this.showError = true;
            this.msgError = err.message;
        });
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
export { AppComponent };
