import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  private messages: any[] = [];

  getAllMessages() {
    return this.messages;
  }

  addMessage(message: any) {
    this.messages.push(message);
  }
}
