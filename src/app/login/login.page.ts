import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  isLoading = false;
  constructor(public loading: LoadingService, public authService: AuthService, public toastController: ToastController, private router: Router) {
    
  }
  
  ngOnInit() {
    this.authService.user
    .subscribe(res => {
      if(res) {
        this.router.navigate(['/home']);
      }
    });
  }

  signup() {
    this.loading.present();
    this.authService.signup(this.email, this.password).then(data => {
      let response: any = data;
      if(!response.success) {
        this.showToast(response.data.message);
      } else {
        this.showToast('Signed up successfully');
        this.email = this.password = '';
      }
      this.loading.dismiss();
    })
  }

  login() {
      this.loading.present();
      this.authService.login(this.email, this.password).then(data => {
        let response: any = data;
        if(!response.success) {
          this.showToast(response.data.message);
        } else {
          this.showToast('Logged in successfully');
          this.email = this.password = '';
        }
        this.loading.dismiss();
      });
  }

  async showToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
