import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommentService } from 'src/app/shared/comment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.sass']
})
export class CommentItemComponent implements OnInit {

  constructor(private service: CommentService) { }

  get Environment(){return environment}

  @Output() deletedComment = new EventEmitter<number>();
  AccessDelelete = false;
  @Input() Comment;

  ngOnInit() {
    this.Comment.commentDate = new Date(this.Comment.commentDate).toLocaleString();
    const UserId: number = +JSON.parse(window.atob(localStorage.getItem('Token').split('.')[1])).UserId;
    this.AccessDelelete = this.Comment.id === UserId;
  }

  onDelete() {
    this.service.delComment(this.Comment.commentId).subscribe(
      res => this.deletedComment.emit(this.Comment.commentId),
      err => { }
    );
  }

}
