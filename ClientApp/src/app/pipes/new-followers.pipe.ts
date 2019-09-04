import { Pipe, PipeTransform } from '@angular/core';
import { UserCard } from '../models/userCard.model';

@Pipe({
  name: 'newFollowers'
})
export class NewFollowersPipe implements PipeTransform {

  transform(users: UserCard[], newFollowers: boolean): UserCard[] {
    return users.filter(u => u.new === newFollowers);
  }

}
