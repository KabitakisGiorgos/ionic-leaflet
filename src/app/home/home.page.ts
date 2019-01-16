import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import leaflet from 'leaflet';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  points:Array<any>=[];
  ionViewDidEnter() {
    this.loadmap();
  }
  constructor(private statusBar: StatusBar) {

  }

  loadmap() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.styleDefault();//In order to see the time of the status bar

    var bounds = new leaflet.LatLngBounds(new leaflet.LatLng(0, 0), new leaflet.LatLng(450, 700));//Height,width
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

    var start = leaflet.latLng([310, 160]);
    var end = leaflet.latLng([310, 400]);

    leaflet.marker(start).bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().on('click', () => {
      if (this.map.hasLayer(travel)) this.map.removeLayer(travel);
      else{
        this.map.addLayer(travel);
      }
    }).addTo(this.map);

    leaflet.marker(end).addTo(this.map).bindPopup('test').on('click', () => {
      if (this.map.hasLayer(travel)) this.map.removeLayer(travel);
      else{
        this.map.addLayer(travel);
      }
    });
    var route = [
      start,
      leaflet.latLng([274, 135]),
      leaflet.latLng([240, 132]),
      leaflet.latLng([90, 221]),
      leaflet.latLng([10, 245]),
      leaflet.latLng([21, 499]),
      leaflet.latLng([258, 514]),
      end,
    ]
    var travel = leaflet.polyline(route);
    this.map.on('click', (e) => {
      this.points.push(leaflet.latLng([274, 135]));
      console.log(this.points);
    });

  };

  clear(){
    this.points=[];
  }
}