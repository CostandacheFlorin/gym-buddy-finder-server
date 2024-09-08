import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import generateRoomName from 'utils/generateRoomName';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/messages',
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    message: { content: string; sender: string; receiver: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const roomName = generateRoomName(message.sender, message.receiver);
    this.server.to(roomName).emit('receiveMessage', { message });

    // Update latest chats for both users

    this.server.to(message.sender).emit('updateLatestChats', message);
    this.server.to(message.receiver).emit('updateLatestChats', message);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.handshake.query.userId as string;
    const otherUser = client.handshake.query.otherUserId as string;

    const roomName = generateRoomName(loggedInUser, otherUser);

    client.join(roomName);
    client.join(loggedInUser); // Also join user's own room for latestChats updates
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {}
}
