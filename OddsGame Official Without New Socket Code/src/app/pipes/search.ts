import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the Search pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'searchByName',
  pure: true
})
export class SearchByName implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(list: any[], searchTerm: string): any[] {
    if(searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      return list.filter(item => {
        return item.name.toLowerCase().indexOf(searchTerm) !== -1;
      })
    }
    else {
      return list;
    }
  }
}

@Pipe({
  name: 'searchByChallenge',
  pure: true
})
export class SearchByChallenge implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(list: any[], searchTerm: string): any[] {
    if(searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      return list.filter(item => {
        return item.challenger_name.toLowerCase().indexOf(searchTerm) !== -1 || item.challengee_name.toLowerCase().indexOf(searchTerm) !== -1;
      })
    }
    else {
      return list;
    }
  }
}

