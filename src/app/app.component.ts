import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { DATA } from './data';
// this is the broken data set
// import { DATA } from './dataset-with-duplicated-id';
import {
  AutoSizeVirtualScrollStrategy,
  DynamicSizeVirtualScrollStrategy,
  RxVirtualFor,
  RxVirtualScrollViewportComponent
} from './virtual-scrolling';

// uncomment when u like to use the currently released version
/*import {
  AutoSizeVirtualScrollStrategy,
  DynamicSizeVirtualScrollStrategy,
  RxVirtualFor,
  RxVirtualScrollViewportComponent
} from '@rx-angular/template/experimental/virtual-scrolling';*/

@Component({
  selector: 'app-root',
  template: `
    <div>
      <button style="margin-right: 1rem" (click)="show = 'autosize'">Autosize</button>
      <button (click)="show = 'dynamic'">Dynamic</button>
      <div><strong>Active: {{ show }}</strong></div>
    </div>
    <div class="__wrap">
      <div class="__log-viewport" #viewportRef>
        <ng-container *ngIf="show === 'autosize'; else: dynamic">
          <rx-virtual-scroll-viewport
            class="__scroller"
            autosize
            [tombstoneSize]="_rowSize"
            [runwayItems]="10">
            <div class="__item" *rxVirtualFor="let item of items$; trackBy: 'id'">
              <span class="__timestamp">{{ item.timestamp }}</span><span class="__content">{{ item.content }}</span>
            </div>
          </rx-virtual-scroll-viewport>
        </ng-container>
        <ng-template #dynamic>
          <rx-virtual-scroll-viewport
            class="__scroller"
            *ngIf="!!viewportWidth"
            [dynamic]="dynamicSize"
            [runwayItems]="10">
            <div class="__item" *rxVirtualFor="let item of items$; trackBy: 'id'">
              <span class="__timestamp">{{ item.timestamp }}</span><span class="__content">{{ item.content }}</span>
            </div>
          </rx-virtual-scroll-viewport>
        </ng-template>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    RxVirtualScrollViewportComponent,
    RxVirtualFor,
    DynamicSizeVirtualScrollStrategy,
    NgIf,
    AutoSizeVirtualScrollStrategy
  ]
})
export class AppComponent {

  show = 'autosize';

  items$ = of(DATA);
  viewportWidth!: number;

  _rowSize = 22;
  private _itemPadding = 32;
  private _letterWidth = 7.21;

  @ViewChild('viewportRef')
  viewportRef!: ElementRef<HTMLElement>;

  dynamicSize = (item: any) => {
    const charsPerRow = Math.floor(this.viewportWidth / this._letterWidth);
    const rows = Math.ceil(
      ((item.timestamp + item.content).length + 10) / charsPerRow
    );
    return Math.max(rows, 1) * this._rowSize;
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.viewportWidth =
        this.viewportRef.nativeElement.clientWidth - this._itemPadding;
    });
  }

}
