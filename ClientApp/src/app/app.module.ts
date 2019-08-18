import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './main/profile/profile.component';
import { FriendListComponent } from './main/friend-list/friend-list.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { FriendItemComponent } from './main/friend-list/friend-item/friend-item.component';
import { InfoProfileComponent } from './main/profile/info-profile/info-profile.component';
import { PostListComponent } from './main/post-list/post-list.component';
import { PostItemComponent } from './main/post-list/post-item/post-item.component';
import { CommentListComponent } from './main/post-list/post-item/comment-list/comment-list.component';
import { CommentItemComponent } from './main/post-list/post-item/comment-list/comment-item/comment-item.component';
import { SearchComponent } from './main/search/search.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { SettingsComponent } from './main/settings/settings.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { NewRoomComponent } from './rooms/new-room/new-room.component';
import { ChatComponent } from './rooms/room/chat/chat.component';
import { DashboardComponent } from './rooms/room/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ProfileComponent,
    FriendListComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    FriendItemComponent,
    InfoProfileComponent,
    PostListComponent,
    PostItemComponent,
    CommentListComponent,
    CommentItemComponent,
    SearchComponent,
    SettingsComponent,
    RoomsComponent,
    RoomComponent,
    NewRoomComponent,
    ChatComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({progressBar: true}),
    NgxUiLoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
