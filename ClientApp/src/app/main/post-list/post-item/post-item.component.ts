import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { PostService } from '../../../shared/post.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.sass']
})
export class PostItemComponent implements OnInit {

  constructor(private service: PostService, private elementRef: ElementRef) { }

  @Input() Post: {
    comments: number,
    postDate: string,
    postId: number,
    likes: number,
    myLike: boolean
  };
  @Input() AccessDelelete: boolean;

  ngOnInit() {
    this.Post.postDate = new Date(this.Post.postDate).toLocaleString();
  }

  onDelete() {
    this.service.delPost(this.Post.postId).subscribe(
      res => this.elementRef.nativeElement.remove(),
      err => {}
    );
  }

  changeComments(d: number) {
    this.Post.comments += + d;
  }

  onLike() {
    this.service.likePost(this.Post.postId).subscribe(
      res => {
        this.Post.likes += this.Post.myLike ? -1 : 1;
        this.Post.myLike = !this.Post.myLike;
      },
      err => {}
    );
    return false;
  }
}
