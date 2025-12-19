import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import chatApi from '../../api/chatApi';
import userApi from '../../api/userApi';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemText,
    Badge,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Slide,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import './ChatWidget.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Function để render message với clickable links và format đẹp hơn
const renderMessageWithLinks = (text) => {
    if (!text) return text;

    // Regex để tìm URL (http/https)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            // Extract path để hiển thị ngắn gọn hơn
            let displayText = '👉 Xem chi tiết';
            let isProductLink = false;

            if (part.includes('/products/')) {
                isProductLink = true;
                displayText = '🛍️ Xem sản phẩm';
            }

            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                        e.preventDefault();
                        // Nếu là link localhost hoặc cùng domain, navigate trong cùng tab
                        if (part.includes('localhost:3000') || part.includes(window.location.hostname)) {
                            // Extract path từ URL
                            let path = '';
                            if (part.includes(window.location.origin)) {
                                path = part.split(window.location.origin)[1];
                            } else if (part.includes('localhost:3000')) {
                                path = part.split('localhost:3000')[1];
                            }

                            if (path) {
                                // Navigate trong cùng tab
                                window.location.href = path;
                            } else {
                                window.open(part, '_blank');
                            }
                        } else {
                            // Link ngoài, mở tab mới
                            window.open(part, '_blank');
                        }
                    }}
                    style={{
                        display: 'inline-block',
                        marginTop: '6px',
                        marginBottom: '4px',
                        padding: '8px 16px',
                        backgroundColor: part.includes('/products/') ? '#1976d2' : '#4caf50',
                        color: '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = part.includes('/products/') ? '#1565c0' : '#45a049';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = part.includes('/products/') ? '#1976d2' : '#4caf50';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                >
                    {displayText}
                </a>
            );
        }
        // Giữ nguyên text, preserve line breaks và emoji
        const lines = part.split('\n');
        return (
            <span key={index} style={{ display: 'block' }}>
                {lines.map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </span>
        );
    });
};

// Function để render message với product links được chèn ngay sau mỗi sản phẩm
const renderMessageWithProductLinks = (text, productLinks) => {
    if (!text) return text;
    if (!productLinks || productLinks.length === 0) {
        // Nếu không có productLinks, render bình thường
        return renderMessageWithLinks(text);
    }

    // Loại bỏ URL và text hướng dẫn không cần thiết
    let cleanedText = text
        .replace(/https?:\/\/[^\s]+/g, '') // Loại bỏ URL
        .replace(/🔗/g, '') // Loại bỏ icon link
        .replace(/Anh\/chị có thể click vào link để xem chi tiết hoặc hỏi em về giá, tồn kho của sản phẩm cụ thể\.?/gi, '') // Loại bỏ text hướng dẫn
        .trim();

    // Chia text thành các dòng
    const lines = cleanedText.split('\n');
    const result = [];

    lines.forEach((line, lineIndex) => {
        // Kiểm tra xem dòng này có phải là sản phẩm không (dạng "1. Tên - Giá")
        // Pattern: bắt đầu bằng số, dấu chấm, khoảng trắng, tên sản phẩm, dấu gạch ngang, giá (có số)
        // Regex: số. tên - giá (giá phải có ít nhất một chữ số)
        const trimmedLine = line.trim();
        const productMatch = trimmedLine.match(/^(\d+)\.\s+.+\s*-\s*.+[\d.,]/);

        if (productMatch) {
            // Đây là dòng sản phẩm
            const productIndex = parseInt(productMatch[1]) - 1; // Chuyển từ 1-based sang 0-based

            // Thêm dòng text sản phẩm
            result.push(
                <React.Fragment key={`line-${lineIndex}`}>
                    {line}
                    <br />
                </React.Fragment>
            );

            // Thêm link ngay sau dòng sản phẩm
            if (productLinks && productLinks[productIndex]) {
                const product = productLinks[productIndex];
                result.push(
                    <a
                        key={`link-${lineIndex}`}
                        href={product.url}
                        onClick={(e) => {
                            e.preventDefault();
                            // Extract path từ URL
                            let path = '';
                            if (product.url.includes(window.location.origin)) {
                                path = product.url.split(window.location.origin)[1];
                            } else if (product.url.includes('localhost:3000')) {
                                path = product.url.split('localhost:3000')[1];
                            }

                            if (path) {
                                window.location.href = path;
                            } else {
                                window.open(product.url, '_blank');
                            }
                        }}
                        style={{
                            display: 'inline-block',
                            marginTop: '6px',
                            marginBottom: '8px',
                            padding: '6px 12px',
                            backgroundColor: '#1976d2',
                            color: '#ffffff',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1565c0';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#1976d2';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                    >
                        🛍️ Xem chi tiết
                    </a>
                );
            }

            // Thêm <br /> để xuống dòng cho sản phẩm tiếp theo (nếu có)
            if (lineIndex < lines.length - 1) {
                result.push(<br key={`br-after-${lineIndex}`} />);
            }
        } else {
            // Đây là dòng text bình thường
            result.push(
                <React.Fragment key={`line-${lineIndex}`}>
                    {line}
                    {lineIndex < lines.length - 1 && <br />}
                </React.Fragment>
            );
        }
    });

    return result;
};

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [adminInfo, setAdminInfo] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUserInfo, setCurrentUserInfo] = useState(null); // Lưu thông tin user hiện tại
    const messagesEndRef = useRef(null);
    const unreadCountIntervalRef = useRef(null);
    const loginTimeRef = useRef(null); // Lưu thời gian đăng nhập
    const messagesLoadedFromSocketRef = useRef(false); // Flag để biết socket đã load messages chưa
    const currentUserId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');

    // Kiểm tra xem có phải vừa mới đăng nhập không (trong vòng 10 giây)
    const isRecentlyLoggedIn = () => {
        const loginTime = localStorage.getItem('login_time');
        if (!loginTime) {
            return false;
        }
        const loginTimestamp = parseInt(loginTime);
        if (isNaN(loginTimestamp)) {
            return false;
        }
        const now = Date.now();
        const timeDiff = now - loginTimestamp;
        const isRecent = timeDiff < 10000; // 10 giây
        console.log('ChatWidget: isRecentlyLoggedIn check:', { loginTimestamp, now, timeDiff, isRecent });
        return isRecent;
    };

    useEffect(() => {
        // Only load for non-admin users
        if (userRole === 'admin') {
            return;
        }

        // Kiểm tra token trước khi load
        const token = localStorage.getItem('access_token');
        if (!token) {
            return;
        }

        loadAdminInfo();
        loadUnreadCount();
        loadCurrentUserInfo();

        // Refresh unread count every 5 seconds - chỉ khi có token
        let errorCount = 0;

        // Clear interval cũ nếu có
        if (unreadCountIntervalRef.current) {
            clearInterval(unreadCountIntervalRef.current);
            unreadCountIntervalRef.current = null;
        }

        unreadCountIntervalRef.current = setInterval(async () => {
            const currentToken = localStorage.getItem('access_token');
            if (!currentToken) {
                if (unreadCountIntervalRef.current) {
                    clearInterval(unreadCountIntervalRef.current);
                    unreadCountIntervalRef.current = null;
                }
                return;
            }

            try {
                await loadUnreadCount();
                errorCount = 0; // Reset error count nếu thành công
            } catch (error) {
                const errorMessage = typeof error?.message === 'string'
                    ? error.message
                    : (typeof error?.message === 'object'
                        ? JSON.stringify(error.message)
                        : String(error?.message || ''));

                // Nếu là lỗi 401 (token hết hạn), dừng ngay lập tức
                if (errorMessage.includes('authenticated') ||
                    errorMessage.includes('401') ||
                    errorMessage.includes('hết hạn') ||
                    errorMessage.includes('Unauthorized')) {
                    errorCount++;
                    // Dừng ngay sau 1 lần lỗi 401 để tránh spam
                    if (errorCount >= 1) {
                        if (unreadCountIntervalRef.current) {
                            clearInterval(unreadCountIntervalRef.current);
                            unreadCountIntervalRef.current = null;
                        }
                        console.warn('ChatWidget: Token expired. Stopping unread count updates.');
                        return;
                    }
                } else {
                    // Với lỗi khác, reset error count sau một số lần
                    if (errorCount < 3) {
                        errorCount++;
                    } else {
                        errorCount = 0; // Reset sau 3 lần để thử lại
                    }
                }
            }
        }, 5000);

        return () => {
            if (unreadCountIntervalRef.current) {
                clearInterval(unreadCountIntervalRef.current);
                unreadCountIntervalRef.current = null;
            }
        };
    }, [userRole]);

    // Backup: Load messages nếu handleOpen chưa load được (fallback)
    useEffect(() => {
        if (userRole === 'admin') {
            return;
        }

        // Chỉ load nếu dialog đang mở, có adminInfo, chưa có messages, và không đang loading
        // Đây là fallback nếu handleOpen chưa load được messages
        if (open && adminInfo && adminInfo._id && messages.length === 0 && !loading) {
            console.log('ChatWidget: Fallback - loading messages via useEffect...');
            loadMessages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, adminInfo?._id, userRole]);

    useEffect(() => {
        // Only initialize for non-admin users
        if (userRole === 'admin') {
            return;
        }

        if (open && adminInfo && adminInfo._id) {
            // Only initialize if socket doesn't exist or is disconnected
            if (!socket || !socket.connected) {
                console.log('ChatWidget: Initializing socket');
                initializeSocket();
            }
        } else if (!open && socket) {
            // Close socket when dialog closes
            console.log('ChatWidget: Closing socket - dialog closed');
            socket.close();
            setSocket(null);
        }

        // Cleanup function
        return () => {
            // Only cleanup if dialog is closing
            if (!open && socket) {
                console.log('ChatWidget: Cleanup - closing socket');
                socket.close();
                setSocket(null);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, adminInfo?._id, userRole]); // Only depend on open, adminInfo._id, and userRole

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadAdminInfo = async () => {
        try {
            const admin = await chatApi.getAdmin();
            console.log('Admin info loaded:', admin);
            // Đảm bảo _id là string
            if (admin && admin._id) {
                setAdminInfo({
                    ...admin,
                    _id: admin._id.toString ? admin._id.toString() : admin._id,
                });
            } else {
                console.error('Admin info is missing _id:', admin);
            }
        } catch (error) {
            console.error('Failed to load admin info:', error);
            // Kiểm tra nếu lỗi 401 - token hết hạn
            const errorMessage = typeof error?.message === 'string'
                ? error.message
                : (typeof error?.message === 'object'
                    ? JSON.stringify(error.message)
                    : String(error?.message || ''));

            if (errorMessage.includes('authenticated') ||
                errorMessage.includes('401') ||
                errorMessage.includes('hết hạn') ||
                errorMessage.includes('Unauthorized')) {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                localStorage.removeItem('access_token');
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                window.location.href = '/login';
            } else {
                // Hiển thị thông báo lỗi cho user
                alert('Không thể tải thông tin admin. Vui lòng thử lại sau.');
            }
        }
    };

    const loadCurrentUserInfo = async () => {
        if (!currentUserId) return;
        try {
            const userInfo = await userApi.getInfo(currentUserId);
            setCurrentUserInfo(userInfo);
            console.log('ChatWidget: Current user info loaded:', userInfo);
        } catch (error) {
            console.error('ChatWidget: Failed to load current user info:', error);
        }
    };

    const loadUnreadCount = async () => {
        // Kiểm tra token trước khi gọi API
        const token = localStorage.getItem('access_token');
        if (!token) {
            setUnreadCount(0);
            return;
        }

        try {
            const data = await chatApi.getUnreadCount();
            setUnreadCount(data.count || 0);
        } catch (error) {
            // Nếu lỗi 401, có thể token đã hết hạn - không log nhiều
            const errorMessage = typeof error?.message === 'string'
                ? error.message
                : (typeof error?.message === 'object'
                    ? JSON.stringify(error.message)
                    : String(error?.message || ''));

            if (errorMessage.includes('authenticated') ||
                errorMessage.includes('401') ||
                errorMessage.includes('hết hạn') ||
                errorMessage.includes('Unauthorized')) {
                setUnreadCount(0);
                // Dừng interval nếu token hết hạn để tránh spam
                if (unreadCountIntervalRef.current) {
                    clearInterval(unreadCountIntervalRef.current);
                    unreadCountIntervalRef.current = null;
                }
                // Không log lỗi để tránh spam console
                return;
            }
            console.error('Failed to load unread count:', error);
            setUnreadCount(0);
        }
    };

    const initializeSocket = (adminIdToJoin = null) => {
        const token = localStorage.getItem('access_token');
        const targetAdminId = adminIdToJoin || (adminInfo && adminInfo._id ? (adminInfo._id.toString ? adminInfo._id.toString() : adminInfo._id) : null);

        if (!token || !targetAdminId) {
            console.warn('Cannot initialize socket: missing token or admin info', { hasToken: !!token, hasAdminId: !!targetAdminId });
            return;
        }

        // Lưu adminId để dùng trong connect event
        const adminIdForJoin = targetAdminId;

        // Close existing socket if any
        if (socket) {
            console.log('ChatWidget: Closing existing socket before creating new one');
            socket.close();
            setSocket(null);
        }

        console.log('ChatWidget: Initializing new socket connection');
        const newSocket = io('http://localhost:5000/chat', {
            auth: {
                token: token,
            },
            transports: ['websocket', 'polling'],
            reconnection: false, // Tắt auto reconnect để xử lý lỗi token
            forceNew: true, // Force new connection
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            // Đợi connection ready từ server trước khi joinRoom
        });

        // Đợi server báo connection đã sẵn sàng
        newSocket.on('connectionReady', (data) => {
            console.log('ChatWidget: Connection ready, userId:', data.userId);
            const adminIdToUse = adminIdForJoin || (adminInfo && adminInfo._id ? (adminInfo._id.toString ? adminInfo._id.toString() : adminInfo._id) : null);
            if (adminIdToUse) {
                console.log('ChatWidget: Emitting joinRoom with adminId:', adminIdToUse);
                newSocket.emit('joinRoom', { otherUserId: adminIdToUse });
            } else {
                console.warn('ChatWidget: Cannot emit joinRoom - adminId not available');
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            // Xử lý lỗi kết nối
        });

        newSocket.on('error', (error) => {
            console.error('Socket error event:', error);
            if (error.code === 'TOKEN_EXPIRED' || error.message?.includes('expired')) {
                // Token hết hạn - yêu cầu đăng nhập lại
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                localStorage.removeItem('access_token');
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                window.location.href = '/login';
            }
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Server đã disconnect - có thể do token invalid
                console.warn('Server disconnected client - token may be invalid');
            }
        });

        newSocket.on('newMessage', (data) => {
            console.log('ChatWidget: Received newMessage event', {
                dataType: Array.isArray(data) ? 'array' : typeof data,
                dataLength: Array.isArray(data) ? data.length : 'N/A',
                firstMessage: Array.isArray(data) && data.length > 0 ? {
                    _id: data[0]._id,
                    content: data[0].content,
                    senderId: data[0].senderId?._id || data[0].senderId,
                } : null,
            });
            if (Array.isArray(data)) {
                // Xóa tin nhắn tạm (temp-*) và thay bằng messages từ server
                setMessages(prev => {
                    console.log('ChatWidget: Merging messages', {
                        prevCount: prev.length,
                        newCount: data.length,
                        prevLastMsg: prev.length > 0 ? {
                            _id: prev[prev.length - 1]._id,
                            content: prev[prev.length - 1].content,
                        } : null,
                        newLastMsg: data.length > 0 ? {
                            _id: data[data.length - 1]._id,
                            content: data[data.length - 1].content,
                        } : null,
                    });
                    // Lọc bỏ tin nhắn tạm
                    const withoutTemp = prev.filter(msg => {
                        const id = msg._id?.toString() || msg._id;
                        return !id?.toString().startsWith('temp-');
                    });
                    // Merge với messages mới từ server (ưu tiên server)
                    const messageMap = new Map();
                    // Thêm messages không phải temp
                    withoutTemp.forEach(msg => {
                        const id = msg._id?.toString() || msg._id;
                        if (id) messageMap.set(id, msg);
                    });
                    // Thêm/update messages từ server (ưu tiên server)
                    data.forEach(msg => {
                        const id = msg._id?.toString() || msg._id;
                        if (id) {
                            messageMap.set(id, msg); // Server message luôn ưu tiên
                        }
                    });
                    // Sắp xếp theo thời gian
                    const sorted = Array.from(messageMap.values()).sort((a, b) => {
                        const timeA = new Date(a.createdAt || 0).getTime();
                        const timeB = new Date(b.createdAt || 0).getTime();
                        return timeA - timeB;
                    });
                    console.log('ChatWidget: Merged messages count:', sorted.length);
                    // Log tin nhắn cuối cùng để debug
                    if (sorted.length > 0) {
                        const lastMsg = sorted[sorted.length - 1];
                        console.log('ChatWidget: Last message after merge:', {
                            _id: lastMsg._id,
                            content: lastMsg.content,
                            senderId: lastMsg.senderId?._id || lastMsg.senderId,
                            createdAt: lastMsg.createdAt,
                            isTemp: lastMsg._id?.toString().startsWith('temp-'),
                        });
                    }
                    return sorted;
                });
                // Đợi một chút để state update xong rồi mới scroll
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
                loadUnreadCount();
            } else {
                console.warn('ChatWidget: Received invalid newMessage data', data);
            }
        });

        newSocket.on('messageHistory', (data) => {
            console.log('Received messageHistory from socket:', data);
            // Update messages từ socket - socket là nguồn chính và đáng tin cậy nhất
            // Luôn cập nhật từ socket messageHistory vì đây là nguồn dữ liệu chính từ backend
            messagesLoadedFromSocketRef.current = true; // Đánh dấu đã load từ socket
            if (data && Array.isArray(data)) {
                // Luôn cập nhật từ socket, vì socket là nguồn chính
                setMessages(data);
                console.log('ChatWidget: Set messages from socket messageHistory, count:', data.length);
                setLoading(false);
                setTimeout(() => {
                    scrollToBottom();
                }, 100);

                // Nếu socket trả về rỗng, thử load từ REST API như backup
                if (data.length === 0) {
                    console.log('ChatWidget: Socket returned empty array, trying REST API as backup...');
                    setTimeout(async () => {
                        try {
                            if (adminInfo && adminInfo._id) {
                                const adminId = adminInfo._id.toString ? adminInfo._id.toString() : adminInfo._id;
                                const restData = await chatApi.getMessages(adminId);
                                console.log('ChatWidget: Loaded messages from REST API (backup), count:', restData?.length || 0);
                                if (restData && Array.isArray(restData) && restData.length > 0) {
                                    setMessages(restData);
                                    setTimeout(() => {
                                        scrollToBottom();
                                    }, 100);
                                }
                            }
                        } catch (error) {
                            console.error('ChatWidget: Failed to load messages from REST API (backup):', error);
                        }
                    }, 500);
                }
            } else {
                // Nếu socket không trả về messages, giữ nguyên messages hiện tại (từ REST API)
                console.log('ChatWidget: Invalid data from socket messageHistory, keeping current messages');
                setLoading(false);
            }
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(newSocket);
    };

    const loadMessages = async () => {
        if (!adminInfo || !adminInfo._id) {
            console.warn('Cannot load messages: admin info not available');
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            console.warn('Cannot load messages: no token');
            return;
        }

        try {
            setLoading(true);
            const adminId = adminInfo._id.toString ? adminInfo._id.toString() : adminInfo._id;
            const data = await chatApi.getMessages(adminId);
            console.log('Loaded messages via REST API:', data);
            setMessages(data || []);
            setLoading(false);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages:', error);
            setLoading(false);
            // Không hiển thị lỗi cho user, chỉ log
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !socket || !adminInfo || !adminInfo._id) return;

        const messageContent = newMessage.trim();
        const adminId = adminInfo._id.toString ? adminInfo._id.toString() : adminInfo._id;

        // Optimistic update: Hiển thị tin nhắn của user ngay lập tức
        const tempUserMessage = {
            _id: `temp-${Date.now()}`,
            senderId: {
                _id: currentUserId,
                displayName: currentUserInfo?.displayName || 'Bạn',
                avaUrl: currentUserInfo?.avaUrl || '',
                role: userRole || 'member',
            },
            receiverId: {
                _id: adminId,
            },
            content: messageContent,
            isRead: false,
            senderRole: userRole || 'member',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Thêm tin nhắn tạm vào danh sách
        setMessages(prev => [...prev, tempUserMessage]);
        setNewMessage('');
        scrollToBottom();

        try {
            console.log('ChatWidget: Sending message', { receiverId: adminId, content: messageContent });
            socket.emit('sendMessage', {
                receiverId: adminId,
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

    const handleOpen = async () => {
        // Check if user is logged in
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Vui lòng đăng nhập để sử dụng tính năng chat');
            window.location.href = '/login';
            return;
        }

        setOpen(true);
        setLoading(true); // Set loading ngay khi mở
        setMessages([]); // Clear messages cũ để load lại từ đầu

        // Load admin info (luôn load lại để đảm bảo có thông tin mới nhất)
        let currentAdminInfo = adminInfo;
        try {
            const admin = await chatApi.getAdmin();
            if (admin && admin._id) {
                currentAdminInfo = {
                    ...admin,
                    _id: admin._id.toString ? admin._id.toString() : admin._id,
                };
                setAdminInfo(currentAdminInfo);
            } else {
                console.error('Admin info is missing _id:', admin);
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error('Failed to load admin info in handleOpen:', error);
            setLoading(false);
            return;
        }

        // Load messages ngay lập tức sau khi có adminInfo
        // Load từ REST API ngay để hiển thị messages ngay lập tức
        // Socket messageHistory sẽ cập nhật sau nếu có messages mới hơn
        if (currentAdminInfo && currentAdminInfo._id) {
            // Reset flag khi mở chat mới
            messagesLoadedFromSocketRef.current = false;
            // Mark all messages from admin as read when opening
            try {
                await chatApi.markAsRead(currentAdminInfo._id.toString ? currentAdminInfo._id.toString() : currentAdminInfo._id);
                setUnreadCount(0);
            } catch (err) {
                console.error('ChatWidget: Failed to mark messages as read on open', err);
            }

            // Khởi tạo socket ngay nếu chưa có hoặc chưa connect
            // Để đảm bảo socket messageHistory được gọi sớm
            const adminId = currentAdminInfo._id.toString ? currentAdminInfo._id.toString() : currentAdminInfo._id;
            if (!socket || !socket.connected) {
                console.log('ChatWidget: Initializing socket in handleOpen with adminId:', adminId);
                initializeSocket(adminId);
            } else if (socket && socket.connected) {
                // Nếu socket đã connect, emit joinRoom ngay để lấy messageHistory
                console.log('ChatWidget: Socket already connected, emitting joinRoom with adminId:', adminId);
                socket.emit('joinRoom', { otherUserId: adminId });
            }

            // Load từ REST API ngay lập tức để hiển thị messages
            try {
                const adminId = currentAdminInfo._id.toString ? currentAdminInfo._id.toString() : currentAdminInfo._id;
                console.log('ChatWidget: Loading messages from REST API immediately for admin:', adminId);
                const data = await chatApi.getMessages(adminId);
                console.log('ChatWidget: Loaded messages from REST API, count:', data?.length || 0);
                if (data && Array.isArray(data)) {
                    setMessages(data);
                    console.log('ChatWidget: Set messages from REST API, count:', data.length);
                    setLoading(false);
                    setTimeout(() => {
                        scrollToBottom();
                    }, 100);
                } else {
                    setMessages([]);
                    setLoading(false);
                }
            } catch (error) {
                console.error('ChatWidget: Failed to load messages from REST API:', error);
                setMessages([]);
                setLoading(false);
            }
        } else {
            console.warn('ChatWidget: Cannot load messages - adminInfo not available');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        // Clear messages khi đóng để khi mở lại sẽ load lại từ đầu
        setMessages([]);
        setLoading(true);
        // Reset flag khi đóng chat
        messagesLoadedFromSocketRef.current = false;
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

    // Only show for non-admin users
    if (userRole === 'admin') {
        console.log('ChatWidget: User is admin, not showing widget');
        return null;
    }

    console.log('ChatWidget: Rendering chat widget', { userRole, currentUserId, hasToken: !!localStorage.getItem('access_token') });

    // Show icon even if not logged in (will prompt login when clicked)
    return (
        <Box className="chat-widget-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1300 }}>
            <IconButton
                onClick={handleOpen}
                className="chat-widget-button"
                size="large"
                style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    width: '56px',
                    height: '56px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    showZero={false}
                    overlap="circular"
                >
                    <ChatIcon style={{ color: 'white', fontSize: '28px' }} />
                </Badge>
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="sm"
                fullWidth
                style={{ zIndex: 1300 }}
                PaperProps={{
                    style: {
                        height: '600px',
                        maxHeight: '90vh',
                        backgroundColor: '#ffffff',
                        zIndex: 1300,
                    },
                }}
                BackdropProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1299,
                    },
                }}
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <Avatar src={adminInfo?.avaUrl} alt="Hanie Jewelry">
                                H
                            </Avatar>
                            <Box ml={2}>
                                <Typography variant="h6">Hanie Jewelry</Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent
                    dividers
                    style={{
                        padding: '0 !important',
                        paddingRight: '0 !important',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '500px',
                        maxHeight: '500px',
                        overflow: 'hidden'
                    }}
                >
                    <Box className="chat-widget-messages" style={{ flex: 1, minHeight: 0, overflow: 'auto', paddingRight: '0' }}>
                        {!adminInfo ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%" style={{ minHeight: '300px' }}>
                                <CircularProgress />
                                <Typography variant="body2" style={{ marginLeft: '16px' }}>
                                    Đang tải thông tin admin...
                                </Typography>
                            </Box>
                        ) : loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%" style={{ minHeight: '300px' }}>
                                <CircularProgress />
                                <Typography variant="body2" style={{ marginLeft: '16px' }}>
                                    Đang tải tin nhắn...
                                </Typography>
                            </Box>
                        ) : messages.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column" style={{ minHeight: '300px' }}>
                                <Typography variant="body2" color="textSecondary">
                                    Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                                </Typography>
                            </Box>
                        ) : (
                            <List style={{ padding: '0 !important', margin: '0', width: '100%', paddingRight: '0 !important' }}>
                                {(() => {
                                    console.log('ChatWidget: Rendering messages list', {
                                        count: messages.length,
                                        lastMessage: messages.length > 0 ? {
                                            _id: messages[messages.length - 1]._id,
                                            content: messages[messages.length - 1].content,
                                            senderId: messages[messages.length - 1].senderId?._id || messages[messages.length - 1].senderId,
                                        } : null,
                                    });
                                    return null;
                                })()}
                                {messages.map((message, index) => {
                                    const messageId = message._id?.toString() || message._id || `msg-${index}`;
                                    const senderId = message.senderId?._id || message.senderId?.toString() || message.senderId;
                                    const isOwnMessage = senderId === currentUserId;
                                    // Get sender name: if admin, show "Hanie Jewelry", else show displayName
                                    const senderName = message.senderId?.role === 'admin'
                                        ? 'Hanie Jewelry'
                                        : (message.senderId?.displayName || 'Người dùng');
                                    // Get avatar và displayName cho tin nhắn của chính mình
                                    const ownDisplayName = currentUserInfo?.displayName || message.senderId?.displayName || 'Người dùng';
                                    const ownAvatar = currentUserInfo?.avaUrl || message.senderId?.avaUrl || '';
                                    const ownInitial = ownDisplayName.charAt(0).toUpperCase();
                                    // Get avatar và displayName cho tin nhắn của người khác
                                    const otherDisplayName = senderName;
                                    const otherAvatar = message.senderId?.avaUrl || '';
                                    const otherInitial = otherDisplayName.charAt(0).toUpperCase();

                                    return (
                                        <ListItem
                                            key={messageId}
                                            className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}
                                            style={{
                                                padding: isOwnMessage ? '4px 0 4px 8px' : '4px 8px 4px 0',
                                                paddingRight: isOwnMessage ? '0' : '8px',
                                                paddingLeft: isOwnMessage ? '8px' : '0',
                                                marginRight: isOwnMessage ? '0' : 'auto',
                                                marginLeft: isOwnMessage ? 'auto' : '0',
                                                display: 'flex',
                                                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                                alignItems: 'flex-end',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            {!isOwnMessage && (
                                                <Avatar src={otherAvatar} style={{ marginRight: '8px', marginLeft: '0', width: '32px', height: '32px', flexShrink: 0 }}>
                                                    {otherInitial}
                                                </Avatar>
                                            )}
                                            <ListItemText
                                                style={{
                                                    textAlign: isOwnMessage ? 'right' : 'left',
                                                    maxWidth: '75%',
                                                    paddingRight: isOwnMessage ? '0' : 'inherit',
                                                    paddingLeft: isOwnMessage ? 'inherit' : '0',
                                                    marginRight: isOwnMessage ? '0' : 'inherit',
                                                    marginLeft: isOwnMessage ? 'inherit' : '0',
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
                                                        {/* Hiển thị message với product links được chèn ngay sau mỗi sản phẩm */}
                                                        {message.metadata?.productLinks && message.metadata.productLinks.length > 0 ? (
                                                            <Typography
                                                                variant="body2"
                                                                component="div"
                                                                style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word',
                                                                    lineHeight: '1.6',
                                                                }}
                                                            >
                                                                {renderMessageWithProductLinks(message.content, message.metadata.productLinks)}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                component="div"
                                                                style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word',
                                                                    lineHeight: '1.6',
                                                                }}
                                                            >
                                                                {renderMessageWithLinks(message.content)}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="caption" className="message-time" style={{ textAlign: 'right' }}>
                                                            {formatTime(message.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            {isOwnMessage && (
                                                <Avatar src={ownAvatar} style={{ marginLeft: '8px', marginRight: '0', width: '32px', height: '32px', flexShrink: 0 }}>
                                                    {ownInitial}
                                                </Avatar>
                                            )}
                                        </ListItem>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </List>
                        )}
                    </Box>
                    <Paper className="chat-widget-input" elevation={3}>
                        <TextField
                            fullWidth
                            multiline
                            rows={1}
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => {
                                const value = e.target.value;
                                console.log('ChatWidget: Input length:', value.length, 'Value:', value);
                                setNewMessage(value);
                            }}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            size="small"
                            disabled={!adminInfo || !socket?.connected}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || !adminInfo || !socket?.connected}
                        >
                            <SendIcon />
                        </IconButton>
                    </Paper>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ChatWidget;

