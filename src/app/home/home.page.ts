import { Component, ViewChild, NgZone, ElementRef} from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import Cities from '../services/location';
import {ApiService} from '../services/api.service';
declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
	mapOptions: any;
	showList: Boolean = false;
	weatherData: any = {} ;
  location = {lat: null, lng: null};
	infoWindows: any;
	cityTemperature: any = '';
	cityForecast: any;
	activeFilter: String = 'F';
  apiKey: any = 'AIzaSyCCh36EiMSjGZzqyBjNqi2FaaYpowZ-P7E';
  constructor(public zone: NgZone, public geolocation: Geolocation, public api : ApiService) {
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
								this.closeAllInfoWindows();
								this.resizeMap(100);
								this.api.getWeather(city.name).then(data => {
									let res: any = data;
									this.weatherData = res.forecast.forecastday[0].day;
									this.cityTemperature = res.current.temp_c;
									document.getElementById(city.id).innerText = "";
									document.getElementById(city.id).innerText = city.name + " :  " +this.cityTemperature + ' C';
							})
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
      }, 3000);
	}
	closeAllInfoWindows() {
		for(let window of this.infoWindows) {
			window.close();
		}
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
}
