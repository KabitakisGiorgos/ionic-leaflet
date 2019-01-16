import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import leaflet from 'leaflet';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';
import * as Graph from 'node-dijkstra';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  points:Array<any>=[];
  route:any;
  RouteLine:any;
  ionViewDidEnter() {
    this.loadmap();
  }
  constructor(private statusBar: StatusBar) {
    this.route = new Graph();
    this.route.addNode('Start', { B:1 });
    this.route.addNode('B', { C:1});
    this.route.addNode('C', { D:1 });
    this.route.addNode('D', { End:1 });
    this.route.addNode('End', { });
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

    var start = leaflet.latLng([240, 161]);
    var end = leaflet.latLng([338, 471]);

    var nodePoints={//FIXME:add this to seperate file 
        Start:[240,161],
        End:[338,471],
        B:[247,402],
        C:[351,403],
        D:[351,470]
    };

    leaflet.marker(start).bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().on('click', () => {
      if (this.map.hasLayer(this.RouteLine)) this.map.removeLayer(this.RouteLine);
      else{

       var tmp=this.route.path('Start', 'End');
       console.log(tmp);
       var tmproute:Array< leaflet.latLng>=[];

       tmp.forEach(element => {
        console.log(nodePoints[element]);
        tmproute.push(leaflet.latLng(nodePoints[element]));
       });
       this.RouteLine=leaflet.polyline(tmproute);
       this.map.addLayer(this.RouteLine);
      }
    }).addTo(this.map);

    leaflet.marker(end).addTo(this.map).bindPopup('test').on('click', () => {
      if (this.map.hasLayer(this.RouteLine)) this.map.removeLayer(this.RouteLine);
      else{
        this.map.addLayer(this.RouteLine);
      }
    });
   //var routeTmp = [
    //   start,
    //   leaflet.latLng([274, 135]),
    //   leaflet.latLng([240, 132]),
    //   leaflet.latLng([90, 221]),
    //   leaflet.latLng([10, 245]),
    //   leaflet.latLng([21, 499]),
    //   leaflet.latLng([258, 514]),
    //   end,
    // ]
    //var travel = leaflet.polyline(routeTmp);
    this.map.on('click', (e) => {
      this.points.push(leaflet.latLng([e.latlng.lat,e.latlng.lng]));
      console.log(this.points);
    });

  };

  clear(){
    this.points=[];
  }
}