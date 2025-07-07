import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
@Injectable()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  emitContentUpdate(contentId: number) {
    this.server.emit('content-updated', { contentId });
  }
}
