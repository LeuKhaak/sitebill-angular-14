import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replace',
})

export class ReplacePipe implements PipeTransform {
    transform(value: string, regexValue: string, replaceValue: string): any {
        let pattern = new RegExp(regexValue, 'g');

        if (regexValue == 'htmlEntities') {
            return this.htmlEntities(value);
        } else {
            pattern = new RegExp(regexValue, 'g');
        }
        return value.replace(pattern, replaceValue);
    }

    htmlEntities(str) {
        return String(str).replace(/&nbsp;/g, ' ').replace(/&laquo/g, '"').replace(/&raquo;/g, '"').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&mdash;/g, ' - ');
    }
}
