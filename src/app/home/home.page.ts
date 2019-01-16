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
import { nodePoints } from '../../MapConfig/mapPoints';

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
    this.route.addNode('Start', { B1:1});
    this.route.addNode('B1', { B2:1});

    //testing Route
    this.route.addNode('B2', { B:10,t0:1});//Change the weught of B to see the alternative route
    this.route.addNode('t0', { t1:1 });
    this.route.addNode('t1', { t2:1 });
    this.route.addNode('t2', { B:1 });

    //testing Route
    
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

    var start = leaflet.latLng(nodePoints.Start);
    var end = leaflet.latLng(nodePoints.End);

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
   
    this.map.on('click', (e) => {
      this.points.push(leaflet.latLng([e.latlng.lat,e.latlng.lng]));
      console.log(this.points);
    });

  };

  clear(){
    this.points=[];
  }
}