import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight',
})

export class HighlightPipe implements PipeTransform {
    transform(value: string, term: string): string {
        if (value == undefined ) {
            return '';
        }
        value = '<span class="highlight" style="color: green;">' + term + '</span> ' + value;
        return value;
    }
}
