var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import leaflet from 'leaflet';
var HomePage = /** @class */ (function () {
    function HomePage() {
    }
    HomePage.prototype.ionViewDidEnter = function () {
        this.loadmap();
    };
    HomePage.prototype.loadmap = function () {
        this.map = leaflet.map("map", {
            crs: leaflet.CRS.Simple,
            maxBoundsViscosity: 1.0
        });
        var bounds = [
            [0, 0],
            [430, 760]
        ];
        var image = leaflet.imageOverlay('assets/test.jpg', bounds).addTo(this.map);
        this.map.fitBounds(bounds);
        var tail = leaflet.latLng([310, 160]);
        var nose = leaflet.latLng([310, 400]);
        leaflet.marker(tail).addTo(this.map);
        this.map.setView([50, 50], 0);
        leaflet.marker(nose).addTo(this.map).bindPopup('Test');
        var travel = leaflet.polyline([tail, nose]).addTo(this.map);
    };
    ;
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], HomePage.prototype, "mapContainer", void 0);
    HomePage = __decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        })
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map