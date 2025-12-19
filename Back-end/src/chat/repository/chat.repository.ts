import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schema/message.schema';
import { Types } from 'mongoose';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(messageData: Partial<Message>): Promise<Message> {
    console.log('ChatRepository: Creating message', messageData);
    const message = new this.messageModel(messageData);
    const savedMessage = await message.save();
    console.log('ChatRepository: Message saved to database', {
      messageId: savedMessage._id,
      senderId: savedMessage.senderId,
      receiverId: savedMessage.receiverId,
      content: savedMessage.content,
    });
    return savedMessage;
  }

  async getMessagesBetweenUsers(
    userId1: string,
    userId2: string,
  ): Promise<Message[]> {
    // Xử lý trường hợp AI bot - không có messages trong DB
    if (userId1 === 'ai-assistant' || userId1.toLowerCase() === 'ai' ||
        userId2 === 'ai-assistant' || userId2.toLowerCase() === 'ai') {
      return [];
    }
    
    const messages = await this.messageModel
      .find({
        $or: [
          {
            senderId: new Types.ObjectId(userId1),
            receiverId: new Types.ObjectId(userId2),
          },
          {
            senderId: new Types.ObjectId(userId2),
            receiverId: new Types.ObjectId(userId1),
          },
        ],
      })
      .sort({ createdAt: 1 })
      .populate('senderId', 'displayName avaUrl role')
      .populate('receiverId', 'displayName avaUrl role')
      .exec();

    // Transform messages: if sender is admin, replace displayName with "Admin"
    // If sender is chatbot, replace displayName with "Chatbot"
    return messages.map((msg: any) => {
      if (msg.senderId) {
        const senderObj = msg.senderId.toObject ? msg.senderId.toObject() : msg.senderId;
        if (msg.senderRole === 'chatbot') {
          msg.senderId = {
            ...senderObj,
            displayName: 'Chatbot',
            role: 'chatbot',
          };
        } else if (senderObj.role === 'admin') {
          msg.senderId = {
            ...senderObj,
            displayName: 'Admin',
          };
        }
      }
      return msg;
    });
  }

  async markMessagesAsRead(
    senderId: string,
    receiverId: string,
  ): Promise<void> {
    await this.messageModel.updateMany(
      {
        senderId: new Types.ObjectId(senderId),
        receiverId: new Types.ObjectId(receiverId),
        isRead: false,
      },
      { isRead: true },
    );
  }

  async getUnreadCount(receiverId: string): Promise<number> {
    return this.messageModel.countDocuments({
      receiverId: new Types.ObjectId(receiverId),
      isRead: false,
    });
  }

  async getAllConversationsForUser(userId: string, userRole: string): Promise<any[]> {
    console.log('ChatRepository: getAllConversationsForUser', { userId, userRole });
    
    // Build match condition based on user role
    let matchCondition: any = {
      $or: [
        { senderId: new Types.ObjectId(userId) },
        { receiverId: new Types.ObjectId(userId) },
      ],
    };

    console.log('ChatRepository: Match condition', JSON.stringify(matchCondition, null, 2));

    // Kiểm tra xem có messages nào không
    const totalMessages = await this.messageModel.countDocuments(matchCondition);
    console.log('ChatRepository: Total messages matching condition:', totalMessages);

    const conversations = await this.messageModel.aggregate([
      {
        $match: matchCondition,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new Types.ObjectId(userId)] },
              '$receiverId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false, // Chỉ giữ lại khi có user
        },
      },
      // Filter based on role: admin sees only users, users see only admin
      {
        $match: userRole === 'admin'
          ? { 'user.role': { $ne: 'admin' } } // Admin only sees conversations with users
          : { 'user.role': 'admin' }, // Users only see conversation with admin
      },
      {
        $project: {
          userId: '$_id',
          displayName: userRole === 'admin' 
            ? '$user.displayName' // Admin sees user's name
            : 'Admin', // Users see "Admin" instead of admin's name
          avaUrl: '$user.avaUrl',
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            senderId: '$lastMessage.senderId',
          },
          unreadCount: 1,
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    console.log('ChatRepository: Found conversations', conversations.length);
    if (conversations.length > 0) {
      console.log('ChatRepository: First conversation sample:', JSON.stringify(conversations[0], null, 2));
    } else {
      // Nếu không có conversations, kiểm tra xem có messages không
      const allMessages = await this.messageModel.find(matchCondition).limit(5).exec();
      console.log('ChatRepository: Sample messages (first 5):', allMessages.map(m => ({
        _id: m._id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        content: m.content,
      })));
    }

    return conversations;
  }
}

