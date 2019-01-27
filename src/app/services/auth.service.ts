import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
  }
  signup(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        resolve({success:  true, data: value});
      })
      .catch(err => {
        resolve({success:  false, data: err});
      });
    });
  }
  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        resolve({success:  true, data: value});
      })
      .catch(err => {
        resolve({success:  false, data: err});
      });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.firebaseAuth
      .auth
      .signOut();
      resolve({success: true});
    });
  }
}
