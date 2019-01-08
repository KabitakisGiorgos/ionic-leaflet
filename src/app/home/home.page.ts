import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import leaflet from 'leaflet';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';
import { NGXLogger } from 'ngx-logger';
import { Device } from '@ionic-native/device/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  ionViewDidEnter() {
   // this.loadmap();
  }
  constructor(private statusBar: StatusBar,private logger:NGXLogger,private device:Device) {}
/*
  loadmap() {

    this.statusBar.overlaysWebView(true);
    this.statusBar.styleDefault();//In order to see the time of the status bar

    var bounds = new leaflet.LatLngBounds(new leaflet.LatLng(0, 0), new leaflet.LatLng(430, 760));
    this.map = leaflet.map("map", {
      crs: leaflet.CRS.Simple,
      center: bounds.getCenter(),
      zoom: 0,
      attributionControl: false, //Link to leaflet library 
      maxZoom: 5,
      maxBounds: bounds,
      maxBoundsViscosity: 0.8
    });

    var image = leaflet.imageOverlay('assets/test.jpg', bounds).addTo(this.map);
    this.map.fitBounds(bounds);

    var tail = leaflet.latLng([310, 160]);
    var nose = leaflet.latLng([310, 400]);

    leaflet.marker(tail).bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().on('click', () => {
      if (this.map.hasLayer(travel)) this.map.removeLayer(travel);
      else
        this.map.addLayer(travel);
    }).addTo(this.map);


    leaflet.marker(nose).addTo(this.map).bindPopup('test').on('click', () => {
      this.map.removeLayer(travel);
    });
    var route = [
      tail,
      leaflet.latLng([274, 135]),
      leaflet.latLng([240, 132]),
      leaflet.latLng([90, 221]),
      leaflet.latLng([10, 245]),
      leaflet.latLng([21, 499]),
      leaflet.latLng([258, 514]),
      nose,
    ]
    var travel = leaflet.polyline(route);
    this.map.on('click', (e) => {
      console.log("Latitude " + e.latlng.lat + " Longtitude " + e.latlng.lng);
    });

  };
*/

  log(lvl) {
    switch (lvl) {
      case 0:
        this.logger.debug('My debug message');
        break;
      case 1:
        this.logger.info('My info message');
        break;
      case 2:
        this.logger.log('My log message');
        break;
      case 3:
        this.logger.warn('My warning message');
        break;
      case 4:
        this.logger.error('Now we got a problem',{device:{
          model:this.device.model,
          platform:this.device.platform,
          uuid:this.device.uuid,
          version:this.device.version,
          manufacturer:this.device.manufacturer
        }});
    }
  }
}