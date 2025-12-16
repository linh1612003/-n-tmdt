import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import chatApi from '../../api/chatApi';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    CircularProgress,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import './Chat.scss';

const Chat = ({ userId, userRole, otherUserId, otherUserName, otherUserAvatar }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Initialize socket connection
        const newSocket = io('http://localhost:5000/chat', {
            auth: {
                token: token,
            },
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            // Đợi connection ready từ server
        });

        // Đợi server báo connection đã sẵn sàng
        newSocket.on('connectionReady', (data) => {
            console.log('Chat: Connection ready, userId:', data.userId);
            if (otherUserId) {
                newSocket.emit('joinRoom', { otherUserId });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        newSocket.on('newMessage', (data) => {
            console.log('Received newMessage event:', data);
            // Xóa các temp messages (tin nhắn tạm) khi nhận được message từ server
            setMessages(prevMessages => {
                const filteredPrev = prevMessages.filter(msg => {
                    const id = msg._id?.toString() || msg._id;
                    return !id?.toString().startsWith('temp-');
                });
                
                // Tạo map để tránh duplicate
                const messageMap = new Map();
                // Thêm tin nhắn cũ (đã lọc temp)
                filteredPrev.forEach(msg => {
                    const id = msg._id?.toString() || msg._id;
                    if (id) messageMap.set(id, msg);
                });
                // Thêm tin nhắn mới (có thể là array hoặc single message)
                const newMessages = Array.isArray(data) ? data : [data];
                newMessages.forEach(msg => {
                    const id = msg._id?.toString() || msg._id;
                    if (id) messageMap.set(id, msg);
                });
                return Array.from(messageMap.values()).sort((a, b) => {
                    const timeA = new Date(a.createdAt || 0).getTime();
                    const timeB = new Date(b.createdAt || 0).getTime();
                    return timeA - timeB;
                });
            });
            scrollToBottom();
        });

        newSocket.on('messageHistory', (data) => {
            setMessages(data);
            setLoading(false);
            scrollToBottom();
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [otherUserId]);

    useEffect(() => {
        if (otherUserId) {
            loadMessages();
        }
    }, [otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await chatApi.getMessages(otherUserId);
            setMessages(data);
            if (socket && socket.connected) {
                socket.emit('joinRoom', { otherUserId });
                socket.emit('markAsRead', { senderId: otherUserId });
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !socket) return;

        const messageContent = newMessage.trim();
        
        // Optimistic update: Hiển thị tin nhắn của user ngay lập tức
        const tempUserMessage = {
            _id: `temp-${Date.now()}`,
            senderId: {
                _id: currentUserId,
                displayName: localStorage.getItem('userName') || 'Bạn',
                avaUrl: localStorage.getItem('userAvatar') || '',
                role: 'user',
            },
            receiverId: {
                _id: otherUserId,
            },
            content: messageContent,
            isRead: false,
            senderRole: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        // Thêm tin nhắn tạm vào danh sách
        setMessages(prev => [...prev, tempUserMessage]);
        setNewMessage('');
        scrollToBottom();

        try {
            socket.emit('sendMessage', {
                receiverId: otherUserId,
                content: messageContent,
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            // Xóa tin nhắn tạm nếu có lỗi
            setMessages(prev => prev.filter(msg => msg._id !== tempUserMessage._id));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <Box className="chat-container">
            <Paper className="chat-header">
                <Box display="flex" alignItems="center">
                    <Avatar src={otherUserAvatar} alt={otherUserName}>
                        {otherUserName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box ml={2}>
                        <Typography variant="h6">
                            {otherUserName || 'Người dùng'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Box className="chat-messages">
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {messages.map((message, index) => {
                            const senderId = message.senderId?._id || message.senderId?.toString() || message.senderId;
                            const isOwnMessage = senderId === currentUserId;
                            // Get sender name: if admin, show "Admin", else show displayName
                            const senderName = message.senderId?.role === 'admin' 
                                ? 'Admin' 
                                : (message.senderId?.displayName || 'Người dùng');
                            const senderAvatar = message.senderId?.role === 'admin' 
                                ? '' 
                                : (message.senderId?.avaUrl || '');
                            return (
                                <ListItem
                                    key={index}
                                    className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                        alignItems: 'flex-end',
                                        width: '100%',
                                        paddingLeft: isOwnMessage ? '8px' : '0',
                                        paddingRight: isOwnMessage ? '0' : '8px',
                                        marginLeft: isOwnMessage ? 'auto' : '0',
                                        marginRight: isOwnMessage ? '0' : 'auto',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {!isOwnMessage && (
                                        <ListItemAvatar style={{ minWidth: '40px', marginRight: '8px' }}>
                                            <Avatar src={senderAvatar}>
                                                {senderName.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                    )}
                                    <ListItemText
                                        style={{
                                            textAlign: isOwnMessage ? 'right' : 'left',
                                            maxWidth: '75%',
                                            paddingRight: isOwnMessage ? '0' : 'inherit',
                                            marginRight: isOwnMessage ? '0' : 'inherit',
                                            flex: isOwnMessage ? '0 0 auto' : 'inherit',
                                        }}
                                        primary={
                                            <Box
                                                className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}
                                                style={{
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {!isOwnMessage && (
                                                    <Typography variant="caption" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', opacity: 0.8 }}>
                                                        {senderName}
                                                    </Typography>
                                                )}
                                                <Typography variant="body1">
                                                    {message.content}
                                                </Typography>
                                                <Typography variant="caption" className="message-time" style={{ textAlign: 'right' }}>
                                                    {formatTime(message.createdAt)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    {isOwnMessage && (
                                        <ListItemAvatar style={{ minWidth: '40px', marginLeft: '8px', marginRight: '0' }}>
                                            <Avatar src={localStorage.getItem('userAvatar') || ''}>
                                                {(localStorage.getItem('userName') || 'U')?.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                    )}
                                </ListItem>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </List>
                )}
            </Box>

            <Paper className="chat-input">
                <TextField
                    fullWidth
                    multiline
                    rows={1}
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => {
                        const value = e.target.value;
                        console.log('Chat: Input length:', value.length, 'Value:', value);
                        setNewMessage(value);
                    }}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default Chat;

