import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { PaintService } from './paint/paint.service';
import { PaintComponent } from './paint/paint.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, PaintComponent ],
  bootstrap:    [ AppComponent ],
  providers: [PaintService]
})
export class AppModule { }
