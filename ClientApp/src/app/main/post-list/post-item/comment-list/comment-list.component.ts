import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentService } from '../../../../shared/comment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.sass']
})
export class CommentListComponent implements OnInit {
  constructor(private service: CommentService) {}

  get Environment(){return environment; }

  @Output() changeComments = new EventEmitter<number>();

  comments = [];
  @Input() PostId: number;
  textComment = '';
  avatar = 'default.jpg';

  ngOnInit() {
    this.service
      .getComments(this.PostId)
      .subscribe((res: any) => (this.comments = res), err => {});

    let avatar = localStorage.getItem('avatar');
    if (avatar !== null) this.avatar = avatar;
    else
      setTimeout(() => {
        let avatar = localStorage.getItem('avatar');
        if (avatar!== null) this.avatar = avatar;
      }, 1500);
  }

  onComment() {
    this.service.addComment(this.PostId, this.textComment).subscribe(
      res => {
        this.comments.push(res);
        this.textComment = '';
        this.changeComments.emit(1);
      },
      err => {}
    );
  }

  deletedComment(commentId: number) {
    this.comments = this.comments.filter(c => c.commentId !== commentId);
    this.changeComments.emit(-1);
  }
}
