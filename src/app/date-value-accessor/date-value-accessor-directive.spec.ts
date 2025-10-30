import { DateValueAccessorDirective } from './date-value-accessor.directive';
import { ElementRef } from '@angular/core';

describe('DateValueAccessorDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(document.createElement('input'));
    const directive = new DateValueAccessorDirective(el);
    expect(directive).toBeTruthy();
  });
});
