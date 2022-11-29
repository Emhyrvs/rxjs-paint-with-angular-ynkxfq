import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { mergeMap, takeUntil, switchMap } from 'rxjs/operators';

import { PaintService } from './paint.service';

@Component({
  selector: 'app-paint',
  template: `
    <h3>Paint something!</h3>
    <canvas #mount>  /></canvas>
    <div style="display:none;">
  <img id="source" src="https://www.w3schools.com/tags/img_the_scream.jpg" width="500" height="227" />
</div>
  `,
  styleUrls: ['./paint.component.css'],
})
export class PaintComponent implements OnInit, AfterViewInit {
  constructor(private paintSvc: PaintService, private elRef: ElementRef) {}

  ngOnInit() {
    console.log(this.elRef);
    this.paintSvc.initialize(this.elRef.nativeElement);
    this.startPainting();
  }
  ngAfterViewInit() {}

  private startPainting() {
    const { nativeElement } = this.elRef;
    const canvas = nativeElement.querySelector('canvas') as HTMLCanvasElement;

    const ctx = canvas.getContext('2d');
    const image = nativeElement.querySelector('#source');

    image.addEventListener('load', (e) => {
      ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
    });
    var background = new Image();
    background.src = 'http://www.samskirrow.com/background.png';

    // Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function () {
      ctx.drawImage(background, 0, 0);
    };
    const move$ = fromEvent<MouseEvent>(canvas, 'mousemove');
    const down$ = fromEvent<MouseEvent>(canvas, 'mousedown');
    const up$ = fromEvent<MouseEvent>(canvas, 'mouseup');
    const paints$ = down$.pipe(
      mergeMap((down) => move$.pipe(takeUntil(up$)))
      // mergeMap(down => move$)
    );

    down$.subscribe(console.info);

    const offset = getOffset(canvas);

    paints$.subscribe((event) => {
      const clientX = event.clientX - offset.left;
      const clientY = event.clientY - offset.top;
      this.paintSvc.paint({ clientX, clientY });
    });
  }
}

function getOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  };
}
