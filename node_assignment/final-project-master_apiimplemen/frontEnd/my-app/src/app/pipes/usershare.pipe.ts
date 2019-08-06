import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usershare'
})
export class UsersharePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
