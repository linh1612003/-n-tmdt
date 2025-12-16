import React, { useState, useEffect } from 'react';
import { Box, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Badge } from '@material-ui/core';
import chatApi from '../../../api/chatApi';
import Chat from '../../../components/Chat/Chat';
import './AdminChat.scss';

const AdminChat = () => {
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
            console.log('AdminChat: Loading conversations for user:', currentUserId, 'role:', userRole);
            const data = await chatApi.getConversations();
            console.log('AdminChat: Received conversations data:', data);
            console.log('AdminChat: Number of conversations:', data?.length || 0);
            
            // Filter to show only user conversations (not admin-to-admin)
            const userConversations = data.filter(conv => {
                const userId = conv.userId?._id || conv.userId;
                console.log('AdminChat: Filtering conversation with userId:', userId);
                // You might need to check if userId is admin or not
                // For now, we'll show all conversations
                return true;
            });
            
            console.log('AdminChat: Filtered conversations:', userConversations.length);
            setConversations(userConversations);
            
            // Auto-select first conversation if available
            if (userConversations.length > 0 && !selectedConversation) {
                setSelectedConversation({
                    userId: userConversations[0].userId?._id || userConversations[0].userId,
                    userName: userConversations[0].displayName || 'Người dùng',
                    userAvatar: userConversations[0].avaUrl || '',
                });
            }
        } catch (error) {
            console.error('AdminChat: Failed to load conversations:', error);
            console.error('AdminChat: Error details:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = async (conversation) => {
        const selectedUserId = conversation.userId?._id || conversation.userId;

        // Mark messages from this user as read
        try {
            await chatApi.markAsRead(selectedUserId);
        } catch (err) {
            console.error('AdminChat: Failed to mark messages as read', err);
        }

        // Update selected conversation
        setSelectedConversation({
            userId: selectedUserId,
            userName: conversation.displayName || 'Người dùng',
            userAvatar: conversation.avaUrl || '',
        });

        // Optimistically set unreadCount to 0 for this conversation
        setConversations((prev) =>
            prev.map((c) => {
                const id = c.userId?._id || c.userId;
                if (id === selectedUserId) {
                    return { ...c, unreadCount: 0 };
                }
                return c;
            }),
        );
    };

    return (
        <Box className="admin-chat-page-container">
            <Box className="chat-sidebar">
                <Paper className="sidebar-header">
                    <Typography variant="h6">Tin nhắn từ khách hàng</Typography>
                </Paper>
                <List className="conversation-list">
                    {loading ? (
                        <ListItem>
                            <Typography variant="body2">Đang tải...</Typography>
                        </ListItem>
                    ) : conversations.length === 0 ? (
                        <ListItem>
                            <Typography variant="body2" color="textSecondary">
                                Chưa có cuộc trò chuyện nào
                            </Typography>
                        </ListItem>
                    ) : (
                        conversations.map((conversation, index) => {
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
                                            badgeContent={conversation.unreadCount}
                                            color="error"
                                            showZero={false}
                                        >
                                            <Avatar src={conversation.avaUrl || ''}>
                                                {(conversation.displayName || 'U')?.charAt(0)}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={conversation.displayName || 'Người dùng'}
                                        primaryTypographyProps={{
                                            style: {
                                                fontWeight: conversation.unreadCount > 0 ? 700 : 400,
                                            },
                                        }}
                                        secondary={
                                            <Typography variant="caption" noWrap>
                                                {conversation.lastMessage?.content || ''}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            );
                        })
                    )}
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

export default AdminChat;

