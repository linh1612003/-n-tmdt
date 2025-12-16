import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UseGuards } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
@Injectable()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        console.error('Connection error: No token provided');
        client.emit('error', { message: 'Token is required' });
        client.disconnect();
        return;
      }

      const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        console.error('Connection error: No JWT secret configured');
        client.emit('error', { message: 'Server configuration error' });
        client.disconnect();
        return;
      }

      const decoded = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      const user = await this.userModel.findById(decoded.userId);
      if (!user) {
        console.error('Connection error: User not found');
        client.emit('error', { message: 'User not found' });
        client.disconnect();
        return;
      }

      // Đảm bảo userId là string để match với receiverId
      const userIdString = decoded.userId.toString();
      client.data.userId = userIdString;
      client.data.userRole = user.role;
      this.connectedUsers.set(userIdString, client.id);

      // Notify user is online
      this.server.emit('userOnline', {
        userId: userIdString,
        isOnline: true,
      });

      console.log(`User ${userIdString} connected (role: ${user.role})`);
      console.log('ChatGateway: Connected users:', Array.from(this.connectedUsers.keys()));
      
      // Emit event để báo client connection đã sẵn sàng
      client.emit('connectionReady', {
        userId: userIdString,
        userRole: user.role,
      });
    } catch (error) {
      console.error('Connection error:', error);
      
      // Gửi thông báo lỗi cụ thể về client
      if (error.name === 'TokenExpiredError') {
        client.emit('error', { 
          message: 'Token expired', 
          code: 'TOKEN_EXPIRED' 
        });
      } else if (error.name === 'JsonWebTokenError') {
        client.emit('error', { 
          message: 'Invalid token', 
          code: 'INVALID_TOKEN' 
        });
      } else {
        client.emit('error', { 
          message: error.message || 'Connection failed', 
          code: 'CONNECTION_ERROR' 
        });
      }
      
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.connectedUsers.delete(client.data.userId);
      this.server.emit('userOnline', {
        userId: client.data.userId,
        isOnline: false,
      });
      console.log(`User ${client.data.userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { receiverId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const senderId = client.data.userId;
      const senderRole = client.data.userRole;

      console.log('ChatGateway: Received sendMessage', {
        senderId,
        senderRole,
        receiverId: data.receiverId,
        content: data.content,
      });

      if (!senderId || !data.receiverId || !data.content) {
        console.error('ChatGateway: Missing required fields', {
          senderId,
          receiverId: data.receiverId,
          content: data.content,
        });
        client.emit('error', { message: 'Missing required fields' });
        return;
      }

      // Đảm bảo receiverId là string
      const receiverIdString = data.receiverId.toString();
      
      const messages = await this.chatService.createMessage(
        {
          receiverId: receiverIdString,
          content: data.content,
        },
        senderId,
        senderRole,
      );

      console.log('ChatGateway: Message saved successfully', {
        messageCount: messages?.length || 0,
      });

      // Send to sender
      console.log('ChatGateway: Emitting newMessage to sender', {
        senderId,
        socketId: client.id,
        messageCount: messages?.length || 0,
      });
      client.emit('newMessage', messages);

      // Send to receiver if online
      // receiverIdString đã được khai báo ở trên
      const receiverSocketId = this.connectedUsers.get(receiverIdString);
      
      console.log('ChatGateway: Looking for receiver', {
        receiverId: data.receiverId,
        receiverIdString: receiverIdString,
        connectedUsers: Array.from(this.connectedUsers.keys()),
        found: !!receiverSocketId,
      });
      
      if (receiverSocketId) {
        console.log('ChatGateway: Sending message to receiver', {
          receiverId: receiverIdString,
          socketId: receiverSocketId,
        });
        this.server.to(receiverSocketId).emit('newMessage', messages);
      } else {
        console.log('ChatGateway: Receiver not online', {
          receiverId: receiverIdString,
          availableUsers: Array.from(this.connectedUsers.keys()),
        });
      }

      return messages;
    } catch (error) {
      console.error('ChatGateway: Error sending message:', error);
      console.error('ChatGateway: Error stack:', error.stack);
      client.emit('error', { 
        message: 'Failed to send message',
        error: error.message,
      });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { otherUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    // Đảm bảo otherUserId là string
    const otherUserIdString = data.otherUserId?.toString();
    console.log('ChatGateway: joinRoom called', { userId, otherUserId: data.otherUserId, otherUserIdString });
    
    if (!userId) {
      console.error('ChatGateway: joinRoom - userId not found in client.data');
      client.emit('error', { message: 'User ID not found' });
      return;
    }
    
    if (!otherUserIdString) {
      console.error('ChatGateway: joinRoom - otherUserId not provided');
      client.emit('error', { message: 'Other user ID not provided' });
      return;
    }
    
    const roomId = this.getRoomId(userId, otherUserIdString);
    client.join(roomId);
    console.log('ChatGateway: User joined room', { userId, otherUserId: otherUserIdString, roomId });

    // Load and send message history
    console.log('ChatGateway: Loading messages for', { userId, otherUserId: otherUserIdString });
    const messages = await this.chatService.getMessages(
      userId,
      otherUserIdString,
    );
    console.log('ChatGateway: Loaded messages count:', messages?.length || 0);
    client.emit('messageHistory', messages);

    // Mark messages as read
    await this.chatService.markAsRead(otherUserIdString, userId);
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { senderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const receiverId = client.data.userId;
    await this.chatService.markAsRead(data.senderId, receiverId);

    // Notify sender that messages were read
    const senderSocketId = this.connectedUsers.get(data.senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('messagesRead', {
        receiverId,
      });
    }
  }

  private getRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('-');
  }
}

