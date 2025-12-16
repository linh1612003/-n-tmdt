import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './services/chat.service';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly jwtService;
    private readonly userModel;
    server: Server;
    private connectedUsers;
    constructor(chatService: ChatService, jwtService: JwtService, userModel: Model<User>);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleMessage(data: {
        receiverId: string;
        content: string;
    }, client: Socket): Promise<import("./schema/message.schema").Message[]>;
    handleJoinRoom(data: {
        otherUserId: string;
    }, client: Socket): Promise<void>;
    handleMarkAsRead(data: {
        senderId: string;
    }, client: Socket): Promise<void>;
    private getRoomId;
}
