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
  points: Array<any> = [];
  route: any;
  RouteLine: any;
  CanvasWidth: any;
  CanvasHeight: any;
  ionViewDidEnter() {
    this.loadmap();
  }
  constructor(private statusBar: StatusBar) {

    //Dimensions
    //0.95 is the percentage of the width
    //1.41 is the ratio of the picture width/height
    this.CanvasHeight = ((window.innerWidth * 0.95) / 1.41);
    this.CanvasWidth = 0.95 * window.innerWidth;

    this.route = new Graph();
    this.route.addNode('Start', { B1: 1 });
    this.route.addNode('B1', { B2: 1 });

    //testing Route
    this.route.addNode('B2', { B: 10, t0: 1 });//Change the weught of B to see the alternative route
    this.route.addNode('t0', { t1: 1 });
    this.route.addNode('t1', { t2: 1 });
    this.route.addNode('t2', { B: 1 });

    //testing Route

    this.route.addNode('B', { C: 1 });
    this.route.addNode('C', { D: 1 });
    this.route.addNode('D', { End: 1 });
    this.route.addNode('End', {});
  }

  loadmap() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.styleDefault();//In order to see the time of the status bar

    var bounds = new leaflet.LatLngBounds(new leaflet.LatLng(0, 0), new leaflet.LatLng(this.CanvasHeight, this.CanvasWidth));//Height,width
    var myrenderer = leaflet.canvas({ padding: 1 });
    this.map = leaflet.map("map", {
      crs: leaflet.CRS.Simple,
      center: bounds.getCenter(),
      zoom: 0,
      attributionControl: false, //Link to leaflet library 
      maxZoom: 5,
      maxBounds: bounds,
      maxBoundsViscosity: 0.8,
      preferCanvas: true,
      renderer: myrenderer,
      easeLinearity: 0.4
    });

    var image = leaflet.imageOverlay('assets/test.jpg', bounds).addTo(this.map);
    this.map.fitBounds(bounds);

    var start = leaflet.latLng([nodePoints.Start[0] * this.CanvasHeight, nodePoints.Start[1] * this.CanvasWidth]);
    var end = leaflet.latLng([nodePoints.End[0] * this.CanvasHeight, nodePoints.End[1] * this.CanvasWidth]);

    leaflet.marker(start).bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().on('click', () => {
      if (this.map.hasLayer(this.RouteLine)) this.map.removeLayer(this.RouteLine);
      else {

        var tmp = this.route.path('Start', 'End');
        console.log(tmp);
        var tmproute: Array<leaflet.latLng> = [];

        tmp.forEach(element => {
          tmproute.push(leaflet.latLng([nodePoints[element][0] * this.CanvasHeight, nodePoints[element][1] * this.CanvasWidth]));
        });
        var myrenderer = leaflet.canvas({ padding: 1 });//Fix for the rendering of the polyline not braking
        this.RouteLine = leaflet.polyline(tmproute, {
          renderer: myrenderer,
          preferCanvas: true,
          color: 'red'
        });
        this.map.addLayer(this.RouteLine);
      }
    }).addTo(this.map);

    leaflet.marker(end).addTo(this.map).bindPopup('test').on('click', () => {
      if (this.map.hasLayer(this.RouteLine)) this.map.removeLayer(this.RouteLine);
      else {
        this.map.addLayer(this.RouteLine);
      }
    });

    // this.map.on('click', (e) => {//Not necessaary any more
    //   this.points.push(leaflet.latLng([e.latlng.lat,e.latlng.lng]));
    //   console.log(this.points);
    // })
  };

  checkAudio() {
    try {
      (<any>window).HeadsetDetection.detect(function (detected) {
        if (detected) {
          alert("Headphone connected");
        } else {
          alert("No Headphone Found.");
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  lock() {
    if (this.map.dragging._enabled) {
      this.map.dragging.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      this.map.boxZoom.disable();
      this.map.keyboard.disable();
      if (this.map.tap) this.map.tap.disable();
      this.map.zoomControl.disable();
    } else {
      this.map.dragging.enable();
      this.map.touchZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.scrollWheelZoom.enable();
      this.map.boxZoom.enable();
      this.map.keyboard.enable();
      if (this.map.tap) this.map.tap.enable();
      this.map.zoomControl.enable();
    }
  };

  setView() {
    //   this.map.panTo([nodePoints.End[0]*this.CanvasHeight,nodePoints.End[1]*this.CanvasWidth],{
    //     animate:true,
    //     duration:1,
    //   });
    this.map.setView([nodePoints.End[0] * this.CanvasHeight, nodePoints.End[1] * this.CanvasWidth], 3);
  }

}