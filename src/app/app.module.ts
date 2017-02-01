import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from '@angular/material';

import 'hammerjs';

import {AppComponent, DialogResultExampleDialog, KeysPipe} from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    KeysPipe,
    DialogResultExampleDialog,
  ],
  entryComponents: [DialogResultExampleDialog],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
