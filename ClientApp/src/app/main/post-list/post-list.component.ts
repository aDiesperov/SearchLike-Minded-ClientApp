import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../../shared/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.sass']
})
export class PostListComponent implements OnInit, OnChanges {

  constructor(private service: PostService) { }

  postText = '';
  @Input() Id: number;
  @Input() Pub: boolean;
  posts = [];
  accessPublish = false;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.service.getPosts(this.Id, this.Pub).subscribe(
      (res: any) => {
        this.accessPublish = res.accessPublish;
        this.posts = res.posts;
      },
      err => { }
    );
  }

  onPost() {
    this.service.addPost(this.postText).subscribe(
      res => {
        this.postText = '';
        this.posts.unshift(Object.assign(res, {likes: 0, comments: 0}));
      }
    );
  }

}
