import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './main/profile/profile.component';
import { FriendListComponent } from './main/friend-list/friend-list.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { SearchComponent } from './main/search/search.component';
import { SettingsComponent } from './main/settings/settings.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
import { NewRoomComponent } from './rooms/new-room/new-room.component';


const routes: Routes = [{ path: '', pathMatch: 'full', redirectTo: '/login' },
{path: '', component: UserComponent, children: [{ path: 'login', component: LoginComponent },
                                                    { path: 'register', component: RegisterComponent }]},
{ path: '', component: MainComponent, canActivate: [AuthGuard],
                        children: [{ path: 'profile/:id', component: ProfileComponent },
                                    {path: 'friends', pathMatch: 'full', redirectTo: '/friends/all'},
                                    { path: 'friends/:type', component: FriendListComponent },
                                    { path: 'settings', component: SettingsComponent },
                                    { path: 'search', component: SearchComponent}]},
  {path: 'room', component: RoomsComponent, canActivate: [AuthGuard],
                        children: [ {path: '', component: NewRoomComponent},
                                    {path: ':id', component: RoomComponent}]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
