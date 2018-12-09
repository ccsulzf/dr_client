import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'filterMap' })
export class FilterPipe implements PipeTransform {
    transform(list, prop, value) {
        if (!prop || !value) {
            return list;
        }
        const maps = [];
        for (const item of list) {
            if (item[prop] === value) {
                maps.push(item);
            }
        }
        return maps;
    }
}
