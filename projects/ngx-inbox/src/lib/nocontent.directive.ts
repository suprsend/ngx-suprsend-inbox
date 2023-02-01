import {
  Directive,
  Input,
  TemplateRef,
  AfterContentChecked,
  ElementRef,
  ViewContainerRef,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[noContent]',
})
export class NoContentDirective implements AfterContentChecked {
  @Input()
  noContent: TemplateRef<any>;

  private element: HTMLElement;
  private hasContent = true;

  constructor(
    element: ElementRef,
    private container: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.element = element.nativeElement;
  }

  ngAfterContentChecked(): void {
    let hasContent = false;
    for (let i = this.element.childNodes.length - 1; i >= 0; --i) {
      const node = this.element.childNodes[i];
      if (node.nodeType === 1 || node.nodeType === 3) {
        hasContent = true;
        break;
      }
    }
    if (hasContent !== this.hasContent) {
      this.hasContent = hasContent;
      if (hasContent) {
        this.renderer.removeClass(this.element, 'is-empty');
        this.container.clear();
      } else {
        Promise.resolve().then(() => {
          this.renderer.addClass(this.element, 'is-empty');
          this.container.createEmbeddedView(this.noContent);
        });
      }
    }
  }
}
