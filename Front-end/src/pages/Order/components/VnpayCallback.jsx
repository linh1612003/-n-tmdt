import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VnpayCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Lấy các tham số từ URL
        const params = new URLSearchParams(location.search);
        // Gửi lên backend để xác thực và cập nhật trạng thái
        axios.get(`http://localhost:5000/api/payment/vnpayCallback?${params.toString()}`)
            .then(() => {
                alert('Thanh toán thất bại!');
                navigate('/');
            })
            .catch(() => {
                alert('Đã thanh toán thành công!');
                navigate('/');
            });
    }, [navigate, location]);

    return (
        <div>
            Đang chuyển hướng...
        </div>
    );
};

export default VnpayCallback; 