import { Box, makeStyles, Modal, Typography, TextField } from '@material-ui/core';
<<<<<<< HEAD
import { Button } from 'antd';
=======
import { Button, Form, Input } from 'antd';
>>>>>>> origin/back-up
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======
import { Formik } from 'formik';
import * as Yup from 'yup';
>>>>>>> origin/back-up
import cartsApi from '../../../api/cartApi';
import orderApi from '../../../api/ordersApi';
import userApi from '../../../api/userApi';
import { discountPercentage, formatPrice } from '../../../utils/common';
import { addToCart } from '../../Cart/cartSlice';


ProductInfo.propTypes = {
    product: PropTypes.object,
};

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    name: {
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    descriptionBox: {
        fontFamily: 'monospace',


    },
    descriptionTitle: {
        fontWeight: "800",
        fontFamily: 'monospace',
        fontSize: '20px',
        // borderBottom: `1px solid ${theme.palette.grey[300]}`,
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        marginTop: '10px'
    },
    description: {
        fontFamily: 'monospace',
        fontSize: '20px',
    },
    priceBox: {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        margin: ' 15px 0px',
    },
    salePrice: {
        marginRight: theme.spacing(1),
        fontSize: '18px',
        fontFamily: 'monospace',
        fontWeight: '600',
    },
    originalPrice: {
        marginRight: theme.spacing(1),
        fontSize: '18px',
        fontFamily: 'monospace',
        textDecoration: 'line-through',
        color: '#807D7C',
    },
    promotionPercent: {
        color: '#dc4136',
        fontSize: '18px',
        fontFamily: 'monospace',
        fontWeight: '500',
    },
    keyCount: {
        display: 'flex',
        marginTop: '10px',
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        margin: ' 15px 0px',
    },
    sizeName: {
        justifyContent: 'conter',
        fontFamily: 'monospace',
        fontSize: '24px',
    },
    payment: {
        margin: ' 15px 0px',
    },
    policy: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '.5rem',
        gap: '.8rem',
        // borderTop: `1px solid ${theme.palette.grey[300]}`,

        '& > span': {
            color: '#807D7C',
            fontFamily: 'monospace',
            fontSize: '20px',
        },
    },
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
<<<<<<< HEAD
    shippingModal: {
        position: 'absolute',
        width: 500,
        maxWidth: '90%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3, 4, 4),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    shippingForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
=======
>>>>>>> origin/back-up
}));

function ProductInfo({ product = {} }) {
    const classes = useStyles();
    const { name, description, salePrice, originalPrice, _id, images } = product;
    const userId = localStorage.getItem('userId');
    const promotionPercent = discountPercentage(originalPrice, salePrice);
    const [openModal, setOpenModal] = useState(false);
<<<<<<< HEAD
    const [openShippingModal, setOpenShippingModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState(null);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
    const [shippingFormData, setShippingFormData] = useState({
        receiver: '',
        phone: '',
        address: '',
        addressDetail: '',
    });

    useEffect(() => {
        if (!userId) {
=======
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [openShippingModal, setOpenShippingModal] = useState(false);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);


    // Fake data for test pay now

    useEffect(() => {
        if (!userId) {
            setError('No user ID found in local storage');
>>>>>>> origin/back-up
            setIsLoadingUserInfo(false);
            return;
        }
        (async () => {
            try {
                setIsLoadingUserInfo(true);
                const userInfo = await userApi.getInfo(userId);
                setUserInfo(userInfo);
<<<<<<< HEAD
                // Khởi tạo form với thông tin hiện có
                setShippingFormData({
                    receiver: userInfo.displayName || '',
                    phone: userInfo.contactPhone || '',
                    address: userInfo.address || '',
                    addressDetail: userInfo.addressDetail || '',
                });
            } catch (err) {
                console.error('Error fetching user info:', err);
=======
            } catch (error) {
                console.error('Failed to fetch account info:', error);
                setError('Failed to fetch account info');
>>>>>>> origin/back-up
            } finally {
                setIsLoadingUserInfo(false);
            }
        })();
    }, [userId]);

<<<<<<< HEAD
    const shippingInfo = userInfo ? {
        receiver: userInfo.displayName || '',
        phone: userInfo.contactPhone || '',
        address: userInfo.address || '',
        addressDetail: userInfo.addressDetail || '',
        isInCart: false
    } : null;
=======
    const shippingInfoValidationSchema = Yup.object().shape({
        receiver: Yup.string()
            .min(2, 'Tên người nhận phải có ít nhất 2 ký tự')
            .required('Vui lòng nhập tên người nhận'),
        phone: Yup.string()
            .matches(/^(0|\+84|84)[0-9]{9,10}$/, 'Số điện thoại không đúng định dạng. Ví dụ: 0123456789')
            .required('Vui lòng nhập số điện thoại'),
        address: Yup.string()
            .min(1, 'Vui lòng nhập địa chỉ')
            .required('Vui lòng nhập địa chỉ'),
        addressDetail: Yup.string()
            .min(1, 'Vui lòng nhập chi tiết địa chỉ')
            .required('Vui lòng nhập chi tiết địa chỉ'),
    });
>>>>>>> origin/back-up


    // Payload add to cart 
    // ============================================================================================================================
    const productId = _id ? _id.toString() : '';
    const quantity = 1;
    const payload = { userId, productId, quantity };
    // ============================================================================================================================
    const handleAddToCart = async () => {
        if (!userId) {
            setOpenModal(true);
            return;
        }
        try {
<<<<<<< HEAD
            await cartsApi.add(payload);
=======
            const req = await cartsApi.add(payload);
>>>>>>> origin/back-up
            const action = addToCart({
                id: product._id,
                product,
                quantity: 1,
            });
            dispatch(action);
            enqueueSnackbar('Đã thêm vào giỏ hàng  ', { variant: 'success' });
<<<<<<< HEAD
        } catch (err) {
            console.error('Add to cart failed:', err);
=======
        } catch (error) {
            console.error('Add to cart failed:', error);
>>>>>>> origin/back-up
            enqueueSnackbar('Đã xảy ra lỗi ! Vui lòng thử lại sau ', { variant: 'error' });
        }
    };


<<<<<<< HEAD
    // Payload pay now - sẽ được tạo trong handleBuyNow
    // ============================================================================================================================
=======
    // Payload pay now
    // ============================================================================================================================
    const createOrderWithShippingInfo = async (shippingInfoData) => {
        const price = salePrice;
        const urlImage = images && images.length > 0 ? images[0] : '';
        const products = [{ productId, price, quantity, urlImage }];
        
        const payloadPay = { userId, products, shippingInfo: shippingInfoData };
        
        try {
            console.log('Creating order with payload:', payloadPay);
            const req = await orderApi.add(payloadPay);
            console.log('Order created:', req);
            navigate(`/orders?id=${req.orderExist._id}`);
        } catch (error) {
            console.error('Error creating order:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                const errorMsg = error.response.data?.message || 'Đã xảy ra lỗi! Vui lòng thử lại sau.';
                enqueueSnackbar(errorMsg, { variant: 'error' });
            } else {
                enqueueSnackbar('Đã xảy ra lỗi! Vui lòng thử lại sau.', { variant: 'error' });
            }
        }
    };

>>>>>>> origin/back-up
    const handleBuyNow = async () => {
        if (!userId) {
            setOpenModal(true);
            return;
        }
<<<<<<< HEAD
        if (isLoadingUserInfo) {
            enqueueSnackbar('Đang tải thông tin người dùng, vui lòng đợi...', { variant: 'info' });
            return;
        }
        if (!userInfo || !shippingInfo) {
            enqueueSnackbar('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.', { variant: 'error' });
            return;
        }
        if (!shippingInfo.receiver || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.addressDetail) {
            setOpenShippingModal(true);
            return;
        }
        try {
            // Tạo payloadPay sau khi đã kiểm tra tất cả điều kiện
            const price = salePrice;
            const urlImage = images[0];
            const products = [{ productId, price, quantity, urlImage }];
            const payloadPay = { userId, products, shippingInfo };

            const req = await orderApi.add(payloadPay);
            navigate(`/orders?id=${req.orderExist._id}`);

        } catch (error) {
            console.error('Error creating order:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi! Vui lòng thử lại sau.';
            enqueueSnackbar(errorMessage, { variant: 'error' });
=======
        
        // Đợi userInfo được load
        if (isLoadingUserInfo) {
            enqueueSnackbar('Đang tải thông tin...', { variant: 'info' });
            return;
        }
        
        // Kiểm tra userInfo có đầy đủ thông tin giao hàng không
        if (userInfo && userInfo.displayName && userInfo.contactPhone && userInfo.address && userInfo.addressDetail) {
            // Có đầy đủ thông tin, tạo order ngay
            const shippingInfo = {
                receiver: userInfo.displayName,
                phone: userInfo.contactPhone,
                address: userInfo.address,
                addressDetail: userInfo.addressDetail,
            };
            await createOrderWithShippingInfo(shippingInfo);
        } else {
            // Thiếu thông tin, mở modal để nhập
            setOpenShippingModal(true);
        }
    };

    const handleShippingInfoSubmit = async (values, { setSubmitting }) => {
        console.log('Submitting shipping info:', values);
        try {
            // Lưu thông tin giao hàng vào user account (nếu có API)
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    await orderApi.updateShippingInfo(userId, values);
                    // Cập nhật userInfo local
                    setUserInfo({
                        ...userInfo,
                        displayName: values.receiver,
                        contactPhone: values.phone,
                        address: values.address,
                        addressDetail: values.addressDetail,
                    });
                } catch (error) {
                    console.error('Error updating shipping info:', error);
                    // Vẫn tiếp tục tạo order dù không lưu được vào account
                }
            }
            
            // Tạo order với thông tin giao hàng
            await createOrderWithShippingInfo(values);
            setOpenShippingModal(false);
            setSubmitting(false);
        } catch (error) {
            console.error('Error submitting shipping info:', error);
            setSubmitting(false);
            enqueueSnackbar('Đã xảy ra lỗi! Vui lòng thử lại sau.', { variant: 'error' });
>>>>>>> origin/back-up
        }
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleNavigate = () => {
        navigate('/login')
<<<<<<< HEAD
    };
    const handleCloseShippingModal = () => {
        setOpenShippingModal(false);
    };
    const handleShippingFormChange = (field, value) => {
        setShippingFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleSaveShippingInfo = async () => {
        // Kiểm tra các trường bắt buộc
        if (!shippingFormData.receiver || !shippingFormData.phone || !shippingFormData.address || !shippingFormData.addressDetail) {
            enqueueSnackbar('Vui lòng điền đầy đủ thông tin giao hàng.', { variant: 'warning' });
            return;
        }
        try {
            // Cập nhật thông tin giao hàng vào tài khoản (bao gồm cả contactPhone, address, addressDetail)
            console.log('=== START UPDATING SHIPPING INFO ===');
            console.log('Updating shipping info with:', {
                contactPhone: shippingFormData.phone,
                address: shippingFormData.address,
                addressDetail: shippingFormData.addressDetail,
            });

            // Gọi API updateShippingInfo trước
            const shippingPayload = {
                contactPhone: shippingFormData.phone,
                address: shippingFormData.address,
                addressDetail: shippingFormData.addressDetail,
            };
            console.log('=== CALLING updateShippingInfo API ===');
            console.log('URL will be: api/users/' + userId + '/shipping-infor');
            console.log('Payload:', JSON.stringify(shippingPayload, null, 2));

            console.log('About to call orderApi.updateShippingInfo with userId:', userId);
            console.log('About to call orderApi.updateShippingInfo with payload:', shippingPayload);

            try {
                const updateResult = await orderApi.updateShippingInfo(userId, shippingPayload);
                console.log('Update shipping info result:', updateResult);
                console.log('=== updateShippingInfo API SUCCESS ===');
            } catch (shippingError) {
                console.error('=== updateShippingInfo API ERROR ===');
                console.error('Error object:', shippingError);
                console.error('Error message:', shippingError?.message);
                console.error('Error response:', shippingError?.response);
                console.error('Error response data:', shippingError?.response?.data);
                // Không throw error ở đây, chỉ log để không chặn việc cập nhật displayName
                enqueueSnackbar('Không thể cập nhật địa chỉ. Vui lòng thử lại sau.', { variant: 'error' });
            }

            // Cập nhật displayName nếu khác với giá trị hiện tại
            // Lưu ý: Nếu token hết hạn, việc này sẽ fail nhưng không ảnh hưởng đến shipping info đã được lưu
            if (shippingFormData.receiver !== userInfo.displayName) {
                try {
                    console.log('Updating displayName...');
                    await userApi.update(userId, {
                        displayName: shippingFormData.receiver,
                    });
                    console.log('Update displayName success');
                } catch (displayNameError) {
                    console.error('Error updating displayName:', displayNameError);
                    const errorMessage = displayNameError?.message || '';

                    // Nếu token hết hạn, axiosClient đã xử lý redirect, chỉ cần thông báo
                    if (errorMessage.includes('hết hạn') || errorMessage.includes('expired') || errorMessage.includes('401')) {
                        enqueueSnackbar('Phiên đăng nhập đã hết hạn. Đang chuyển đến trang đăng nhập...', { variant: 'warning' });
                    } else {
                        // Các lỗi khác không quan trọng, shipping info đã được lưu
                        console.warn('DisplayName update failed but shipping info was saved');
                    }
                    // Không throw error ở đây vì shipping info đã được cập nhật thành công
                }
            }
            console.log('=== END UPDATING SHIPPING INFO ===');

            // Cập nhật userInfo local
            const updatedUserInfo = {
                ...userInfo,
                displayName: shippingFormData.receiver,
                contactPhone: shippingFormData.phone,
                address: shippingFormData.address,
                addressDetail: shippingFormData.addressDetail,
            };
            setUserInfo(updatedUserInfo);

            // Đóng modal và tiếp tục đặt hàng
            setOpenShippingModal(false);
            enqueueSnackbar('Đã cập nhật thông tin giao hàng.', { variant: 'success' });

            // Tiếp tục đặt hàng với thông tin mới
            const price = salePrice;
            const urlImage = images[0];
            const products = [{ productId, price, quantity, urlImage }];
            const newShippingInfo = {
                receiver: shippingFormData.receiver,
                phone: shippingFormData.phone,
                address: shippingFormData.address,
                addressDetail: shippingFormData.addressDetail,
            };
            const payloadPay = { userId, products, shippingInfo: newShippingInfo, isInCart: false };

            const req = await orderApi.add(payloadPay);
            navigate(`/orders?id=${req.orderExist._id}`);
        } catch (error) {
            console.error('Error updating shipping info:', error);
            enqueueSnackbar('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.', { variant: 'error' });
        }
    };
    const handleNavigateToAccount = () => {
        setOpenShippingModal(false);
        navigate('/account');
    };
=======
    }
>>>>>>> origin/back-up


    return (
        <Box className={classes.root}>
            {/* Tên sản phẩm  */}
            <Typography
                component='h1'
                variant='h3'
                className={classes.name}
            >
                {name}
            </Typography>
            {/* Box giá sản phẩm */}
            <Box className={classes.priceBox}>
                <Box
                    component='span'
                    className={classes.salePrice}
                >
                    {formatPrice(salePrice)}
                </Box>
                {promotionPercent > 0 && (
                    <>
                        <Box
                            component='span'
                            className={classes.originalPrice}
                        >
                            {formatPrice(originalPrice)}
                        </Box>
                        <Box
                            component='span'
                            className={classes.promotionPercent}
                        >
                            {` ${promotionPercent}%`}
                        </Box>
                    </>
                )}
            </Box>
            {/* Box chọn Mua ngay hoặc add to cart */}
            <Box className={classes.payment}>
                <Button
                    type='primary'
                    onClick={handleBuyNow}
                    style={{
                        marginRight: '10px',
                        background: 'black',
                        borderRadius: '0px',
                        fontFamily: 'monospace',
                    }}
                >
                    Mua ngay
                </Button>
                <Button
                    type='primary'
                    onClick={handleAddToCart}
                    style={{
                        marginRight: '10px',
                        background: 'white',
                        color: 'black',
                        border: '1px solid black',
                        fontWeight: 'bold',
                        borderRadius: '0px',
                        fontFamily: 'monospace',
                    }}
                >
                    Thêm vào giỏ hàng
                </Button>
            </Box>
            {/* Box chính sách mua hàng  */}
            <Box>
                <Box className={classes.policy}>
                    <box-icon name='refresh' ></box-icon>
                    <Box component='span'>
                        ĐỔI TRẢ MIỄN PHÍ trong 3 ngày (Với lỗi từ Nhà sản xuất)
                    </Box>
                </Box>
                <Box className={classes.policy}>
                    <box-icon name='package' ></box-icon>
                    <Box component='span'>FREE SHIPPING đơn hàng &gt; 500K</Box>
                </Box>
                <Box className={classes.policy}>
                    <box-icon name='check-shield' ></box-icon>
                    <Box component='span'>
                        BẢO HÀNH trong 1 năm với sản phẩm(do kĩ thuật viên kiểm định)
                    </Box>
                </Box>
            </Box>
            {/* Box thông tin sản phẩm  */}
            <Box className={classes.descriptionBox}>
                <Typography
                    className={classes.descriptionTitle}
                >
                    THÔNG TIN
                </Typography>
                <Typography
                    variant='body2'
                    className={classes.description}
                >
                    {description}
                </Typography>
            </Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby='modal-title'
                aria-describedby='modal-description'
            >
                <div className={classes.modal}>
                    <Typography variant='h5' id='modal-title' style={{ fontFamily: 'monospace', }}>
                        Vui lòng đăng nhập để tiếp tục
                    </Typography>
                    <Box style={{ display: "flex", justifyContent: "space-between", marginTop: '10px' }}>
                        <Button style={{ borderRadius: '0px', height: '32px', width: '100px', fontFamily: 'monospace', }} onClick={handleCloseModal}>Đóng</Button>
                        <Button style={{ borderRadius: '0px', height: '32px', width: '100px', background: 'black', color: '#fff', fontFamily: 'monospace', }} onClick={handleNavigate}>Đăng nhập</Button>
                    </Box>
                </div>
            </Modal>
<<<<<<< HEAD
            <Modal
                open={openShippingModal}
                onClose={handleCloseShippingModal}
                aria-labelledby='shipping-modal-title'
                aria-describedby='shipping-modal-description'
            >
                <div className={classes.shippingModal}>
                    <Typography variant='h5' id='shipping-modal-title' style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        Thông tin giao hàng
                    </Typography>
                    <Typography variant='body2' style={{ fontFamily: 'monospace', marginTop: '8px', color: '#666' }}>
                        Vui lòng điền đầy đủ thông tin để tiếp tục đặt hàng
                    </Typography>
                    <Box className={classes.shippingForm}>
                        <TextField
                            label="Tên người nhận *"
                            value={shippingFormData.receiver}
                            onChange={(e) => handleShippingFormChange('receiver', e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Số điện thoại *"
                            value={shippingFormData.phone}
                            onChange={(e) => handleShippingFormChange('phone', e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Địa chỉ (Phường/Quận/Thành Phố) *"
                            value={shippingFormData.address}
                            onChange={(e) => handleShippingFormChange('address', e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Số nhà, tên đường *"
                            value={shippingFormData.addressDetail}
                            onChange={(e) => handleShippingFormChange('addressDetail', e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            multiline
                            rows={2}
                        />
                    </Box>
                    <Box style={{ display: "flex", justifyContent: "space-between", marginTop: '20px', gap: '10px' }}>
                        <Button
                            style={{
                                borderRadius: '0px',
                                height: '40px',
                                flex: 1,
                                fontFamily: 'monospace',
                                border: '1px solid #ccc',
                                color: '#333'
                            }}
                            onClick={handleCloseShippingModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            style={{
                                borderRadius: '0px',
                                height: '40px',
                                flex: 1,
                                background: '#666',
                                color: '#fff',
                                fontFamily: 'monospace',
                            }}
                            onClick={handleNavigateToAccount}
                        >
                            Cập nhật trong tài khoản
                        </Button>
                        <Button
                            style={{
                                borderRadius: '0px',
                                height: '40px',
                                flex: 1,
                                background: 'black',
                                color: '#fff',
                                fontFamily: 'monospace',
                            }}
                            onClick={handleSaveShippingInfo}
                        >
                            Lưu và tiếp tục
                        </Button>
                    </Box>
=======
            
            {/* Modal nhập thông tin giao hàng */}
            <Modal
                open={openShippingModal}
                onClose={() => setOpenShippingModal(false)}
                aria-labelledby='shipping-modal-title'
                aria-describedby='shipping-modal-description'
            >
                <div className={classes.modal} style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <Typography variant='h5' id='shipping-modal-title' style={{ fontFamily: 'monospace', marginBottom: '20px' }}>
                        Thông tin giao hàng
                    </Typography>
                    <Formik
                        initialValues={{
                            receiver: userInfo?.displayName || '',
                            phone: userInfo?.contactPhone || '',
                            address: userInfo?.address || '',
                            addressDetail: userInfo?.addressDetail || '',
                        }}
                        validationSchema={shippingInfoValidationSchema}
                        onSubmit={handleShippingInfoSubmit}
                        validateOnChange={true}
                        validateOnBlur={true}
                    >
                        {({ values, handleChange, handleBlur, handleSubmit, errors, touched, isSubmitting, isValid }) => {
                            console.log('Form errors:', errors);
                            console.log('Form isValid:', isValid);
                            console.log('Form values:', values);
                            
                            return (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log('Form submitted');
                                    handleSubmit(e);
                                }}>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        <TextField
                                            label="Tên người nhận"
                                            name="receiver"
                                            value={values.receiver}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={touched.receiver && !!errors.receiver}
                                            helperText={touched.receiver && errors.receiver}
                                            style={{ fontFamily: 'monospace' }}
                                        />
                                        <TextField
                                            label="Số điện thoại"
                                            name="phone"
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={touched.phone && !!errors.phone}
                                            helperText={touched.phone && errors.phone}
                                            style={{ fontFamily: 'monospace' }}
                                        />
                                        <TextField
                                            label="Địa chỉ"
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={touched.address && !!errors.address}
                                            helperText={touched.address && errors.address}
                                            style={{ fontFamily: 'monospace' }}
                                        />
                                        <TextField
                                            label="Chi tiết địa chỉ"
                                            name="addressDetail"
                                            value={values.addressDetail}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            error={touched.addressDetail && !!errors.addressDetail}
                                            helperText={touched.addressDetail && errors.addressDetail}
                                            style={{ fontFamily: 'monospace' }}
                                        />
                                    </Box>
                                    {Object.keys(errors).length > 0 && (
                                        <Box style={{ marginTop: '10px', color: 'red', fontSize: '14px' }}>
                                            Vui lòng điền đầy đủ thông tin
                                        </Box>
                                    )}
                                    <Box style={{ display: "flex", justifyContent: "space-between", marginTop: '20px' }}>
                                        <Button 
                                            type="button"
                                            style={{ borderRadius: '0px', height: '32px', width: '100px', fontFamily: 'monospace' }} 
                                            onClick={() => setOpenShippingModal(false)}
                                        >
                                            Hủy
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                console.log('Button clicked, calling handleSubmit');
                                                handleSubmit(e);
                                            }}
                                            disabled={isSubmitting}
                                            style={{ 
                                                borderRadius: '0px', 
                                                height: '32px', 
                                                width: '100px', 
                                                background: 'black', 
                                                color: '#fff', 
                                                fontFamily: 'monospace',
                                                border: 'none',
                                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                opacity: isSubmitting ? 0.6 : 1
                                            }}
                                        >
                                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                                        </button>
                                    </Box>
                                </form>
                            );
                        }}
                    </Formik>
>>>>>>> origin/back-up
                </div>
            </Modal>
        </Box>
    );
}

export default ProductInfo;
