import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { PostService } from '../../../shared/post.service';
import { environment } from 'src/environments/environment';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.sass']
})
export class PostItemComponent implements OnInit {

  constructor(private service: PostService, private elementRef: ElementRef) { }

  get Environment(){ return environment}

  @Input() post: Post;
  @Input() AccessDelelete: boolean;

  ngOnInit() {
    this.post.postDate = new Date(this.post.postDate).toLocaleString();
  }

  onDelete() {
    this.service.delPost(this.post.postId).subscribe(
      res => this.elementRef.nativeElement.remove(),
      err => {}
    );
  }

  changeComments(d: number) {
    this.post.comments += + d;
  }

  onLike() {
    this.service.likePost(this.post.postId).subscribe(
      res => {
        this.post.likes += this.post.myLike ? -1 : 1;
        this.post.myLike = !this.post.myLike;
      }
    );
    return false;
  }
}
