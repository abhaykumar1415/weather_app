# Weather app- A POC

> The following project is a POC. built with Ionic
## Ionic version : 4.9.0

Local set Up :-
  - ````git clone git@github.com:abhaykumar1415/weather_app.git````
  - ````npm install````
 
Connect your android device via USB and check for available devices : 
````adb devices ````

Run the app on Andriod device
````ionic cordova run android --device````

I have used ````https://www.apixu.com```` for weather API.

### Tasks
- [x] First time user can login/signup using firebase authentication.
- [x] On successful sign in, Map will be shown with configurable 10 cities.
- [x] On tapping the city pin on the map, the current temperature should display on a pop up
- [x] The popup should have a link for forecast, which when tapped, a day wise weather forecast should be displayed in list below the map.
- [x] User should be able to toggle between degree Celsius and Fahrenheit. 
- [x] The user should be able to close the list by tapping a close forecast list button.
- [x] If the user were to click on other city pin on map the open forecast list should be closed.
- [x] The user should be able to pinch/zoom the map.


![Login](https://i.imgur.com/zUeNcoU.png)
![Markers on the Map](https://i.imgur.com/N9fF9SA.png)
![Temperature](https://i.imgur.com/LD4TJQf.png)