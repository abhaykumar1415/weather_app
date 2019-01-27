import { Injectable } from '@angular/core';
import base_url from './constants';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getWeather(location) {
    let url  = base_url + location;
      return new Promise((res, rej) => {
        fetch(url, {method: "get"})
        .then(function(response) {
          return response.json();
        }).then(data => {
          res(data);
        })
      })
    }
}
