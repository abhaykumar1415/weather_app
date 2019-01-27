import { Component, OnInit, ViewChild, NgZone, ElementRef} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import Cities from '../services/location';
import {ApiService} from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoadingService } from '../services/loading';
declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
	mapOptions: any;
	showList: Boolean = false;
	weatherData: any = {} ;
  location = {lat: null, lng: null};
	infoWindows: any;
	cityTemperature: any = '';
	cityForecast: any;
	activeFilter: String = 'C';
  apiKey: any = 'AIzaSyCCh36EiMSjGZzqyBjNqi2FaaYpowZ-P7E';
  constructor(public zone: NgZone, public geolocation: Geolocation, public api : ApiService, public authService: AuthService, public toastController: ToastController, private router: Router, public loading: LoadingService) {
		const script = document.createElement('script');
		this.infoWindows = [];
      script.id = 'googleMap';
      if (this.apiKey) {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey;
      } else {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=';
      }
      document.head.appendChild(script);
      this.geolocation.getCurrentPosition().then((position) =>  {
          this.location.lat = position.coords.latitude;
          this.location.lng = position.coords.longitude;
      });
      this.mapOptions = {
          center: {
            lat: 21.1458,
            lng: 79.0882
          },
          zoom: 4,
          mapTypeControl: false
      };
      setTimeout(() => {
          var map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
          Cities.map(city => {
            var markerOptions: any = {};
            var marker;
            markerOptions.position = city.location;
            markerOptions.map = map;
            markerOptions.title = city.name;
            marker = new google.maps.Marker(markerOptions);
            marker.setMap(map);
            var content = '<p id='+city.id+'></p>';
            var infowindow = new google.maps.InfoWindow({
                content: content
						});
            marker.addListener('click',() => {
								this.getWeather(city);
								infowindow.open(map,marker);
								setTimeout(() => {
									if(document.getElementById(city.id)) {
										document.getElementById(city.id).addEventListener('click',() => {
											this.resizeMap(50);
										});
									}
								},100);
						});
						this.infoWindows.push(infowindow)
					})
					this.loading.dismiss();
      }, 3000);
	}
	ngOnInit(): void {
		this.loading.present();
		this.authService.user
    .subscribe(res => {
      if(!res) {
				this.loading.dismiss();
        this.router.navigate(['/login']);
      }
    });
	}
	
	closeAllInfoWindows() {
		for(let window of this.infoWindows) {
			window.close();
		}
	}
	getWeather(city) {
		this.loading.present();
				this.closeAllInfoWindows();
				this.resizeMap(100);
				this.api.getWeather(city.name).then(data => {
					let res: any = data;
					this.weatherData = res.forecast.forecastday[0].day;
					this.cityTemperature = res.current.temp_c;
					document.getElementById(city.id).innerText = "";
					document.getElementById(city.id).innerText = city.name + " :  " +this.cityTemperature + ' C';
					this.loading.dismiss();
			})
	}
	returnTemp() {
		return this.cityTemperature;
	}
	resizeMap(screenSize) {
		var mapView = document.getElementById('map');
		if(screenSize == 100) {
			mapView.className = "fullView";
			this.showList = false;
		} else {
			mapView.className = "halfView";
			this.showList = true;
		}
	}
	changeFilter(filter) {
		this.activeFilter = filter;
	}
	logout() {
		this.loading.present();
    this.authService.logout().then(data => {
			this.loading.dismiss();
			this.showToast('Logged out');
			this.router.navigate(['/login']);
		})
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
