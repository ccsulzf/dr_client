import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
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

@Pipe({ name: 'filterList' })
export class FilterListPipe implements PipeTransform {
    transform(list, prop, value) {
        if (!prop || !value) {
            return list;
        }
        const maps = _.differenceBy(list, value, 'name');
        return maps;
    }
}


@Pipe({ name: 'filterName' })
export class FilterNamePipe implements PipeTransform {
    transform(list, prop, value) {
        if (!prop || !value) {
            return list;
        }
        const tets = _.filter(list, (item) => {
            return item[prop].indexOf(value) > -1;
        });
        return tets;
    }
}


