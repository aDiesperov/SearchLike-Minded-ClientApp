import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../../shared/post.service';
import { Post } from 'src/app/models/post.model';

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
  posts: Post[];
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
      (res: Post) => {
        this.postText = '';
        this.posts.unshift(Object.assign(res, {likes: 0, comments: 0}));
      }
    );
  }

}
