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
  location = {lat: null, lng: null};
	infoWindows: any;
	cityTemperature: any = '';
	cityForecast: any;
  apiKey: any = 'AIzaSyCCh36EiMSjGZzqyBjNqi2FaaYpowZ-P7E';
  constructor(public zone: NgZone, public geolocation: Geolocation, public api : ApiService) {
      console.log("Cities ", Cities);
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
          console.log("this.mapElement.nativeElement :", this.mapElement.nativeElement);
          var map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
          console.log("dta L", Cities);
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
						console.log("this.cityTemperature  1 :", this.cityTemperature );
            marker.addListener('click',() => {
								this.closeAllInfoWindows();
								this.api.getWeather(city.name).then(data => {
									console.log("DATA in home component :", data);
									let res: any = data;
									this.cityTemperature = res.current.temp_c;
									document.getElementById(city.id).innerText = "";
									document.getElementById(city.id).innerText = city.name + " " +this.cityTemperature + 'C';
									console.log("this.cityTemperature  2 :", this.cityTemperature );
							})
								infowindow.open(map,marker);
								console.log("City.id :", city.id);
								console.log("document.getElementById(city.id) :", document.getElementById(city.id));
								setTimeout(() => {
									if(document.getElementById(city.id)) {
										document.getElementById(city.id).addEventListener('click',() => {
											console.log("info windor clicked for :", city.id);
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
}
