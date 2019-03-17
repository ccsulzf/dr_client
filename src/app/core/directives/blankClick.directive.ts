import { Directive, ViewContainerRef, ElementRef, HostListener, Renderer } from '@angular/core';
import { SystemService } from '../providers/system.service';
@Directive({
    selector: '[blankClick]',
})
export class BlankClickDirective {
    constructor(
        public el: ElementRef,
        public renderer: Renderer,
        public system: SystemService,
        public viewRef: ViewContainerRef
    ) { }

    @HostListener('document:click', ['$event'])
    onClick() {
        if (this.el.nativeElement.contains(event.target)) {
            this.system.showList({
                id: this.viewRef.element.nativeElement.id,
            });
        } else {
            this.system.showList({
                id: '',
            });
        }
    }
}
