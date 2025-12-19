import { Box, Button, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Radio } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Field, Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { formatPrice } from '../../../src/utils/common';
import cartsApi from '../../api/cartApi';
import orderApi from '../../api/ordersApi';
import userApi from '../../api/userApi';
<<<<<<< HEAD
import VietnamAddressField from '../../components/form-controls/VietnamAddressField';
=======
import SearchAddressField from '../../components/form-controls/SearchAddressField';
>>>>>>> origin/back-up
import { removeFromCart } from './cartSlice';
import CartClear from './components/CartClear';
import { cartItemsCountSelector, cartTotalSelector } from './selectors';

const CustomRadio = styled(Radio)({
    '&.Mui-checked': {
        color: 'black',
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    name: {
        fontWeight: '700',
        fontFamily: 'monospace',
        marginBottom: '5px',
    },
    descriptionBox: {
        // fontFamily: 'Montserrat !important',
        fontFamily: 'monospace',
    },
    descriptionTitle: {
        fontWeight: '800',
        fontFamily: 'monospace',
        fontSize: '20px',
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        marginTop: '10px',
    },
    description: {
        fontFamily: 'monospace',
        fontSize: '20px',
    },
    priceBox: {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        margin: '15px 0px',
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
        margin: '15px 0px',
    },
    sizeName: {
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '24px',
    },
    payment: {
        margin: '15px 0px',
    },
    policy: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '.5rem',
        gap: '.8rem',
        '& > span': {
            color: '#807D7C',
            fontFamily: 'monospace',
            fontSize: '20px',
        },
    },
    cartContainer: {
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(2),
    },
    cartImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        marginRight: theme.spacing(2),
    },
    cartDetails: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartItem: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: theme.spacing(2),
        justifyContent: ' space-between',
        marginLeft: '20px',
    },
    leftPanel: {
        width: '50%',
<<<<<<< HEAD
        borderRight: '1px solid #e0e0e0',
        padding: '30px',
        backgroundColor: '#fafafa',
=======
        borderRight: '1px solid black',
        padding: '20px',
>>>>>>> origin/back-up
    },
    rightPanel: {
        width: '50%',
        marginTop: '20px',
    },
    input: {
        fontFamily: 'monospace',
<<<<<<< HEAD
        width: '100%',
=======
        height: '60px',
>>>>>>> origin/back-up
    },
    img: {
        height: '120px',
        width: '120px',
        marginRight: '15px',
    },
    item: {
<<<<<<< HEAD
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(3),
    },
    name: {
        fontWeight: '600',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#333',
        marginBottom: '8px',
    },
    address: {
        backgroundColor: 'white',
        padding: theme.spacing(3),
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
=======
        marginBottom: '10px',
>>>>>>> origin/back-up
    },
}));

const validationSchema = Yup.object().shape({
<<<<<<< HEAD

=======
    displayName: Yup.string()
        .required('Vui lòng nhập tên người đặt hàng')
        .min(2, 'Tên người đặt hàng phải có ít nhất 2 ký tự'),
    contactPhone: Yup.string()
        .required('Vui lòng nhập số điện thoại')
        .matches(
            /^(0|\+84|84)[0-9]{9,10}$/,
            'Số điện thoại không đúng định dạng. Vui lòng nhập số điện thoại Việt Nam (10 số bắt đầu bằng 0)'
        ),
    address: Yup.string()
        .required('Vui lòng nhập địa chỉ (quận, thành phố)'),
    addressDetail: Yup.string()
        .required('Vui lòng nhập số nhà, tên đường'),
>>>>>>> origin/back-up
});
function CartPages(props) {
    //=================================================================================================================================
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleCheckboxChange = (product) => {
        if (selectedProducts.some((item) => item._id === product._id)) {
            setSelectedProducts(selectedProducts.filter((item) => item._id !== product._id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };
    //=================================================================================================================================

    const [paymentMethod, setPaymentMethod] = React.useState('');
    const navigate = useNavigate();

    const handleChangePay = (event) => {
        setPaymentMethod(event.target.value);
    };
    const classes = useStyles();
    // Lấy danh sách sản phẩm từ Redux
    const cartItems = useSelector((state) => state.cart.cartItems);

    // Tính tổngg sản phẩm , giá trong giỏ hàng từ Redux
    const cartItemsCount = useSelector(cartItemsCountSelector);
    const cartItemsTotal = useSelector(cartTotalSelector);
    const [cartList, setCartList] = useState([]);

    const userId = localStorage.getItem('userId');

    const [formData, setFormData] = useState({
        receiver: '',
        phone: '',
        address: '',
        addressDetail: '',
        isInCart: true,
    });

    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleRemoveItem = async (id) => {
        try {
            const userId = localStorage.getItem('userId');
            const productIds = [id];
            const req = await cartsApi.delete(userId, productIds);
            dispatch(removeFromCart(id));
            enqueueSnackbar('Đã xóa khỏi giỏ hàng!', { variant: 'error' });
        } catch (error) {
            enqueueSnackbar('Xóa sản phẩm khỏi giỏ hàng thất bại!', { variant: 'error' });
        }
    };

    useEffect(() => {
        if (!userId) {
            setError('No user ID found in local storage');
            return;
        }

        (async () => {
            try {
                const [cartList, userData] = await Promise.all([
                    cartsApi.getAll(userId),
                    userApi.getInfo(userId),
                ]);

                setCartList(cartList);
<<<<<<< HEAD
                // Map dữ liệu từ userData vào formData (đảm bảo tên field khớp với form)
                setFormData({
                    receiver: String(userData.displayName || '').trim(),
                    phone: String(userData.contactPhone || '').trim(),
                    address: String(userData.address || '').trim(),
                    addressDetail: String(userData.addressDetail || '').trim(),
                    isInCart: true,
                });
=======
                setFormData(userData);
>>>>>>> origin/back-up
            } catch (error) {
                console.log('Failed to fetch data', error);
                setError('Failed to fetch data');
            }
        })();
    }, [cartItems]);

    // Button Buy Now
    // =========================================================
    const products = [];
    cartList.forEach((cartItem) => {
        cartItem.product.forEach((productItem) => {
            if (selectedProducts.some((item) => item._id === productItem._id)) {
                products.push({
                    productId: productItem._id,
                    price: productItem.salePrice,
                    quantity: cartItem.quantity,
                    urlImage: productItem.images[0],
                });
            }
        });
    });

    const handleBuyNow = async (values) => {
<<<<<<< HEAD
        // Đảm bảo các giá trị là string và không rỗng
        const shippingInfo = {
            receiver: String(values.receiver || '').trim(),
            phone: String(values.phone || '').trim(),
            address: String(values.address || '').trim(),
            addressDetail: String(values.addressDetail || '').trim(),
        };

        // Validate shippingInfo trước khi gửi
        console.log('[Cart] Form values:', values);
        console.log('[Cart] ShippingInfo:', shippingInfo);

        if (!shippingInfo.receiver || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.addressDetail) {
            console.error('[Cart] Missing shipping info:', {
                receiver: !shippingInfo.receiver,
                phone: !shippingInfo.phone,
                address: !shippingInfo.address,
                addressDetail: !shippingInfo.addressDetail,
            });
            enqueueSnackbar('Vui lòng điền đầy đủ thông tin vận chuyển!', {
                variant: 'warning',
            });
            return;
        }

=======
        const shippingInfo = {
            receiver: values.displayName,
            phone: values.contactPhone,
            address: values.address,
            addressDetail: values.addressDetail,
            isInCart: true,
        };

>>>>>>> origin/back-up
        const updatedProducts = selectedProducts.map((selectedProduct) => {
            const cartItem = cartList.find((item) =>
                item.product.some((product) => product._id === selectedProduct._id),
            );
<<<<<<< HEAD
            if (!cartItem) {
                console.error('[Cart] CartItem not found for product:', selectedProduct._id);
                return null;
            }
            return {
                productId: String(selectedProduct._id), // Đảm bảo là string
                price: Number(selectedProduct.salePrice) || 0, // Đảm bảo là number
                quantity: Number(cartItem.quantity) || 1, // Đảm bảo là number
                urlImage: selectedProduct.images?.[0] || selectedProduct.images?.[0] || '',
            };
        }).filter(Boolean); // Loại bỏ null values

        // Kiểm tra products sau khi filter
        if (updatedProducts.length === 0) {
            enqueueSnackbar('Không có sản phẩm hợp lệ để thanh toán!', {
                variant: 'warning',
            });
            return;
        }

        const payloadPay = { userId, products: updatedProducts, shippingInfo, isInCart: true };

        if (!userId) {
            enqueueSnackbar('Vui lòng đăng nhập để thanh toán!', {
                variant: 'warning',
            });
=======
            return {
                productId: selectedProduct._id,
                price: selectedProduct.salePrice,
                quantity: cartItem.quantity, // Cập nhật số lượng từ cartList
                urlImage: selectedProduct.images[0],
            };
        });

        const payloadPay = { userId, products: updatedProducts, shippingInfo };

        if (!userId) {
>>>>>>> origin/back-up
            return;
        }
        if (selectedProducts.length === 0) {
            enqueueSnackbar('Vui lòng chọn ít nhất một sản phẩm để mua hàng!', {
                variant: 'warning',
            });
            return;
        }
        try {
<<<<<<< HEAD
            console.log('[Cart] Payload to send:', JSON.stringify(payloadPay, null, 2));
            const req = await orderApi.add(payloadPay);
            navigate(`/orders?id=${req.orderExist._id}`);
        } catch (error) {
            console.error('[Cart] Error creating order:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi! Vui lòng thử lại sau.';
            console.error('[Cart] Error message:', errorMessage);
            enqueueSnackbar(errorMessage, { variant: 'error' });
=======
            const req = await orderApi.add(payloadPay);
            navigate(`/orders?id=${req.orderExist._id}`);
        } catch (error) {
            enqueueSnackbar('Đã xảy ra lỗi! Vui lòng thử lại sau.', { variant: 'error' });
>>>>>>> origin/back-up
        }
    };

    const handleIncreaseQuantity = (id) => {
        setCartList(
            cartList.map((item) =>
                item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
        );
    };

    const handleDecreaseQuantity = (id) => {
        setCartList(
            cartList.map((item) =>
                item._id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item,
            ),
        );
    };

    const totalAmount = selectedProducts.reduce((total, selectedProduct) => {
        const cartItem = cartList.find(item =>
            item.product.some(product => product._id === selectedProduct._id)
        );
        return total + cartItem.quantity * selectedProduct.salePrice;
    }, 0);

    return (
        <Box>
            {cartItems.length === 0 ? (
                <CartClear />
            ) : (
                <Box className={classes.cartContainer}>
                    <Box className={classes.leftPanel}>
                        <Box className={classes.leftPanelUp}>
                            <Box className={classes.address}>
                                <Typography
                                    component='h1'
                                    variant='h5'
<<<<<<< HEAD
                                    style={{
                                        fontFamily: 'monospace',
                                        marginBottom: '24px',
                                        fontWeight: 'bold',
                                        color: '#222'
                                    }}
=======
                                    style={{ fontFamily: 'monospace', marginBottom: '20px' }}
>>>>>>> origin/back-up
                                >
                                    Thông tin vận chuyển
                                </Typography>
                                <Formik
                                    initialValues={formData}
                                    enableReinitialize
                                    validationSchema={validationSchema}
                                    onSubmit={handleBuyNow}
                                >
<<<<<<< HEAD
                                    {({ handleChange, handleBlur }) => (
                                        <Form className={classes.wrapper}>
                                            <Box className={classes.item}>
                                                <Typography className={classes.name}>
                                                    Tên người đặt <span style={{ color: 'red' }}>*</span>
                                                </Typography>
                                                <Field
                                                    as={TextField}
                                                    name='receiver'
                                                    className={classes.input}
                                                    variant='outlined'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    fullWidth={true}
                                                    size='small'
                                                    style={{ fontFamily: 'monospace' }}
                                                />
                                            </Box>
                                            <Box className={classes.item}>
                                                <Typography className={classes.name}>
                                                    Địa chỉ (Tỉnh/TP - Quận/Huyện - Phường/Xã) <span style={{ color: 'red' }}>*</span>
                                                </Typography>
                                                <div className={classes.input}>
                                                    <VietnamAddressField name='address' />
                                                </div>
                                            </Box>
                                            <Box className={classes.item}>
                                                <Typography className={classes.name}>
                                                    Số nhà, tên đường <span style={{ color: 'red' }}>*</span>
                                                </Typography>
                                                <Field
                                                    as={TextField}
                                                    name='addressDetail'
                                                    className={classes.input}
                                                    variant='outlined'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    fullWidth={true}
                                                    size='small'
                                                    placeholder="Ví dụ: 356 Kim Giang"
                                                    style={{ fontFamily: 'monospace' }}
                                                />
                                            </Box>
                                            <Box className={classes.item}>
                                                <Typography className={classes.name}>
                                                    Số điện thoại <span style={{ color: 'red' }}>*</span>
                                                </Typography>
                                                <Field
                                                    as={TextField}
                                                    name='phone'
                                                    className={classes.input}
                                                    variant='outlined'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    fullWidth={true}
                                                    size='small'
                                                    placeholder="Ví dụ: 0968061203"
                                                    style={{ fontFamily: 'monospace' }}
                                                />
                                            </Box>
=======
                                    {({ handleChange, handleBlur, errors, touched }) => (
                                        <Form className={classes.wrapper}>
                                            <Form className={classes.wrapper}>
                                                <Box className={classes.item}>
                                                    <Typography className={classes.name}>
                                                        Tên người đặt
                                                    </Typography>
                                                    <Field
                                                        as={TextField}
                                                        name='displayName'
                                                        className={classes.input}
                                                        variant='outlined'
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth={true}
                                                        fontFamily='monospace'
                                                        error={touched.displayName && !!errors.displayName}
                                                        helperText={touched.displayName && errors.displayName}
                                                    />
                                                </Box>
                                                <Box className={classes.item}>
                                                    <Typography className={classes.name}>
                                                        Địa chỉ ( quận , thành phố )
                                                    </Typography>
                                                    <Field
                                                        as={SearchAddressField}
                                                        name='address'
                                                        className={classes.input}
                                                        variant='outlined'
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth={true}
                                                        error={touched.address && !!errors.address}
                                                        helperText={touched.address && errors.address}
                                                    />
                                                </Box>
                                                <Box className={classes.item}>
                                                    <Typography className={classes.name}>
                                                        Số nhà{' '}
                                                    </Typography>
                                                    <Field
                                                        as={TextField}
                                                        name='addressDetail'
                                                        className={classes.input}
                                                        variant='outlined'
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth={true}
                                                        error={touched.addressDetail && !!errors.addressDetail}
                                                        helperText={touched.addressDetail && errors.addressDetail}
                                                    />
                                                </Box>

                                                <Box className={classes.item}>
                                                    <Typography className={classes.name}>
                                                        Số điện thoại
                                                    </Typography>
                                                    <Field
                                                        as={TextField}
                                                        name='contactPhone'
                                                        className={classes.input}
                                                        variant='outlined'
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth={true}
                                                        error={touched.contactPhone && !!errors.contactPhone}
                                                        helperText={touched.contactPhone && errors.contactPhone}
                                                    />
                                                </Box>
                                            </Form>
>>>>>>> origin/back-up
                                            <Box
                                                style={{
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
<<<<<<< HEAD
                                                    marginTop: '24px',
=======
>>>>>>> origin/back-up
                                                }}
                                            >
                                                <Button
                                                    className={classes.button}
                                                    variant='contained'
                                                    color='primary'
                                                    type='submit'
                                                    style={{
<<<<<<< HEAD
                                                        background: 'black',
                                                        borderRadius: '4px',
                                                        fontFamily: 'monospace',
                                                        color: 'white',
                                                        padding: '12px 48px',
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        textTransform: 'uppercase',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                        transition: 'all 0.3s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#333';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'black';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                                    }}
                                                // disabled={selectedProducts.length === 0}
                                                >
                                                    ĐẶT HÀNG
=======
                                                        marginTop: '20px',
                                                        background: 'black',
                                                        borderRadius: '0px',
                                                        fontFamily: 'monospace',
                                                        color: 'white',
                                                    }}
                                                // disabled={selectedProducts.length === 0}
                                                >
                                                    Đặt hàng
>>>>>>> origin/back-up
                                                </Button>
                                            </Box>
                                        </Form>
                                    )}
                                </Formik>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={classes.rightPanel}>
                        <div>
                            <Typography
                                component='h1'
                                variant='h5'
                                style={{ fontFamily: 'monospace', marginBottom: '20px' }}
                            >
                                Giỏ hàng({cartItemsCount})
                            </Typography>
                            {cartList.map((cartItem) => (
                                <Box key={cartItem._id}>
                                    {cartItem.product.map((productItem, index) => (
<<<<<<< HEAD
                                        <Box key={`${cartItem._id}-${productItem._id}-${index}`} style={{ display: 'flex' }}>
=======
                                        <Box style={{ display: 'flex' }}>
>>>>>>> origin/back-up
                                            <Box
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <input
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: 'black',
                                                        alignSelf: 'center',
                                                    }}
                                                    type='checkbox'
                                                    checked={selectedProducts.some(
                                                        (item) => item._id === productItem._id,
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(productItem)
                                                    }
                                                />
                                            </Box>
                                            <Box
                                                key={index}
                                                className={classes.cartItem}
                                            >
                                                <Box className={classes.img}>
                                                    <img
                                                        src={
                                                            productItem.images[0]
                                                                ? `http://localhost:5000/api/uploads/products/${productItem.images[0].split('/').pop()}`
                                                                : 'https://via.placeholder.com/444'
                                                        }
                                                        alt={productItem.name}
                                                        className={classes.cartImage}
                                                    />
                                                </Box>
                                                <Box className={classes.cartDetails}>
                                                    <Typography
                                                        component='h1'
                                                        variant='h5'
                                                        className={classes.name}
                                                    >
                                                        {productItem.name}
                                                    </Typography>
                                                    <Box style={{ display: '' }}>
                                                        <Box
                                                            style={{
                                                                display: 'flex',
                                                                border: '1px solid  black',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <Button
                                                                onClick={() =>
                                                                    handleDecreaseQuantity(
                                                                        cartItem._id,
                                                                    )
                                                                }
                                                            >
                                                                -
                                                            </Button>
                                                            <Typography
                                                                component='p'
                                                                className={classes.description}
                                                            >
                                                                {cartItem.quantity}
                                                            </Typography>
                                                            <Button
                                                                onClick={() =>
                                                                    handleIncreaseQuantity(
                                                                        cartItem._id,
                                                                    )
                                                                }
                                                            >
                                                                +
                                                            </Button>
                                                        </Box>
                                                    </Box>

                                                    <Typography
                                                        component='p'
                                                        className={classes.salePrice}
                                                    >
                                                        {formatPrice(productItem.salePrice)}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleRemoveItem(productItem._id)
                                                        }
                                                    >
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ))}
                            <Box style={{ display: 'flex' }}>
                                <Typography
                                    component='h1'
                                    variant='h5'
                                    style={{
                                        fontFamily: 'monospace',
                                        marginBottom: '20px',
                                        marginRight: '300px',
                                    }}
                                >
                                    Tổng tiền
                                </Typography>
                                <Typography
                                    component='h1'
                                    variant='h5'
                                    style={{
                                        fontFamily: 'monospace',
                                        marginBottom: '20px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {formatPrice(totalAmount)}
                                </Typography>
                            </Box>
                        </div>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

CartPages.propTypes = {
    // Define prop types if any
};

export default CartPages;
