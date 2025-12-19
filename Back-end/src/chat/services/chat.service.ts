import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: string,
    senderRole: string,
  ) {
    console.log('ChatService: Creating message', {
      senderId,
      senderRole,
      receiverId: createMessageDto.receiverId,
      content: createMessageDto.content,
    });

    const message = await this.chatRepository.createMessage({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(createMessageDto.receiverId),
      content: createMessageDto.content,
      senderRole,
      isRead: false,
    });

    console.log('ChatService: Message created, fetching all messages', {
      messageId: message._id,
    });

    const allMessages = await this.chatRepository.getMessagesBetweenUsers(
      senderId,
      createMessageDto.receiverId,
    );

    console.log('ChatService: Retrieved messages', {
      messageCount: allMessages?.length || 0,
    });

    return allMessages;
  }

  async getMessages(userId: string, otherUserId: string) {
    // Xử lý trường hợp AI bot - không có messages trong DB
    if (otherUserId === 'ai-assistant' || otherUserId.toLowerCase() === 'ai') {
      return [];
    }
    return this.chatRepository.getMessagesBetweenUsers(userId, otherUserId);
  }

  async markAsRead(senderId: string, receiverId: string) {
    return this.chatRepository.markMessagesAsRead(senderId, receiverId);
  }

  async getUnreadCount(userId: string) {
    return this.chatRepository.getUnreadCount(userId);
  }

  async getConversations(userId: string, userRole: string) {
    console.log('ChatService: getConversations called', { userId, userRole });
    const result = await this.chatRepository.getAllConversationsForUser(userId, userRole);
    console.log('ChatService: getConversations result count:', result?.length || 0);
    return result;
  }

  async getAdminUser() {
    const admin = await this.userModel.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('Admin user not found');
    }
    return {
      _id: admin._id,
      displayName: admin.displayName,
      avaUrl: admin.avaUrl,
      role: admin.role,
    };
  }

  async getUserById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  async createChatbotMessage(
    data: {
      receiverId: string;
      content: string;
      quickReplies?: Array<{ title: string; payload: string }>;
      metadata?: any;
    },
    senderId: string, // Admin ID (chatbot gửi từ admin account)
  ) {
    console.log('ChatService: Creating chatbot message', {
      senderId,
      receiverId: data.receiverId,
      content: data.content,
    });

    const message = await this.chatRepository.createMessage({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(data.receiverId),
      content: data.content,
      senderRole: 'chatbot', // Đánh dấu là tin nhắn từ chatbot
      isRead: false,
      quickReplies: data.quickReplies,
      metadata: data.metadata,
    });

    console.log('ChatService: Chatbot message created, fetching all messages', {
      messageId: message._id,
    });

    const allMessages = await this.chatRepository.getMessagesBetweenUsers(
      senderId,
      data.receiverId,
    );

    console.log('ChatService: Retrieved messages', {
      messageCount: allMessages?.length || 0,
    });

    return allMessages;
  }
}

