import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addSymbol',
  standalone: true
})

// Agrega el símbolo concreto al campo concreto
export class AddSymbolPipe implements PipeTransform {

  transform(value: string, keyword: string): string {
    const keywordsEuro = ['importe_impuestos', 'importe', 'precio'];

    if (keywordsEuro.includes(keyword)) {
      return `${value} €`;
    }

    return value;
  }
}

