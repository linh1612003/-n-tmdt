import { Badge, Box, IconButton, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle, Search, ShoppingCart } from '@material-ui/icons';
import 'boxicons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cartsApi from '../../api/cartApi';
import logo from '../../assets/logo/logo.svg';
import { logout } from '../../pages/Auth/userSlice';
import SearchComponent from '../../pages/Product/components/Search';
import '../Header/style.scss';
import { cartItemsCountSelector } from '../../pages/Cart/selectors';

function Header(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const [cartList, setCartList] = useState([]);
    const [userId, setUserId] = useState();
    // Tính số lượng sản phẩm (items) còn hợp lệ trong giỏ của user hiện tại
    // Chỉ đếm item còn quantity > 0 và còn product (đã xóa/thanh toán thì bỏ qua)
    const cartItemsCount = (cartList || [])
        .filter((item) => (item?.quantity || 0) > 0 && item?.product?.length > 0)
        .length;

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role');
        if (userId) {
            setIsLoggedIn(true);
            setUserId(userId);
            if (userRole === 'admin') {
                setIsAdmin(true);
            }
        }
    }, []);

    const loadCartList = async () => {
        if (!userId) {
            return;
        }
        try {
            const cartList = await cartsApi.getAll(userId);
            setCartList(cartList || []);
        } catch (error) {
            console.log('Failed to fetch carts list', error);
            setCartList([]);
        }
    };

    useEffect(() => {
        loadCartList();
    }, [userId]);

    // Reload cart khi navigate về trang chủ hoặc khi có thay đổi
    useEffect(() => {
        const handleFocus = () => {
            if (userId) {
                loadCartList();
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [userId]);

    const handleSearchClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleUserClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        const action = logout();
        dispatch(action);
        setIsLoggedIn(false);
        handleCloseMenu();
        navigate('/');
    };

    const handleAdminClick = () => {
        navigate('/admin');
    }
    const handleUserInfo = () => {
        navigate('/account');
    };
    const handleShop = () => {
        navigate('/order-history');
    };

    return (
        <div className='wrapper__header'>
            <a
                href='/'
                className='wrapper__header__logo'
            >
                <span className='header-logo-text' style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '2rem', color: '#222' }}>
                    Hanie Jewelry
                </span>
            </a>

            <nav className='wrapper__header__navbar'>
                <a
                    style={{ '--i': 1 }}
                    href='/products'
                    className='active'
                >
                    SẢN PHẨM
                </a>
                <a
                    style={{ '--i': 2 }}
                    href='http://localhost:3000/products?promotion=true'
                >
                    KHUYẾN MÃI
                </a>
                {/* <a
                    style={{ '--i': 3 }}
                    href='http://localhost:3000/products?_limit=16&_page=1&_sort=asc&categoryId=6749e63a24417ea8e0551c35'
                >
                    Pre-order
                </a> */}
                <a
                    style={{ '--i': 4 }}
                    href='/about'
                >
                    VỀ CHÚNG TÔI
                </a>
                {/* <a
                    style={{ '--i': 5 }}
                    href='/blog'
                >
                    BLOG
                </a> */}
            </nav>

            <div className='wrapper__header__social-media'>
                {isLoggedIn ? (
                    <Box>
                        {isAdmin ? (
                            <>
                                <IconButton
                                    size='large'
                                    color='inherit'
                                    onClick={handleAdminClick}
                                >
                                    <box-icon type='solid' name='lock-alt'></box-icon>
                                </IconButton>
                                <IconButton
                                    color='inherit'
                                    onClick={handleUserClick}
                                >
                                    <AccountCircle />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    size='large'
                                    color='inherit'
                                    onClick={handleSearchClick}
                                >
                                    <Search />
                                </IconButton>
                                <IconButton
                                    size='large'
                                    color='inherit'
                                    onClick={handleCartClick}
                                >
                                    <Badge
                                        badgeContent={cartItemsCount}
                                        color='error'
                                    >
                                        <ShoppingCart style={{ color: 'black' }} />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    color='inherit'
                                    onClick={handleUserClick}
                                >
                                    <AccountCircle />
                                </IconButton>
                            </>
                        )}
                    </Box>
                ) : (
                    <>
                        <a
                            style={{ '--i': 2 }}
                            href='https://www.facebook.com/moc.thien.1401'
                        >
                            <box-icon
                                type='logo'
                                name='facebook-circle'
                                color='#000'
                            ></box-icon>
                        </a>
                        <a
                            style={{ '--i': 3 }}
                            href='https://www.instagram.com/haniepham06?igsh=cHFmZG80eTY4Njh4&utm_source=qr'
                        >
                            <box-icon
                                type='logo'
                                name='instagram-alt'
                                color='#000'
                            ></box-icon>
                        </a>
                        <a
                            style={{ '--i': 4 }}
                            href='/login'
                        >
                            <box-icon
                                type='solid'
                                name='user-circle'
                                color='#000'
                            ></box-icon>
                        </a>
                    </>
                )}
            </div>

            <div className={`search-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                <SearchComponent onClose={() => setIsDropdownOpen(false)} />
            </div>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                getContentAnchorEl={null}
            >
                <MenuItem onClick={handleUserInfo}>Thông tin cá nhân</MenuItem>
                <MenuItem onClick={handleShop}>Đơn mua</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Đăng xuất</MenuItem>
            </Menu>
        </div>
    );
}

export default Header 