import { Directive, ViewContainerRef, ElementRef } from '@angular/core';

@Directive({
    selector: '[dynamic-component]',
})
export class DynamicComponentDirective {
    constructor(
        public viewContainerRef: ViewContainerRef
    ) { }
}
