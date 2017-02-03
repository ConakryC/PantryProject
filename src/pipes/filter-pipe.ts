import {Injectable, Pipe} from '@angular/core';
import * as Enums from '../providers/ordering-helper';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe {

  /**
  * Works but may end up being expensive since a filter pipe and a sort pipe would be modfying the same list
  **/
  transform(array, args) {
    switch (args) {
      case Enums.Filter.Gluten_Free.value:
        return array.filter((item) => {
          //Make sure item exists
          if (item) {
            if (item.info.badges) {

              //Check to make sure it has gluten free badge
              return item.info.badges.indexOf('gluten_free') > -1;
            }
          }
          return false;
        });
      case Enums.Filter.Favorite.value:
        break;
      case Enums.Filter.Not_Favorite.value:
        break;
      case Enums.Filter.Dairy_Free.value:
        break;
      case Enums.Filter.Peanut_Free.value:
        break;
      default:
        //Don't mess with the array if not one of the above filters
        //Ex. ALL filter
        break;
    }

    return array;
  }
}
