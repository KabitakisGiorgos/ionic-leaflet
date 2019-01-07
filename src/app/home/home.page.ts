import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import leaflet from 'leaflet';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';
import * as RasterCoords from 'leaflet-rastercoords';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  ionViewDidEnter() {
    this.loadmap();
  }
  constructor(private statusBar: StatusBar) {
    leaflet.RasterCoords=RasterCoords;
  }
  
  loadmap() {

    var img = [
      3831,  // original width of image (here from `example/karta.jpg`)
      3101   // original height of image
    ]
    // create the map
    this.map = leaflet.map('map')
    
    // assign map and image dimensions
    var rc = new leaflet.RasterCoords(this.map, img)
    // set max zoom Level (might be `x` if gdal2tiles was called with `-z 0-x` option)
    this.map.setMaxZoom(rc.zoomLevel())
    // all coordinates need to be unprojected using the `unproject` method
    // set the view in the lower right edge of the image
    this.map.setView(rc.unproject([img[0], img[1]]), 2)
    
    // set markers on click events in the map
    this.map.on('click', function (event) {
      // any position in leaflet needs to be projected to obtain the image coordinates
      var coords = rc.project(event.latlng)
      var marker = leaflet.marker(rc.unproject(coords))
        .addTo(this.map)
      marker.bindPopup('[' + Math.floor(coords.x) + ',' + Math.floor(coords.y) + ']')
        .openPopup()
    })
    
    // the tile layer containing the image generated with `gdal2tiles --leaflet -p raster -w none <img> tiles`
    leaflet.tileLayer('assets/tiles/{z}/{x}/{y}.png', {
      noWrap: true
    }).addTo(this.map)

  };
}