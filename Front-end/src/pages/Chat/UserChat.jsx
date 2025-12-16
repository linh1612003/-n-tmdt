import React, { useState, useEffect } from 'react';
import { Box, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Badge } from '@material-ui/core';
import chatApi from '../../api/chatApi';
import Chat from '../../components/Chat/Chat';
import './Chat.scss';

const UserChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUserId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await chatApi.getConversations();
            setConversations(data);
            
            // Auto-select conversation if not already selected
            if (!selectedConversation && data.length > 0) {
                const firstConv = data[0];
                if (firstConv) {
                    setSelectedConversation({
                        userId: firstConv.userId?._id || firstConv.userId || firstConv.userId,
                        userName: firstConv.displayName || 'Người dùng',
                        userAvatar: firstConv.avaUrl || '',
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = (conversation) => {
        setSelectedConversation({
            userId: conversation.userId?._id || conversation.userId,
            userName: conversation.displayName || 'Người dùng',
            userAvatar: conversation.avaUrl || '',
        });
    };

    return (
        <Box className="chat-page-container">
            <Box className="chat-sidebar">
                <Paper className="sidebar-header">
                    <Typography variant="h6">Tin nhắn</Typography>
                </Paper>
                <List className="conversation-list">
                    {conversations.map((conversation, index) => {
                        const convUserId = conversation.userId?._id || conversation.userId;
                        const isSelected = selectedConversation?.userId === convUserId;
                        return (
                            <ListItem
                                key={index}
                                button
                                selected={isSelected}
                                onClick={() => handleSelectConversation(conversation)}
                                className="conversation-item"
                            >
                                <ListItemAvatar>
                                    <Badge
                                        badgeContent={conversation.unreadCount > 0 ? conversation.unreadCount : 0}
                                        color="error"
                                    >
                                        <Avatar src={conversation.avaUrl || ''}>
                                            {(conversation.displayName || 'U')?.charAt(0)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={conversation.displayName || 'Người dùng'}
                                    secondary={
                                        <Typography variant="caption" noWrap>
                                            {conversation.lastMessage?.content || ''}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
            <Box className="chat-main">
                {selectedConversation ? (
                    <Chat
                        userId={currentUserId}
                        userRole={userRole}
                        otherUserId={selectedConversation.userId}
                        otherUserName={selectedConversation.userName}
                        otherUserAvatar={selectedConversation.userAvatar}
                    />
                ) : (
                    <Paper className="no-conversation">
                        <Typography variant="h6" color="textSecondary">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

export default UserChat;

