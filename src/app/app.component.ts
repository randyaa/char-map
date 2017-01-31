import {Component, ViewChild, AfterViewInit} from '@angular/core';

import * as Konva from 'konva';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  //LowRes map
  // Waterdeep @ 1625,865
  // Hillsfar @ 3380,1100

  @ViewChild('map') mapContainer;
  originalImage = 'assets/Sword-Coast-Map_LowRes.jpg';
  stage:Konva.Stage;
  ratio = 1;

  chars:any = {
    "malexik": {
      layer:undefined,
      show:false,
      waypoints:[
        [3380,1100],
        [1625,865],
        [500,500],
        [30,1077],
      ],
      color: 'red',
    },
    "tikara": {
      layer:undefined,
      show:false,
      waypoints:[
        [50,50],
        [350,700],
        [140,1010],
        [30,1077],
        [1400,788],
      ],
      color: 'green',
    }
  };

  toggleCharacterPath(charName){
    let theChar = this.chars[charName];
    if (theChar.layer) {
      if (theChar.show) {
        theChar.show = false;
        theChar.layer.moveToBottom();
      } else {
        theChar.show = true;
        theChar.layer.moveToTop();
      }
    } else {
      theChar.show = true;
      theChar.layer = this.generateCharacterLayer(theChar.waypoints, theChar.color);
      this.stage.add(theChar.layer);
    }
  }


  generateCharacterLayer(waypoints, color) {
    let points = [].concat.apply([], waypoints);
    points = points.map((e) => {
      return e*this.ratio;
    });
    let newLayer = new Konva.Layer();
    let path = new Konva.Line({
      points: points,
      stroke: color,
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round'
    });
    newLayer.add(path);
    return newLayer;
  }

  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    this.ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*this.ratio, height: srcHeight*this.ratio };
  };

  ngAfterViewInit() {
    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
    });

    let newDimensions = this.calculateAspectRatioFit(3600, 2329, window.innerWidth, window.innerHeight);

    // add canvas element
    var baseLayer = new Konva.Layer();
    var imageObj = new Image();
    imageObj.onload = () => {
      baseLayer.add(new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: newDimensions.width,
        // window.innerWidth,
        height: newDimensions.height
        // window.innerHeight
      }));
      this.stage.add(baseLayer);
    };
    imageObj.src = this.originalImage;
  }
}
