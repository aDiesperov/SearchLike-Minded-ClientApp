import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SignalrService } from 'src/app/shared/signalr.service';
import { Message } from 'src/app/models/message.model';
import { ChatService } from 'src/app/shared/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {
  get Environment() {
    return environment;
  }

  constructor(
    signalrService: SignalrService,
    private chatService: ChatService
  ) {
    signalrService.connection.on(
      'receiveMessage',
      (message: Message, room: number) => {
        if (room === this.roomId) {
          this.chatService.messages.push(message);
          setTimeout(this.scrolDown, 50);
        }
      }
    );
    signalrService.connection.on('deleteMessage', (messageId: number) => {
      this.chatService.messages = this.chatService.messages.filter(
        m => m.messageId !== messageId
      );
    });
  }

  @Input() roomId: number;
  message = '';

  ngOnInit() {}

  onSendMessage() {
    if (this.message.length > 0) {
      this.chatService
        .sendMessage(this.roomId, this.message)
        .subscribe((res: Message) => {
          this.message = '';
          setTimeout(this.scrolDown, 50);
        });
    }
  }

  scrolDown() {
    let msg_history = document.querySelector('.msg_history') as HTMLElement;
    msg_history.scrollTo({ top: msg_history.scrollHeight, behavior: 'smooth' });
  }

  onDelete(id: number) {
    if (confirm('Are you sure?')) {
      this.chatService.deleteMessage(id).subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(this.scrolDown, 50);
  }
}
