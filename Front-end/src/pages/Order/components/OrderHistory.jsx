import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { List, Card, Spin, Alert, Modal, Typography, Row, Col, Tabs } from 'antd';
=======
import { List, Card, Spin, Alert, Modal, Typography, Row, Col } from 'antd';
>>>>>>> origin/back-up
import { format as formatDate } from 'date-fns';
import { vi } from 'date-fns/locale';
import orderApi from '../../../api/ordersApi';
import { formatPrice } from '../../../utils';

const OrderHistory = () => {
    const userId = localStorage.getItem('userId');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
<<<<<<< HEAD
    const [activeTab, setActiveTab] = useState('all');
=======
>>>>>>> origin/back-up

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
<<<<<<< HEAD
                // Lấy userId mới nhất từ localStorage để đảm bảo luôn đúng
                const currentUserIdFromStorage = localStorage.getItem('userId');
                const userIdToUse = currentUserIdFromStorage || userId;
                
                if (!userIdToUse) {
                    setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                    setLoading(false);
                    return;
                }

                console.log('Fetching order history for userId:', userIdToUse);
                const orderData = await orderApi.getOrderHistory(userIdToUse);
                console.log('Received order data:', orderData?.length || 0, 'orders');
                
                // Đảm bảo chỉ lấy đơn hàng của user hiện tại (double check để bảo mật)
                // Normalize userId để so sánh chính xác (lowercase và trim)
                const currentUserId = userIdToUse.toString().trim().toLowerCase();
                
                // Hàm helper để normalize userId từ order
                const normalizeUserId = (orderUserId) => {
                    if (!orderUserId) return '';
                    
                    // Nếu là object có _id
                    if (typeof orderUserId === 'object') {
                        if (orderUserId._id) {
                            return String(orderUserId._id).trim().toLowerCase();
                        }
                        // Nếu là ObjectId trực tiếp
                        if (orderUserId.toString) {
                            return String(orderUserId).trim().toLowerCase();
                        }
                        return '';
                    }
                    
                    // Nếu là string
                    if (typeof orderUserId === 'string') {
                        return orderUserId.trim().toLowerCase();
                    }
                    
                    // Fallback
                    return String(orderUserId).trim().toLowerCase();
                };
                
                // CRITICAL: Filter chặt chẽ để đảm bảo chỉ lấy đơn hàng của user này
                const filteredOrders = (orderData || []).filter(order => {
                    if (!order) {
                        console.warn('OrderHistory - Order is null/undefined');
                        return false;
                    }
                    
                    const orderUserId = normalizeUserId(order.userId);
                    const matches = orderUserId === currentUserId;
                    
                    // Log TẤT CẢ các order không match để debug (kể cả khi orderUserId rỗng)
                    if (!matches) {
                        console.error('OrderHistory - SECURITY: Order filtered out - userId mismatch!', {
                            orderId: order._id,
                            orderUserId: order.userId ? String(order.userId) : 'MISSING',
                            orderUserIdNormalized: orderUserId || 'EMPTY',
                            currentUserId: userIdToUse,
                            currentUserIdNormalized: currentUserId,
                            match: matches
                        });
                    }
                    
                    return matches;
                });
                
                console.log('OrderHistory - Filter results:', {
                    total: orderData?.length || 0,
                    filtered: filteredOrders.length,
                    filteredOut: (orderData?.length || 0) - filteredOrders.length,
                    currentUserId: userIdToUse,
                    currentUserIdNormalized: currentUserId
                });
                
                // Cảnh báo nếu có đơn hàng bị filter ra
                if (orderData && orderData.length > filteredOrders.length) {
                    console.error('OrderHistory - WARNING: Some orders were filtered out!', {
                        original: orderData.length,
                        filtered: filteredOrders.length,
                        filteredOut: orderData.length - filteredOrders.length
                    });
                }
                
                const sortedOrders = filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
                
            } catch (err) {
                console.error('Error fetching order history:', err);
                // Xử lý lỗi từ backend (ví dụ: ForbiddenException)
                if (err.response?.status === 403) {
                    setError('Bạn không có quyền xem đơn hàng này. Vui lòng đăng nhập lại.');
                } else if (err.response?.status === 401) {
                    setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                } else {
                    setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải lịch sử đặt hàng');
                }
=======
                const orderData = await orderApi.getOrderHistory(userId);
                const sortedOrders = orderData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
                
            } catch (err) {
                setError(err.message);
>>>>>>> origin/back-up
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [userId]);

    const showModal = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

<<<<<<< HEAD
=======
    const handleOk = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

>>>>>>> origin/back-up
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

<<<<<<< HEAD
=======
    const renderPaymentMethod = (method) => {
        switch (method) {
            case 'payment':
                return 'Thanh toán trực tuyến';
            case 'cash':
                return 'Thanh toán khi nhận hàng';
            default:
                return 'Phương thức không xác định'; // Giá trị mặc định nếu không khớp
        }
    };

>>>>>>> origin/back-up
    const renderPaymentStatus = (status) => {
      switch (status) {
          case 'pending':
              return 'Chưa thanh toán';
          case 'Success':
              return 'Đã thanh toán';
          default:
              return status;
      }
  };
  

    const renderShippingStatus = (status) => {
<<<<<<< HEAD
        // Xử lý cả tiếng Việt và tiếng Anh
        const statusLower = status?.toLowerCase() || '';
        switch (statusLower) {
            case 'not shipped':
            case 'chưa vận chuyển':
                return 'Chưa vận chuyển';
            case 'processing':
            case 'chờ xử lý':
                return 'Chờ xử lý';
            case 'in transit':
            case 'đang vận chuyển':
                return 'Đang vận chuyển';
            case 'out for delivery':
            case 'đang giao hàng':
                return 'Đang giao hàng';
            case 'delivered':
            case 'đã giao hàng':
                return 'Đã giao hàng';
            case 'returned':
            case 'đã trả lại':
                return 'Đã trả lại';
            case 'canceled':
            case 'đã hủy':
=======
        switch (status) {
            case 'not shipped':
                return 'Chưa vận chuyển';
            case 'processing':
                return 'Đang xử lý';
            case 'in transit':
                return 'Đang vận chuyển';
            case 'out for delivery':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            case 'returned':
                return 'Đã trả lại';
            case 'canceled':
>>>>>>> origin/back-up
                return 'Đã hủy';
            default:
                return status;
        }
    };

<<<<<<< HEAD
    // Hàm lọc đơn hàng theo tab
    const getFilteredOrders = () => {
        if (activeTab === 'all') {
            return orders;
        }
        
        return orders.filter(order => {
            const shippingStatusLower = order.shippingStatus?.toLowerCase() || '';
            const paymentStatus = order.paymentStatus;
            
            switch (activeTab) {
                case 'pending':
                    // Chờ xử lý
                    return shippingStatusLower === 'chờ xử lý' || shippingStatusLower === 'processing';
                case 'shipping':
                    // Đang vận chuyển
                    return shippingStatusLower === 'đang vận chuyển' || shippingStatusLower === 'in transit';
                case 'delivered':
                    // Đã giao hàng
                    return shippingStatusLower === 'đã giao hàng' || shippingStatusLower === 'delivered';
                case 'paid':
                    // Đã thanh toán
                    return paymentStatus === 'Success';
                case 'cancelled':
                    // Đã hủy
                    return shippingStatusLower === 'đã hủy' || shippingStatusLower === 'canceled';
                default:
                    return true;
            }
        });
    };

    const filteredOrders = getFilteredOrders();

=======
>>>>>>> origin/back-up
    const renderStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Chưa hoàn tất';
            case 'success':
                return 'Hoàn tất';
            default:
                return status;
        }
    };

    if (loading) {
        return <Spin tip="Đang tải lịch sử đặt hàng..." />;
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ marginTop: '100px', padding: '100px' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>Lịch sử đặt hàng</h1>
            </div>
<<<<<<< HEAD
            
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                style={{ marginBottom: '24px' }}
                type="card"
                items={[
                    {
                        label: `Tổng số đơn (${orders.length})`,
                        key: 'all',
                    },
                    {
                        label: `Chờ xử lý (${orders.filter(o => {
                            const status = o.shippingStatus?.toLowerCase() || '';
                            return status === 'chờ xử lý' || status === 'processing';
                        }).length})`,
                        key: 'pending',
                    },
                    {
                        label: `Đang vận chuyển (${orders.filter(o => {
                            const status = o.shippingStatus?.toLowerCase() || '';
                            return status === 'đang vận chuyển' || status === 'in transit';
                        }).length})`,
                        key: 'shipping',
                    },
                    {
                        label: `Đã giao hàng (${orders.filter(o => {
                            const status = o.shippingStatus?.toLowerCase() || '';
                            return status === 'đã giao hàng' || status === 'delivered';
                        }).length})`,
                        key: 'delivered',
                    },
                    {
                        label: `Đã thanh toán (${orders.filter(o => o.paymentStatus === 'Success').length})`,
                        key: 'paid',
                    },
                    {
                        label: `Đã hủy (${orders.filter(o => {
                            const status = o.shippingStatus?.toLowerCase() || '';
                            return status === 'đã hủy' || status === 'canceled';
                        }).length})`,
                        key: 'cancelled',
                    },
                ]}
            />

            {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '16px', color: '#999' }}>Không có đơn hàng nào trong danh mục này</p>
                </div>
            ) : (
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={filteredOrders}
                    renderItem={order => (
=======
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={orders}
                renderItem={order => (
>>>>>>> origin/back-up
                    <List.Item>
                        <Card
                            bordered={false}
                            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        >
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <h3 style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>Mã đơn hàng: {order._id}</h3>
                                </Col>
                                <Col>
                                    <Typography.Link
                                        onClick={() => showModal(order)}
                                        style={{ textDecoration: 'underline', color: 'black', fontWeight: 'bold' }}
                                    >
                                        Xem chi tiết
                                    </Typography.Link>
                                </Col>
                            </Row>
                            <p style={{ fontWeight: 'bold' }}>Ngày đặt hàng: {formatDate(new Date(order.orderDate), 'dd/MM/yyyy', { locale: vi })}</p>
                            <p style={{ fontWeight: 'bold' }}>Trạng thái vận chuyển: {renderShippingStatus(order.shippingStatus)}</p>
                            <p style={{ fontWeight: 'bold' }}>Tổng giá trị: {formatPrice(order.totalAmount)}</p>
                        </Card>
                    </List.Item>
                )}
<<<<<<< HEAD
                />
            )}
=======
            />
>>>>>>> origin/back-up

            {selectedOrder && (
                <Modal
                    title={`Chi tiết đơn hàng ${selectedOrder._id}`}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Card
                        bordered={false}
                        style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    >
                        <p style={{ fontWeight: 'bold' }}>Ngày đặt hàng: {formatDate(new Date(selectedOrder.orderDate), 'dd/MM/yyyy', { locale: vi })}</p>
                        <p style={{ fontWeight: 'bold' }}>Trạng thái: {renderStatus(selectedOrder.status)}</p>
                        <p style={{ fontWeight: 'bold' }}>Trạng thái vận chuyển: {renderShippingStatus(selectedOrder.shippingStatus)}</p>
                        <p style={{ fontWeight: 'bold' }}>Trạng thái thanh toán: {renderPaymentStatus(selectedOrder.paymentStatus)}</p>
                        {/* <p style={{ fontWeight: 'bold' }}>Phương thức thanh toán: {renderPaymentMethod(selectedOrder.paymentMethod)}</p> */}
                        <p style={{ fontWeight: 'bold' }}>Tổng giá trị: {formatPrice(selectedOrder.totalAmount)}</p>
                        <p style={{ fontWeight: 'bold' }}>Danh sách sản phẩm:</p>
                        <ul>
                            {selectedOrder.products.map(item => (
                                <li key={item.productId} style={{ marginBottom: '10px' ,marginLeft:'20px'}}>
                                    <img
                                        src={item.urlImage}
                                        alt="Product"
                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    />
                                    <span>Số lượng: {item.quantity}</span>
                                    <br />
                                    <span>Giá sản phẩm: {formatPrice(item.price)}</span>
                                </li>
                            ))}
                        </ul>
                        <p style={{ fontWeight: '600'  }}>Thông tin vận chuyển:</p>
                        <p style={{ fontWeight: 'bold', marginLeft:'20px' }}>Người nhận: {selectedOrder.shippingInfo.receiver}</p>
                        <p style={{ fontWeight: 'bold', marginLeft:'20px' }}>Điện thoại: {selectedOrder.shippingInfo.phone}</p>
                        <p style={{ fontWeight: 'bold', marginLeft:'20px' }}>Địa chỉ: {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.addressDetail}</p>
                    </Card>
                </Modal>
            )}
        </div>
    );
};

export default OrderHistory;
