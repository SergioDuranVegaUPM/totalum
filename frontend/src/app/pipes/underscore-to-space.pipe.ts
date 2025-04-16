import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'underscoreToSpace',
  standalone: true
})

// Sustituye todos los caracteres "_" por espacios en blanco
export class UnderscoreToSpacePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/_/g, ' ');
  }
}
