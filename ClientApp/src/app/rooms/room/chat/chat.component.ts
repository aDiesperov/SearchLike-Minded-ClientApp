import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SignalrService } from 'src/app/shared/signalr.service';
import { Message } from 'src/app/models/message.model';
import { ChatService } from 'src/app/shared/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {

  constructor(signalr: SignalrService, private chat: ChatService) { 
    signalr.connection.on('receiveMessage', (message: Message, room: number) => {
      if(room === this.roomId){
        this.messages.push(message);
        setTimeout(this.scrolDown, 50);
      }
    });
    signalr.connection.on('deleteMessage', (messageId: number) => {
        this.messages = this.messages.filter(m => m.messageId !== messageId);
    });
  }

  @Input() roomId: number;
  @Input() messages: Array<Message>;
  message = '';

  ngOnInit() {
  }

  onSendMessage() {
    if (this.message.length > 0) {
      this.chat.sendMessage(this.roomId, this.message).subscribe((res: Message) => {
          this.messages.push(res);
          this.message = '';
          setTimeout(this.scrolDown, 50);
      });
    }
  }

  scrolDown() {
    let msg_history = document.querySelector('.msg_history') as HTMLElement;
    msg_history.scrollTo({top: msg_history.scrollHeight, behavior: 'smooth'});
  }

  onDelete(id: number) {
    if (confirm('Are you sure?')) {
      this.chat.deleteMessage(id).subscribe(
          res => this.messages = this.messages.filter(m => m.messageId != id)
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(this.scrolDown, 50);
  }

}
