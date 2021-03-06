import {Component, ViewChild, AfterViewInit, Pipe, PipeTransform} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

import * as Konva from 'konva';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  //LowRes map
  // Waterdeep @ 1625,865
  // Hillsfar @ 3380,1100
  // Daggerford @ 1741, 943
  // Golden Fields @ [1704, 767],
  // Citadel Albar @ [2308, 234],
  // Ice spiers @ [2276, 187],
  // GracklStugh UNDERDARK ROUGH ESTIMATE @ 1768, 401
  // Thesk (?) ROUGH ESTIMATE @ [3376, 1673],
  // island of ... ? [3057, 1713],
  // westgate @ [3000, 1663],


  // tikara village @ BOGUS [350, 750],

  @ViewChild('map') mapContainer;
  originalImage = 'assets/Sword-Coast-Map_LowRes.jpg';
  stage:Konva.Stage;
  ratio = 1;
  editing:any;

  chars:any = {
    "Nogil": {
      layer:undefined,
      show:false,
      waypoints: [
        [350, 750],
        [2243,778],
      ],
      color: "blue"
    },
    "Vanak": {
      layer:undefined,
      show:false,
      waypoints: [
        [5000, 1350],
        [3376, 1673],
        [3057, 1713],
        [3000, 1663],
      ],
      color: "blue"
    },
    "Malexik": {
      layer:undefined,
      show:false,
      waypoints:[
        [1768, 401],
        [1677, 894],
        [1704, 767],
        [2308, 234],
        [2276, 187],
        [1741, 943],
        [3333,1085],
      ],
      color: 'red',
    },
    "Tikara": {
      layer:undefined,
      show:false,
      waypoints:[
        [350, 750],
        [1677, 894],
        [1704, 767],
      ],
      color: 'green',
    }
  };

  constructor(public dialog: MdDialog) {}

  openDialog(event) {
    let dialogRef= this.dialog.open(DialogResultExampleDialog);
    dialogRef.componentInstance.position= {
      x:Math.floor(event.layerX/this.ratio),
      y:Math.floor(event.layerY/this.ratio)
    };
    dialogRef.componentInstance.ratio=this.ratio;
    dialogRef.componentInstance.findClosest();
    dialogRef.componentInstance.chars=this.chars;
    dialogRef.afterClosed().subscribe(result => {
      if (this.chars[result]) {
        this.chars[result].waypoints.push([
          Math.floor(event.layerX / this.ratio),
          Math.floor(event.layerY / this.ratio)
        ]);
      }
    });
  }

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
      strokeWidth: 3,
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


  edit(charName) {
    this.editing = this.chars[charName];
    alert('editing' + charName);
  }

  ngAfterViewInit() {
    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.stage.on('click', (e) => {
      this.openDialog(e.evt);
      // alert('it happened!' + e.evt.x + " by " + e.evt.y);
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

@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: './dialog-result-example-dialog.html',
})
export class DialogResultExampleDialog {
  position:any;
  chars:any;
  ratio:any;
  points = [
    {x: 1625, y: 865, name: "Waterdeep", distanceFromOrigin:undefined},
    {x: 3380, y: 1100, name: "Hillsfar", distanceFromOrigin:undefined},
    {x: 50, y: 50, name: "Unknown", distanceFromOrigin:undefined}
  ];

  //LowRes map
  // Waterdeep @ 1625,865
  // Hillsfar @ 3380,1100

  findClosest() {
    for (let knownLoc of this.points) {
      knownLoc.distanceFromOrigin =
        Math.sqrt(
          Math.pow(knownLoc.x - this.position.x, 2) +
          Math.pow(knownLoc.y - this.position.y, 2)
        );
    }

    this.points.sort(function(a,b){
      return a.distanceFromOrigin - b.distanceFromOrigin;
    });
  };
  constructor(public dialogRef: MdDialogRef<DialogResultExampleDialog>) {}
}
