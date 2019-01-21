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
import 'leaflet-polylinedecorator';

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
  RouteLineDash: any;
  RouteLineFootSteps: any;
  RouteLineLine: any;
  CanvasWidth: any;
  CanvasHeight: any;
  ionViewDidEnter() {
    this.loadmap();
  }
  constructor(private statusBar: StatusBar) {

    //Dimensions
    //0.95 is the percentage of the width
    //1.41 is the ratio of the picture width/height
    this.CanvasHeight = ((window.innerWidth * 0.95) / 2.12);
    this.CanvasWidth = 0.95 * window.innerWidth;

    this.route = new Graph();
    this.route.addNode('Start', { B1: 1 });
    this.route.addNode('B1', { B2: 1, Start: 1 });

    //testing Route
    this.route.addNode('B2', { B: 10, t0: 1, B1: 1 });//Change the weught of B to see the alternative route
    this.route.addNode('t0', { t1: 1, B2: 1 });
    this.route.addNode('t1', { t2: 1, t0: 1 });
    this.route.addNode('t2', { B: 1, t1: 1 });

    //testing Route

    this.route.addNode('B', { C: 1, t2: 1 });
    this.route.addNode('C', { D: 1, B: 1 });
    this.route.addNode('D', { End: 1, C: 1 });
    this.route.addNode('End', { D: 1 });
  }

  loadmap() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.styleDefault();//In order to see the time of the status bar
    //this.statusBar.backgroundColorByName('red'); Change Color of the phone bar

    var bounds = new leaflet.LatLngBounds(new leaflet.LatLng(0, 0), new leaflet.LatLng(this.CanvasHeight, this.CanvasWidth));//Height,width
    this.map = leaflet.map("map", {
      crs: leaflet.CRS.Simple,
      center: bounds.getCenter(),
      zoom: 0,
      attributionControl: false, //Link to leaflet library 
      maxZoom: 5,
      maxBounds: bounds,
      maxBoundsViscosity: 0.8,
      easeLinearity: 0.4
    });

    var image = leaflet.imageOverlay('assets/map.png', bounds).addTo(this.map);
    this.map.fitBounds(bounds);

    var start = leaflet.latLng([nodePoints.Start[0] * this.CanvasHeight, nodePoints.Start[1] * this.CanvasWidth]);
    var end = leaflet.latLng([nodePoints.End[0] * this.CanvasHeight, nodePoints.End[1] * this.CanvasWidth]);

    leaflet.marker(start).bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().on('click', () => {
      if (this.map.hasLayer(this.RouteLine)) {
        this.map.removeLayer(this.RouteLineLine);
        this.map.removeLayer(this.RouteLine);
      }
      else {

        var tmp = this.route.path('Start', 'End');//'End' 'Start' for opposite direction
        console.log(tmp);
        var tmproute: Array<leaflet.latLng> = [];

        tmp.forEach(element => {
          tmproute.push(leaflet.latLng([nodePoints[element][0] * this.CanvasHeight, nodePoints[element][1] * this.CanvasWidth]));
        });

        this.RouteLineLine = leaflet.polyline(tmproute, {
          color: 'red',
          weight: 2
        });

        this.RouteLineDash = leaflet.polylineDecorator(tmproute, {
          patterns: [
            { offset: 25, repeat: 50, symbol: leaflet.Symbol.arrowHead({ pixelSize: 8, pathOptions: { color: 'red', fillOpacity: 1, weight: 0 } }) }
          ]
        });

        this.RouteLineFootSteps = leaflet.polylineDecorator(
          tmproute,
          {
            patterns: [
              {
                offset: 0, repeat: 30, symbol: leaflet.Symbol.marker({
                  rotate: true, markerOptions: {
                    icon: leaflet.icon({
                      iconUrl: 'assets/foot8.png',
                      iconAnchor: [4, 4]
                    })
                  }
                })
              }
            ]
          }
        )

        this.RouteLine = this.RouteLineDash;
        this.map.addLayer(this.RouteLine);
        this.map.addLayer(this.RouteLineLine);
      }
    }).addTo(this.map);

    leaflet.marker(end).addTo(this.map).bindPopup('test').on('click', () => {
      if (this.map.hasLayer(this.RouteLine)) {
        this.map.removeLayer(this.RouteLineLine);
        this.map.removeLayer(this.RouteLine);
      }
      else {
        this.map.addLayer(this.RouteLine);
      }
    });

    this.map.on('zoomend', () => {
      console.log(this.map.getZoom());
      this.map.removeLayer(this.RouteLine);
      this.map.removeLayer(this.RouteLineLine);
      if (this.map.getZoom() > 2) {
        this.RouteLine = this.RouteLineFootSteps;
      } else {
        this.RouteLine = this.RouteLineDash;
        this.map.addLayer(this.RouteLineLine);
      }
      this.map.addLayer(this.RouteLine);
    });
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