import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'price'
})
export class PricePipe implements PipeTransform {

    public transform(value: number | string, trailingZeroesNumber = 0): string {

        const numberWithSpaces = (x) => {
            const num = (trailingZeroesNumber ? (+x || 0).toFixed(trailingZeroesNumber) : (+x || 0)).toString();
            return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('.', ',');
        };

        return numberWithSpaces(value);
    }

}
