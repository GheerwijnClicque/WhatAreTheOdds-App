import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchByName',
  pure: true
})
export class SearchByName implements PipeTransform {

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

